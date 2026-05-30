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
    <div className="h-screen bg-base-200 ">
      <div className="flex items-center justify-center pt-20 px-4 ">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6l h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden ">
            <SideBar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}{" "}
            {/* Placeholder for chat window */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
