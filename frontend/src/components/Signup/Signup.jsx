import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        type: "",
        photo: null,
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();


    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFormData((prevFormData) => ({
            ...prevFormData,
            photo: file,
        }));
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true); // Set loading state to true during form submission
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("username", formData.username);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("password", formData.password);
            formDataToSend.append("type", formData.type);
            formDataToSend.append("photo", formData.photo);


            const response = await axios.post(
                "http://localhost:8082/auth/signup",
                formDataToSend,
                {
                    withCredentials: true,
                }
            );

            if (response.data.message === "you can not take this username or email") {
                alert("User is already exist!!");
            } else {
                navigate("/Login");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false); // Set loading state to false after form submission
        }
    };

    return (
        <div className="min-h-screen mb-2 flex items-center justify-center bg-gray-100">
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
                    <div className="mb-4">
                        <label htmlFor="photo" className="block mb-1 font-medium">
                            Profile Photo
                        </label>
                        <input
                            type="file"
                            name="photo"
                            onChange={handleFileChange}
                            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                            accept="image/*"
                            disabled={isLoading} // Disable input field while loading
                        />
                    </div>
                    {/* End of photo input field */}
                    <button
                        type="submit"
                        className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isLoading} // Disable submit button while loading
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            </div>
                        ) : (
                            <>Sign Up</>
                        )}
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
    );
}

export default Signup;