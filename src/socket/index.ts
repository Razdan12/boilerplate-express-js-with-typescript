import { Server, Socket } from 'socket.io';
import { verifyToken } from '../helpers/jwt.helper';
import { JwtPayload } from 'jsonwebtoken';

interface CustomSocket extends Socket {
  user?: JwtPayload & { userId: number };
}

let io: Server;

const initSocket = (server: any) => {
  if (!server) {
    throw new Error('Server instance is required to initialize Socket.IO');
  }

  io = new Server(server, {
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || '*' as any,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    },
  });

  io.use((socket: CustomSocket, next) => {
    const token = socket.handshake.auth.token ?? socket.handshake.headers.token;
    if (!token) {
      console.error('\x1b[33m[SOCKET]\x1b[0m No token provided');
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = verifyToken(token) as JwtPayload & { userId: number };
      socket.user = decoded;
      next();
    } catch (err: any) {
      console.error('\x1b[33m[SOCKET]\x1b[0m Invalid token:', err.message);
      return next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: CustomSocket) => {
    const user = socket.user;
    if (!user || !user.userId) {
      console.error('\x1b[33m[SOCKET]\x1b[0m Invalid user data');
      return socket.disconnect(true);
    }

    socket.join(user.userId.toString()); // Join room with userId as string
    console.log(`\x1b[33m[SOCKET]\x1b[0m User '${user.userId}' connected`);

    socket.on('disconnect', (reason) => {
      console.log(
        `\x1b[33m[SOCKET]\x1b[0m User '${user.userId}' disconnected:`,
        reason
      );
    });
  });
};

const getSocket = (): Server => {
  if (!io) {
    throw new Error('Socket.IO is not initialized. Call initSocket first.');
  }
  return io;
};

/**
 * 
 * @param {string} name 
 * @param {object} args 
 * @param {number[]} args.userIds
 * @param {boolean} args.allAdmin
 */
const sendOn = (name: string, args: { userIds?: number[]; allAdmin?: boolean }) => {
  const { userIds, allAdmin } = args;
  getSocket();

  let userList: string[] = [];
  if (userIds) userList.push(...userIds.map(id => id.toString()));

  // Assuming there's a way to get all admin user IDs if allAdmin is true
  // For now, just emit to userList
  io.to(userList).emit(name);
};

export { initSocket, getSocket, sendOn };
