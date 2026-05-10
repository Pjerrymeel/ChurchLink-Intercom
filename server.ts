import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import os from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = parseInt(process.env.PORT || "3000");
  
  // Internal state
  let users: any[] = [];
  const channels = [
    { id: '1', name: 'Main Tech', description: 'FOH, Lighting, Media', icon: 'monitor' },
    { id: '2', name: 'Camera Team', description: 'Ops, Jib, Controller', icon: 'camera' },
    { id: '3', name: 'Livestream', description: 'Stream Monitor, Audio', isEmergency: true, icon: 'globe' },
    { id: '4', name: 'Worship/Stage', description: 'MD, Stage Hands', icon: 'music' },
  ];

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-intercom", (data: { username: string }) => {
      const newUser = {
        id: socket.id,
        name: data.username,
        role: "Production Team",
        status: "online",
        avatar: data.username.charAt(0).toUpperCase(),
        channelId: "1", // Default to Main Tech
        connectedAt: Date.now(),
      };
      
      users.push(newUser);
      socket.join("1"); // Join default room
      
      // Update all clients on presence, but not speaking status
      io.emit("active-users-update", users);
      console.log(`${data.username} joined intercom`);
    });

    socket.on("change-channel", (channelId: string) => {
      const user = users.find(u => u.id === socket.id);
      if (user) {
        // Clear speaking status in old room before leaving
        if (user.channelId) {
          io.to(user.channelId).emit("user-speaking-status", {
            userId: socket.id,
            username: user.name,
            channelId: user.channelId,
            isSpeaking: false
          });
          socket.leave(user.channelId);
        }
        
        user.channelId = channelId;
        socket.join(channelId);
        
        io.emit("active-users-update", users);
      }
    });

    socket.on("speaking-update", (data: { isSpeaking: boolean }) => {
      const user = users.find(u => u.id === socket.id);
      if (user && user.channelId) {
        // Send to room only - isolates speaking indicator
        io.to(user.channelId).emit("user-speaking-status", {
          userId: socket.id,
          username: user.name,
          channelId: user.channelId,
          isSpeaking: data.isSpeaking
        });
      }
    });

    // WebRTC Signaling - Relay events to specific users
    socket.on("request-handshake", (data: { channelId: string }) => {
      // Tell everyone else in this channel to start a handshake with the new user
      socket.to(data.channelId).emit("request-handshake", { from: socket.id });
    });

    socket.on("signal-offer", (data: { to: string, offer: any }) => {
      io.to(data.to).emit("signal-offer", { from: socket.id, offer: data.offer });
    });

    socket.on("signal-answer", (data: { to: string, answer: any }) => {
      io.to(data.to).emit("signal-answer", { from: socket.id, answer: data.answer });
    });

    socket.on("signal-ice", (data: { to: string, candidate: any }) => {
      io.to(data.to).emit("signal-ice", { from: socket.id, candidate: data.candidate });
    });

    socket.on("disconnect", () => {
      const user = users.find(u => u.id === socket.id);
      if (user && user.channelId) {
        // Clear speaking status in their room before they are removed
        io.to(user.channelId).emit("user-speaking-status", {
          userId: socket.id,
          username: user.name,
          channelId: user.channelId,
          isSpeaking: false
        });
      }
      users = users.filter(u => u.id !== socket.id);
      io.emit("active-users-update", users);
      console.log("User disconnected:", socket.id);
    });
  });

  // API Routes
  app.get("/api/ping", (req, res) => {
    res.send("pong");
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/info", (req, res) => {
    const nets = os.networkInterfaces();
    const ips: string[] = [];
    for (const name of Object.keys(nets)) {
      const netList = nets[name];
      if (netList) {
        for (const net of netList) {
          if (net.family === 'IPv4' && !net.internal) {
            ips.push(net.address);
          }
        }
      }
    }
    res.json({
      status: "ok",
      version: "1.0.0",
      ips: ips,
      port: PORT,
      hostname: os.hostname()
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Handle server errors
  httpServer.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ ERROR: Port ${PORT} is already in use.`);
      console.error(`Please close any other application using this port or try a different one.`);
      process.exit(1);
    } else {
      console.error('\n❌ SERVER ERROR:', err);
    }
  });

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`\n==================================================`);
    console.log(`📡 CHURCHLINK INTERCOM - LAN OFFLINE MODE ACTIVE`);
    console.log(`==================================================`);
    console.log(`Local Server: http://localhost:${PORT}`);
    console.log(`\nTo connect other devices on the same network:`);
    
    // Get and show local IP addresses
    const nets = os.networkInterfaces();
    let foundIP = false;
    for (const name of Object.keys(nets)) {
      const netList = nets[name];
      if (netList) {
        for (const net of netList) {
          // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
          if (net.family === 'IPv4' && !net.internal) {
            console.log(`➤ http://${net.address}:${PORT}`);
            foundIP = true;
          }
        }
      }
    }
    
    if (!foundIP) {
      console.log(`⚠️ No LAN IP detected. Ensure you are connected to a WiFi/Ethernet router.`);
    }
    console.log(`\nReady for communication (Internet not required).`);
    console.log(`==================================================\n`);
  });
}

// Global Process Error Handlers
process.on("uncaughtException", (err) => {
  console.error("CRITICAL UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED REJECTION:", reason);
});

// Auto-start if run directly
const isMainModule = import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('server.ts');
if (isMainModule) {
  startServer().catch(err => {
    console.error("FAILED TO START SERVER:", err);
    process.exit(1);
  });
}
