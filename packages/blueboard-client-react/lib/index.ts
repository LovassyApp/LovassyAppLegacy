import Echo from 'laravel-echo';

export { default as BlueboardClientInit } from './BlueboardClientInit';
export { default as useBlueboardClient } from './hooks/useBlueboardClient';
export { default as useBlueboardChannel } from './hooks/useBlueboardChannel';
export { default as useBlueboardPrivateChannel } from './hooks/useBlueboardPrivateChannel';
export type EchoChannel = ReturnType<Echo['channel']> & { name: string };
