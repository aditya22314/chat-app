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
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeToMessages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-base-100 text-base-content">
        <span className="loading loading-spinner"></span>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-base-100 text-base-content flex flex-col h-full">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 bg-base-100">
        {messages?.map((message) => (
          (() => {
            const isMe = message.senderId === authUser._id;
            return (
          <div
            key={message?._id}
            ref={messageRef}
            className={`chat ${isMe ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-image avatar size-10">
              <div className="rounded-full border">
                <img
                  src={
                    isMe
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
            <div
              className={`chat-bubble ${
                isMe ? "chat-bubble-primary text-primary-content" : "chat-bubble text-base-content"
              }`}
            >
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
            );
          })()
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
