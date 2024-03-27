import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TailSpin } from 'react-loader-spinner';

import MatchDetails from './MatchDetails';

function MatchList({ tournament, onClose }) {
    const tournament_id = tournament._id;
    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatch = async () => {
            try {
                const response = await axios.post(
                    "http://localhost:8082/admin/matches",
                    { tournament_id },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        withCredentials: true,
                    }
                );
                setMatches(response.data.match);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };
        fetchMatch();
    }, [tournament_id]);

    const [selectedMatch, setSelectedMatch] = useState(null);

    const handleMatchClick = (match) => {
        setSelectedMatch(match);
    };

    return (
        <div className="p-4 bg-white shadow rounded">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold text-gray-800 mr-3 ">{tournament.tournament_name} Matches</h1>
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-colors"
                >
                    Close
                </button>
            </div>
            {loading ? (
                <div className="flex justify-center">
                    <TailSpin color="#00BFFF" height={50} width={50} />
                </div>
            ) : (
                matches.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {matches.map((match, index) => (
                            <div
                                key={match._id}
                                onClick={() => handleMatchClick(match)}
                                className="p-4 bg-gray-100 rounded shadow cursor-pointer hover:bg-gray-200"
                            >
                                <p className="font-medium text-gray-700">Match {index + 1}: {match.team_name[0]} vs {match.team_name[1]}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-lg text-gray-700">No matches found.</p>
                )
            )}
            {selectedMatch && <MatchDetails match={selectedMatch} />}
        </div>

    );
}

export default MatchList;
