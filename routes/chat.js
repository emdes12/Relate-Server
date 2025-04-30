import express from "express";
import multer from "multer";
import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import db from "../db.js";
import authorization from "../middleware/authorization.js";

const router = express.Router();

// posting chat TEXT type to db
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
    const {
      sender_name,
      sender_permission,
      sender_id,
      sender_color,
      chat_message,
    } = req.body;
    if (chat_message === "" || undefined) {
      return res.status(403).json("👈🏼stop sending empty content⚠️");
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
    const chats = await db.query(
      "SELECT * FROM chats WHERE user_id =$1 ORDER BY created_at DESC",
      [boss_id]
    );
    const chatList = chats.rows;
    res.status(200).json(chatList);
  } catch (error) {
    console.log(error.message);
    res.status(500).json("server error, unable t get messages");
  }
});

/* 
    -- UPLOADING FILES  --
*/

// Create uploads directory if it doesn't exist

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf|docx/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG, PDF, and DOCX files are allowed"));
    }
  },
}).single("file");

// File upload endpoint
router.post("/upload", authorization, (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const dbUs = await db.query(
        "SELECT user_email FROM users WHERE user_id=$1",
        [req.user]
      );
      console.log(dbUs);
      const { user_email } = dbUs.rows[0].user_email;
      // 1. destructuring the received body
      const chat_type = "file";
      const { sender_name, sender_permission, sender_id, sender_color } =
        req.body;
      let user_id = "";

      if (sender_permission === "admin") {
        user_id = sender_id;
      } else {
        const boss = await db.query(
          "SELECT user_id FROM staffs WHERE staff_email=$1",
          [user_email]
        );
        console.log(boss.rows[0].user_id)
        user_id = boss.rows[0].user_id;
      }
      // Save file metadata to PostgreSQL
      const result = await db.query(
        "INSERT INTO chats (sender_name, sender_color, original_name, storage_name, file_path, file_type, file_size, user_id, sender_id, chat_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
        [
          sender_name,
          sender_color,
          req.file.originalname,
          req.file.filename,
          req.file.path,
          req.file.mimetype,
          req.file.size,
          user_id,
          sender_id,
          chat_type,
        ]
      );

      res.status(201).json("File uploaded successfully");
    } catch (dbError) {
      console.error("Database error:", dbError);

      // Clean up the uploaded file if DB insert fails
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error("Failed to delete file:", unlinkErr);
      });

      res.status(500).json("Failed to save file metadata");
    }
  });
});

// File download endpoint (optional)
router.get("/files/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM chats WHERE chat_id = $1", [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json("File not found");
    }

    const file = result.rows[0];
    if (!fs.existsSync(file.file_path)) {
      return res.status(404).json("File not found on server");
    }

    console.log(file.file_path, file.original_name);
    res.download(file.file_path, file.original_name);
  } catch (error) {
    console.error("Error retrieving file:", error);
    res.status(500).json("Error retrieving file");
  }
});

export default router;
