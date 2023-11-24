import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Modal from 'react-modal';
import { TailSpin } from 'react-loader-spinner';
Modal.setAppElement('#root'); // Set the root app element for accessibility

function Add_Team() {
    const navigate = useNavigate();
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState();
    const [isShow, setIsShow] = useState(false);
    const [IsTeamAdded, setIsteamAdded] = useState(false);
    const [formData, setFormData] = useState({
        tournament_name: "",
        team_name: "",
        players: Array(11).fill({ player_name: "", player_type: "" }),
    });
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal visibility

    const handlePlayerChange = (index, event) => {
        const { name, value } = event.target;
        const updatedPlayers = [...formData.players];
        const updatedPlayer = { ...updatedPlayers[index] };
        updatedPlayer[name] = value;
        updatedPlayers[index] = updatedPlayer;
        setFormData({ ...formData, players: updatedPlayers });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        formData.tournament_name = selectedTournament.tournament_name;
        setLoading(true);

        try {
            await axios.post(
                "http://localhost:8082/user/add_team",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
        } catch (error) {
            console.log(error);
        }

        setFormData({ tournament_name: "", team_name: "", players: Array(11).fill({ player_name: "", player_type: "" }) });
        setIsShow(false);
        setIsteamAdded(true);
        setLoading(false);
        closeModal(); // Close the modal after submitting the form
    };

    useEffect(() => {
        const userfind = Cookies.get('token');
        if (userfind === undefined) {
            navigate("/Login");
        }
        const fetchTournaments = async () => {
            try {
                setIsteamAdded(false);
                const response = await axios.post(
                    "http://localhost:8082/user/showall_tournament",
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
        };
        fetchTournaments();
    }, [IsTeamAdded]);

    const addTeamHandler = async (tournament) => {
        if (tournament === selectedTournament && isShow) {
            setIsShow(false)
        } else {
            setIsShow(true);
            setSelectedTournament(tournament);
            openModal(); // Open the modal when adding a team
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tournaments
                .filter(tournament => tournament.capacity !== 0)
                .map((tournament) => (
                    <div key={tournament._id} className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-xl" onClick={() => addTeamHandler(tournament)}>
                        <h3 className="text-lg font-semibold">{tournament.tournament_name}</h3>
                        <p>Available Slot: {tournament.capacity}</p>
                        {tournament.capacity && (
                            <button onClick={() => addTeamHandler(tournament)}>
                                Add Your Team
                            </button>
                        )}
                    </div>
                ))}

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Add Team Modal"
            >
                <div className="modal-container">
                    <button className="close-button absolute top-2 right-2 p-2 bg-gray-200 hover:bg-gray-300 rounded-full" onClick={closeModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <h2 className="text-2xl font-semibold mb-4 text-center">
                    Add Team
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="text"
                            name="team_name"
                            value={formData.team_name}
                            onChange={(e) =>
                                setFormData({ ...formData, team_name: e.target.value })
                            }
                            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                            placeholder="Team Name"
                            required
                        />
                    </div>
                    {formData.players.map((player, index) => (
                        <div key={index} className="mb-4">
                            <input
                                type="text"
                                name="player_name"
                                value={player.player_name}
                                onChange={(e) => handlePlayerChange(index, e)}
                                className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                                placeholder={`Player ${index + 1} Name`}
                                required
                            />
                            <select
                                type="text"
                                name="player_type"
                                value={player.player_type}
                                onChange={(e) => handlePlayerChange(index, e)}
                                className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                                required
                            >
                                <option value="">Select a type of player</option>
                                <option value="batsmen">Batsmen</option>
                                <option value="bowler">Bowler</option>
                                <option value="all-rounder">All-Rounder</option>
                            </select>
                        </div>
                    ))}
                    {loading ? (
                        <div className="flex justify-center">
                            <TailSpin color="#00BFFF" height={50} width={50} />
                        </div>
                    ) : (
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                        >
                            Add Team
                        </button>
                    )}
                </form>
            </Modal>
        </div>
    );
}

export default Add_Team;
