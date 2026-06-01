import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { SOCKET_BASE_URL } from "@/app/lib/constants/config";

export const useAdminSocketEvents = (
  onChatCreated: () => void,
  onChatStatusUpdated: () => void
) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Get server URL based on environment
    socketRef.current = io(SOCKET_BASE_URL);

    // Join admin room
    socketRef.current.emit("joinAdmin");

    // Listen for admin events
    socketRef.current.on("chatCreated", (newChat) => {
      console.log("New chat created:", newChat);
      onChatCreated();
    });

    socketRef.current.on("chatStatusUpdated", (updatedChat) => {
      console.log("Chat status updated:", updatedChat);
      onChatStatusUpdated();
    });

    // Clean up on component unmount
    return () => {
      socketRef.current?.off("chatCreated");
      socketRef.current?.off("chatStatusUpdated");
      socketRef.current?.disconnect();
    };
  }, [onChatCreated, onChatStatusUpdated]);

  return socketRef.current;
};
