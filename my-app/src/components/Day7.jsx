import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    LabelList,
} from 'recharts';

const WorkingHoursBarChart = () => {
    const { employeeId } = useParams(); // Get employeeId from the URL
    const [workingData, setWorkingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWorkingHours = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/working/days7/${employeeId}`);
                const sortedData = response.data.data.records.sort(
                    (a, b) => new Date(a.date) - new Date(b.date) // Sort by date in ascending order
                );
                setWorkingData({ ...response.data, data: { records: sortedData } });
            } catch (err) {
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchWorkingHours();
    }, [employeeId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!workingData) {
        return <div>No data available</div>;
    }

    // Prepare data for Recharts
    const data = workingData.data.records.map((record) => ({
        date: record.date,
        day: record.day, // Add day to the data
        hours: parseFloat(record.totalHours),
    }));

    return (
        <div>
            <h2>Total Working Hours for the Last 7 Days</h2>
            <BarChart
                width={700} // Customize chart width
                height={400} // Customize chart height
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="date"
                    tickFormatter={(date) => `${date}`} // Display full dates
                    angle={-45} // Rotate x-axis labels
                    textAnchor="end" // Align labels
                    height={80} // Add space for rotated labels
                />
                <YAxis
                    label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} // Add Y-axis label
                />
                <Tooltip formatter={(value, name, props) => [`${value} Hours`, 'Working Hours']} />
                <Bar
                    dataKey="hours"
                    fill="#a84632" // Bar color
                    radius={[6, 6, 0, 0]} // Round corners on top
                    barSize={70} // Control bar width
                >
                    {/* Display working hours on top of bars */}
                    <LabelList dataKey="hours" position="top" style={{ fill: '#333', fontWeight: 'bold' }} />
                </Bar>
            </BarChart>
        </div>
    );
};

export default WorkingHoursBarChart;
