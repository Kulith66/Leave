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

const Month12 = () => {
    const { employeeId } = useParams(); // Get employeeId from the URL
    const [workingData, setWorkingData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWorkingHours = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/working/month12/${employeeId}`);
                const sortedData = response.data.data.sort(
                    (a, b) => new Date(a.month) - new Date(b.month) // Sort by month in ascending order
                );
                setWorkingData(sortedData);
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

    if (!workingData || workingData.length === 0) {
        return <div>No data available</div>;
    }

    // Prepare data for Recharts
    const data = workingData.map((record) => ({
        month: record.month, // Month in readable format
        hours: parseFloat(record.totalHours), // Total hours as a number
    }));

    return (
        <div>
            <h2>Total Working Hours for the Last 12 Months</h2>
            <BarChart
                width={700} // Chart width
                height={400} // Chart height
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="month"
                    angle={-45} // Rotate x-axis labels
                    textAnchor="end"
                    height={80} // Add space for rotated labels
                />
                <YAxis
                    label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} // Y-axis label
                />
                <Tooltip formatter={(value) => [`${value} Hours`, 'Working Hours']} />
                <Bar
                    dataKey="hours"
                    fill="#a84632" // Bar color
                    radius={[6, 6, 0, 0]} // Rounded corners at the top
                    barSize={50} // Width of bars
                >
                    {/* Display hours above bars */}
                    <LabelList dataKey="hours" position="top" style={{ fill: '#333', fontWeight: 'bold' }} />
                </Bar>
            </BarChart>
        </div>
    );
};

export default Month12;
