import jwt from "jsonwebtoken";
import env from "dotenv";
env.config();

function jwtGenerator(user_id) {
    const payload = {
        user: user_id
    }

    return jwt.sign(payload, process.env.jwtSecret, {expiresIn: "10hr"})
}

export default jwtGenerator;