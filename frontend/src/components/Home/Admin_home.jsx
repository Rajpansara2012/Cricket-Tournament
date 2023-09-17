import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";
import Details from "./Details";

function Admin_home() {
    const navigate = useNavigate();
    const [tournaments, setTournaments] = useState([]);

    const [selectedTournament, setSelectedTournament] = useState(null);
    const [isshow, setisshow] = useState(false);

    useEffect(() => {
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
                console.log(response.data.tournament);
            } catch (error) {
                navigate("/Login")
                console.log(error);
            }
        };
        fetchTournaments();
    }, []);

    const handleTournamentClick = async (tournament) => {
        if (selectedTournament == tournament && isshow)
            setisshow(false);
        else {
            setSelectedTournament(tournament);
            setisshow(true);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:8082/auth/logout",
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            )
            navigate("/Login")
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleTournament = () => {
        navigate("/Add_Tournament");
    }

    return (
        <div>
            <button onClick={handleLogout}>
                Logout
            </button>
            <button onClick={handleTournament}>
                Add tournament
            </button>
            <h1>Tournaments List</h1>

            {tournaments.map((tournament) => (
                <li key={tournament.id}>
                    <button onClick={() => handleTournamentClick(tournament)}>
                        {tournament.tournament_name}
                    </button>
                    {isshow && selectedTournament === tournament && (
                        <Details teamsid={selectedTournament.teams} />
                    )}
                </li>
            ))}
        </div>
    );
}

export default Admin_home;
