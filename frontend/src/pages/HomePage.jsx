import { Navigate } from "react-router-dom";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import SideBar from "./SideBar";

const HomePage = () => {
  const { authUser } = useAuthStore();
  const { selectedUser } = useChatStore();

  if (!authUser) {
    return <Navigate to="/login" />;
  }
  return (
    <div className="h-full bg-base-200 p-4">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl mx-auto h-[calc(100vh-6rem)]">
        <div className="flex h-full rounded-lg overflow-hidden">
          <SideBar />
          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
