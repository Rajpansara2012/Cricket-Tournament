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
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const userfind = Cookies.get('token');
        const usertype = Cookies.get('user_type');
        if (userfind === undefined) {
            navigate("/Login")
        }
        else if (usertype != 'admin') {
            navigate("/User_home");
        }

        const fetchTournaments = async () => {
            setIsLoading(true); // Set loading state to true before fetching
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
            } finally {
                setIsLoading(false); // Set loading state to false after fetching
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
        <>
            {isLoading ? (
                <div className="flex items-center justify-center m-auto">
                    <div className="animate-spin mx-auto">
                        <div className="spinner-border border-primary animate-spin inline-block w-8 h-8 border-3 rounded-full" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="ml-3 mt-3 mr-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {tournaments.length > 0 ? (
                            tournaments.map((tournament) => (
                                <a
                                    key={tournament._id}
                                    className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                    onClick={() => handleTournamentClick(tournament)}
                                >
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{tournament.tournament_name}</h5>
                                    <p className="font-normal text-gray-700 dark:text-gray-400">Capacity: {tournament.capacity}</p>
                                    <p className="font-normal text-gray-700 dark:text-gray-400">Location: {tournament.location}</p>
                                </a>
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-64">
                                <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
                                    <div className="p-8">
                                        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">No tournaments available</div>
                                        <a href="/Add_Tournament" className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">Add Tournament</a>
                                        <p className="mt-2 text-gray-500">You can add a new tournament by clicking the link above.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mb-2">
                    </div>
                </>
            )}
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
        </>


    );

}

export default Admin_home;
