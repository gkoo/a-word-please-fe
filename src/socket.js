import io from 'socket.io-client';

import {
  socketIoServerUrl,
} from './constants';

export const newSocket = () => {
  const socket = io(socketIoServerUrl);
  socket.on('disconnect', () => {
    // Reconnect
    console.log('disconnected. attempting to reconnect.');
    socket.open();
  });
  return socket;
};
