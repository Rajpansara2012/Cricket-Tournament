import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Modal from 'react-modal';
import MatchDetails from '../View_match/MatchDetails';
import MatchDetail1 from '../View_match/MatchDetail1';

import Commentary from '../View_match/Commentary';
import { TailSpin } from 'react-loader-spinner';

Modal.setAppElement('#root');

function User_home() {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedOption, setSelectedOption] = useState('scoreboard'); // Track the selected option
  const [isLoading, setIsLoding] = useState(true);
  const navigate = useNavigate();

  const handleCardClick = (match) => {
    setSelectedMatch(match);
    setPopupOpen(true);
  };

  const [matches, setMatches] = useState([]);
  useEffect(() => {
    const userfind = Cookies.get('token');
    if (userfind === undefined) {
      navigate('/Login');
    }

    const fetchMatches = async () => {
      try {
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
        const sortedMatches = response.data.matches.slice();
        sortedMatches.sort((a, b) => {
          if (a.islive && !b.islive) return -1;
          if (!a.islive && b.islive) return 1;
          return 0;
        });
        setMatches(sortedMatches);
      } catch (error) {
        console.log(error);
      }
    };
    setInterval(() => {
      fetchMatches();
      setIsLoding(false);
    }, 2000);
  }, []);

  return (
    <>
      {isLoading && (<div className="flex justify-center">
        <TailSpin color="#00BFFF" height={50} width={50} />
      </div>)}
      {!isLoading && (<div className="flex flex-wrap">
        {matches &&
          matches.map((match, index) => (
            <div
              key={index}
              className="relative w-full md:w-1/2 lg:w-1/3 p-3"
              onClick={() => handleCardClick(match)}
            >
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h2 className="text-lg font-semibold mb-2">
                  {match.team_name[0]} vs {match.team_name[1]}
                </h2>
                <p>
                  {match.team_name[0]} Score: {match.score[0]}/{match.wicket[0]}({match.over[0]})
                </p>
                <p>
                  {match.team_name[1]} Score: {match.score[1]}/{match.wicket[1]}({match.over[1]})
                </p>
              </div>
              <div
                className={`absolute top-5 right-4 px-2 py-1 rounded font-semibold ${match.islive ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                  }`}
              >
                {match.islive ? 'Live' : 'Completed'}
              </div>
            </div>
          ))}
        {isPopupOpen && selectedMatch && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
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
                !selectedMatch.islive ? <MatchDetails match={selectedMatch} /> : <MatchDetail1 match={selectedMatch} />
              ) : (
                <Commentary match={selectedMatch} />
              )}

            </div>
          </div>
        )}
      </div>)}
    </>
  );
}

export default User_home;
