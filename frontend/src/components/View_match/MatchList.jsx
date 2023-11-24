import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import MatchDetails from './MatchDetails';

function MatchList({ tournament, onClose }) {
    const tournament_id = tournament._id;
    console.log(tournament_id);
    const [matches, setMatches] = useState([]);

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
            } catch (error) {
                console.log(error);
            }
        };
        fetchMatch();
    }, [tournament]);
    console.log(matches)
    const [selectedMatch, setSelectedMatch] = useState(null);

    const handleMatchClick = (match) => {
        setSelectedMatch(match);
    };

    return (
        <div>
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold">{tournament.tournament_name} Matches</h1>
                <button type="button" onClick={onClose} className="bg-gray-200 py-2 px-4 rounded">Close</button>

            </div>
            <ul>
                {matches && matches.map((match, index) => (
                    <li
                        key={match._id}
                        onClick={() => handleMatchClick(match)}
                        className="cursor-pointer hover:underline"
                    >
                        Match {index + 1}: {match.team_name[0]} vs {match.team_name[1]}
                    </li>
                ))}
            </ul>
            {selectedMatch && <MatchDetails match={selectedMatch} />}
        </div>
    );
}

export default MatchList;
