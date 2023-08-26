import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Signup() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        type: ""
    });
    const navigate = useNavigate();
    const handleChange = (event) => {
        const { name, value } = event.target;


        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));

    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:8082/auth/signup",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            )
            navigate("/");
        }
        catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit} action="">
                <input type="text" name="type" value={formData.type} onChange={handleChange}></input>
                <input type="text" name="username" value={formData.username} onChange={handleChange}></input>
                <input type="text" name="password" value={formData.password} onChange={handleChange}></input>
                <input type="text" name="email" value={formData.email} onChange={handleChange}></input>
                <button type="submit">singup</button>
            </form>
        </div>
    )
}
export default Signup