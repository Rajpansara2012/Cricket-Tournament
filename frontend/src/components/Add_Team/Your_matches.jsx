import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import MatchDetails from '../View_match/MatchDetails';
import { TailSpin } from "react-loader-spinner";

function Your_matches() {
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [isLoding, setIsLoding] = useState(true); // Set isLoding to true initially
    const navigate = useNavigate();

    const handleCardClick = (match) => {
        setSelectedMatch(match);
        setPopupOpen(true);
    };

    const [matches, setMatches] = useState([]);
    useEffect(() => {
        const userfind = Cookies.get('token');
        if (userfind === undefined) {
            navigate("/Login");
        }

        const fetchTournaments = async () => {
            try {
                const response = await axios.post(
                    "http://localhost:8082/user/user_matches",
                    { userfind },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        withCredentials: true,
                    }
                );
                setMatches(response.data.match);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoding(false); // Set isLoding to false once the API call is completed
            }
        };

        fetchTournaments();
    }, [navigate]);

    return (
        <>
            {isLoding ? (
                <div className="flex justify-center">
                    <TailSpin color="#00BFFF" height={50} width={50} />
                </div>
            ) : (
                <div className="flex flex-wrap">
                    {matches.map((match, index) => (
                        <div
                            key={index}
                            className="w-full md:w-1/2 lg:w-1/3 p-3"
                            onClick={() => handleCardClick(match)}
                        >
                            <div className="bg-white rounded-lg shadow-lg p-4">
                                <h2 className="text-lg font-semibold mb-2">
                                    {match.team_name[0]} vs {match.team_name[1]}
                                </h2>
                                <p>
                                    {match.team_name[0]} Score: {match.score[0]}/{match.wicket[0]}
                                </p>
                                <p>
                                    {match.team_name[1]} Score: {match.score[1]}/{match.wicket[1]}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isPopupOpen && selectedMatch && (
                <div className="fixed mt-10 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
                    <div className="bg-white p-8 rounded shadow-md relative max-h-full overflow-y-auto">
                        <button
                            onClick={() => setPopupOpen(false)}
                            className="absolute top right-4 text-gray-500 hover:text-gray-800 cursor-pointer"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <h2 className="text-2xl font-semibold mb-4 text-center">Match Details</h2>
                        <MatchDetails match={selectedMatch} />
                    </div>
                </div>
            )}
        </>
    );
}

export default Your_matches;
