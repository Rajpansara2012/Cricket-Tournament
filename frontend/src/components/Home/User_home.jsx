import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function User_home() {
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
    }
    else {
      setIsShow(true);
      setSelectedTournament(tournament);
    }
  };

  return (
    <div>
      <h1>Tournaments List</h1>
      {tournaments.map((tournament) => (
        <li key={tournament._id}>
          <label>{tournament.tournament_name}</label>
          <label> Available Slot: {tournament.capacity}</label>
          {tournament.capacity && (
            <button onClick={() => addTeamHandler(tournament)}>
              Add Your Team
            </button>
          )}
          {isShow && selectedTournament === tournament && (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              {loading ? (
                <div className="overlay">
                  <div className="loader">Loading...</div>
                </div>
              ) : (
                <div className="bg-white p-8 rounded shadow-md md:w-96 w-full">
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
                          <option value="batsmen">batsmen</option>
                          <option value="bowler">bowler</option>
                          <option value="all-rounder">all-rounder</option>
                        </select>
                      </div>
                    ))}
                    <button
                      type="submit"
                      className="w-full bg-blue-500 text-white py-2 rounded hover-bg-blue-600"
                    >
                      Add Team
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </li>
      ))}
    </div>
  );
}

export default User_home;