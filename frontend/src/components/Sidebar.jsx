import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { FiLogOut } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../config";
import { setUserData, setSelectedUser, clearUnread } from "../redux/userSlice";

function Sidebar() {
  const { userData, otherUsers, onlineUsers, selectedUser, unreadMessages } = useSelector((state) => state.user);
  const [search, setSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [recentChatIds, setRecentChatIds] = useState(() => {
    try {
      const saved = localStorage.getItem(`recentChats_${userData?._id}`);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedUser && !recentChatIds.includes(selectedUser._id)) {
      const updated = [selectedUser._id, ...recentChatIds];
      setRecentChatIds(updated);
      localStorage.setItem(`recentChats_${userData?._id}`, JSON.stringify(updated));
    }
  }, [selectedUser, recentChatIds, userData]);

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      navigate("/login");
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const filteredUsers = otherUsers?.filter((u) => {
    if (u._id === userData?._id) return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const n = u.name ? u.name.toLowerCase() : "";
      const un = u.userName ? u.userName.toLowerCase() : "";
      return n.includes(q) || un.includes(q);
    } else {
      return recentChatIds.includes(u._id);
    }
  }) || [];

  return (
    <div className="lg:w-[30%] w-full h-full bg-slate-100 flex flex-col relative border-r border-gray-300">
      
      {/* Top Gradient Card */}
      <div className="w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 rounded-br-[60px] shadow-lg flex flex-col px-6 pt-8 pb-6 relative z-10">
        
        {/* Top Row: Logo & Profile Pic */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-white text-[24px] font-bold">ChatLoop</h1>
            <div className="mt-4">
              <h2 className="text-pink-100 text-[18px] font-medium">Hi,</h2>
              <h1 className="text-white text-[22px] font-bold truncate max-w-[200px]">
                {userData?.name || userData?.userName}
              </h1>
            </div>
          </div>
          
          <Link to="/profile" className="w-[55px] h-[55px] rounded-full overflow-hidden shadow-lg border-2 border-white cursor-pointer hover:scale-105 transition-transform shrink-0">
            <img
              src={userData?.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt="profile"
              className="w-full h-full object-cover bg-white"
            />
          </Link>
        </div>

        {/* Active Users Row & Search */}
        <div className="mt-8 flex items-center gap-3">
          {!search ? (
            <div
              className="w-[50px] h-[50px] rounded-full bg-white shadow-lg shadow-fuchsia-500/20 flex justify-center items-center cursor-pointer hover:scale-105 transition-all shrink-0"
              onClick={() => setSearch(true)}
            >
              <IoIosSearch className="text-[24px] text-fuchsia-600" />
            </div>
          ) : (
            <div className="h-[50px] flex-1 bg-white rounded-full shadow-lg shadow-fuchsia-500/20 flex items-center gap-2 px-4 transition-all w-full">
              <IoIosSearch className="text-[22px] text-fuchsia-600" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-[15px] bg-transparent"
                autoFocus
              />
              <RxCross2
                className="text-[22px] cursor-pointer text-gray-500 hover:text-red-500"
                onClick={() => {
                  setSearch(false);
                  setSearchQuery("");
                }}
              />
            </div>
          )}

          {/* Render circular avatars for online users next to search */}
          {!search && (
            <div className="flex -space-x-3 overflow-hidden">
              {otherUsers?.filter(u => onlineUsers.includes(u._id) && u._id !== userData?._id).slice(0, 4).map((user) => (
                <div 
                  key={user._id} 
                  onClick={() => {
                    dispatch(setSelectedUser(user));
                    dispatch(clearUnread(user._id));
                  }}
                  className="w-[50px] h-[50px] rounded-full border-2 border-white shadow-md hover:shadow-xl hover:shadow-fuchsia-500/30 overflow-hidden shrink-0 cursor-pointer hover:scale-110 hover:z-10 transition-all relative"
                >
                  <img src={user.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt={user.userName} className="w-full h-full object-cover bg-slate-200" title={user.name} />
                  <span className="absolute bottom-0 right-1 w-2.5 h-2.5 bg-green-500 border border-white rounded-full shadow-sm"></span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto p-5 pb-24 scrollbar-hide">
        <div className="space-y-3 mt-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => {
              const isOnline = onlineUsers.includes(user._id);
              const unreadCount = unreadMessages[user._id];
              return (
                <div 
                  key={user._id} 
                  onClick={() => {
                    dispatch(setSelectedUser(user));
                    dispatch(clearUnread(user._id));
                  }}
                  className={`flex items-center gap-4 bg-white p-3 rounded-full shadow-md hover:shadow-lg hover:shadow-fuchsia-500/10 cursor-pointer transition-all ${selectedUser?._id === user._id ? 'ring-2 ring-fuchsia-500 bg-fuchsia-50' : ''}`}
                >
                  <div className="relative shrink-0">
                    <div className="w-[45px] h-[45px] rounded-full overflow-hidden shadow-md border border-gray-100">
                      <img src={user.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="user" className="w-full h-full object-cover bg-slate-100" />
                    </div>
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h3 className={`font-semibold text-[16px] truncate ${unreadCount ? 'text-fuchsia-600' : 'text-gray-800'}`}>
                      {user.name || user.userName}
                    </h3>
                  </div>
                  {unreadCount > 0 && (
                    <div className="w-6 h-6 rounded-full bg-fuchsia-500 text-white flex items-center justify-center text-[12px] font-bold shadow-md shrink-0">
                      {unreadCount}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500 mt-10">No users found</div>
          )}
        </div>
      </div>

      {/* Logout Button (Bottom Left) */}
      <div className="absolute bottom-6 left-6 z-20">
        <button
          onClick={handleLogout}
          className="w-[50px] h-[50px] rounded-full bg-white shadow-lg border border-gray-100 flex justify-center items-center cursor-pointer hover:bg-red-50 hover:text-red-500 text-gray-600 transition-colors group"
          title="Logout"
        >
          <FiLogOut className="text-[22px] group-hover:-translate-x-0.5 transition-transform" />
        </button>
      </div>

    </div>
  );
}

export default Sidebar;
