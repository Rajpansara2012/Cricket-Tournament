import React, { useState, useEffect } from "react";
import axios from "axios";
import Details from "./Details";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

function Admin_home() {
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userfind = Cookies.get('token');
        const usertype = Cookies.get('user_type');
        if (userfind === undefined) {
            navigate("/Login")
        } else if (usertype !== 'admin') {
            navigate("/User_home");
        }

        const fetchTournaments = async () => {
            try {
                const response = await axios.post(
                    "http://localhost:8082/admin/showallt",
                    {},
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        withCredentials: true,
                    }
                );
                setTournaments(response.data.tournament);
            } catch (error) {
                console.log(error);
            }
        };
        fetchTournaments();
    }, [navigate]);

    const handleTournamentClick = (tournament) => {
        setSelectedTournament(tournament);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setSelectedTournament(null);
        setIsPopupOpen(false);
    };

    return (
        <div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-screen bg-gray-400 antialiased text-gray-900 p-8">
        {tournaments.map((tournament) => (
            <div key={tournament._id} className="relative mx-4">
                {/* Add mx-4 (margin-x: 4) to create space between cards */}
                <div className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl" onClick={() => handleTournamentClick(tournament)}>
                    <div className="flex items-baseline">
                        <span className="bg-teal-200 text-teal-800 text-xs px-2 inline-block rounded-full uppercase font-semibold tracking-wide">
                            New
                        </span>
                        <div className="ml-2 text-gray-600 uppercase text-xs font-semibold tracking-wider">
                            {tournament.capacity} baths &bull; {tournament.rooms} rooms
                        </div>
                    </div>
                    <h4 className="mt-1 text-xl font-semibold uppercase leading-tight truncate">
                        {tournament.tournament_name}
                    </h4>
                    <div className="mt-1">
                        ${tournament.price}
                        <span className="text-gray-600 text-sm"> /wk</span>
                    </div>
                    <div className="mt-4">
                        <span className="text-teal-600 text-md font-semibold">
                            {tournament.rating}/5 ratings
                        </span>
                        <span className="text-sm text-gray-600">(based on {tournament.num_ratings} ratings)</span>
                    </div>
                </div>
            </div>
        ))}
        {isPopupOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black opacity-50 z-40"></div>
                <div className="z-50 relative">
                    <button
                        onClick={closePopup}
                        className="absolute top-1 right-1 bg-gray-500 text-white p-1 w-6 rounded hover:bg-gray-600"
                    >
                        X
                    </button>
                    <div className="bg-white p-4 rounded-lg shadow-lg max-h-screen overflow-y-auto">
                        <br></br>
                        <Details teamsid={selectedTournament.teams} onClose={closePopup} />
                    </div>
                </div>
            </div>
        )}
    </div>
</div>

    
    );
}

export default Admin_home;
