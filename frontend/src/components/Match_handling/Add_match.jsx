import React from 'react'
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from 'js-cookie';
import { TailSpin } from 'react-loader-spinner';

function Add_match() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        total_over: "",
        toss: "",
        toss_status: "",
        venue: "",
        tournament_id: "",
        team_name1: "",
        team_name2: ""
    });
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState("");
    const [isshow, setisshow] = useState(false);
    const [teams, setteams] = useState(null);
    const [selectedTeamOne, setSelectedTeamOne] = useState();
    const [selectedTeamSecond, setSelectedTeamSecond] = useState();
    const [showform, setshowform] = useState(false);

    useEffect(() => {
        const userfind = Cookies.get('token');
        const usertype = Cookies.get('user_type');
        if (userfind === undefined) {
            navigate("/Login")
        }
        else if (usertype != 'admin') {
            navigate("/User_home");
        }
        const fetchTournaments = async () => {
            try {
                const response = await axios.post(
                    "http://localhost:8082/admin/showallt",
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
    }, []);

    // console.log(tournaments);
    const handleTournamentSelect = async (event) => {
        setSelectedTournament(JSON.parse(event.target.value));
        // console.log(event.target.value);
        const teamsid = JSON.parse(event.target.value).teams;
        try {
            // console.log(teamsid)
            const response = await axios.post(
                "http://localhost:8082/admin/teams",
                { teamsid },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            )
            setteams(response.data.allteams)
        } catch (error) {
            console.log(error);
        }
        setisshow(true);
    };

    const handleTeamSelect1 = (event) => {
        const team = JSON.parse(event.target.value)
        if (selectedTeamSecond && selectedTeamSecond.team_name === team.team_name) {
            document.getElementById("firstselect").value = "option1";
            alert("can't select same team.")
        }
        else {
            setSelectedTeamOne(team);
            if (selectedTeamSecond) {
                setshowform(true);
                const updatedFormData = { ...formData, team_name1: team.team_name, team_name2: selectedTeamSecond.team_name, tournament_id: selectedTournament._id };
                setFormData(updatedFormData);
            }
        }

    };

    const handleTeamSelect2 = (event) => {
        // console.log(event.target.value);
        const team = JSON.parse(event.target.value)
        if (selectedTeamOne && selectedTeamOne.team_name === team.team_name) {
            document.getElementById("secondselect").value = "option1";
            alert("can't select same team.")
        }
        else {
            setSelectedTeamSecond(team);
            if (selectedTeamOne) {
                setshowform(true);
                const updatedFormData = { ...formData, team_name1: selectedTeamOne.team_name, team_name2: team.team_name, tournament_id: selectedTournament._id };
                setFormData(updatedFormData);
            }
        }
    }
    // console.log(showform);
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        console.log(formData);
        try {
            const response = await axios.post(
                "http://localhost:8082/admin/add_match",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            )

            const { team1, team2, player1, player2 } = response.data;
            localStorage.setItem('team1', JSON.stringify(team1));
            localStorage.setItem('team2', JSON.stringify(team2));
            localStorage.setItem('player1', JSON.stringify(player1));
            localStorage.setItem('player2', JSON.stringify(player2));
            Cookies.set('ball', 0);
            Cookies.set("batting", 1);
            setTimeout(() => {
                setLoading(false);
                navigate('/Scoring');
            }, 1000);
        }
        catch (error) {
            console.log(error);
        }
    }
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };
    return (
        <>
            {loading ? (
                <div className="flex justify-center">
                    <TailSpin color="#00BFFF" height={50} width={50} />
                </div>
            ) : (
                <div className="min-h-screen flex items-center justify-center bg-gray-100">
                    <div className="bg-white p-8 rounded shadow-md md:w-96 w-full">
                        <form onSubmit={handleSubmit} action="">
                            <h2 className="text-base font-medium text-gray-700">Select a Tournament:</h2>
                            <select
                                onChange={handleTournamentSelect}
                                className="w-full p-2 border rounded focus:ring focus:ring-blue-300 mb-4"
                            >
                                <option value="">Select a tournament</option>
                                {tournaments.map((tournament) => (
                                    <option key={tournament._id} value={JSON.stringify(tournament)}>
                                        {tournament.tournament_name}
                                    </option>
                                ))}
                            </select>
                            {isshow && <h2 className="text-base font-medium text-gray-700">Select First Team</h2>}
                            {isshow && (
                                <select
                                    id="firstselect"
                                    onChange={handleTeamSelect1}
                                    className="w-full p-2 border rounded focus:ring focus:ring-blue-300 mb-4"
                                >
                                    <option value="option1">Select a team</option>
                                    {isshow &&
                                        teams &&
                                        teams.map((team) => (
                                            <option key={team._id} value={JSON.stringify(team)}>
                                                {team.team_name}
                                            </option>
                                        ))}
                                </select>
                            )}

                            {isshow && <h2 className="text-base font-medium text-gray-700">Select Second Team</h2>}
                            {isshow && (
                                <select
                                    id="secondselect"
                                    onChange={handleTeamSelect2}
                                    className="w-full p-2 border rounded focus:ring focus:ring-blue-300 mb-4"
                                >
                                    <option value="option1">Select a team</option>
                                    {isshow &&
                                        teams &&
                                        teams.map((team) => (
                                            <option key={team._id} value={JSON.stringify(team)}>
                                                {team.team_name}
                                            </option>
                                        ))}
                                </select>
                            )}

                            {showform && (
                                <>
                                    <h2 className="text-base font-medium text-gray-700">Total Over:</h2>
                                    <div className="mb-4">
                                        <input
                                            type="number"
                                            name="total_over"
                                            value={formData.total_over}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                                            placeholder="Total Over"
                                            min="1"
                                            step="1"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <select
                                            name="toss"
                                            value={formData.toss}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                                            required
                                        >
                                            <option value="">Select toss win team</option>
                                            <option value={selectedTeamOne.team_name}>{selectedTeamOne.team_name}</option>
                                            <option value={selectedTeamSecond.team_name}>{selectedTeamSecond.team_name}</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <select
                                            name="toss_status"
                                            value={formData.toss_status}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                                            required
                                        >
                                            <option value="">Select an option</option>
                                            <option value="batting">Batting</option>
                                            <option value="bowling">Bowling</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <h2 className="text-base font-medium text-gray-700">Venue:</h2>
                                        <input
                                            type="text"
                                            name="venue"
                                            value={formData.venue}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                                            placeholder="Venue"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                                    >
                                        Add Match
                                    </button>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            )}

        </>
    )
}

export default Add_match