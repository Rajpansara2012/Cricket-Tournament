import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./Navbar.css";

function Navbar(props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    // Fetch the username from cookies and update the state
    const storedUsername = Cookies.get("username");
    setUsername(storedUsername || "");
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setShowProfileDropdown(false); // Close profile dropdown when menu is toggled
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
    setIsMenuOpen(false); // Close the menu when the profile dropdown is toggled
  };

  const handleLogout = () => {
    // Add logic to handle logout (e.g., clear cookies, redirect, etc.)
    // For now, let's just reload the page
    window.location.reload();
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 sticky top-0 z-50 h-16">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-2 md:p-4">
        <a href="/Login" className="flex items-center">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white mt-0">
            Cricket Tournament
          </span>
        </a>

        <button
          type="button"
          onClick={toggleMenu}
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        <div
          className={`w-full md:block md:w-auto ${isMenuOpen ? "" : "hidden"}`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-2 md:p-0 mt-0 md:flex-row md:space-x-4 md:mt-0  dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {props.usertype === "admin" && (
              <>
                <li>
                  <a
                    href="/View_Matches"
                    className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  >
                    View Matches
                  </a>
                </li>
                <li>
                  <a
                    href="/Add_Tournament"
                    className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  >
                    Add Tournament
                  </a>
                </li>
                <li>
                  <a
                    href="/Add_Match"
                    className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  >
                    Add Match
                  </a>
                </li>
                <li>
                  <a
                    href="/Logout"
                    className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  >
                    Logout
                  </a>
                </li>
              </>
            )}
            {props.usertype === "user" && (
              <>
                <li>
                  <a
                    href="/Your_Matches"
                    className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  >
                    Your Matches
                  </a>
                </li>
                <li>
                  <a
                    href="/Add_Team"
                    className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  >
                    Add Team
                  </a>
                </li>
                <li>
                  <div className="relative ml-auto">
                    {username && (
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={toggleProfileDropdown}
                      >
                        <img
                          src="/path/to/your/profile-pic.jpg"
                          alt=""
                          className="w-8 h-8 mt-1 rounded-full border border-gray-300"
                        />
                      </div>
                    )}

                    {showProfileDropdown && (
                      <div className="absolute right-0 mt-2 bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-lg shadow-md">
                        <ul className="py-2">
                          <li>
                            <a
                              href="/Profile"
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                            >
                              Profile
                            </a>
                          </li>
                          <li>
                            <a
                              href="/Logout"
                              className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                            >
                              Logout
                            </a>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
