import React, { useState, useEffect, useRef } from 'react'
import Cookies from 'js-cookie';
import axios from "axios";

function Scoring() {
    const team1 = JSON.parse(localStorage.getItem('team1'))
    const team2 = JSON.parse(localStorage.getItem('team2'))
    const player1 = JSON.parse(localStorage.getItem('player1'))
    const player2 = JSON.parse(localStorage.getItem('player2'))
    const [isshow, setisshow] = useState(0);
    const [batsman1, setbatsman1] = useState(null);
    const [batsman2, setbatsman2] = useState(null);
    const [bowler, setbowler] = useState(null);
    const [match, setmatch] = useState(null);
    const [batting, setbatting] = useState(1);
    const [temp, settemp] = useState(1);
    useEffect(() => {
        const bat1 = Cookies.get('bastman1');
        const bat2 = Cookies.get('bastman2');
        const bowler = Cookies.get('bowler');
        const match = Cookies.get('match');
        if (bat1 != undefined) {
            setbatsman1(JSON.parse(bat1));
        }
        if (bat2 != undefined) {
            setbatsman2(JSON.parse(bat2));
        }
        if (bowler != undefined) {
            setbowler(JSON.parse(bowler));
            setmatch(JSON.parse(match));
        }
        if (bat1 != undefined && bat2 != undefined && bowler != undefined)
            setisshow(2);
        else if (bat1 != undefined && bat2 != undefined)
            setisshow(1);
    }, []);

    const handlebastmanselect1 = (event) => {
        const player = JSON.parse(event.target.value)
        if (batsman2 != null && batsman2._id === player._id) {
            document.getElementById("firstselect").value = "option1";
            alert("can't select same player.")
        }
        else {
            setbatsman1(player);
            if (batsman2 != null) {
                setisshow(1);
            }
        }
    };

    // console.log(batsman1);
    const handlebastmanselect2 = (event) => {
        const player = JSON.parse(event.target.value)
        if (batsman1 != null && batsman1._id === player._id) {
            document.getElementById("secondselect").value = "option1";
            alert("can't select same player.")
        }
        else {
            setbatsman2(player);
            if (batsman1 != null) {
                setisshow(1);
            }
        }
    };

    // console.log(batsman2);
    // console.log(bowler);

    const handlebowler = (event) => {
        const player = JSON.parse(event.target.value)
        Cookies.set('bastman1', JSON.stringify(batsman1));
        Cookies.set('bastman2', JSON.stringify(batsman2));
        Cookies.set('bowler', JSON.stringify(player));
        setbowler(player);
        setisshow(2);
    };

    const handleZero = async (event) => {
        batsman1.batting_run += 0;
        batsman1.batting_ball += 1;
        batsman1.strike_rate = (batsman1.batting_run / batsman1.batting_ball) * 100;
        bowler.bowling_run += 0;
        bowler.bowling_ball += 1;
        bowler.economy = (bowler.bowling_run / bowler.bowling_ball) * 6;
        var ball = parseInt(Cookies.get('ball'));
        var o = Math.floor(ball / 6);
        var currentball = ball % 6;
        Cookies.set('ball', ball + 1);

        if (batting == 1) {
            if (match.over[0] == null) {
                match.over.push(0);
            }
            match.over[0] = o + currentball / 10;
        }
        else {
            if (match.over[1] == null) {
                match.over.push(0);
            }
            match.over[1] = o + currentball / 10;
        }
        const datatosend = {
            match,
            batsman1,
            batsman2,
            bowler
        }
        settemp(temp + 1);

        try {
            const res = await axios.post('http://localhost:8082/admin/update_score', datatosend)
                .then(response => {
                    console.log('Data sent successfully:', response.data);
                })
                .catch(error => {
                    console.error('Error sending data:', error);
                });
        }
        catch (e) {
            console.error('Error sending data:', e);
        }

        // if ((ball + 1) % 6 == 0) {
        //     var t = batsman1;
        //     setbatsman1(batsman2);
        //     setbatsman2(t);
        //     Cookies.set('bastman1', JSON.stringify(batsman1));
        //     Cookies.set('bastman2', JSON.stringify(batsman2));
        //     Cookies.set('bowler', JSON.stringify(bowler));
        //     // setisshow(1);
        // }
        // else {
        Cookies.set('bastman1', JSON.stringify(batsman1));
        Cookies.set('bastman2', JSON.stringify(batsman2));
        Cookies.set('bowler', JSON.stringify(bowler));
        // }

    };
    const handleOne = (event) => {

    };
    const handleTwo = (event) => {

    };
    const handleThree = (event) => {

    };
    const handleFour = (event) => {

    };
    const handleSix = (event) => {

    };
    const handleWicket = (event) => {

    };
    const handleWide = (event) => {

    };
    const handleNoball = (event) => {

    };
    const handleFreehit = (event) => {

    };
    const handleBye = (event) => {

    };
    const handleInningend = (event) => {

    };

    return (
        <div>
            {isshow == 0 &&
                <>
                    <select id="firstselect" onChange={handlebastmanselect1}>
                        <option value="option1">Select a Striker</option>
                        {player1 && player1.map((player) => (
                            <option key={player._id} value={JSON.stringify(player)}>
                                {player.name}
                                {player.type}
                            </option>
                        ))
                        }
                    </select>
                    <select id="secondselect" onChange={handlebastmanselect2}>
                        <option value="option1">Select a Non striker</option>
                        {player1 && player1.map((player) => (
                            <option key={player._id} value={JSON.stringify(player)}>
                                {player.name}
                                {player.type}
                            </option>
                        ))
                        }
                    </select>
                </>
            }
            {isshow == 1 &&
                <>
                    <select onChange={handlebowler}>
                        <option value="option1">Select a bowler</option>
                        {player2 && player2.map((player) => (
                            <option key={player._id} value={JSON.stringify(player)}>
                                {player.name}
                                {player.type}
                            </option>
                        ))
                        }
                    </select>
                </>
            }
            {
                isshow == 2 &&
                <>
                    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                        <div className="grid grid-cols-2 text-center mb-4 flex justify-between">
                            <h2 className="text-2xl font-semibold">{team1.team_name}: {match && match.score && match.score[0] != null ? match.score[0] : 0}/{match && match.wicket && match.wicket[0] != null ? match.wicket[0] : 0}</h2>
                            <h2 className="text-2xl font-semibold">{team2.team_name}:  {match && match.score && match.score[1] != null ? match.score[1] : 0}/{match && match.wicket && match.wicket[1] != null ? match.wicket[1] : 0}</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-lg shadow-md flex justify-between">
                                <div className='ml-5'>
                                    <h3 className="text-xl font-semibold">Batsman 1: {batsman1.name}</h3>
                                    {<p>Score: {batsman1.batting_run == null && 0}
                                        {batsman1.batting_run != null && batsman1.batting_run}</p>}
                                    {<p>Balls: {batsman1.batting_ball == null && 0}
                                        {batsman1.batting_ball != null && batsman1.batting_ball}</p>}

                                </div>
                                <div className='mr-5'>
                                    <h3 className="text-xl font-semibold">Batsman 2: {batsman2.name}</h3>
                                    {<p>Score: {batsman2.batting_run == null && 0}
                                        {batsman2.batting_run != null && batsman2.batting_run}</p>}
                                    {<p>Balls: {batsman2.batting_ball == null && 0}
                                        {batsman2.batting_ball != null && batsman2.batting_ball}</p>}
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold">Bowler: {bowler.name}</h3>

                                {<p>Wickets: {bowler.wicket == null && 0}
                                    {bowler.wicket != null && bowler.wicket}</p>}

                                {<p>Overs: {bowler.bowling_ball == null && 0}
                                    {bowler.bowling_ball != null && bowler.bowling_ball}</p>}

                                {<p>Runs: {bowler.bowling_run == null && 0}
                                    {bowler.bowling_run != null && bowler.bowling_run}</p>}
                            </div>
                        </div>
                        {/* <div className="bg-white p-4 mt-4 rounded-lg shadow-md">
                            
                        </div> */}
                        {/* <div className="text-center mt-4">
                            <h2 className="text-2xl font-semibold">Current Score: { }</h2>
                        </div> */}
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                        <form>
                            <div className="text-center mb-4">
                                <h2 className="text-2xl font-semibold">Score Input</h2>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="button" onClick={handleZero}>0</button>
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="button" onClick={handleOne}>1</button>
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="button" onClick={handleTwo}>2</button>
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="button" onClick={handleThree}>3</button>
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="button" onClick={handleFour}>Four</button>
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="button" onClick={handleSix}>Six</button>
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="button" onClick={handleWicket}>Wicket</button>
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="button" onClick={handleWide}>Wide</button>
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="button" onClick={handleNoball}>No Ball</button>
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="button" onClick={handleBye}>Bye</button>
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="button" onClick={handleFreehit}>Free Hit</button>
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="button" onClick={handleInningend}>Inning End</button>
                            </div>
                        </form>
                    </div>
                </>
            }
        </div>
    )
}

export default Scoring
