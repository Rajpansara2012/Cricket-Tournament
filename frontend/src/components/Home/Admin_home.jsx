import axios from "axios";
import { useState, useEffect } from "react";
import Details from "./Details";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";


function Admin_home() {
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
            const userfind = Cookies.get('token');
            const usertype = Cookies.get('user_type');
            if (userfind === undefined) {
                navigate("/Login")
            }
            else if(usertype != 'admin'){
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

    const handleTournamentClick = (tournament) => {
        setSelectedTournament(tournament);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setSelectedTournament(null);
        setIsPopupOpen(false);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tournaments.map((tournament) => (
                <div key={tournament._id} className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-xl" onClick={() => handleTournamentClick(tournament)}>
                    <h3 className="text-lg font-semibold">{tournament.tournament_name}</h3>
                    <p>Capacity: {tournament.capacity}</p>
                    <p>Location: {tournament.location}</p>
                </div>
            ))}
            {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-black opacity-50 z-40"></div>
                    <div className="z-50 relative">
                        <button
                            onClick={closePopup}
                            className="absolute top-1 right-1 bg-gray-500 text-white p-1 w-6 rounded hover:bg-gray-600"
                        >
                            X
                        </button>
                        <div className="bg-white p-4 rounded-lg shadow-lg max-h-screen overflow-y-auto">
                            <br></br>
                            <Details teamsid={selectedTournament.teams} onClose={closePopup} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Admin_home;
