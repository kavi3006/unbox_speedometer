import "dotenv/config";
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT) || 5432,
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "postgres",
  database: process.env.PGDATABASE || "speeddb",
});

console.log("Starting manual ingestion...");
setInterval(async () => {
  const speed = Math.floor(Math.random() * 120); // Random 0-120
  await pool.query("INSERT INTO speed_data (speed) VALUES ($1)", [speed]);
  process.stdout.write(`Inserted speed: ${speed}\r`);
}, 1000);
