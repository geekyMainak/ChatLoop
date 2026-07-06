import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOtherUsers } from "../redux/userSlice";
import axios from "axios";
import { serverUrl } from "../config";

const useGetOtherUsers = () => {
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchOtherUsers = async () => {
            if (!userData) return;
            try {
                const response = await axios.get(`${serverUrl}/api/user/other-users`, {
                    withCredentials: true,
                });
                dispatch(setOtherUsers(response.data));
            } catch (error) {
                console.error("Error fetching other users:", error);
            }
        };
        
        fetchOtherUsers();
    }, [dispatch, userData]);
};

export default useGetOtherUsers;
