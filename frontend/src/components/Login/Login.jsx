import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from 'js-cookie';
function Login(props) {

    useEffect(() => {
        const userfind = Cookies.get('token');
        if (userfind != undefined) {
            navigate("/Admin_home")
        }
    }, []);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
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
                "http://localhost:8082/auth/login",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            )
            const userData = response.data.user;
            console.log(response)
            props.setuser(response.data.user.type);
            if (response.data.user.type == "admin")
                navigate("/Admin_home");
            else
                navigate("/User_home");

        }
        catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md md:w-96 w-full">
                <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
                <form onSubmit={handleSubmit} action="">
                    <div className="mb-4">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                            placeholder="Email"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                            placeholder="Password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    >
                        Login
                    </button>
                    <p className="mt-4 text-center">
                        haven't account?{" "}
                        <Link to="/Signup" className="text-blue-500">
                            Singup
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
export default Login