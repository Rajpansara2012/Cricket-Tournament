const express = require('express');
const Tournament = require('../models/tournament');
const User = require('../models/user');
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('scratch.txt');
const Match = require('../models/match');
const Team = require('../models/team');
const Player = require('../models/player');
const { isauthenticated } = require('../middleware/auth');
const { ObjectId } = require('mongodb');
const match = require('../models/match');
const router = express.Router();
const io = require('../app');

router.post('/addtournament', isauthenticated, async (req, res) => {
    try {
        const tournament_name = req.body.tournament_name;
        const capacity = req.body.capacity;
        const location = req.body.location;
        const tournament_fee = req.body.tournament_fee;
        const tournament = new Tournament({ tournament_name, userId: req.userId, capacity, location, tournament_fee });
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
            if ((toss == team_name2 && toss_status == "batting") || (toss == team_name1 && toss_status != "batting")) {
                var temp = match.team_name[0];
                match.team_name[0] = match.team_name[1];
                match.team_name[1] = temp;
                var temp2 = match.teamId[0];
                match.teamId[0] = match.teamId[1];
                match.teamId[1] = temp2;
            }

            match.over[0] = 0;
            match.over[1] = 0;
            match.score[0] = 0;
            match.score[1] = 0;
            match.wicket[0] = 0;
            match.wicket[1] = 0;
            match.commentary[0] = [];
            match.commentary[1] = [];
            match.islive = true;
            // match.save();
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
            if ((toss == team_name1 && toss_status == "batting") || (toss == team_name2 && toss_status != "batting")) {
                // console.log(player1.length);
                // console.log(player2.length);
                match.players1 = player1;
                match.players2 = player2;
                match.save();
                res.json({ message: 'match added successfully.', match, team1: team[0], team2: team[1], player1: player1, player2: player2 });
            }
            else {
                match.players1 = player2;
                match.players2 = player1;
                match.save();
                // res.cookie('match', JSON.stringify(match), { expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) });
                res.json({ message: 'match added successfully.', match, team1: team[1], team2: team[0], player1: player2, player2: player1 });

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

                const matchId = updatedObjectFromFrontend._id;
                const match = await Match.findById(matchId);

                if (!match) {
                    console.log('Match not found');
                    return;
                }

                // Update fields individually
                match.team_name = updatedObjectFromFrontend.team_name;
                match.teamId = updatedObjectFromFrontend.teamId;
                match.userId = updatedObjectFromFrontend.userId;
                match.tournamentId = updatedObjectFromFrontend.tournamentId;
                match.score = updatedObjectFromFrontend.score;
                match.wicket = updatedObjectFromFrontend.wicket;
                match.over = updatedObjectFromFrontend.over;
                match.toss = updatedObjectFromFrontend.toss;
                match.toss_status = updatedObjectFromFrontend.toss_status;
                match.winner = updatedObjectFromFrontend.winner;
                match.venue = updatedObjectFromFrontend.venue;
                match.total_over = updatedObjectFromFrontend.total_over;
                match.islive = updatedObjectFromFrontend.islive;
                match.commentary = updatedObjectFromFrontend.commentary;
                const batsman1Id = receivedData.batsman1._id instanceof ObjectId
                    ? receivedData.batsman1._id
                    : new ObjectId(receivedData.batsman1._id);

                const batsman2Id = receivedData.batsman2._id instanceof ObjectId
                    ? receivedData.batsman2._id
                    : new ObjectId(receivedData.batsman2._id);

                const bowlerId = receivedData.bowler._id instanceof ObjectId
                    ? receivedData.bowler._id
                    : new ObjectId(receivedData.bowler._id);

                // console.log(bowlerId);

                // Update players1 array
                match.players1.forEach((player, index) => {
                    const playerId = player._id instanceof ObjectId ? player._id : new ObjectId(player._id);

                    const isBatsman1 = batsman1Id.equals(playerId);
                    const isBatsman2 = batsman2Id.equals(playerId);
                    const isBowler = bowlerId.equals(playerId);

                    if (isBatsman1 || isBatsman2 || isBowler) {
                        // console.log("Match found");
                        if (isBatsman1)
                            match.players1[index] = receivedData.batsman1;
                        else if (isBatsman2)
                            match.players1[index] = receivedData.batsman2;
                        else
                            match.players1[index] = receivedData.bowler;
                        // console.log(player);

                    }
                });

                // Update players2 array
                match.players2.forEach((player, index) => {
                    const playerId = player._id instanceof ObjectId ? player._id : new ObjectId(player._id);

                    const isBatsman1 = batsman1Id.equals(playerId);
                    const isBatsman2 = batsman2Id.equals(playerId);
                    const isBowler = bowlerId.equals(playerId);

                    if (isBatsman1 || isBatsman2 || isBowler) {
                        // console.log("Match found");
                        // Assuming you want to update the player object itself
                        if (isBatsman1)
                            match.players2[index] = receivedData.batsman1;
                        else if (isBatsman2)
                            match.players2[index] = receivedData.batsman2;
                        else
                            match.players2[index] = receivedData.bowler;
                        // console.log(player);
                    }
                });

                // Save the updated match object
                const updatedObject = await match.save();
                console.log('Before emitting updateScore event');

                io.emit('liveUpdate', updatedObject);
                // console.log('Object updated successfully:', updatedObject);
            } catch (err) {
                console.error('Error updating object:', err);
            }
        }
        if (receivedData.batsman1.batting_status == "remaing")
            receivedData.batsman1.batting_status = "playing"
        if (receivedData.batsman2.batting_status == "remaing")
            receivedData.batsman2.batting_status = "playing"
        // console.log(receivedData.batsman1.batting_status);
        // console.log(receivedData.batsman2.batting_status);
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
        io.emit('liveUpdate', m);
        // console.log(m.winner)
        const t1Id = m.teamId[0];
        const t2Id = m.teamId[1];
        const team1Obj = await (Team.findById(t1Id));
        const team2Obj = await (Team.findById(t2Id));
        // for (var i = 0; i < 11; i++) {
        //     const p1 = await (Player.findById(team1Obj.players[i]));
        //     const p2 = await (Player.findById(team2Obj.players[i]));
        //     m.players1.push(p1);
        //     m.players2.push(p2);
        // }
        // m.save();
        for (var i = 0; i < 11; i++) {
            const p1 = await (Player.findById(team1Obj.players[i]));
            const p2 = await (Player.findById(team2Obj.players[i]));

            p1.batting_status = "remaing";
            p1.profile.run += p1.batting_run;
            p1.batting_run = 0;
            p1.profile.faced_ball += p1.batting_ball;
            p1.batting_ball = 0;
            p1.strike_rate = 0;
            if (p1.profile.faced_ball != 0)
                p1.profile.strike_rate = (p1.profile.run / p1.profile.faced_ball) * 100;
            p1.profile.fours += p1.fours;
            p1.profile.sixes += p1.sixes;
            p1.fours = 0;
            p1.sixes = 0;
            p1.profile.delivery_ball += p1.bowling_ball;
            p1.bowling_ball = 0;
            p1.profile.bowling_run += p1.bowling_run;
            p1.bowling_run = 0;
            p1.profile.wicket += p1.wicket;
            p1.wicket = 0;
            if (p1.profile.delivery_ball != 0)
                p1.profile.economy = p1.profile.bowling_run / (p1.profile.delivery_ball / 6);
            p1.economy = 0;
            p1.save();

            p2.batting_status = "remaing";
            p2.profile.run += p2.batting_run;
            p2.batting_run = 0;
            p2.profile.faced_ball += p2.batting_ball;
            p2.batting_ball = 0;
            p2.strike_rate = 0;
            if (p2.profile.faced_ball != 0)
                p2.profile.strike_rate = (p2.profile.run / p2.profile.faced_ball) * 100;
            p2.profile.fours += p2.fours;
            p2.profile.sixes += p2.sixes;
            p2.fours = 0;
            p2.sixes = 0;
            p2.profile.delivery_ball += p2.bowling_ball;
            p2.bowling_ball = 0;
            p2.profile.bowling_run += p2.bowling_run;
            p2.bowling_run = 0;
            p2.profile.wicket += p2.wicket;
            p2.wicket = 0;
            if (p2.profile.delivery_ball != 0)
                p2.profile.economy = p2.profile.bowling_run / p2.profile.delivery_ball;
            p2.economy = 0;
            p2.save();
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
            }).cookie("match", null, {
                expires: new Date()
            })
            .status(200)
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
