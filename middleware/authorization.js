import jwt from "jsonwebtoken";
import env from "dotenv"
env.config()

export default async (req, res, next) => {
    const token = req.header("token");
  console.log("token", token);
    try {
        const jwtToken = req.header("token");

        console.log("authorized: ", jwtToken);
        

        if(!jwtToken){
            return res.status(403).json("Not Authorize")
        }

        const payload = jwt.verify(jwtToken, process.env.jwtSecret);

        req.user = payload.user;

    } catch (error) {
        console.error(error.message);
        return res.status(403).json("Not Authorize")
    }

    next()
}