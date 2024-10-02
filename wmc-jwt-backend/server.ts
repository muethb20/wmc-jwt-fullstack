import * as express from 'express';
import {Post} from "./interfaces/post.interface";
import * as jwt from 'jsonwebtoken';
import {User} from "./interfaces/user.interface";
import * as dotenv from 'dotenv';
import {authenticateToken} from "./services/jwt.service";
import * as cors from 'cors';

dotenv.config();

const app = express();
app.use(cors())
app.use(express.json())

const posts: Post[] = [
    {
        username: 'Thomas',
        title: 'Maturaballkarten'
    },{
        username: 'Thomas',
        title: 'Mallorca Urlaub'
    },
    {
        username: 'Thomas',
        title: 'Test Post'
    },{
        username: 'Lukas',
        title: 'Drohnenflug für fortgeschrittene'
    },{
        username: 'Lukas',
        title: 'Pfusch am Bau'
    },
    {
        username: 'Lukas',
        title: 'Golf Turnier'
    }
]

app.get('/posts', authenticateToken,(req, res) => {
    res.json(posts.filter(post => post.username == req.user.username))
})

app.listen(3000);