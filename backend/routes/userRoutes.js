const express = require('express');
const Tournament = require('../module/tournament');
const Team = require('../module/team');
const Player = require('../module/player');


const router = express.Router();

router.post('/add_team', async (req, res) => {
    try {
        const tournament_name = req.body.tournament_name;
        const tournament  = await Tournament.findOne({tournament_name});
        const team_name = req.body.team_name;
        const userId = req.session.userId;
        const players_name = req.body.players;
        const type = req.body.type;
        const players = [];
        for(var i = 0; i < players_name.length; i++) {
            const player = new Player({ name : players_name[i], type: type[i]});
            await player.save();
            players.push(player);
        }
        
        
        const team = new Team({team_name : team_name, userId : userId, tournamentId : tournament._id, players : players});
        tournament.teams.push(team);
        console.log(tournament);
        await tournament.save();
        await team.save();
        res.json({ message: 'team added successfully.',  });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});
module.exports = router;
