import axios from "axios";
import db from "./config_db";

export const fetchDataAndSave = async (req, res) => {
  try {
    // Fetch data from the external API
    const response = await axios.get('https://api.example.com/data');
    const data = response.data;

    // Save the data to the MySQL database
    const query = 'INSERT INTO your_table_name (column1, column2) VALUES ?';
    const values = data.map(item => [item.field1, item.field2]); // Adjust according to your data structure

    db.query(query, [values], (err, results) => {
      if (err) {
        console.error('Error inserting data into MySQL:', err);
        res.status(500).send('Failed to save data to database');
        return;
      }
      res.status(200).send('Data successfully saved to database');
    });
  } catch (error) {
    console.error('Error fetching data from API:', error);
    res.status(500).send('Failed to fetch data from API');
  }
};
