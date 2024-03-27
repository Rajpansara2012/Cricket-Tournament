import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner';

const Details = (props) => {
    const teamsid = props.teamsid;
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.post(
                    "http://localhost:8082/admin/teams",
                    { teamsid },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        withCredentials: true,
                    }
                );
                setTeams(response.data.allteams);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };
        fetchTeams();
    }, []);

    const handleClose = () => {
        props.onClose();
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-lg relative">
            {loading ? (
                <div className="flex justify-center">
                    <TailSpin color="#00BFFF" height={50} width={50} />
                </div>
            ) : teams && teams.length > 0 ? (
                <div>
                    <p className="font-bold text-xl mb-2">Teams:</p>

                    {teams.map((team) => (
                        <p key={team.id} className="text-lg mb-1">{team.team_name}</p>
                    ))}
                </div>
            ) : (
                <p className="font-bold text-xl mb-2">No teams available</p>
            )}
        </div>
    );
};

export default Details;
