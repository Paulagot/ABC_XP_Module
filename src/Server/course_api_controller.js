import axios from "axios";
import pool from "./config_db.js"
import dotenv from "dotenv";

//this is to connect to the zenler API and pull in data relating to the bytes and missions
// admin end

dotenv.config();

export const fetchCourseData = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.ZENLER_COURSE_DATA_URL}?status=1&limit=500`, {
      headers: {
        'X-API-Key': process.env.ZENLER_API_KEY,
        'X-Account-Name': process.env.ZENLER_ACCOUNT_NAME,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
   

    const responseData = response.data;

    if (!responseData || !responseData.data || !responseData.data.items) {
      return res.status(500).send('Invalid data structure from API');
    }

    const items = responseData.data.items;

    // Process bites and missions data
    const updatedBites = await processBitesData(items.filter(item => item.categories.includes(14621)));
    const updatedMissions = await processMissionsData(items.filter(item => item.categories.includes(17226)));

    // Return the updated items to the client
    res.status(200).json({
      message: 'Data fetched and processed successfully',
      updatedBites,
      updatedMissions
    });

  } catch (error) {
    console.error('Error fetching data from API or updating database:', error);
    res.status(500).send('Failed to fetch data from API or update database');
  }
};

// Function to process bites data
const processBitesData = async (bitesItems) => {
  let updatedItems = [];
  for (const item of bitesItems) {
    const [rows] = await pool.promise().query('SELECT * FROM bites WHERE zenler_id = ?', [item.id]);

    if (rows.length > 0) {
      const existingItem = rows[0];
      if (existingItem.name !== item.name || existingItem.subtitle !== item.subtitle ||
          existingItem.thumbnail !== item.thumbnail || existingItem.url !== item.url) {
        await pool.promise().query(
          'UPDATE bites SET name = ?, subtitle = ?, thumbnail = ?, url = ?, updated_at = NOW() WHERE zenler_id = ?',
          [item.name, item.subtitle, item.thumbnail, item.url, item.id]
        );
        updatedItems.push(item.name);
      }
    } else {
      await pool.promise().query(
        'INSERT INTO bites (name, subtitle, thumbnail, url, zenler_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
        [item.name, item.subtitle, item.thumbnail, item.url, item.id]
      );
      updatedItems.push(item.name);
    }
  }

  return updatedItems;
};

// Function to process missions data
const processMissionsData = async (missionsItems) => {
  let updatedItems = [];
  for (const item of missionsItems) {
    const [rows] = await pool.promise().query('SELECT * FROM missions WHERE zenler_id = ?', [item.id]);

    if (rows.length > 0) {
      const existingItem = rows[0];
      if (existingItem.name !== item.name || existingItem.subtitle !== item.subtitle ||
          existingItem.thumbnail !== item.thumbnail || existingItem.mission_url !== item.url) {
        await pool.promise().query(
          'UPDATE missions SET name = ?, subtitle = ?, thumbnail = ?, mission_url = ?, updated_at = NOW() WHERE zenler_id = ?',
          [item.name, item.subtitle, item.thumbnail, item.url, item.id]
        );
        updatedItems.push(item.name);
      }
    } else {
      await pool.promise().query(
        'INSERT INTO missions (name, subtitle, thumbnail, mission_url, zenler_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
        [item.name, item.subtitle, item.thumbnail, item.url, item.id]
      );
      updatedItems.push(item.name);
    }
  }

  return updatedItems;
};
