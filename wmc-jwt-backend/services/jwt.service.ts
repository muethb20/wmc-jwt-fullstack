import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import {User} from "../interfaces/user.interface";
dotenv.config();

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1] //Get part after "Bearer"

    console.log(token);

    if (token == null){
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            res.sendStatus(403)
        }

        req.user = user;
        next();
    })
}

export function generateAccessToken(user: User) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30s' });
}