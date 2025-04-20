import express from "express";
import db from "../db.js";
import authorization from "../middleware/authorization.js";
import colorGenerator from "../utils/colorGenerator.js";

const router = express.Router();

router.get("/", authorization, async (req, res) => {
  try {
    const user = await db.query(
      "SELECT user_id, user_name, user_email, user_color FROM users WHERE user_id=$1",
      [req.user]
    );
    res.json(user.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// GET  users clients/contactss list

router.get("/customers", authorization, async (req, res) => {
  const client = await db.query(
    "SELECT  clients.client_id, clients.client_name, clients.client_email, clients.client_number, clients.client_location, clients.client_label, clients.client_color  FROM clients JOIN users ON users.user_id=clients.user_id WHERE clients.user_id =$1 ORDER BY clients.client_name ASC",
    [req.user]
  );
  res.status(200).json(client.rows);
  try {
  } catch (error) {
    console.error(error.message);
    res.status(500).json(error);
  }
});

// POST new users customer contact
router.post("/customers", authorization, async (req, res) => {

  const token = req.header("token");
  console.log("token", token);
  
  try {
    const user_id = req.user;
    console.log("body received", req.body)
    const color = colorGenerator();
    const { name, number, email, label, location, birthday, note } =
      req.body;
    const userExist = await db.query(
      "SELECT  clients.client_id, clients.client_name, clients.client_email, clients.client_location, clients.client_label  FROM clients JOIN users ON users.user_id=clients.user_id WHERE clients.user_id =$1 AND clients.client_number = $2 ",
      [user_id, number]
    );

    console.log("exist:", userExist.rows)

    if (userExist.rows.length !== 0) {
      return res.status(401).json("Customer Already Exists");
    }
    console.log("no user found")
    // let data =[]
      const newUser = await db.query(
        "INSERT INTO clients ( user_id, client_name, client_number, client_email, client_label, client_location, client_birthday, client_note, client_color ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
        [user_id, name, number, email, label, location, birthday, note, color]
      );
    
      res.json("Successfully added a new Customer")
  } catch (error) {}
});

export default router;
