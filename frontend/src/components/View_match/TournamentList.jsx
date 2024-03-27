import axios from "axios";
import { useState, useEffect } from "react";
import MatchList from './MatchList';
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import PointTable from "./PointTable";


function TournamentList() {
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isPointTablePopupOpen, setIsPointTablePopupOpen] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        const userfind = Cookies.get('token');
        if (userfind === undefined) {
            navigate("/Login");
        }
        else {
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
                }
                finally {
                    setIsLoading(false); // Set loading state to false after fetching

                }
            };
            fetchTournaments();
        }
    }, []);

    const handleTournamentClick = (tournament) => {
        setSelectedTournament(tournament);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setSelectedTournament(null);
        setIsPopupOpen(false);
    };

    const showPointTable = (tournament) => {
        // Show point table popup
        setSelectedTournament(tournament);
        setIsPointTablePopupOpen(true);
    };

    const closePointTablePopup = () => {
        // Close point table popup
        setSelectedTournament(null);

        setIsPointTablePopupOpen(false);
    };
    return (
        <>        {isLoading ? (
            <div className="flex items-center justify-center m-auto">
                <div className="animate-spin mx-auto">
                    <div className="spinner-border border-primary animate-spin inline-block w-8 h-8 border-3 rounded-full" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        ) : (
            <>
                <div className="ml-3 mt-3 mr-3 mb-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tournaments.length === 0 && (
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
                    {tournaments.map((tournament) => (
                        <div
                            key={tournament._id}
                            className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl p-4 cursor-pointer"
                        >
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{tournament.tournament_name}</h3>
                                <div className="flex items-center justify-between mt-2 text-gray-700 dark:text-gray-400">
                                    <p>Location: {tournament.location}</p>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => handleTournamentClick(tournament, "matches")}
                                            className="inline-flex items-center text-sm font-medium px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-white hover:bg-blue-200 dark:hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed"
                                        >
                                            Matches
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => showPointTable(tournament, "pointTable")}
                                            className="inline-flex items-center text-sm font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-700 text-green-700 dark:text-white hover:bg-green-200 dark:hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed"
                                        >
                                            Point Table
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    ))}
                    {isPopupOpen && (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="fixed inset-0 bg-black opacity-50 z-40"></div>
                            <div className="z-50 relative">
                                <div className="bg-white p-4 rounded-lg shadow-lg max-h-screen overflow-y-auto">
                                    <MatchList tournament={selectedTournament} onClose={closePopup} />
                                </div>
                            </div>
                        </div>
                    )}
                    {isPointTablePopupOpen && (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="fixed inset-0 bg-black opacity-50 z-40"></div>
                            <div className="z-50 relative">
                                <div className="bg-white p-4 rounded-lg shadow-lg max-h-screen overflow-y-auto">
                                    <PointTable tournament={selectedTournament} onClose={closePointTablePopup} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </>
        )}
        </>
    );
}

export default TournamentList;
