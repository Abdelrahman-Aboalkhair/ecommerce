"use client";

import React from "react";
import {
  useGetChatQuery,
  useSendMessageMutation,
  useUpdateChatStatusMutation,
} from "@/app/store/apis/ChatApi";
import { useSocketConnection } from "./useSocketConnection";
import { useChatMessages } from "./useChatMessages";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatStatus from "./ChatStatus";
import ChatInput from "./ChatInput";
import CallConnectingScreen from "./CallConnectingScreen";
import CallInProgressScreen from "./CallInProgressScreen";
import CustomLoader from "@/app/components/feedback/CustomLoader";
import { useWebRTCCall } from "./useWebRTCCall";
import { useAuth } from "@/app/hooks/useAuth";

interface ChatProps {
  chatId: string;
}

const ChatContainer: React.FC<ChatProps> = ({ chatId }) => {
  const { user } = useAuth();

  const { data, isLoading, error } = useGetChatQuery(chatId);
  const chat = data?.chat;

  const [sendMessage] = useSendMessageMutation();
  const [updateChatStatus] = useUpdateChatStatusMutation();

  const socket = useSocketConnection(chatId);

  const { messages, message, setMessage, handleSendMessage, isTyping } =
    useChatMessages(chatId, user, chat, socket, sendMessage);

  const { callStatus, endCall } = useWebRTCCall({ chatId, socket });

  const handleResolveChat = async () => {
    try {
      await updateChatStatus({ chatId, status: "RESOLVED" }).unwrap();
    } catch (err) {
      console.error("Failed to resolve chat:", err);
    }
  };

  if (isLoading) {
    return <CustomLoader />;
  }

  if (!user) {
    // Handle the case where user is null or undefined
    // For example, you can return a loading indicator or an error message
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-red-50 border border-red-300 text-red-600 px-6 py-4 rounded-lg shadow-sm">
          Error: {(error as any).data?.message || "Failed to load chat"}
        </div>
      </div>
    );
  }

  const canResolve =
    (user?.role === "ADMIN" || user?.role === "SUPERADMIN") &&
    chat?.status === "OPEN";

  return (
    <div className="flex flex-col h-[80vh] max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden transition-all duration-300">
      <ChatHeader
        chat={chat}
        onResolve={handleResolveChat}
        canResolve={canResolve}
      />
      <MessageList messages={messages} currentUserId={user?.id ?? ""} />
      {isTyping && <ChatStatus isTyping={true} />}
      {/* {callStatus === "idle" && chat?.status === "OPEN" && (
        <button
          onClick={startCall}
          className="flex items-center gap-2 p-3 w-fit mx-4 my-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
        >
          <PhoneCall size={20} />
          Start Call
        </button>
      )} */}
      {callStatus === "calling" && (
        <CallConnectingScreen chat={chat} onCancel={endCall} />
      )}
      {callStatus === "in-call" && (
        <CallInProgressScreen
          // localVideoRef={localVideoRef}
          // remoteVideoRef={remoteVideoRef}
          onEndCall={endCall}
        />
      )}
      {callStatus === "ended" && (
        <div className="p-4 text-gray-600 bg-gray-50">Call ended</div>
      )}
      {chat?.status === "OPEN" && (
        <ChatInput
          message={message}
          setMessage={setMessage}
          onSendMessage={handleSendMessage}
        />
      )}
      {chat?.status !== "OPEN" && (
        <div className="p-4 bg-gray-100 text-center text-gray-500 border-t border-gray-200">
          This conversation has been resolved
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
