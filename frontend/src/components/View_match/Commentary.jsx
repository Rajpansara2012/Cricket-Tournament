import React, { useEffect, useState } from 'react';

function Commentary({ match }) {
    useEffect(() => {
        setInterval(() => {

        }, 2000);
    }, []);
    if (!match || !match.commentary || match.commentary.length !== 2) {
        return (
            <div className="text-center mt-4">
                <p className="text-gray-600">No commentary available</p>
            </div>
        );
    }


    // Reverse the commentary arrays
    const [inning1Commentary, inning2Commentary] = match.commentary;
    const reversedInning1Commentary = inning1Commentary.slice().reverse();
    const reversedInning2Commentary = inning2Commentary.slice().reverse();

    return (
        <div>
            {match.commentary[1].length != 0 && <div>
                <h3 className="text-xl font-semibold mb-2">Inning 2 Commentary:</h3>
                <ul className="list-disc pl-4">
                    {reversedInning2Commentary.map((comment, index) => (
                        <li key={index} className="text-gray-700 mb-2">{comment}</li>
                    ))}
                </ul>
            </div>}
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Inning 1 Commentary:</h3>
                <ul className="list-disc pl-4">
                    {reversedInning1Commentary.map((comment, index) => (
                        <li key={index} className="text-gray-700 mb-2">{comment}</li>
                    ))}
                </ul>
            </div>

        </div>
    );
}

export default Commentary;
