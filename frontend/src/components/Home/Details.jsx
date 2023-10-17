import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Details = (props) => {
    const teamsid = props.teamsid;
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state

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
                setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.log(error);
                setLoading(false); // Set loading to false on error
            }
        };
        fetchTeams();
    }, []);

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : teams && teams.length > 0 ? (
                teams.map((team) => (
                    <p key={team.id}>{team.team_name}</p>
                ))
            ) : (
                <p>No teams available</p>
            )}
        </div>
    );
};

export default Details;
