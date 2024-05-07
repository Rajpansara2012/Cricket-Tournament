import React, { useState } from 'react';
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardText,
    MDBCardBody,
    MDBCardImage,
    MDBBtn,
    MDBBreadcrumb,
    MDBBreadcrumbItem,
    MDBProgress,
    MDBProgressBar,
    MDBIcon,
    MDBListGroup,
    MDBListGroupItem,
} from "mdb-react-ui-kit";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import Playerprofile from './PlayerProfile';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function MatchDetails({ match }) {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [user, setUser] = useState(null);
    const [graph_run, setGraph_run] = useState(null);
    const [graph_strike_rate, setGraph_strike_rate] = useState(null);
    const [graph_wicket, setGraph_wicket] = useState(null);
    const [graph_economy, setGraph_economy] = useState(null);

    const [selectedPlayer, setSelectedPlayer] = useState(null);

    const handlePlayerClick = (playerId) => {
        console.log(playerId)
        setSelectedPlayer(playerId);
    };

    const handleClosePopup = () => {
        setSelectedPlayer(null);
    };

    return (
        <div className="p-4 bg-white shadow rounded">
            <h2 className="text-2xl font-semibold mb-4">{match.name} Details</h2>
            <div className="mb-4">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-400 py-2 px-4">Team Name</th>
                            <th className="border border-gray-400 py-2 px-4">Scores</th>
                            <th className="border border-gray-400 py-2 px-4">Wickets</th>
                            <th className="border border-gray-400 py-2 px-4">Overs</th>
                        </tr>
                    </thead>
                    <tbody>
                        {match.team_name.map((team, index) => (
                            <tr key={index} className="border border-gray-400">
                                <td className="border border-gray-400 py-2 px-4">
                                    {team}
                                    {match.winner == team && <span className="ml-2 inline-block bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold tracking-wide">(Winner)</span>}
                                    {match.winner == 'tie' && <span className="ml-2 inline-block bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold tracking-wide">(Tie)</span>}
                                </td>
                                <td className="border border-gray-400 py-2 px-4">{match.score[index]}</td>
                                <td className="border border-gray-400 py-2 px-4">{match.wicket[index]}</td>
                                <td className="border border-gray-400 py-2 px-4">{match.over[index]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <h3 className="text-2xl font-semibold mb-4">Player Details</h3>
                {['players1', 'players2'].map((playerGroup, i) => (
                    <table key={i} className="w-full border-collapse mb-4">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-400 py-2 px-4">Player Name</th>
                                <th className="border border-gray-400 py-2 px-4">Batting Run</th>
                                <th className="border border-gray-400 py-2 px-4">Batting Ball</th>
                                <th className="border border-gray-400 py-2 px-4">Strike Rate</th>
                                <th className="border border-gray-400 py-2 px-4">Bowling run</th>
                                <th className="border border-gray-400 py-2 px-4">Over</th>
                                <th className="border border-gray-400 py-2 px-4">Wicket</th>
                                <th className="border border-gray-400 py-2 px-4">Economy</th>
                            </tr>
                        </thead>
                        <tbody>
                            {match[playerGroup].map((player, index) => (
                                <tr key={index} className="border border-gray-400">
                                    <td className="border border-gray-400 py-2 px-4">
                                        <a href="#" onClick={() => handlePlayerClick(player._id)}>
                                            {player.name}
                                        </a>
                                    </td>

                                    <td className="border border-gray-400 py-2 px-4">{player.batting_run}</td>
                                    <td className="border border-gray-400 py-2 px-4">{player.batting_ball}</td>
                                    <td className="border border-gray-400 py-2 px-4">{Math.round(player.strike_rate)}</td>
                                    <td className="border border-gray-400 py-2 px-4">{player.bowling_run}</td>
                                    <td className="border border-gray-400 py-2 px-4">{(parseInt(player.bowling_ball / 6) + (parseFloat((player.bowling_ball % 6) / 10)))}</td>
                                    <td className="border border-gray-400 py-2 px-4">{player.wicket}</td>
                                    <td className="border border-gray-400 py-2 px-4">{Math.round(player.economy)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ))}
            </div>
            {selectedPlayer && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded shadow-lg overflow-y-auto max-h-full">
                        <h1 className='text-center text-xl'>Player Details</h1>
                        <button
                            onClick={handleClosePopup}
                            className="mr-60 top-4 right-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                        >
                            Back
                        </button>
                        {/* Content of the popup */}
                        <Playerprofile playerId={selectedPlayer}></Playerprofile>
                    </div>
                </div>
            )}

        </div>

    );
}

export default MatchDetails;
