import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../config";
import { setMessages } from "../redux/userSlice";

const useGetMessages = () => {
    const dispatch = useDispatch();
    const { selectedUser } = useSelector((state) => state.user);

    useEffect(() => {
        const getMessages = async () => {
            try {
                if (!selectedUser) return;
                
                const response = await axios.get(`${serverUrl}/api/message/${selectedUser._id}`, {
                    withCredentials: true,
                });
                
                dispatch(setMessages(response.data));
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        getMessages();
    }, [selectedUser, dispatch]);
};

export default useGetMessages;
