import express from "express";
import db from "../db.js";
import authorization from "../middleware/authorization.js";
import colorGenerator from "../utils/colorGenerator.js";

const router = express.Router();

router.get("/", authorization, async (req, res) => {
  try {
    const user = await db.query(
      "SELECT user_id, user_name, user_email, user_color, user_permission FROM users WHERE user_id=$1",
      [req.user]
    );
    res.json(user.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// GET list of all users clients/contact

router.get("/customers", authorization, async (req, res) => {
  const client = await db.query(
    "SELECT  clients.client_id, clients.client_name, clients.client_email, clients.client_number, clients.client_location, clients.client_label, clients.client_color, clients.client_note  FROM clients JOIN users ON users.user_id=clients.user_id WHERE clients.user_id =$1 ORDER BY clients.client_name ASC",
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
    console.log("body received", req.body);
    const color = colorGenerator();
    const { name, number, email, label, location, birthday, note } = req.body;
    const userExist = await db.query(
      "SELECT  clients.client_id, clients.client_name, clients.client_email, clients.client_location, clients.client_label  FROM clients JOIN users ON users.user_id=clients.user_id WHERE clients.user_id =$1 AND clients.client_number = $2 ",
      [user_id, number]
    );

    console.log("exist:", userExist.rows);

    if (userExist.rows.length !== 0) {
      return res.status(401).json("Customer Already Exists");
    }
    console.log("no user found");
    // let data =[]
    const newUser = await db.query(
      "INSERT INTO clients ( user_id, client_name, client_number, client_email, client_label, client_location, client_birthday, client_note, client_color ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
      [user_id, name, number, email, label, location, birthday, note, color]
    );

    res.json("Successfully added a new Customer");
  } catch (error) {
    res.status(500).json("Server Error")
    console.log(error.message)
  }
});

// DELETE customer contact
router.delete("/customers/:id", authorization, async (req, res) => {
  try {
    const deletingUser = req.params.id;
    console.log(deletingUser);
    const dltUser = await db.query(
      "DELETE FROM clients WHERE client_id = $1 AND user_id = $2",
      [deletingUser, req.user]
    );

    const client = await db.query(
      "SELECT  clients.client_id, clients.client_name, clients.client_email, clients.client_number, clients.client_location, clients.client_label, clients.client_color  FROM clients JOIN users ON users.user_id=clients.user_id WHERE clients.user_id =$1 ORDER BY clients.client_name ASC",
      [req.user]
    );
    res.status(200).json(client.rows);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// PACTH customers contact
router.patch("/customers/:id", authorization, async (req, res) => {
  try {
    const client_id = req.params.id
    const user_id = req.user;
    console.log("body received", req.body);

    const { name, number, email, label, location, birthday, note } = req.body;
    await db.query(
      "UPDATE clients SET client_name=$2, client_number=$3, client_email=$4, client_label=$5, client_location=$6, client_birthday=$7, client_note=$8 WHERE client_id=$1 AND user_id=$9",
      [client_id, name, number, email, label, location, birthday, note, user_id]
    );

    console.log("Successffully Update")

    const client = await db.query(
      "SELECT  clients.client_id, clients.client_name, clients.client_email, clients.client_number, clients.client_location, clients.client_label, clients.client_color  FROM clients JOIN users ON users.user_id=clients.user_id WHERE clients.user_id =$1 ORDER BY clients.client_name ASC",
      [req.user]
    );
    res.status(200).json(client.rows);
  } catch (error) {
    res.status(500).json(error.message)
    console.log(error.message)
  }
});


/*
  STAFF PAGE START BELOW
*/

// GET list of all user's staffs

router.get("/staffs", authorization, async (req, res) => {
  const staffList = await db.query(
    "SELECT  staffs.staff_id, staffs.staff_name, staffs.staff_email, staffs.staff_number, staffs.employed_date, staffs.staff_role, staffs.staff_color, staffs.staff_note  FROM staffs JOIN users ON users.user_id=staffs.user_id WHERE staffs.user_id =$1 ORDER BY staffs.staff_name ASC",
    [req.user]
  );
  res.status(200).json(staffList.rows);
  try {
  } catch (error) {
    console.error(error.message);
    res.status(500).json(error);
  }
});

// POST new users STAFF contact
router.post("/staffs", authorization, async (req, res) => {
  const token = req.header("token");
  console.log("token", token);

  try {
    const user_id = req.user;
    console.log("body received", req.body);
    const color = colorGenerator();
    const { name, number, email, role, employed, birthday, note } = req.body;
    

    const staffExist = await db.query(
      "SELECT  staffs.staff_id FROM staffs JOIN users ON users.user_id=staffs.user_id WHERE staffs.user_id =$1 AND staffs.staff_email = $2 ",
      [user_id, email]
    );
    
    console.log("exist:", staffExist.rows);

    if (staffExist.rows.length !== 0) {
      return res.status(401).json("Staff Already Exists");
    }
    console.log("no user found");
    // let data =[]
    await db.query(
      "INSERT INTO staffs (staff_name, staff_email, staff_number, staff_birthday, employed_date, staff_color, staff_role, staff_note, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
      [name, email, number, birthday, employed, color, role, note, user_id]
    );

    res.json("Staff successfully added");
  } catch (error) {
    res.status(500).json("Server Error")
    console.log(error.message)
  }
});

export default router;
