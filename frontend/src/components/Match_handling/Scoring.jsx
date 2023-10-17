import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Scoring() {
  const navigate = useNavigate();

  const team1 = JSON.parse(localStorage.getItem("team1"));
  const team2 = JSON.parse(localStorage.getItem("team2"));
  const player1 = JSON.parse(localStorage.getItem("player1"));
  const player2 = JSON.parse(localStorage.getItem("player2"));
  const [isshow, setisshow] = useState(0);
  const [batsman1, setbatsman1] = useState(null);
  const [batsman2, setbatsman2] = useState(null);
  const [bowler, setbowler] = useState(null);
  const [match, setmatch] = useState(null);
  const [batting, setbatting] = useState(1);
  const [temp, settemp] = useState(1);
  const [iswicket, setiswicket] = useState(0);
  const [isLoding, setIsLoding] = useState(false);
  useEffect(() => {
    const bat1 = Cookies.get("bastman1");
    const bat2 = Cookies.get("bastman2");
    const bowler = Cookies.get("bowler");
    const match = Cookies.get("match");

    setmatch(JSON.parse(match));
    if (bat1 != undefined) {
      setbatsman1(JSON.parse(bat1));
    }
    if (bat2 != undefined) {
      setbatsman2(JSON.parse(bat2));
    }
    if (bowler != undefined) {
      setbowler(JSON.parse(bowler));
      //   Cookies.set('match', JSON.stringify(match));

      setmatch(JSON.parse(match));
    }
    if (bat1 != undefined && bat2 != undefined && bowler != undefined)
      setisshow(2);
    else if (bat1 != undefined && bat2 != undefined) setisshow(1);
  }, []);

  const handlebastmanselect1 = (event) => {
    const player = JSON.parse(event.target.value);
    if (batsman2 != null && batsman2._id === player._id) {
      document.getElementById("firstselect").value = "option1";
      alert("can't select same player.");
    } else {
      setbatsman1(player);
      if (batsman2 != null && match.over[0] != match.total_over) {
        setisshow(1);
      }
    }
  };

  // console.log(batsman1);
  const handlebastmanselect2 = (event) => {
    const player = JSON.parse(event.target.value);
    if (batsman1 != null && batsman1._id === player._id) {
      document.getElementById("secondselect").value = "option1";
      alert("can't select same player.");
    } else {
      setbatsman2(player);
      if (batsman1 != null) {
        setisshow(1);
      }
    }
  };

  // console.log(batsman2);
  // console.log(bowler);

  const handlebowler = (event) => {
    const player = JSON.parse(event.target.value);
    Cookies.set("bastman1", JSON.stringify(batsman1));
    Cookies.set("bastman2", JSON.stringify(batsman2));
    Cookies.set("bowler", JSON.stringify(player));
    setbowler(player);
    setisshow(2);
  };

  function over_change() {
    if (parseInt(Cookies.get("ball")) % 6 == 0) {
      console.log("in if overchang");

      // console.log(batsman1)
      // console.log(batsman2)
      Cookies.set("bowler", JSON.stringify(bowler));
      Cookies.set("match", JSON.stringify(match));
      // console.log(Cookies.get('bastman1'));
      // console.log(Cookies.get('bastman2'));
      if (batting == 1 && (match.over[0]) != parseFloat(match.total_over)) {
        console.log(match.over[1])
        console.log(match.total_over)
        console.log(batting);
        console.log("22222222222222222222222222222")
        setisshow(1);
      }
      if(batting == 1 && (match.over[0]) == parseFloat(match.total_over)) {
        console.log("1111111111111111111111111111111111")
        // setbatsman1(null)
        setbatsman2(null)
        setisshow(0);
      }
      if (batting == 2 && (match.over[1]) != parseFloat(match.total_over)) {
        console.log(batting);
        setisshow(1);
      }
      strike_change();
    } else {

      //   Cookies.set("bastman1", JSON.stringify(batsman2));
      //   Cookies.set("bastman2", JSON.stringify(batsman1));
      //   Cookies.set("bowler", JSON.stringify(bowler));
      //   Cookies.set("match", JSON.stringify(match));
      //   console.log("in else overchang");
      // console.log(Cookies.get("bastman1"));
      // console.log(Cookies.get("bastman1"));
    }
  }
  function strike_change() {
    // Cookies.set('bastman1', JSON.stringify(batsman1));
    // Cookies.set('bastman2', JSON.stringify(batsman2));
    console.log("bbet1" + batsman1.name);
    console.log("bbet2" + batsman2.name);

    var t = batsman1;
    var t1 = batsman2;
    setbatsman1(t1);
    setbatsman2(t);
    console.log("abet1" + batsman1.name);
    console.log("abet2" + batsman2.name);
    console.log("in strike change fun");
    Cookies.set("bastman1", JSON.stringify(batsman2));
    Cookies.set("bastman2", JSON.stringify(batsman1));
    console.log(Cookies.get("bastman1"));
    console.log(Cookies.get("bastman2"));

  }

  const backend_call = async () => {
    console.log("in backend call");
    console.log(Cookies.get("bastman1"));
    console.log(Cookies.get("bastman2"));
    const datatosend = {
      match,
      batsman1,
      batsman2,
      bowler,
    };
    settemp(temp + 1);
    console.log(datatosend)
    try {
      const res = await axios
        .post("http://localhost:8082/admin/update_score", datatosend)
        .then((response) => {
          console.log("Data sent successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error sending data:", error);
        });
    } catch (e) {
      console.error("Error sending data:", e);
    }
  };

  function score(value) {

    console.log("from score function");
    console.log(Cookies.get("bastman1"));
    console.log(Cookies.get("bastman2"));
    batsman1.batting_run += value;
    batsman1.batting_ball += 1;
    var ball = parseInt(Cookies.get("ball"));

    batsman1.strike_rate = (batsman1.batting_run / batsman1.batting_ball) * 100;
    if ((value == 1 || value == 3) && (ball + 1) % 6 != 0) {
      console.log("before strike change call");
      // console.log(Cookies.get("bastman1"));
      // console.log(Cookies.get("bastman2"));
      strike_change();
    } else if (value == 4) {
      if (batsman1.four == null) {
        batsman1.four = 1;
      } else {
        batsman1.four += 1;
      }
    } else if (value == 6) {
      if (batsman1.six == null) {
        batsman1.six = 1;
      } else {
        batsman1.six += 1;
      }
    }
    bowler.bowling_run += value;
    bowler.bowling_ball += 1;
    bowler.economy = (bowler.bowling_run / bowler.bowling_ball) * 6;
    var o = Math.floor((ball + 1) / 6);
    var currentball = (ball + 1) % 6;
    Cookies.set("ball", ball + 1);
    Cookies.set("bowler", JSON.stringify(bowler));

    if (batting == 1) {
      if (match) {
        if (match.over[0] == null) {
          match.over.push(0);
        }
        // console.log(match.over[0])
        match.over[0] = o + currentball / 10;
        // console.log(match.over[0])
        if (match.score[0] == null) {
          match.score.push(0);
        }
        match.score[0] += value;
      }
      // console.log('hi');
    } else {
      if (match) {
        if (match.over[1] == null) {
          match.over.push(0);
        }
        match.over[1] = o + currentball / 10;
        if (match.score[1] == null) {
          match.score.push(0);
        }
        match.score[1] += value;
      }
    }
    Cookies.set("match", JSON.stringify(match));
    handleInningend();


  }
  const handleZero = async (event) => {
    score(0);
    backend_call();
    over_change();
  };
  const handleOne = async (event) => {
    console.log("from handleOne");
    console.log(Cookies.get("bastman1"));
    console.log(Cookies.get("bastman2"));

    score(1);
    backend_call();
    if (parseInt(Cookies.get("ball")) % 6 != 0) {
      over_change();
    } else if (batting == 1 && match.over[0] != match.total_over) {
      setisshow(1);
    }
    else if (batting == 2 && match.over[1] != match.total_over) {
      setisshow(1);
    }
  };
  const handleTwo = async (event) => {
    score(2);
    backend_call();

    over_change();
  };
  const handleThree = (event) => {
    score(3);
    backend_call();
    if (parseInt(Cookies.get("ball")) % 6 != 0) {
      over_change();
    } else if (batting == 1 && match.over[0] != match.total_over) {
      setisshow(1);
    }
    else if (batting == 2 && match.over[1] != match.total_over) {
      setisshow(1);
    }
  };
  const handleFour = (event) => {
    score(4);
    backend_call();

    over_change();
  };
  const handleSix = (event) => {
    score(6);
    backend_call();

    over_change();
  };

  const handelWicketBatsmen = (event) => {
    const player = JSON.parse(event.target.value);
    Cookies.set("bastman1", JSON.stringify(player));
    setbatsman1(player);
    setiswicket(0);
  };

  const handleWicket = (event) => {
    bowler.wicket += 1;
    bowler.bowling_ball += 1;
    console.log(bowler.wicket);
    var ball = parseInt(Cookies.get("ball"));
    var o = Math.floor(ball / 6);
    var currentball = ball % 6;
    Cookies.set("ball", ball + 1);
    Cookies.set("bowler", JSON.stringify(bowler));
    if (batting == 1) {
      if (match.wicket[0] == null) {
        match.wicket.push(0);
      }
      match.wicket[0] += 1;
      if (match.over[0] == null) {
        match.over.push(0);
      }
      match.over[0] = o + currentball / 10;

    } else {
      if (match.wicket[1] == null) {
        match.wicket.push(0);
      }
      match.wicket[1] += 1;
      if (match.over[1] == null) {
        match.over.push(0);
      }
      match.over[1] = o + currentball / 10;
    }
    Cookies.set("match", JSON.stringify(match));

    batsman1.batting_status = "out";
    var foundIndex = player1.findIndex(function (player) {

      return player._id === batsman1._id;
    });
    // console.log(foundIndex);
    // console.log(player1[foundIndex]);

    player1[foundIndex].batting_status = "out";
    localStorage.setItem("player1", JSON.stringify(player1));
    backend_call();
    if (parseInt(Cookies.get("ball")) % 6 == 0) {
      console.log("in if overchang");

      // console.log(batsman1)
      // console.log(batsman2)
      Cookies.set("bowler", JSON.stringify(bowler));
      Cookies.set("match", JSON.stringify(match));
      // console.log(Cookies.get('bastman1'));
      // console.log(Cookies.get('bastman2'));

      setisshow(1);
      strike_change();
    }
    if (batting == 1) {
      if (match.wicket[0] != 10)
        setiswicket(1);
      if (match.wicket[0] == 10) {
        handleInningend();
      }
    }
    else {
      if (match.wicket[1] != 10)
        setiswicket(1);
      if (match.wicket[1] == 10) {
        handleInningend();
      }
    }
  };
  function customPrompt(message, options) {
    var optionString = options.join("\n");
    var fullMessage = message + "\n\n" + optionString;
    
    var result = window.confirm(fullMessage);
  
    if (result) {
      var selectedOption = prompt("Enter your choice (0, 1, 2, 3, 4):");
      if (options.includes(selectedOption)) {
        return selectedOption;
      } else {
        alert("Invalid choice. Please select one of the options: " + options.join(", "));
        return -1;
      }
    }
    else {
      return -1;
    } 
  }
  const handleWide = (event) => { 
    bowler.bowling_run += 1;
    var options = ["0","1", "2", "3", "4"];
    var extra = parseInt(customPrompt("Please select an option:", options));
    if(extra == -1) {
      return;
    }
    bowler.bowling_run += extra;
    settemp(0);
    if (batting == 1) {
      if (match) {
        // console.log(match.over[0])
        if (match.score[0] == null) {
          match.score.push(0);
        }
        match.score[0] += (extra+1);
      }
      // console.log('hi');
    } else {
      if (match) {
        if (match.score[1] == null) {
          match.score.push(0);
        }
        match.score[1] += (extra+1);
      }
    }
    Cookies.set("bowler", JSON.stringify(bowler));
    Cookies.set("match", JSON.stringify(match));
    if(parseInt(extra) == 1 || parseInt(extra) == 3){
      strike_change();
    }
    over_change();
    handleInningend();
    backend_call();

  };
  function noBallcustomPrompt(message, options) {
    var optionString = options.join("\n");
    var fullMessage = message + "\n\n" + optionString;
    
    var result = window.confirm(fullMessage);
  
    if (result) {
      var selectedOption = prompt("Enter your choice (0, 1, 2, 3, 4, 6, bye):");
      if (options.includes(selectedOption)) {
        // Handle the selected option here
        return selectedOption;
      } else {
        alert("Invalid choice. Please select one of the options: " + options.join(", "));
        return -1;
      }
    } 
    else {
      return -1;
    }
  }
  const handleNoball = (event) => {
    bowler.bowling_run += 1;
    var options = ["0","1", "2", "3", "4", "6", "Bye"];
    var extra = noBallcustomPrompt("Please select an option:", options);
    if(extra == "Bye") {
      handleBye();
    }else if(parseInt(extra) == -1) {
      return;
    }
    else {
      bowler.bowling_run += parseInt(extra);
      batsman1.batting_run += parseInt(extra);
      batsman1.batting_ball += 1;
      if (batting == 1) {
        if (match) {
          // console.log(match.over[0])
          if (match.score[0] == null) {
            match.score.push(0);
          }
          match.score[0] += (parseInt(extra)+1);
        }
        // console.log('hi');
      } else {
        if (match) {
          if (match.score[1] == null) {
            match.score.push(0);
          }
          match.score[1] += (parseInt(extra)+1);
        }
      }
    }
    Cookies.set("bowler", JSON.stringify(bowler));
    Cookies.set("match", JSON.stringify(match));
    Cookies.set("bastman1", JSON.stringify(batsman1));
    if(parseInt(extra) == 1 || parseInt(extra) == 3){
      strike_change();
    }
    over_change();
    settemp(temp+1);
    handleInningend();
    backend_call();
   };
  const handleFreehit = (event) => { 
    var options = ["0","1", "2", "3", "4", "6", "Bye"];
    var extra = noBallcustomPrompt("Please select an option:", options);
    if(extra == "Bye") {
      handleBye();
    }else if(parseInt(extra) == -1) {
      return;
    }
    else {
      bowler.bowling_run += parseInt(extra);
      bowler.bowling_ball += 1;
      batsman1.batting_run += parseInt(extra);
      batsman1.batting_ball += 1;
      bowler.economy = (bowler.bowling_run / bowler.bowling_ball) * 6;
      var ball = parseInt(Cookies.get("ball"));
    var o = Math.floor((ball + 1) / 6);
    var currentball = (ball + 1) % 6;
    Cookies.set("ball", ball + 1);
    Cookies.set("bowler", JSON.stringify(bowler));

    if (batting == 1) {
      if (match) {
        if (match.over[0] == null) {
          match.over.push(0);
        }
        // console.log(match.over[0])
        match.over[0] = o + currentball / 10;
        // console.log(match.over[0])
        if (match.score[0] == null) {
          match.score.push(0);
        }
        match.score[0] += parseInt(extra);
      }
      // console.log('hi');
    } else {
      if (match) {
        if (match.over[1] == null) {
          match.over.push(0);
        }
        match.over[1] = o + currentball / 10;
        if (match.score[1] == null) {
          match.score.push(0);
        }
        match.score[1] += parseInt(extra);
      }
    }
    Cookies.set("bowler", JSON.stringify(bowler));
    Cookies.set("match", JSON.stringify(match));
    Cookies.set("bastman1", JSON.stringify(batsman1));
    if(parseInt(extra) == 1 || parseInt(extra) == 3){
      strike_change();
    }
    over_change();
    settemp(0);
    handleInningend();
    backend_call();
  }
};
  const handleBye = (event) => { 
    var options = ["0", "1", "2", "3", "4"];
    var extra = customPrompt("Please select an option:", options);
    if(parseInt(extra) == -1) {
      return;
    }
    bowler.bowling_run += parseInt(extra);
      bowler.bowling_ball += 1;
      // batsman1.batting_run += parseInt(extra);
      batsman1.batting_ball += 1;
      bowler.economy = (bowler.bowling_run / bowler.bowling_ball) * 6;

    var ball = parseInt(Cookies.get("ball"));
    var o = Math.floor((ball + 1) / 6);
    var currentball = (ball + 1) % 6;
    Cookies.set("ball", ball + 1);
    Cookies.set("bowler", JSON.stringify(bowler));

    if (batting == 1) {
      if (match) {
        if (match.over[0] == null) {
          match.over.push(0);
        }
        // console.log(match.over[0])
        match.over[0] = o + currentball / 10;
        // console.log(match.over[0])
        if (match.score[0] == null) {
          match.score.push(0);
        }
        match.score[0] += parseInt(extra);
      }
      // console.log('hi');
    } else {
      if (match) {
        if (match.over[1] == null) {
          match.over.push(0);
        }
        match.over[1] = o + currentball / 10;
        if (match.score[1] == null) {
          match.score.push(0);
        }
        match.score[1] += parseInt(extra);
      }
    }
    
    Cookies.set("bowler", JSON.stringify(bowler));
    Cookies.set("match", JSON.stringify(match));
    Cookies.set("bastman1", JSON.stringify(batsman1));
    if(parseInt(extra) == 1 || parseInt(extra) == 3){
      strike_change();
    }
    over_change();
    settemp(temp+1);
    handleInningend();
    backend_call();
    
  };
  const handleInningend = async (event) => {

    if (batting == 1) {
      if ((match.over[0]) == (parseFloat(match.total_over)) || match.wicket[0] == 10) {
        setbatting(2);
        localStorage.setItem('player1', JSON.stringify(player2));
        localStorage.setItem('player2', JSON.stringify(player1));
        setbatsman1(null);
        setbatsman2(null);
        console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
        Cookies.set('ball', 0);
        setisshow(0);
      }
    } else if ((match.over[1]) == (parseFloat(match.total_over)) || (match.wicket[1] == 10) || (match.score[0] < match.score[1])) {
      if (match.score[0] < match.score[1]) {
        match.winner = match.team_name[1];
      }
      else if (match.score[0] > match.score[1]) {
        match.winner = match.team_name[0];
      }
      else {
        match.winner = "tie"
      }
      Cookies.set("bowler", JSON.stringify(bowler));
      Cookies.set("match", JSON.stringify(match));
      setIsLoding(true);
    backend_call();
      try {
        await axios
          .post("http://localhost:8082/admin/save_player", match)
          .then((response) => {
            console.log("Data sent successfully:", response.data);
          })
          .catch((error) => {
            console.error("Error sending data:", error);
          });
      } catch (e) {
        console.error("Error sending data:", e);
      }
      navigate('/Admin_home');
    }
  };
  const Inningend = async (event) => {

    if (batting == 1) {
      setbatting(2);
      localStorage.setItem('player1', JSON.stringify(player2));
      localStorage.setItem('player2', JSON.stringify(player1));
      setbatsman1(null);
      setbatsman2(null);
      Cookies.set('ball', 0);
      setisshow(0);
    }
    else {
      if (match.score[0] > match.score[1]) {
        match.winner = match.team_name[0];
      }
      else if (match.score[0] < match.score[1]) {
        match.winner = match.team_name[1];

      }
      else {
        match.winner = "tie"
      }
      setIsLoding(true);

      backend_call();
      try {
        await axios
          .post("http://localhost:8082/admin/save_player", match)
          .then((response) => {
            console.log("Data sent successfully:", response.data);
          })
          .catch((error) => {
            console.error("Error sending data:", error);
          });
      } catch (e) {
        console.error("Error sending data:", e);
      }
      navigate('/Admin_home');
    }
  }
  return (
    <div>
      {iswicket == 1 && (
        <>
          <select onChange={handelWicketBatsmen}>
            <option value="option1">Select a Striker</option>
            {player1 &&
              player1
                .filter((player) => (player.batting_status !== "out") && player._id != batsman2._id)
                .map((player) => (
                  <option key={player._id} value={JSON.stringify(player)}>
                    {player.name} {player.type}
                  </option>
                ))}
          </select>
        </>
      )}
      {iswicket != 1 && isshow == 0 && (
        <>
          <select id="firstselect" onChange={handlebastmanselect1}>
            <option value="option1">Select a Striker</option>
            {player1 &&
              player1.map((player) => (
                <option key={player._id} value={JSON.stringify(player)}>
                  {player.name}
                  {player.type}
                </option>
              ))}
          </select>
          <select id="secondselect" onChange={handlebastmanselect2}>
            <option value="option1">Select a Non striker</option>
            {player1 &&
              player1.map((player) => (
                <option key={player._id} value={JSON.stringify(player)}>
                  {player.name}
                  {player.type}
                </option>
              ))}
          </select>
        </>
      )}
      {iswicket != 1 && isshow == 1 && (
        <>
          <select onChange={handlebowler}>
            <option value="option1">Select a bowler</option>
            {player2 &&
              player2.map((player) => (
                <option key={player._id} value={JSON.stringify(player)}>
                  {player.name}
                  {player.type}
                </option>
              ))}
          </select>
        </>
      )}
      {isLoding ? (<p>Loding...</p>) : iswicket != 1 && isshow == 2 && (
        <>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <div className="grid grid-cols-2 text-center mb-4 flex justify-between">
              <h2 className="text-2xl font-semibold">
                {team1.team_name}:{" "}
                {match && match.score && match.score[0] != null
                  ? match.score[0]
                  : 0}
                /
                {match && match.wicket && match.wicket[0] != null
                  ? match.wicket[0]
                  : 0}({match.over[0]}/{match.total_over})
              </h2>
              <h2 className="text-2xl font-semibold">
                {team2.team_name}:{" "}
                {match && match.score && match.score[1] != null
                  ? match.score[1]
                  : 0}
                /
                {match && match.wicket && match.wicket[1] != null
                  ? match.wicket[1]
                  : 0}({match.over[1]}/{match.total_over})
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-md flex justify-between">
                <div className="ml-5">
                  <h3 className="text-xl font-semibold">
                    Batsman 1: {batsman1.name}
                  </h3>
                  {
                    <p>
                      Score: {batsman1.batting_run == null && 0}
                      {batsman1.batting_run != null && batsman1.batting_run}
                    </p>
                  }
                  {
                    <p>
                      Balls: {batsman1.batting_ball == null && 0}
                      {batsman1.batting_ball != null && batsman1.batting_ball}
                    </p>
                  }
                </div>
                <div className="mr-5">
                  <h3 className="text-xl font-semibold">
                    Batsman 2: {batsman2.name}
                  </h3>
                  {
                    <p>
                      Score: {batsman2.batting_run == null && 0}
                      {batsman2.batting_run != null && batsman2.batting_run}
                    </p>
                  }
                  {
                    <p>
                      Balls: {batsman2.batting_ball == null && 0}
                      {batsman2.batting_ball != null && batsman2.batting_ball}
                    </p>
                  }
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold">Bowler: {bowler.name}</h3>

                {
                  <p>
                    Wickets: {bowler.wicket == null && 0}
                    {bowler.wicket != null && bowler.wicket}
                  </p>
                }

                {
                  <p>
                    Overs: {bowler.bowling_ball == null && 0}
                    {bowler.bowling_ball != null && bowler.bowling_ball}
                  </p>
                }

                {
                  <p>
                    Runs: {bowler.bowling_run == null && 0}
                    {bowler.bowling_run != null && bowler.bowling_run}
                  </p>
                }
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
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  type="button"
                  onClick={handleZero}
                >
                  0
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  type="button"
                  onClick={handleOne}
                >
                  1
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  type="button"
                  onClick={handleTwo}
                >
                  2
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  type="button"
                  onClick={handleThree}
                >
                  3
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  type="button"
                  onClick={handleFour}
                >
                  Four
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  type="button"
                  onClick={handleSix}
                >
                  Six
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  type="button"
                  onClick={handleWicket}
                >
                  Wicket
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  type="button"
                  onClick={handleWide}
                >
                  Wide
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  type="button"
                  onClick={handleNoball}
                >
                  No Ball
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  type="button"
                  onClick={handleBye}
                >
                  Bye
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  type="button"
                  onClick={handleFreehit}
                >
                  Free Hit
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  type="button"
                  onClick={Inningend}
                >
                  Inning End
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default Scoring;