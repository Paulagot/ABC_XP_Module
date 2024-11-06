import mysql from "mysql2";

const db = mysql.createConnection({
  host: 'xpmodule.c188ccsye2s8.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Paulaisth3best$',
  database: 'xpmodule'
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

export default db;

// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'Tra1ning',
//   database: 'xp_module'
// });