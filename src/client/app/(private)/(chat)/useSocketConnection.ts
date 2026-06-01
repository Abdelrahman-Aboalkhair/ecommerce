import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { SOCKET_BASE_URL } from "@/app/lib/constants/config";
import { isDemoMode } from "@/app/lib/demo";

export const useSocketConnection = (chatId: string) => {
  console.log("chatId to connect => ", chatId);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (isDemoMode()) return;
    // Get server URL based on environment
    socketRef.current = io(SOCKET_BASE_URL);

    // Join specific chat room
    socketRef.current.emit("joinChat", chatId);

    // Clean up on component unmount
    return () => {
      socketRef.current?.disconnect();
    };
  }, [chatId]);

  return socketRef.current;
};
