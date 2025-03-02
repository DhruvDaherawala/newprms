const db = require("../config/db");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// exports.login = (req, res) => {
//   const { username, password } = req.body;
dotenv.config();

exports.login = (req, res) => {
    const { username, password } = req.body;

    const query = "SELECT * FROM registration WHERE username = ? AND password = ?";
    db.query(query, [username, password], (error, results) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (results.length > 0) {
            const user = { id: results[0].id, username: results[0].username };
            const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "120s" });

            return res.status(200).json({ message: "Login successful", token });
        } else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    });
};