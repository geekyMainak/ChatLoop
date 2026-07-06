import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    loading: true,
    otherUsers: null,
    selectedUser: null,
    onlineUsers: [],
    messages: [],
    unreadMessages: {},
    typingUsers: [],
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.loading = false;
    },
    setOtherUsers: (state, action) => {
      state.otherUsers = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },
    incrementUnread: (state, action) => {
      const senderId = action.payload;
      state.unreadMessages[senderId] = (state.unreadMessages[senderId] || 0) + 1;
    },
    clearUnread: (state, action) => {
      const userId = action.payload;
      if (state.unreadMessages[userId]) {
        delete state.unreadMessages[userId];
      }
    },
    addTypingUser: (state, action) => {
      if (!state.typingUsers.includes(action.payload)) {
        state.typingUsers.push(action.payload);
      }
    },
    removeTypingUser: (state, action) => {
      state.typingUsers = state.typingUsers.filter(id => id !== action.payload);
    },
  },
});

export const { setUserData, setOtherUsers, setSelectedUser, setOnlineUsers, setMessages, addMessage, incrementUnread, clearUnread, addTypingUser, removeTypingUser } = userSlice.actions;
export default userSlice.reducer;