import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../redux/userSlice";
import { serverUrl } from "../config";

const useSendMessage = () => {
    const dispatch = useDispatch();
    const { selectedUser } = useSelector((state) => state.user);

    const sendMessage = async ({ message, imageFile }) => {
        try {
            if (!selectedUser) return;

            const formData = new FormData();
            if (message) formData.append("message", message);
            if (imageFile) formData.append("image", imageFile);

            const response = await axios.post(
                `${serverUrl}/api/message/send/${selectedUser._id}`,
                formData,
                { withCredentials: true }
            );

            dispatch(addMessage(response.data));
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return sendMessage;
};

export default useSendMessage;
