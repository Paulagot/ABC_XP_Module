import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ReportTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/api/bitesreport`);

       
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <h2>Bites Report</h2>
            <button onClick={fetchData}>Refresh</button>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table border="1" style={{  marginTop: '20px', textAlign: 'left', fontSize: '14px' }}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Published</th>
                            <th>URL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                <td>{row.name}</td>
                                <td dangerouslySetInnerHTML={{ __html: row.published }}></td>
                                <td dangerouslySetInnerHTML={{ __html: row.url }}></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ReportTable;
