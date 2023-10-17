const express = require('express');
const Tournament = require('../models/tournament');
const Team = require('../models/team');
const Player = require('../models/player');

const { isauthenticated } = require('../middleware/auth');
const router = express.Router();

router.post('/showall_tournament', isauthenticated, async (req, res) => {
    try {
        // const userId = req.session.userId;
        if (req.userId) {
            const tournament = await Tournament.find();
            res.json({ message: 'tournament added successfully.', tournament });
        }
        else {
            // console.log("not found")
            res.status(300).json({ message: 'first login' });
        }

    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

router.post('/add_team', async (req, res) => {
    try {
        const tournament_name = req.body.tournament_name;
        const tournament = await Tournament.findOne({ tournament_name });
        const team_name = req.body.team_name;
        const userId = req.userId;
        const players_obj = req.body.players;
        const players = [];
        for (var i = 0; i < players_obj.length; i++) {
            const player = new Player({ name: players_obj[i].player_name, type: players_obj[i].player_type });
            await player.save();
            players.push(player);
        }


        const team = new Team({ team_name: team_name, userId: userId, tournamentId: tournament._id, players: players });
        tournament.teams.push(team);
        // console.log(tournament);
        tournament.capacity--;
        await tournament.save();
        await team.save();
        res.json({ message: 'team added successfully.', });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

module.exports = router;
