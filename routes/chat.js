import express from "express";
import db from "../db.js";
import authorization from "../middleware/authorization.js";

const router = express.Router();

// posting chat
router.post("/message", authorization, async (req, res) => {
  try {
    const dbUs = await db.query(
      "SELECT user_email FROM users WHERE user_id=$1",
      [req.user]
    );
    console.log(dbUs);
    const { user_email } = dbUs.rows[0];
    // 1. destructuring the received body
    const chat_type = "text";
    const { sender_name, sender_permission, sender_id, sender_color, chat_message } =
      req.body;
    if(chat_message === "" || undefined){
        return res.status(403).json("👈🏼stop sending empty content⚠️")
    }
    let user_id = "";
    console.log(user_id);

    if (sender_permission === "admin") {
      user_id = sender_id;
    } else {
      const boss = await db.query(
        "SELECT user_id FROM staffs WHERE staff_email=$1",
        [user_email]
      );
      user_id = boss.rows[0].user_id;
    }
    console.log(user_id);

    // 2. entering the message to db
    await db.query(
      "INSERT INTO chats (chat_type, chat_message, sender_name, user_id, sender_color) VALUES ($1, $2, $3, $4, $5)",
      [chat_type, chat_message, sender_name, user_id, sender_color]
    );

    res.status(200).json("Message sent!");
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
});

// Get all messages in chats table
router.get("/message", authorization, async (req, res) => {
  try {
    const dbUs = await db.query(
      "SELECT user_email, user_id, user_permission FROM users WHERE user_id=$1",
      [req.user]
    );
    const { user_email, user_id, user_permission } = dbUs.rows[0];
    let boss_id = "";

    if (user_permission === "admin") {
      boss_id = user_id;
    } else {
      const boss = await db.query(
        "SELECT user_id FROM staffs WHERE staff_email=$1",
        [user_email]
      );
      boss_id = boss.rows[0].user_id;
    }

    // 2. entering the message to db
    const chats = await db.query("SELECT * FROM chats WHERE user_id =$1 ORDER BY created_at DESC", [boss_id]);
    const chatList = chats.rows
    res.status(200).json(chatList);
  } catch (error) {
    console.log(error.message);
    res.status(500).json("server error, unable t get messages");
  }
});

export default router;
