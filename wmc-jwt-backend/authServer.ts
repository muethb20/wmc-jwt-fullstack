import * as express from 'express';
import {Post} from "./interfaces/post.interface";
import * as jwt from 'jsonwebtoken';
import {User} from "./interfaces/user.interface";
import * as dotenv from 'dotenv';
import {authenticateToken, generateAccessToken} from "./services/jwt.service";
import * as cors from 'cors';

dotenv.config();

const app = express();
app.use(cors())
app.use(express.json())


let refreshTokens = [];

app.post('/token', (req, res) => {
    const refreshToken = req.body.token;

    if(refreshToken == null){
        return res.sendStatus(401);
    }

    if(!refreshToken.includes(refreshToken)){
        return res.sendStatus(403);
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            res.sendStatus(403);
        }
        const accessToken = generateAccessToken({ username: user.username });
        res.json({accessToken: accessToken});
    })
})

app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
})

app.post('/login', (req, res) => {
    const username = req.body.username;
    const user: User = {username: username}

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    res.json({ accessToken: accessToken, refreshToken: refreshToken});

    console.log("New user named " + req.body.username);
})



app.listen(4000);