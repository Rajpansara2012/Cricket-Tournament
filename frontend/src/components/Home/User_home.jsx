import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Modal from 'react-modal';
import io from 'socket.io-client';
import { TailSpin } from 'react-loader-spinner';
import MatchDetails from '../View_match/MatchDetails';
import Commentary from '../View_match/Commentary';
import PointTable from '../View_match/PointTable';

Modal.setAppElement('#root');

function User_home() {
  const socket = io('http://localhost:8082', { withCredentials: true });
  const [isPointTablePopupOpen, setIsPointTablePopupOpen] = useState(false);

  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedOption, setSelectedOption] = useState('scoreboard');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [liveMatches, setLiveMatches] = useState([]);
  const [completedMatches, setCompletedMatches] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  // const predictions = [];
  // const [pri, setpri] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching matches
        const response = await axios.post(
          'http://localhost:8082/user/showall_matches',
          {},
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );

        const { liveMatches, completedMatches } = response.data;
        // for (const match of liveMatches) {
        //   if ((match.wicket[0] == 10 || match.over[0] == match.total_over)) {
        //     async function fetchData() {
        //       try {
        //         const response = await axios.post('http://localhost:5000/predict', {
        //           runs_left: 19,
        //           balls_left: 12,
        //           wickets_left: 10,
        //           total_runs_x: 200,
        //           cur_run_rate: 10,
        //           req_run_rate: 12
        //         });
        //         predictions.push(response.data);

        //       } catch (error) {
        //         console.error('Error:', error);
        //       }
        //     }
        //     fetchData();
        //   }
        // }

        // setpri(predictions);
        // Update state with fetched matches
        setLiveMatches(liveMatches);
        setCompletedMatches(completedMatches);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        // Set isLoading to false once data is loaded (whether successful or not)
        setIsLoading(false);
      }
    };

    const userToken = Cookies.get('token');
    if (userToken === undefined) {
      navigate('/Login');
    }

    // Fetch matches and set up socket connection
    fetchData();
    socket.on('liveUpdate', handleLiveUpdate);

    return () => {
      socket.off('liveUpdate', handleLiveUpdate);
    };
  }, []);

  const handleLiveUpdate = (data) => {
    setLiveMatches((prevLiveMatches) => {
      let matchUpdated = false;

      const updatedLiveMatches = prevLiveMatches.map((match) => {
        if (match._id === data._id) {
          matchUpdated = true;
          return {
            ...match,
            ...data,
          };
        }
        return match;
      });

      if (!matchUpdated) {
        updatedLiveMatches.push(data);
      }

      return updatedLiveMatches;
    });
  };


  const handleCardClick = (match) => {
    setSelectedMatch(match);
    setPopupOpen(true);
  };

  const showPointTable = (tournament) => {
    // Show point table popup
    setSelectedTournament(tournament);
    setIsPointTablePopupOpen(true);
  };

  const closePointTablePopup = () => {
    // Close point table popup
    setSelectedTournament(null);

    setIsPointTablePopupOpen(false);
  };
  var i = 0;
  const winProbability = {
    teamA: 60,
    teamB: 40
  };

  return (
    <>
      {isLoading && (
        <div className="flex justify-center items-center h-screen">
          <TailSpin color="#00BFFF" height={50} width={50} />
        </div>
      )}
      {!isLoading && (
        <div className="flex flex-wrap">
          {liveMatches &&
            liveMatches.map((match, index) => (
              <div
                key={index}
                className="relative w-full md:w-1/2 lg:w-1/3 p-3"
                onClick={() => handleCardClick(match)}
              >
                <div className="bg-white rounded-lg shadow-lg p-4">
                  <h2 className="text-lg font-semibold mb-2">
                    {match.team_name[0]} vs {match.team_name[1]}
                  </h2>
                  <div>
                    <p>
                      {match.team_name[0]} Score: {match.score[0]}/{match.wicket[0]}({match.over[0]})
                    </p>
                    {match.islive && match.commentary[1] && match.commentary[1].length === 0 && (
                      <div>
                        {match.players1
                          .filter((player) => player.batting_status === "playing")
                          .slice(0, 2)
                          .map((filteredPlayer, playerIndex) => (
                            <div key={playerIndex}>
                              <p className='ml-4'>
                                {filteredPlayer.name} {filteredPlayer.batting_run}({filteredPlayer.batting_ball})
                              </p>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <p>
                      {match.team_name[1]} Score: {match.score[1]}/{match.wicket[1]}({match.over[1]})
                    </p>
                    {match.islive && match.commentary[1] && match.commentary[1].length !== 0 && (
                      <div>
                        {match.players2
                          .filter((player) => player.batting_status === "playing")
                          .slice(0, 2)
                          .map((filteredPlayer, playerIndex) => (
                            <div key={playerIndex}>
                              <p className='ml-4'>
                                {filteredPlayer.name} {filteredPlayer.batting_run}({filteredPlayer.batting_ball})
                              </p>
                            </div>
                          ))}
                      </div>
                    )}
                    {(match.wicket[0] == 10 || match.over[0] == match.total_over) && match.winner == '' && <p className='ml-4 text-red-600'>{match.score[0] - match.score[1] + 1} runs needed from {(parseInt)(match.total_over * 6 - match.over[1] * 6)}</p>}
                    {match.winner != '' && <> <button
                      type="button"
                      onClick={() => showPointTable(match.tournamentId, "pointTable")}
                      className="inline-flex items-center text-sm font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-700 text-green-700 dark:text-white hover:bg-green-200 dark:hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Point Table
                    </button>
                      <button
                        type="button"
                        onClick={() => handleCardClick(match)}
                        className="inline-flex ml-2 items-center text-sm font-medium px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-white hover:bg-blue-200 dark:hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        Details
                      </button></>}
                    {/* {(match.wicket[0] == 10 || match.over[0] == match.total_over) && match.winner == '' &&
                      <div className="flex items-center">

                        {console.log(i)}
                        <p className="font-semibold mr-4">Team A: {pri[i]}%</p>
                        <div className="bg-blue-200 h-6 w-1/2 rounded-full">
                          <div className="bg-green-500 h-full rounded-full" style={{ width: `${pri[i]}%` }}></div>
                        </div>
                        <p className="ml-4 font-semibold">Team B: {100 - pri[i++]}%</p>
                        {console.log(i)}
                      </div>
                    } */}
                  </div>
                </div>
                <div
                  className={`absolute top-5 right-4 px-2 py-1 rounded font-semibold ${match.islive ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                    }`}
                >
                  {match.islive ? 'Live' : 'Completed'}

                </div>
              </div>
            ))}

          {completedMatches &&
            completedMatches.map((match, index) => (
              <div
                key={index}
                className="relative w-full md:w-1/2 lg:w-1/3 p-3"
              >
                <div className="bg-white rounded-lg shadow-lg p-4">
                  <h2 className="text-lg font-semibold mb-2">
                    {match.team_name[0]} vs {match.team_name[1]}
                  </h2>
                  <div>
                    <p>
                      {match.team_name[0]} Score: {match.score[0]}/{match.wicket[0]}({match.over[0]})
                    </p>
                  </div>

                  <div>
                    <p>
                      {match.team_name[1]} Score: {match.score[1]}/{match.wicket[1]}({match.over[1]})
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => showPointTable(match.tournamentId, "pointTable")}
                    className="inline-flex items-center text-sm font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-700 text-green-700 dark:text-white hover:bg-green-200 dark:hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Point Table
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCardClick(match)}
                    className="inline-flex ml-2 items-center text-sm font-medium px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-white hover:bg-blue-200 dark:hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Details
                  </button>


                </div>

                <div
                  className={`absolute top-5 right-4 px-2 py-1 rounded font-semibold bg-green-500 text-white `}
                >
                  {'Completed'}
                </div>
              </div>
            ))}

          {isPopupOpen && selectedMatch && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
              <div className="bg-white p-8 rounded shadow-md relative max-h-full overflow-y-auto">
                <button
                  onClick={() => setPopupOpen(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <h2 className="text-2xl font-semibold mb-4 text-center">Match Details</h2>

                <div className="flex justify-center mb-4">
                  <button
                    onClick={() => setSelectedOption('scoreboard')}
                    className={`${selectedOption === 'scoreboard' ? 'bg-blue-500 text-white' : ''
                      } px-4 py-2 mr-2 rounded cursor-pointer`}
                  >
                    Scoreboard
                  </button>
                  <button
                    onClick={() => setSelectedOption('commentary')}
                    className={`${selectedOption === 'commentary' ? 'bg-blue-500 text-white' : ''
                      } px-4 py-2 rounded cursor-pointer`}
                  >
                    Commentary
                  </button>
                </div>

                {selectedOption === 'scoreboard' ? (
                  <MatchDetails match={selectedMatch} />
                ) : (
                  <Commentary match={selectedMatch} />
                )}
              </div>
            </div>
          )}
          {isPointTablePopupOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="fixed inset-0 bg-black opacity-50 z-40"></div>
              <div className="z-50 relative">
                <div className="bg-white p-4 rounded-lg shadow-lg max-h-screen overflow-y-auto">
                  <PointTable tournament={selectedTournament} onClose={closePointTablePopup} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default User_home;
