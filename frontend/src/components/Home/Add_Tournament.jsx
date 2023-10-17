import React from 'react'
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
function Add_Tournament() {
    const navigate = useNavigate();

    useEffect(() => {
        const userfind = Cookies.get('token');
        if (userfind === undefined) {
            navigate("/Login")
        }
    }, []);
    const [formData, setFormData] = useState({
        tournament_name: "",
        capacity: 0
    });
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
                "http://localhost:8082/admin/addtournament",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            )
            console.log(response)
            navigate("/Admin_home")

        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md md:w-96 w-full">
                <h2 className="text-2xl font-semibold mb-4 text-center">Add Tournament</h2>
                <form onSubmit={handleSubmit} action="">
                    <div className="mb-4">
                        <input
                            type="text"
                            name="tournament_name"
                            value={formData.tournament_name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                            placeholder="Tournament Name"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="number"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                            placeholder="capacity"
                            min="1"
                            step="1"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    >
                        Add Tournament
                    </button>
                </form>

            </div>
        </div>
    )
}

export default Add_Tournament
