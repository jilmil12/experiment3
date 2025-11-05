import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root", // your MySQL username
  password: "root123", // your MySQL password
  database: "userdb",
});

db.connect((err) => {
  if (err) throw err;
  console.log("✅ Database connected!");
});

export default db;
