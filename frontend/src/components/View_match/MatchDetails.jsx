import React from 'react';

function MatchDetails({ match }) {

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
                ))}
            </div>
        </div>

    );
}

export default MatchDetails;
