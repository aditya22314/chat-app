import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const SideBar = () => {
  const { users, getUsers, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();

  const { onlineUsers, authUser } = useAuthStore();
  console.log(authUser);

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users.filter((user) =>user._id!=authUser._id);

  if (isUsersLoading) {
    return (
      <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col">
        <div className="flex items-center justify-center h-full">
          <span className="loading loading-spinner"></span>
        </div>
      </aside>
    );
  }

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col min-h-0">
      <div className="border-b border-base-300 w-full p-5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>
      <div className="p-3 flex-shrink-0">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={() => setShowOnlineOnly(!showOnlineOnly)}
            className="checkbox checkbox-sm"
          />
          <span className="text-sm hidden lg:block">Show Online Only</span>
        </label>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 py-3">
        {filteredUsers?.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
              selectedUser?._id === user._id
                ? "bg-base-300 ring-1 ring-base-300"
                : ""
            }`}
          >
            <div className="relative mx-auto lg:mx-0 flex-shrink-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border border-base-100 rounded-full"></div>
              )}
            </div>
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="font-medium truncate">{user.fullName}</div>
            </div>
          </button>
        ))}

        {users.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No users found</div>
        )}
      </div>
    </aside>
  );
};

export default SideBar;
