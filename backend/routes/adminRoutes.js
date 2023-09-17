const express = require('express');
const Tournament = require('../module/tournament');
const User = require('../module/user');
const Match = require('../module/match');
const Team = require('../module/team');
const { isauthenticated } = require('../middleware/auth');

const router = express.Router();

router.post('/addtournament', isauthenticated, async (req, res) => {
    try {
        const tournament_name = req.body.tournament_name;
        const capacity = req.body.capacity;

        const tournament = new Tournament({ tournament_name, userId: req.userId, capacity });
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
                total_over,
                venue: venue,
                tournamentId: tournament_id,
                userId: userId,
                toss,
                toss_status
            });
            match.save();
            if (toss == team[0].team_name && toss_status == "batting") {
                res.cookie('team1', team[0], { expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), httpOnly: true });
                res.cookie('team2', team[1], { expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), httpOnly: true });

            }
            else {
                res.cookie('team1', team[1], { expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), httpOnly: true });
                res.cookie('team2', team[0], { expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), httpOnly: true });
            }
            res.json({ message: 'match added successfully.', match, team1: team[0], team2: team[1] });

        }
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
// router.get('/tdetails', async (req, res) => {
//     try {
//         const tournament = 
//     }
//     catch (error) {
//         console.log(error);
//         res.status(500).json({ error: 'An error occurred.' });
//     }
// });
// router.put('/scoring', async (req,res) =>{

// });
module.exports = router;
