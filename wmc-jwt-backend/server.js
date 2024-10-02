"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var dotenv = require("dotenv");
var jwt_service_1 = require("./services/jwt.service");
var cors = require("cors");
dotenv.config();
var app = express();
app.use(cors());
app.use(express.json());
var posts = [
    {
        username: 'Thomas',
        title: 'Maturaballkarten'
    }, {
        username: 'Thomas',
        title: 'Mallorca Urlaub'
    },
    {
        username: 'Thomas',
        title: 'Test Post'
    }, {
        username: 'Lukas',
        title: 'Drohnenflug für fortgeschrittene'
    }, {
        username: 'Lukas',
        title: 'Pfusch am Bau'
    },
    {
        username: 'Lukas',
        title: 'Golf Turnier'
    }
];
app.get('/posts', jwt_service_1.authenticateToken, function (req, res) {
    res.json(posts.filter(function (post) { return post.username == req.user.username; }));
});
app.listen(3000);
