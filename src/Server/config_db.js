import mysql from "mysql2";

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Tra1ning',
  database: 'xp_module'
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

// // Replace 'your-endpoint' with the actual RDS endpoint you copied from AWS
// const db = mysql.createConnection({
//   host: 'your-endpoint.rds.amazonaws.com',
//   user: 'your-aws-username', // The username you set for the RDS instance
//   password: 'your-aws-password', // The password you set for the RDS instance
//   database: 'xp_module' // The database name you want to connect to
// });