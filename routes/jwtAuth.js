import express from "express";
import bcrypt from "bcryptjs";
import db from "../db.js";
import jwtGenerator from "../utils/jwtGenerator.js";
import validInfo from "../middleware/validInfo.js";
import authorization from "../middleware/authorization.js";
import colorGenerator from "../utils/colorGenerator.js";

const router = express.Router();

// registering
router.post("/register", validInfo, async (req, res) => {
  console.log(req.body)
  try {
    // 1. destructure the req.body (name, email, password)
    const { name, email, password } = req.body;
    const color = colorGenerator()
    
    // 2. check if user exist (if user exist then throw error)

    const user = await db.query("SELECT * FROM users WHERE user_email=$1", [
      email,
    ]);
    if (user.rows.length !== 0) {
      return res.status(401).send("User already exist!");
    }


    // 3. bcrypt the user password

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);

    const bcryptPassword = await bcrypt.hash(password, salt);

    // 4. enter new user inside our database

    const newUser = await db.query(
      "INSERT INTO users (user_name, user_email, user_password, user_color) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, bcryptPassword, color]
    );

    // 5. generating our jwt token
    const token = jwtGenerator(newUser.rows[0].user_id);
    res.json(token);
    console.log(newUser.rows[0])
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// login routes

router.post("/login", validInfo, async (req, res) => {
  try {
    // 1. destructure the req.body

    const { email, password } = req.body;

    // 2. check if user does not exist (if not exists then throw err)

    const user = await db.query("SELECT * FROM users WHERE user_email=$1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Email or Password is incorrect");
    }

    // 3. check if incoming password is the same as the daabase password

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validPassword) {
      return res.status(401).json("Email or Password is incorrect");
    }

    // 4. given them the jwt token

    const token = jwtGenerator(user.rows[0].user_id);
    res.json(token);
  } catch (error) {
    console.error(error.message);
    res.send(500).send("Server error");
  }
});

router.get("/is-verify", authorization, async(req, res)=>{
  try {
    res.json(true)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");a
  }
})

export default router;
