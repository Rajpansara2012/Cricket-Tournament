import React from 'react'
import axios from "axios";

import { useState, useEffect } from "react";

const Details = (props) => {
    const teamsid = props.teamsid;
    const [teams, setteams] = useState(null);
    useEffect(() => {
        const fatchteam = async () => {
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
        };
        fatchteam();
    }, []);

    return (
        <div>

            {teams && teams.length > 0 ? (
                teams.map((team, index) => (
                    <li key={index}>{team.team_name}</li>
                ))
            ) : (
                <p>No teams available</p>
            )}
        </div>
    )
}

export default Details