import { Channel } from './types';

export const CHANNELS: Omit<Channel, 'onlineCount'>[] = [
  { id: '1', name: 'Main Tech', description: 'FOH, Lighting, Media', icon: 'monitor' },
  { id: '2', name: 'Camera Team', description: 'Ops, Jib, Controller', icon: 'camera' },
  { id: '3', name: 'Livestream', description: 'Stream Monitor, Audio', isEmergency: true, icon: 'globe' },
  { id: '4', name: 'Worship/Stage', description: 'MD, Stage Hands', icon: 'music' },
];
