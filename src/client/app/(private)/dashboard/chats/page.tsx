"use client";
import { useState } from "react";
import { useGetAllChatsQuery } from "@/app/store/apis/ChatApi";
import { useAdminSocketEvents } from "../../(chat)/useAdminSocketEvents";
import ChatContainer from "../../(chat)";
import useToast from "@/app/hooks/ui/useToast";
import { withAuth } from "@/app/components/HOC/WithAuth";

const AdminChatsPage = () => {
  const { showToast } = useToast();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const { data: chats, isLoading, refetch } = useGetAllChatsQuery("OPEN");
  console.log("chats => ", chats);

  // Listen for admin socket events
  useAdminSocketEvents(
    () => {
      showToast("New chat created", "success");
      console.log("chat created");
      refetch();
    },
    () => {
      showToast("Chat status updated", "success");
      console.log("chat status updated");
      refetch();
    }
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar with chat list */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <h2 className="font-semibold text-lg mb-4">Open Support Chats</h2>

        {isLoading ? (
          <div>Loading open chats...</div>
        ) : chats?.chats?.length === 0 ? (
          <div className="text-gray-500">No open chats</div>
        ) : (
          <ul className="space-y-2">
            {chats?.chats?.map((chat) => (
              <li
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`p-3 rounded cursor-pointer ${
                  activeChatId === chat.id
                    ? "bg-blue-100 text-blue-800"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="font-medium">
                  Chat #{chat.id.substring(0, 8)}
                </div>
                <div className="text-sm text-gray-500 flex items-center">
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      chat.status === "OPEN" ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></span>
                  {chat.status === "OPEN" ? "Active" : "Resolved"}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Main chat area */}
      <div className="flex-1">
        {activeChatId ? (
          <ChatContainer chatId={activeChatId} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a chat to view messages
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuth(AdminChatsPage);
