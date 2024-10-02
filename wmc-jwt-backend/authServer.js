"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var jwt = require("jsonwebtoken");
var dotenv = require("dotenv");
var jwt_service_1 = require("./services/jwt.service");
var cors = require("cors");
dotenv.config();
var app = express();
app.use(cors());
app.use(express.json());
var refreshTokens = [];
app.post('/token', function (req, res) {
    var refreshToken = req.body.token;
    if (refreshToken == null) {
        return res.sendStatus(401);
    }
    if (!refreshToken.includes(refreshToken)) {
        return res.sendStatus(403);
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function (err, user) {
        if (err) {
            res.sendStatus(403);
        }
        var accessToken = (0, jwt_service_1.generateAccessToken)({ username: user.username });
        res.json({ accessToken: accessToken });
    });
});
app.delete('/logout', function (req, res) {
    refreshTokens = refreshTokens.filter(function (token) { return token !== req.body.token; });
    res.sendStatus(204);
});
app.post('/login', function (req, res) {
    var username = req.body.username;
    var user = { username: username };
    var accessToken = (0, jwt_service_1.generateAccessToken)(user);
    var refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
    console.log("New user named " + req.body.username);
});
app.listen(4000);
