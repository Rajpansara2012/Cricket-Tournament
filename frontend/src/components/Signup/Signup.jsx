import axios from "axios";
import { useState } from "react";
// import "/common.css";
import { useNavigate, Link } from "react-router-dom";


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
            navigate("/Login");
        }
        catch (error) {
            console.log(error);
        }
    }
   
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>
                <form onSubmit={handleSubmit} action="">
                    <div className="mb-4">
                        <label htmlFor="type" className="block mb-1 font-medium">
                            Account Type
                        </label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                            required
                        >
                            <option value="">Select a user type</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="username" className="block mb-1 font-medium">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                            placeholder="Username"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-1 font-medium">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                            placeholder="Password"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-1 font-medium">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                            placeholder="Email"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="mt-4 text-center">
                    Already have an account?{" "}
                    <Link to="/Login" className="text-blue-500">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}
export default Signup