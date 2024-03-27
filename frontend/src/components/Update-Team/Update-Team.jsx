import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { json } from 'react-router-dom';
import Spinner from 'react-spinner';

function UpdateTeam() {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [updateStatus, setUpdateStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8082/user/FectchTeams', {
            withCredentials: true
        })
            .then(response => {
                setTeams(response.data);
                console.log(response.data); // Handle the response data
            })
            .catch(error => {
                console.error('Error fetching teams:', error); // Handle errors
            });
    }, []);

    useEffect(() => {
        let timer;
        if (updateStatus) {
            timer = setTimeout(() => {
                setUpdateStatus(null);
            }, 8000);
        }

        return () => clearTimeout(timer);

    }, [updateStatus]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPlayer) {
            // If selectedPlayer is not set, prevent form submission
            alert('Please select a player');
            return;
        }
        const requestData = {
            name: selectedPlayer.name,
            type: selectedPlayer.type,
            teamId: selectedTeam
        }
        try {
            setLoading(true);
            const apiUrl = `http://localhost:8082/user/players/${selectedPlayer._id}`;
            axios.put(apiUrl, requestData)
                .then(response => {
                    // Handle successful response
                    console.log('Player updated successfully:', response.data);
                    setUpdateStatus('success');
                    const teamIndex = teams.findIndex(team => team._id === selectedTeam);

                    // If the team is found
                    if (teamIndex !== -1) {
                        // Find the index of the player in the players array of the team
                        const playerIndex = teams[teamIndex].players.findIndex(player => player._id === selectedPlayer._id);

                        if (playerIndex !== -1) {
                            teams[teamIndex].players[playerIndex].name = selectedPlayer.name;
                            teams[teamIndex].players[playerIndex].type = selectedPlayer.type;
                        }
                    }
                    setLoading(false);

                })
                .catch(error => {
                    setUpdateStatus('error');
                    console.error('Error updating player:', error.response.data);
                    setLoading(false);
                });
        } catch (error) {
            setUpdateStatus('error');
            console.error('Error updating player:', error);
        } finally {
        }
    };
    console.log(loading)
    if (selectedPlayer) {
        console.log(selectedPlayer)
        console.log(selectedPlayer.batting_run)
    }
    return (
        <>

            <div className="mt-4 m-auto w-full max-w-xs">
                {updateStatus === 'success' && (
                    <div className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800" role="alert">
                        <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                        </svg>
                        <span className="sr-only">Success</span>
                        <div>
                            <span className="font-medium">Success alert!</span> Player updated successfully.
                        </div>
                    </div>
                )}
                {updateStatus === 'error' && (
                    <div className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
                        <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                        </svg>
                        <span className="sr-only">Error</span>
                        <div>
                            <span className="font-medium">Error alert!</span> Failed to update player(team already played match).
                        </div>
                    </div>
                )}
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="team">
                            Select Team:
                        </label>
                        <div className="inline-block relative w-64">
                            <select
                                id="team"
                                value={selectedTeam}
                                onChange={(e) => {
                                    setSelectedTeam(e.target.value);
                                    setSelectedPlayer(null); // Setting selectedPlayer to null
                                }}

                                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                required
                            >
                                <option value="">Select Team</option>
                                {teams.map((team) => (
                                    <option key={team._id} value={team._id}>
                                        {team.team_name}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg
                                    className="fill-current h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    {selectedTeam && (
                        <div className="mb-4 relative w-64">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="player">
                                Select Player:
                            </label>
                            <div className="inline-block relative w-full">
                                <select
                                    id="player"
                                    value={selectedPlayer ? selectedPlayer._id : ''}
                                    onChange={(e) => setSelectedPlayer(JSON.parse(e.target.value))}
                                    className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"

                                >
                                    <option value="">Select Player</option>
                                    {teams.find((team) => team._id === selectedTeam)?.players.map((player) => (
                                        <option key={player._id} value={JSON.stringify(player)}>
                                            {player.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg
                                        className="fill-current h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedPlayer && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                Name:
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={selectedPlayer.name}
                                onChange={(e) => setSelectedPlayer({ ...selectedPlayer, name: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                    )}
                    {selectedPlayer && (
                        <div className="mb-6 relative w-64">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                                Type:
                            </label>
                            <div className="inline-block relative w-full">
                                <select
                                    id="type"
                                    value={selectedPlayer.type}
                                    onChange={(e) => setSelectedPlayer({ ...selectedPlayer, type: e.target.value })}
                                    className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="batsmen">Batsmen</option>
                                    <option value="bowler">Bowler</option>
                                    <option value="all-rounder">All-Rounder</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg
                                        className="fill-current h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}

                    {!loading && <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={loading}
                    >
                        Update Player
                    </button>
                    }
                    {loading &&
                        <button
                            disabled
                            type="button"
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-4 focus:ring-blue-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                            </svg>
                            Loading...
                        </button>


                    }
                </form>

                {/* <p className="text-center text-gray-500 text-xs">&copy;2020 Acme Corp. All rights reserved.</p> */}
            </div>

        </>

    )
}

export default UpdateTeam
