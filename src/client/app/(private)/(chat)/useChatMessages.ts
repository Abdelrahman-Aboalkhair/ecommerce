import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";

export const useChatMessages = (
  chatId: string,
  user: any,
  chat: any,
  socket: Socket | null,
  sendMessage: any
) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeoutRef] = useState<NodeJS.Timeout | null>(
    null
  );

  // Update messages when chat data is fetched
  useEffect(() => {
    if (chat?.messages) {
      setMessages((prev) => {
        // Filter out existing messages => where id is not in prev
        const newMessages = chat.messages.filter(
          (msg: any) => !prev.some((m) => m.id === msg.id)
        );
        return [...prev, ...newMessages].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
    }
  }, [chat]);

  // Handle real-time messages
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      setMessages((prev) => {
        // Normalize sender field
        // Normalization is the process of ensuring that the sender field is an object
        const normalizedMessage = {
          ...newMessage,
          sender: newMessage.sender || { id: newMessage.senderId }, // ensure sender is an object
        };
        // Update existing message or append new one
        const existingIndex = prev.findIndex(
          (msg) => msg.id === normalizedMessage.id
        );
        // if message already exists
        if (existingIndex !== -1) {
          // Replace existing message with normalized version
          const updatedMessages = [...prev]; // create a copy
          updatedMessages[existingIndex] = normalizedMessage; // replace
          return updatedMessages.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() // a - b sorts in ascending order, while b - a sorts in descending order
          );
        }
        // Append new message
        return [...prev, normalizedMessage].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
    });

    socket.on("userTyping", (typingUser) => {
      if (typingUser.id !== user.id) {
        setIsTyping(true);
        const timeout = setTimeout(() => setIsTyping(false), 3000);
        setTypingTimeoutRef(timeout);
      }
    });

    return () => {
      socket.off("newMessage");
      socket.off("userTyping");
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [socket, user.id, typingTimeout]);

  // Emit typing event
  useEffect(() => {
    if (message && socket) {
      socket.emit("typing", { chatId, user });
    }
  }, [message, socket, chatId, user]);

  // Send a message
  const handleSendMessage = async (file?: File) => {
    if (!message.trim() && !file) return;

    try {
      const result = await sendMessage({
        chatId,
        content: message || undefined,
        file,
      }).unwrap();
      console.log("result => ", result);
      setMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };
  return {
    messages,
    message,
    setMessage,
    handleSendMessage,
    isTyping,
  };
};
