const express = require('express');
const Tournament = require('../models/tournament');
const User = require('../models/user');
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('scratch.txt');
const Match = require('../models/match');
const Team = require('../models/team');
const Player = require('../models/player');
const { isauthenticated } = require('../middleware/auth');

const router = express.Router();

router.post('/addtournament', isauthenticated, async (req, res) => {
    try {
        const tournament_name = req.body.tournament_name;
        const capacity = req.body.capacity;
        const location = req.body.location;
        const tournament = new Tournament({ tournament_name, userId: req.userId, capacity, location });
        await tournament.save();
        res.json({ message: 'tournament added successfully.', tournament });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});
router.post('/showallt', isauthenticated, async (req, res) => {

    try {
        // const userId = req.session.userId;
        if (req.userId) {
            const tournament = await Tournament.find({ userId: req.userId });
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

router.post('/add_match', isauthenticated, async (req, res) => {

    try {
        const team_name1 = req.body.team_name1;
        const team_name2 = req.body.team_name2;
        const total_over = req.body.total_over;
        const toss = req.body.toss;
        const toss_status = req.body.toss_status;
        const venue = req.body.venue;
        const tournament_id = req.body.tournament_id;
        const tournament = await (Tournament.findById(tournament_id));
        const winner = "";
        // console.log(tournamentId);

        const userId = req.userId;
        const team = [];
        team.push(await Team.findOne({ team_name: team_name1, tournamentId: tournament_id }));
        team.push(await Team.findOne({ team_name: team_name2, tournamentId: tournament_id }));
        // console.log(team[0].tournamentId);
        // console.log(team[1].tournamentId);

        if (team[0].tournamentId != tournament_id || team[1].tournamentId != tournament_id) {
            res.status(500).json({ error: "team doestn't exit" });
        }
        else {
            const match = new Match({
                team_name: [team_name1, team_name2],
                teamId: [team[0]._id, team[1]._id],
                total_over,
                venue: venue,
                tournamentId: tournament_id,
                userId: userId,
                toss,
                toss_status,
                winner: winner
            });
            match.over[0] = 0;
            match.over[1] = 0;
            match.score[0] = 0;
            match.score[1] = 0;
            match.wicket[0] = 0;
            match.wicket[1] = 0;
            match.commentary[0] = [];
            match.commentary[1] = [];
            match.islive = true;
            match.save();
            const player1 = [];
            for (var i = 0; i < team[0].players.length; i++) {
                player1.push(await Player.findById(team[0].players[i]));
            }
            const player2 = [];
            for (var i = 0; i < team[1].players.length; i++) {
                player2.push(await Player.findById(team[1].players[i]));
            }
            for (var i = 0; i < player1.length; i++) {
                player1[i].batting_status = "remaing";
                player2[i].batting_status = "remaing";
            }
            res
                .cookie("bastman1", null, {
                    expires: new Date()
                })
                .cookie("bastman2", null, {
                    expires: new Date()
                })
                .cookie("bowler", null, {
                    expires: new Date()
                })
                .status(200)

            res.cookie('match', JSON.stringify(match), { expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) });
            if (toss == team[0].team_name && toss_status == "batting") {

                // console.log(player1.length);
                // console.log(player2.length);
                res.json({ message: 'match added successfully.', match, team1: team[0], team2: team[1], player1, player2 });
            }
            else {
                res.json({ message: 'match added successfully.', match, team1: team[1], team2: team[0], player2, player1 });

            }
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred.' });
    }

});
router.post('/update_players', isauthenticated, async (req, res) => {

    try {
        const match = req.body.match;

        // console.log(tournamentId);

        const userId = req.userId;
        const team = [];
        team.push(await Team.findById(match.teamId[0]));
        team.push(await Team.findById(match.teamId[1]));

        const player1 = [];
        for (var i = 0; i < team[0].players.length; i++) {
            player1.push(await Player.findById(team[0].players[i]));
        }
        const player2 = [];
        for (var i = 0; i < team[1].players.length; i++) {
            player2.push(await Player.findById(team[1].players[i]));
        }
        // console.log(player1[0]);
        res.json({ message: 'match added successfully.', team1: team[0], team2: team[1], player1, player2 });

    }

    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred.' });
    }

});
router.post('/teams', async (req, res) => {
    try {

        const teamsid = req.body.teamsid;
        let allteams = []
        await Promise.all(teamsid.map(async (teamid) => {
            const team = await Team.findById(teamid);
            if (team)
                allteams.push(team);
        }));
        // console.log(allteams)
        res.json({ message: 'all teams.', allteams });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});
router.post('/update_score', async (req, res) => {
    try {
        const receivedData = req.body;
        // console.log('hi' + receivedData.batsman1.batting_ball);
        async function updateObject(updatedObjectFromFrontend) {
            try {
                const updatedObject = await Player.findByIdAndUpdate(
                    updatedObjectFromFrontend._id,
                    updatedObjectFromFrontend,
                );
                if (!updatedObject) {
                    console.log('Object not found');
                    return;
                }

            } catch (err) {
                console.error('Error updating object:', err);
            }
        }

        async function updateMatch(updatedObjectFromFrontend) {
            try {
                const updatedObject = await Match.findByIdAndUpdate(
                    updatedObjectFromFrontend._id,
                    updatedObjectFromFrontend,
                );
                if (!updatedObject) {
                    console.log('Object not found');
                    return;
                }
            } catch (err) {
                console.error('Error updating object:', err);
            }
        }
        updateObject(receivedData.batsman1);
        updateObject(receivedData.batsman2);
        updateObject(receivedData.bowler);
        updateMatch(receivedData.match);
        res.json({ message: 'score updated...' });
    }
    catch (e) {
        console.log(e.message);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

router.post('/save_player', async (req, res) => {
    try {
        const receivedData = req.body;
        const matchObj = await Match.findById(receivedData._id);
        const m = matchObj;
        // console.log(m.winner)
        const t1Id = m.teamId[0];
        const t2Id = m.teamId[1];
        const team1Obj = await (Team.findById(t1Id));
        const team2Obj = await (Team.findById(t2Id));
        for (var i = 0; i < 11; i++) {
            const p1 = await (Player.findById(team1Obj.players[i]));
            const p2 = await (Player.findById(team2Obj.players[i]));
            m.players1.push(p1);
            m.players2.push(p2);
        }
        m.save();
        for (var i = 0; i < 11; i++) {
            const p1 = await (Player.findById(team1Obj.players[i]));
            const p2 = await (Player.findById(team2Obj.players[i]));
            p1.batting_status = "remaining";
            p1.batting_run = null;
            p1.batting_ball = null;
            p1.strike_rate = null;
            p1.fours = null;
            p1.sixes = null;
            p1.bowling_ball = null;
            p1.bowling_run = null;
            p1.wicket = null;
            p1.economy = null;
            p1.save();
            p2.batting_status = "remaining";
            p2.batting_run = null;
            p2.batting_ball = null;
            p2.strike_rate = null;
            p2.fours = null;
            p2.sixes = null;
            p2.bowling_ball = null;
            p2.bowling_run = null;
            p2.wicket = null;
            p2.economy = null;
            p2.save();
        }
        res.json({ message: 'player Saved...' });

    } catch (e) {
        console.log(e.message);
    }
});
router.post('/matches', async (req, res) => {
    try {
        // console.log(req.body.tournament_id);
        const match = await Match.find({ tournamentId: req.body.tournament_id });
        // console.log(match)
        res.json({ message: 'match fectched successfully.', match });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

module.exports = router;
