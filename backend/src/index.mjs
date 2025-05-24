import express from "express";
import passport from "passport";
import "dotenv/config";
import cors from "cors";
import routes from "./routes/index.mjs";
import pool from "./configs/db.mjs";

const PORT = process.env.PORT || 4000;

const app = express();

app.use(express.json());
app.use(passport.initialize());

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));


//set timezone to UTC
process.env.TZ = "UTC-8";

const testDbConnection = async () => {
  try {
    const [rows, fields] = await pool.query("SELECT 1 + 1 AS result");
    console.log("Database connected. Test query result:", rows[0].result); // Should output: 2
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

app.use(routes);
// listen for connections
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await testDbConnection();
  
  });
  
