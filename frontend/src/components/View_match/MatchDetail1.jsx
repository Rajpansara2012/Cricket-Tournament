import React from 'react';
import axios from "axios";

import { useState, useEffect } from "react";

function MatchDetails1({ match }) {

    const teamId = match.teamId;
    const [players1, setplayers1] = useState([]);
    const [players2, setplayers2] = useState([]);
    useEffect(() => {

        const fetchplayer = async () => {
            try {
                const response = await axios.post(
                    'http://localhost:8082/user/fectch_players',
                    { teamId },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        withCredentials: true,
                    }
                );
                setplayers1(response.data.players1);
                setplayers2(response.data.players2);
            } catch (error) {
                console.log(error);
            }
        };
        setInterval(() => {

            fetchplayer();
        }, 2000);
    }, []);
    return (
        <div>
            <h2 className="text-lg font-semibold">{match.name} Details</h2>
            {/* <h2 className="text-lg font-semibold">Winner :{match.winner} </h2><br></br> */}

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
                                <td className="border border-gray-400 py-2 px-4">{team} {match.winner == team && <p>(Winner)</p>}{match.winner == 'tie' && <p>(Tie)</p>}</td>
                                <td className="border border-gray-400 py-2 px-4">{match.score[index]}</td>
                                <td className="border border-gray-400 py-2 px-4">{match.wicket[index]}</td>
                                <td className="border border-gray-400 py-2 px-4">{match.over[index]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div>
                <h3 className="text-lg font-semibold">Player Details</h3>
                <table className="w-full border-collapse">
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
                        {players1.map((player, index) => (
                            <tr key={index} className="border border-gray-400">
                                <td className="border border-gray-400 py-2 px-4">{player.name}</td>
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
                <table className="w-full border-collapse">
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
                        {players2.map((player, index) => (
                            <tr key={index} className="border border-gray-400">
                                <td className="border border-gray-400 py-2 px-4">{player.name}</td>
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
            </div>
        </div>
    );
}

export default MatchDetails1;
