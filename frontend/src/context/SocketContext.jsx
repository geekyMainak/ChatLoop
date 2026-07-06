import { createContext, useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import { serverUrl } from "../config";
import { setOnlineUsers } from "../redux/userSlice";

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { userData } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (userData) {
            const socket = io(serverUrl, {
                query: {
                    userId: userData._id,
                },
            });

            setSocket(socket);

            socket.on("getOnlineUsers", (users) => {
                dispatch(setOnlineUsers(users));
            });

            socket.on("userTyping", (userId) => {
                dispatch({ type: "user/addTypingUser", payload: userId });
            });

            socket.on("userStoppedTyping", (userId) => {
                dispatch({ type: "user/removeTypingUser", payload: userId });
            });

            return () => socket.close();
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [userData, dispatch]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
