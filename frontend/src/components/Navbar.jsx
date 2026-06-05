import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { MessageSquare, Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="bg-base-100/95 border-b border-base-300 sticky top-0 z-50 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Chatify
              </h1>
            </Link>
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-2">
            <Link
              to={"/settings"}
              className="btn btn-sm btn-ghost gap-2 hover:btn-primary transition-all"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link
                  to={"/profile"}
                  className="btn btn-sm btn-ghost gap-2 hover:btn-primary transition-all"
                >
                  <img
                    src={authUser.profilePic || "/avatar.png"}
                    alt={authUser.fullName || "Profile"}
                    className="size-6 rounded-full object-cover"
                  />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  className="btn btn-sm btn-ghost gap-2 hover:btn-error transition-all"
                  onClick={logout}
                >
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
