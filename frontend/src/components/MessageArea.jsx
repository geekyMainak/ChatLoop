import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaArrowLeft } from "react-icons/fa";
import { IoSend, IoImageOutline } from "react-icons/io5";
import { BsEmojiSmile } from "react-icons/bs";
import { setSelectedUser } from "../redux/userSlice";
import useGetMessages from "../customHooks/useGetMessages";
import useSendMessage from "../customHooks/useSendMessage";
import useListenMessages from "../customHooks/useListenMessages";
import EmojiPicker from "emoji-picker-react";

import { useSocketContext } from "../context/SocketContext";

function MessageArea() {
    const { selectedUser, userData, messages, typingUsers } = useSelector((state) => state.user);
    const { socket } = useSocketContext();
    const dispatch = useDispatch();
    const [messageText, setMessageText] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const fileInputRef = useRef(null);
    const lastMessageRef = useRef();
    const typingTimeoutRef = useRef(null);
    const emojiPickerRef = useRef(null);

    useGetMessages();
    useListenMessages();
    const sendMessage = useSendMessage();

    const scrollToBottom = () => {
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, typingUsers]);

    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleBack = () => {
        dispatch(setSelectedUser(null));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleTyping = (e) => {
        setMessageText(e.target.value);
        if (socket && selectedUser) {
            socket.emit("typing", selectedUser._id);

            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

            typingTimeoutRef.current = setTimeout(() => {
                socket.emit("stopTyping", selectedUser._id);
            }, 2000);
        }
    };

    const handleEmojiClick = (emojiObject) => {
        setMessageText((prev) => prev + emojiObject.emoji);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageText.trim() && !imageFile) return;
        
        if (socket && selectedUser) {
            socket.emit("stopTyping", selectedUser._id);
        }
        
        await sendMessage({ message: messageText, imageFile });
        setMessageText("");
        removeImage();
    };

    if (!selectedUser) {
        return (
            <div className="hidden lg:flex lg:w-[70%] flex-col h-full bg-[#f0f2f5]">
                <div className="flex-1 bg-[#e4e6eb] p-6 flex items-center justify-center">
                    <div className="bg-white/60 px-6 py-3 rounded-full text-gray-500 text-[15px] font-medium shadow-sm">
                        Select a conversation to start chatting
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full lg:w-[70%] flex-col h-full bg-[#f0f2f5] flex absolute lg:relative z-30 transition-transform">
            
            {/* Header */}
            <div className="h-[75px] bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 flex items-center px-6 gap-4 shadow-sm shrink-0">
                <button onClick={handleBack} className="lg:hidden p-2 -ml-2 rounded-full hover:bg-white/20 transition">
                    <FaArrowLeft className="text-white text-[20px]" />
                </button>
                
                <div className="w-[45px] h-[45px] rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                    <img 
                        src={selectedUser.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                        alt={selectedUser.userName} 
                        className="w-full h-full object-cover bg-slate-100" 
                    />
                </div>
                
                <div className="flex-1 overflow-hidden">
                    <h2 className="text-white font-bold text-[17px] truncate">
                        {selectedUser.name || selectedUser.userName}
                    </h2>
                    <p className="text-pink-100 text-[13px] truncate">
                        @{selectedUser.userName}
                    </p>
                </div>

            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col scrollbar-hide" style={{ backgroundImage: "url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')", backgroundSize: 'cover', backgroundBlendMode: 'soft-light', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                {messages && messages.length > 0 ? (
                    messages.map((msg, idx) => {
                        const getSenderId = (m) => {
                            if (!m || !m.senderId) return "";
                            return typeof m.senderId === "object" ? (m.senderId._id || m.senderId).toString() : String(m.senderId);
                        };
                        const currentSenderId = getSenderId(msg);
                        
                        const fromMe = currentSenderId === String(userData?._id);
                        const prevMsg = messages[idx - 1];
                        const nextMsg = messages[idx + 1];
                        
                        const isFirstInSequence = !prevMsg || getSenderId(prevMsg) !== currentSenderId;
                        const isLastInSequence = !nextMsg || getSenderId(nextMsg) !== currentSenderId;
                        
                        // Spacing: less space if part of consecutive block
                        const marginTopClass = isFirstInSequence && idx !== 0 ? 'mt-4' : 'mt-1';
                        
                        // Bubble tail shape based on sequence
                        let bubbleShape = 'rounded-[22px]';
                        if (fromMe) {
                            bubbleShape += isFirstInSequence ? ' rounded-tr-[5px]' : '';
                        } else {
                            bubbleShape += isFirstInSequence ? ' rounded-tl-[5px]' : '';
                        }
                        return (
                            <div key={msg._id || idx} ref={isLastInSequence ? lastMessageRef : null} className={`flex w-full items-end ${marginTopClass} ${fromMe ? 'justify-end' : 'justify-start'} animate-[fadeIn_0.3s_ease-out_forwards]`}>
                                
                                {/* Profile Picture for other user (first in sequence) */}
                                {!fromMe && (
                                    <div className="w-[30px] h-[30px] rounded-full mr-2 shrink-0 flex items-end">
                                        {isFirstInSequence && (
                                            <img 
                                                src={selectedUser?.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                                                alt="profile" 
                                                className="w-full h-full rounded-full object-cover shadow-sm border border-gray-200"
                                            />
                                        )}
                                    </div>
                                )}

                                <div className={`relative flex flex-col px-3 py-2 max-w-[70%] shadow-sm text-[15px] ${bubbleShape} ${fromMe ? 'bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-500 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}>
                                    {msg.image && (
                                        <img src={msg.image} alt="attachment" onLoad={scrollToBottom} className="rounded-xl max-w-full max-h-[250px] object-cover mt-1 mb-1" />
                                    )}
                                    
                                    <div className="flex items-end justify-between gap-3">
                                        {msg.message && <span className="break-words mb-1">{msg.message}</span>}
                                        <span className={`text-[10.5px] whitespace-nowrap self-end mb-0.5 ${fromMe ? 'text-white/80' : 'text-gray-400'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="bg-white/80 text-gray-500 text-sm px-4 py-2 rounded-full shadow-sm">
                            Send a message to start the conversation!
                        </span>
                    </div>
                )}
                
                {/* Typing Indicator */}
                {typingUsers.includes(selectedUser._id) && (
                    <div ref={lastMessageRef} className="flex w-full justify-start mt-2">
                        <div className="bg-white text-gray-500 px-4 py-2.5 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5 w-fit">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Image Preview Area */}
            {imagePreview && (
                <div className="px-4 py-2 bg-[#f0f2f5] border-t border-gray-300 flex items-center gap-4 shrink-0">
                    <div className="relative">
                        <img src={imagePreview} alt="preview" className="h-16 w-16 object-cover rounded-md border border-gray-300" />
                        <button 
                            onClick={removeImage} 
                            className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-500 transition"
                        >
                            x
                        </button>
                    </div>
                </div>
            )}

            {/* Message Input Form */}
            <div className="p-4 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.02)] shrink-0 relative">
                
                {/* Emoji Picker */}
                {showEmojiPicker && (
                    <div ref={emojiPickerRef} className="absolute bottom-[75px] left-4 z-50 shadow-xl rounded-xl overflow-hidden">
                        <EmojiPicker 
                            onEmojiClick={handleEmojiClick}
                            width={320}
                            height={400}
                            searchDisabled={false}
                            skinTonesDisabled
                        />
                    </div>
                )}

                <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-[#f0f2f5] rounded-full p-2 px-4 focus-within:ring-2 focus-within:ring-fuchsia-300 transition-all">
                    
                    <input 
                        type="file" 
                        accept="image/*" 
                        hidden 
                        ref={fileInputRef} 
                        onChange={handleImageChange} 
                    />
                    
                    <button 
                        type="button" 
                        className={`transition p-1 ${showEmojiPicker ? 'text-fuchsia-600' : 'text-gray-500 hover:text-fuchsia-600'}`}
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                        <BsEmojiSmile className="text-[22px]" />
                    </button>
                    
                    <button 
                        type="button" 
                        className="text-gray-500 hover:text-fuchsia-600 transition p-1"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <IoImageOutline className="text-[24px]" />
                    </button>
                    
                    <input 
                        type="text" 
                        value={messageText}
                        onChange={handleTyping}
                        placeholder="Type a message..." 
                        className="flex-1 bg-transparent outline-none text-[15px] px-2 py-1"
                    />
                    
                    <button 
                        type="submit" 
                        disabled={!messageText.trim() && !imageFile}
                        className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white w-[38px] h-[38px] rounded-full flex items-center justify-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform shrink-0"
                    >
                        <IoSend className="text-[17px] ml-1" />
                    </button>
                    
                </form>
            </div>
            
        </div>
    );
}

export default MessageArea;