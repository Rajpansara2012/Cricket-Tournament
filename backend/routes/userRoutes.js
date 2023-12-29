const express = require('express');
const Tournament = require('../models/tournament');
const Team = require('../models/team');
const Player = require('../models/player');
const User = require('../models/user');

const { isauthenticated } = require('../middleware/auth');
const match = require('../models/match');
const router = express.Router();
// const Razorpay = require('razorpay');
// const razorpay = new Razorpay({ key_id:})
router.post('/showall_tournament', isauthenticated, async (req, res) => {
    try {
        // const userId = req.session.userId;
        if (req.userId) {
            const tournament = await Tournament.find();
            res.json({ message: 'tournament fectched successfully.', tournament });
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
router.post('/showall_matches', isauthenticated, async (req, res) => {
    try {
        // const userId = req.session.userId;
        if (req.userId) {
            const matches = await match.find();
            res.json({ message: 'Match fecthecd ', matches });
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

router.post('/user_matches', isauthenticated, async (req, res) => {
    try {
        // const userId = req.session.userId;
        if (req.userId) {
            const matches = await match.find();
            var user_matches = [];
            for (var i = 0; i < matches.length; i++) {
                var t1 = await Team.findById(matches[i].teamId[0]);
                var t2 = await Team.findById(matches[i].teamId[1]);

                if (t1.userId == req.userId || t2.userId == req.userId) {
                    user_matches.push(matches[i]);
                }
            }
            res.json({ message: 'Match fecthecd ', match: user_matches });
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
router.post('/add_team', isauthenticated, async (req, res) => {
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
        // payment integration
        // const amount = tournament.tournament_fee;
        // const currency = 'INR';
        // const user = await User.findById(tournament.userId);
        // const option = {
        //     amount,
        //     currency,
        //     notes: {
        //         Tournamentorganizer: user.username.toString()
        //     },
        // };
        // const order = await razorpay.orders.create(options);

        res.json({ message: 'team added successfully.', });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

router.post('/fectch_players', isauthenticated, async (req, res) => {
    // console.log("hi");
    try {
        const teamId = req.body.teamId;
        const team1 = await Team.findById(teamId[0]);
        const team2 = await Team.findById(teamId[1]);
        const playerId1 = team1.players;
        const playerId2 = team2.players;
        const players1 = [];
        const players2 = [];

        for (var i = 0; i < 11; i++) {
            const p1 = await (Player.findById(playerId1[i]));
            const p2 = await (Player.findById(playerId2[i]));
            players1.push(p1);
            players2.push(p2);
        }
        // console.log(players1, players2);
        res.json({ players1, players2 });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

module.exports = router;
