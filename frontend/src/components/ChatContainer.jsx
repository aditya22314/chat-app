import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeToMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageRef = useRef();
  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    getMessages(selectedUser);
    subscribeToMessages();
    return () => {
      unsubscribeToMessages();
    };
  }, [selectedUser, getMessages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="loading loading-spinner"></span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {console.log(messages, "998")}
        {messages?.map((message) => (
          <div
            key={message?._id}
            ref={messageRef}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-image avatar size-10">
              <div className="rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic
                  }
                  alt="avatar"
                />
              </div>
            </div>
            <div className="chat-header text-xs opacity-50 mb-1">
              {formatMessageTime(message.createdAt)}
            </div>
            <div className="chat-bubble">
              {message.image && (
                <img
                  src={message.image}
                  alt="Message"
                  className="max-w-[200px] rounded"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
