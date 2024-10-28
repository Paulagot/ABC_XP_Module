import axios from "axios";
import db from "./config_db.js"

//this is to connect to the zenler API and pull in data relating to the users
// admin end
//currently not triggered!!!!!!!

export const fetchUserData = async (req, res) => {
  try {
    // Fetch data from the external API
    const response = await axios.get('https://api.newzenler.com/api/v1/users?limit=100000&role=4', {
      headers: {
        'X-API-Key': 'ONPDVVIYMEGX6WHFL1QCEJ7KN798IXV2',
        'X-Account-Name': 'ABlockOfCrypto',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  // Extract the data from the API response
  const userData = response.data;
  console.log(userData)

   // test to ensure data is set up right
  if (!userData || !userData.data || !userData.data.items) {
    return res.status(500).send('Invalid user data structure from API');
  }

  const items = userData.data.items;

  // Process users data
  await processUserData(items); 

  res.status(200).json({ message: 'User Data fetched and processed successfully' });

} catch (error) {
  console.error('Error fetching User data from API or updating database:', error);
  res.status(500).send('Failed to fetch user data from API or update database');
}
};

const processUserData = async (usersItems) => {
  let updatedItems = [];
  for (const item of usersItems) {
    // Determine role based on roles array
    const role = item.roles.includes(1) ? 'admin' : 'student';

    // Check if the user exists by email
    const [rows] = await db.promise().query('SELECT * FROM users WHERE email = ?', [item.email]);

    if (rows.length > 0) {
      const existingUser = rows[0];
      
      // Update only if zenler_id or other fields are different
      if (existingUser.zenler_id !== item.id || 
          existingUser.first_name !== item.first_name || 
          existingUser.last_name !== item.last_name || 
          existingUser.role !== role) {

        await db.promise().query(
          'UPDATE users SET first_name = ?, last_name = ?, zenler_id = ?, role = ?, updated_at = NOW() WHERE email = ?',
          [item.first_name, item.last_name, item.id, role, item.email]
        );
        updatedItems.push(item.first_name);
      }
    } else {
      // Insert new user if email doesn't exist in the database
      await db.promise().query(
        'INSERT INTO users (first_name, last_name, email, zenler_id, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
        [item.first_name, item.last_name, item.email, item.id, role]
      );
      updatedItems.push(item.first_name);
    }
  }

  if (updatedItems.length > 0) {
    console.log('Users updated or added:', updatedItems);
  } else {
    console.log('No updates necessary for users.');
  }
};

