import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from 'js-cookie';


function Login(props) {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState(""); // State for error message

    useEffect(() => {
        const userfind = Cookies.get('token');
        const usertype = Cookies.get('user_type');
        // async function fetchData() {
        //     try {
        //         const response = await axios.post('http://localhost:5000/predict', {
        //             runs_left: 19,
        //             balls_left: 12,
        //             wickets_left: 10,
        //             total_runs_x: 200,
        //             cur_run_rate: 10,
        //             req_run_rate: 12
        //         });
        //         console.log(response.data);

        //     } catch (error) {
        //         console.error('Error:', error);
        //     }
        // }
        // fetchData();
        if (userfind !== undefined && usertype == 'admin') {
            navigate("/Admin_home");
        }
        else if (userfind !== undefined && usertype == 'user') {
            navigate("/User_home");
        }
    }, []);

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
            );

            const userData = response.data.user;
            props.setuser(response.data.user.type);

            if (response.data.user.type === "admin") {
                navigate("/Admin_home");
            } else {
                navigate("/User_home");
            }

        } catch (error) {
            setError("Invalid email or password");
            console.log(error);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md md:w-96 w-full">
                <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
                {error && (
                    <p className="text-red-500 text-center mb-4">{error}</p>
                )}
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
                        Don't have an account?{" "}
                        <Link to="/Signup" className="text-blue-500">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>


    );
}

export default Login;
