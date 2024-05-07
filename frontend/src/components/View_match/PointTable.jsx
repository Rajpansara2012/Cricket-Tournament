import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PointTable({ tournament, onClose }) {
    const tournament_id = tournament;
    const [pt, setPt] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Track loading state

    useEffect(() => {
        const fetchPointTable = async () => {
            try {
                const response = await axios.post(
                    "http://localhost:8082/admin/point_table",
                    { tournament_id },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        withCredentials: true,
                    }
                );
                setPt(response.data.point_table);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false); // Set loading to false after fetching (success or error)
            }
        };

        fetchPointTable();
    }, [tournament_id]);

    return (
        <div className="max-w-full overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold mr-3">Point Table for Tournament: {tournament.tournament_name}</h2>
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md" onClick={onClose}>Close</button>
            </div>
            {isLoading ? (
                <div className="flex items-center justify-center m-auto">
                    <div className="animate-spin mx-auto">
                        <div className="spinner-border border-primary animate-spin inline-block w-8 h-8 border-3 rounded-full" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                </div>// Display loader while data is being fetched
            ) : (
                <table className="table-auto w-full border-collapse border border-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 bg-gray-100 border border-gray-200">Team</th>
                            <th className="px-4 py-2 bg-gray-100 border border-gray-200">Played Matches</th>
                            <th className="px-4 py-2 bg-gray-100 border border-gray-200">Win</th>
                            <th className="px-4 py-2 bg-gray-100 border border-gray-200">Loss</th>
                            <th className="px-4 py-2 bg-gray-100 border border-gray-200">Tie</th>
                            <th className="px-4 py-2 bg-gray-100 border border-gray-200">Net Run Rate</th>
                            <th className="px-4 py-2 bg-gray-100 border border-gray-200">Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pt.map((teamData) => (
                            <tr key={teamData._id} className="bg-white">
                                <td className="px-4 py-2 border border-gray-200">{teamData.team.team_name}</td>
                                <td className="px-4 py-2 border border-gray-200">{teamData.played_match}</td>
                                <td className="px-4 py-2 border border-gray-200">{teamData.win}</td>
                                <td className="px-4 py-2 border border-gray-200">{teamData.loss}</td>
                                <td className="px-4 py-2 border border-gray-200">{teamData.tie}</td>
                                <td className="px-4 py-2 border border-gray-200">{(teamData.netRunrate).toFixed(2)}</td>
                                <td className="px-4 py-2 border border-gray-200">{teamData.point}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default PointTable;
