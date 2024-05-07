const express = require('express');
const Tournament = require('../models/tournament');
const Team = require('../models/team');
const Player = require('../models/player');
const User = require('../models/user');

const io = require('../app');
const stripe = require("stripe")("sk_test_51OjLLdSDcDq2PzkiuB784Qt82nsky5v4q9NUZR2XlcufKGJMzezPSrkjl2UnYBA7v4ZXiFOLuxbTGEwKQOn0o8b500A2VtaGub");
const pointTable = require('../models/pointTable');
const Graph = require('../models/graph');

const { isauthenticated } = require('../middleware/auth');
const match = require('../models/match');

const router = express.Router();

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
        if (req.userId) {
            // Find matches with islive: true
            const liveMatches = await match.find({ islive: true });

            // Find matches with islive: false
            const completedMatches = await match.find({ islive: false });

            res.json({
                message: 'Matches fetched successfully',
                liveMatches,
                completedMatches,
            });
        } else {
            res.status(300).json({ message: 'First login' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

router.post('/user_matches', isauthenticated, async (req, res) => {
    try {
        // const userId = req.session.userId;
        if (req.userId) {
            console.log(req.userId)
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

router.post('/handel_payment', isauthenticated, async (req, res) => {
    const tournament_name = req.body.tournament_name;
    const tournament = await Tournament.findOne({ tournament_name });
    const team_name = req.body.team_name;
    const userId = req.userId;
    const players_obj = req.body.players;
    // console.log(tournament_name);
    const lineitems = [{
        price_data: {
            currency: "inr",
            product_data: {
                name: tournament_name
            },
            unit_amount: tournament.tournament_fee * 100
        },
        quantity: 1
    }];

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineitems,
        mode: "payment",
        success_url: "http://localhost:5173/Add_Team",
        cancel_url: "http://localhost:5173/Add_Team",
    });
    // console.log("hi");
    res.json({ id: session.id });
});

router.post('/add_team', isauthenticated, async (req, res) => {
    try {
        // console.log("add team");
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

        const point = new pointTable({ team, tournament, played_match: 0, win: 0, loss: 0, netRunrate: 0, point: 0, tie: 0 });
        await point.save();
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
router.post('/profile', isauthenticated, async (req, res) => {
    try {
        const user = await (User.findById(req.cookies.token));
        // const profile = await (Player.findById(user._id));
        const profile = await (Player.find({ name: user.username }));
        console.log(profile)
        if (profile.length != 0) {
            const obj_graph = await (Graph.find({ player: profile[0]._id }))
            console.log(obj_graph)
            const run = [];
            const strike_rate = [];
            const wicket = [];
            const economy = [];
            for (var i = 0; i < obj_graph.length; i++) {
                if (obj_graph[i].status != 'remaing') {
                    run.push(obj_graph[i].run);
                    strike_rate.push(obj_graph[i].strike_rate);
                }
                if (obj_graph[i].bowling_ball != 0) {
                    wicket.push(obj_graph[i].wicket);
                    economy.push(obj_graph[i].economy);
                }

            }
            // console.log(user)
            res.json({ user: user, profile: profile, graph_run: run, graph_strike_rate: strike_rate, graph_wicket: wicket, graph_economy: economy });
        }
        else {
            console.log(user)
            res.json({ user: user, profile: null, graph_run: null, graph_strike_rate: null, graph_wicket: null, graph_economy: null });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

router.post('/Playerprofile', isauthenticated, async (req, res) => {
    try {
        // const profile = await (Player.findById(user._id));
        console.log(req.body.playerId)
        const profile = await Player.findById(req.body.playerId);
        console.log(profile)

        const obj_graph = await (Graph.find({ player: profile._id }))
        // console.log(obj_graph)
        const run = [];
        const strike_rate = [];
        const wicket = [];
        const economy = [];
        for (var i = 0; i < obj_graph.length; i++) {
            if (obj_graph[i].status != 'remaing') {
                run.push(obj_graph[i].run);
                strike_rate.push(obj_graph[i].strike_rate);
            }
            if (obj_graph[i].bowling_ball != 0) {
                wicket.push(obj_graph[i].wicket);
                economy.push(obj_graph[i].economy);
            }

        }
        // console.log(user)
        res.json({ user: null, profile: profile, graph_run: run, graph_strike_rate: strike_rate, graph_wicket: wicket, graph_economy: economy });

    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

router.get('/FectchTeams', isauthenticated, async (req, res) => {
    try {
        const teams = await Team.find({ userId: req.userId });

        // Populate the players field for each team
        const populatedTeams = await Team.populate(teams, { path: 'players' });

        res.json(populatedTeams);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

router.get('/FectchPlayers', isauthenticated, async (req, res) => {
    try {
        const players = await Player.find();
        // Populate the players field for each team

        res.json(players);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

ismatchplayed = async (req, res, next) => {
    // console.log("hkjhj");
    try {
        console.log(req.body.teamId)
        const teamId = req.body.teamId;

        const matches = await match.find();
        for (const match of matches) {
            if (match.teamId[0] == teamId || match.teamId[1] == teamId) {
                return res.status(400).send("Player can't be updated because the teamId matches.");
            }
        }
        // console.log(matches);
        if (matches)
            next();
        else
            res.status(500).json({ error: 'Internal Server Error' });

    }
    catch (error) {

        console.log(error.message)
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
router.put('/players/:id', ismatchplayed, async (req, res) => {
    const playerId = req.params.id;
    const { name, type } = req.body;
    try {
        const player = await Player.findById(playerId);
        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }

        if (name) {
            player.name = name;
        }
        if (type) {
            player.type = type;
        }

        await player.save();


        res.json(player);
    } catch (error) {
        console.error('Error updating player:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
