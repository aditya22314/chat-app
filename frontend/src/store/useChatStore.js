import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get("/messages/users");
      set({ users: response.data });
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async (user) => {
    set({ isMessagesLoading: true, selectedUser: user });
    try {
      const response = await axiosInstance.get(`/messages/${user?._id}`);
      set({ messages: response.data });
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData,
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  //subscribe to messages
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
    socket.on("newMessage", (newMessage) => {
      const { selectedUser: currentSelectedUser } = get();
      if (!currentSelectedUser) return;

      if (
        newMessage.senderId === currentSelectedUser._id ||
        newMessage.receiverId === currentSelectedUser._id
      ) {
        set({ messages: [...get().messages, newMessage] });
      }
    });
  },
  unsubscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
  },
}));
