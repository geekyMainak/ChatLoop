import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, incrementUnread } from "../redux/userSlice";

const useListenMessages = () => {
    const { socket } = useSocketContext();
    const dispatch = useDispatch();

    const { selectedUser } = useSelector((state) => state.user);

    useEffect(() => {
        const handleNewMessage = (newMessage) => {
            const senderIdStr = typeof newMessage.senderId === 'object' ? newMessage.senderId._id?.toString() || newMessage.senderId.toString() : String(newMessage.senderId);
            const selectedUserIdStr = selectedUser ? String(selectedUser._id) : null;
            
            if (selectedUser && senderIdStr === selectedUserIdStr) {
                dispatch(addMessage(newMessage));
            } else {
                dispatch(incrementUnread(senderIdStr));
            }
        };

        socket?.on("newMessage", handleNewMessage);
        return () => socket?.off("newMessage", handleNewMessage);
    }, [socket, dispatch, selectedUser]);
};

export default useListenMessages;
