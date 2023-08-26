const express = require('express');
const Tournament = require('../module/tournament');
const User = require('../module/user');
const Match = require('../module/match');
const Team = require('../module/team');

const router = express.Router();

router.post('/addtournament', async (req, res) => {
    try {
        const tournament_name = req.body.tournament_name;
        const capacity = req.body.capacity;

        const tournament = new Tournament({ tournament_name, userId: req.session.userId, capacity});
        await tournament.save();
        res.json({ message: 'tournament added successfully.', tournament });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});
router.post('/showallt', async (req, res) => {
    try {
        const tournament = await Tournament.find();
        var temp = [];

        for (const t of tournament) {
            var id = t.userId;
            const user = await User.findOne({ _id: id })
            temp.push(t);
            temp.push(user);

        }
        res.json({ message: 'tournament added successfully.', temp });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});
router.post('/add_match', async (req,res) => {

    try{
        const team_name1 = req.body.team_name1;
        const team_name2 = req.body.team_name2;        
        const total_over = req.body.total_over;
        const toss = req.body.toss;
        const toss_status = req.body.toss_status;

        const venue = req.body.venue;
        const tournament_name = req.body.tournament_name;
        const tournament = await (Tournament.findOne({tournament_name : tournament_name}));
        const tournamentId = tournament._id;
        // console.log(tournamentId);
        
        const userId = req.session.userId;
        const team = [];
        team.push(await Team.findOne({team_name : team_name1, tournamentId}));
        team.push(await Team.findOne({team_name : team_name2, tournamentId}));
        // console.log(team[0].tournamentId);
        // console.log(team[1].tournamentId);
        
        if(team[0].tournamentId != tournamentId || team[1].tournamentId != tournamentId){
            res.status(500).json({ error: "team doestn't exit" });
        }
        else{
            const match = new Match({team_name : [team_name1, team_name2],
                                    total_over,
                                    venue : venue,
                                    tournamentId : tournamentId,
                                    userId : userId,
                                    toss,
                                    toss_status
            });
            match.save();
            if(toss == team[0].team_name && toss_status == "batting"){
                req.session.team1 = team[0];
                req.session.team2 = team[1];
            }
            else{
                req.session.team1 = team[1];
                req.session.team2 = team[0];
            }
            res.json({ message: 'match added successfully.', match });

        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred.' });
    }

});
// router.put('/scoring', async (req,res) =>{

// });
module.exports = router;
