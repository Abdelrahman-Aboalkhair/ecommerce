import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";

export class SocketManager {
  private io: SocketIOServer;

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin:
          process.env.NODE_ENV === "production"
            ? ["https://ecommerce-nu-rosy.vercel.app"]
            : ["http://localhost:3000", "http://localhost:5173"],
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    this.io.on("connection", (socket: Socket) => {
      console.log("New client connected:", socket.id);

      // * This listens when a client joins a room
      socket.on("joinChat", (chatId: string) => {
        socket.join(`chat:${chatId}`);
        console.log(`Client ${socket.id} joined chat:${chatId}`);
      });

      // * This listens when a client joins the admin room
      socket.on("joinAdmin", () => {
        socket.join("admin");
        console.log(`Client ${socket.id} joined admin room`);
      });

      // * This listens when a client makes a call
      socket.on("callOffer", ({ chatId, offer }) => {
        socket
          .to(`chat:${chatId}`)
          .emit("callOffer", { offer, from: socket.id });
        console.log(`Call offer sent for chat:${chatId} from ${socket.id}`);
      });

      // * This listens when a client answers a call
      socket.on("callAnswer", ({ chatId, answer, to }) => {
        socket.to(to).emit("callAnswer", { answer });
        console.log(`Call answer sent to ${to} for chat:${chatId}`);
      });

      // * This listens when a client sends an ICE(interactive connection establishment) candidate => used to establish a peer connection
      /**
       * 
        When a client wants to establish a connection with a remote peer, 
        it generates multiple ICE candidates, 
        which can include: Host candidates, SRFLX (Server Reflexive) candidates, and PRFLX (Peer Reflexive) candidates. 
        These candidates are then sent to the other peer, which uses them to establish a connection.
       */
      socket.on("iceCandidate", ({ chatId, candidate, to }) => {
        console.log("candidate => ", candidate);
        socket.to(to).emit("iceCandidate", { candidate });
        console.log(`ICE candidate sent to ${to} for chat:${chatId}`);
      });

      socket.on("endCall", ({ chatId }) => {
        socket.to(`chat:${chatId}`).emit("callEnded");
        console.log(`Call ended for chat:${chatId}`);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }

  getIO(): SocketIOServer {
    return this.io;
  }
}
