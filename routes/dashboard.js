import express from "express"
import db from "../db.js";
import authorization from "../middleware/authorization.js";
const router = express.Router();


router.get("/", authorization, async (req, res)=>{
    try {
        const user = await db.query("SELECT user_id, user_name, user_email, user_color FROM users WHERE user_id=$1", [req.user])
        res.json(user.rows[0])
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
})


export default router