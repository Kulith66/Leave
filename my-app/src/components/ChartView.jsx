import React, { useState } from 'react';
import Day7 from './Day7';
import Month12 from './Month12';

// Example components for each option
const ThisWeek = () => {
    return <div>Displaying working hours for this week...</div>;
};

const ThisYear = () => {
    return <div>Displaying working hours for this year...</div>;
};

const ChartView = () => {
    const [selectedOption, setSelectedOption] = useState('');

    const handleChange = (e) => {
        setSelectedOption(e.target.value);  // Update the selected option
    };

    return (
        <div>
            <label htmlFor="dropdown">Choose an option:</label>
            <select id="dropdown" value={selectedOption} onChange={handleChange}>
                <option value="">Working Hours</option>
                <option value="thisWeek">This Week</option>
                <option value="thisYear">This Year</option>
            </select>

            {/* Conditionally render components based on selected option */}
            {selectedOption === 'thisWeek' && <Day7 />}
            {selectedOption === 'thisYear' && <Month12 />}
        </div>
    );
};

export default ChartView;
