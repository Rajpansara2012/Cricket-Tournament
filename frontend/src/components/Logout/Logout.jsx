import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post(
                "http://localhost:8082/auth/logout",
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            navigate("/Login");
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleLogout();
    }, []); // Empty dependency array means this effect runs once after component mount

    return <></>;
}

export default Logout;
