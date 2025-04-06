const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

//generate tokens
const generateAccessToken = (userId) => {
    return jwt.sign(
        { id: userId },
        ACCESS_SECRET,
        {
            expiresIn: "15m"
        }
    );
}

const generateRefreshToken = (userId) => {
    return jwt.sign(
        {id: userId},
        REFRESH_SECRET,
        {
            expiresIn: "7d"
        }
    );
}

//user-registration
exports.register = async(req, res) => {
    try{
        const {username, password} = req.body;

        if(!username || !password){
            return res.status(400).json({
                error: "Username and password are required!"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username: username,
            password: hashedPassword,
        });
        res.status(201).json({
            message: "User created successfully!", user: newUser
        });
    }catch (error){
        console.log(error);
        res.status(500).json({error: "Internal Server error!"});
    }
};

//user-login
exports.login = async(req, res) => {
    try{
        const {username, password} = req.body;

        const user = await User.findOne({username} );

        if(!user) return res.status(401).json({error : "Invalid credentials!"});

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) res.status(401).json({error: "Invalid credentials!"});

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        //keeping refresh token as httpcookie only
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
            path: "/user/refresh-token",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.json(accessToken);
    }catch(error){
        console.log(error);
        res.status(500).json({error: "Internal Server Error!"});
    }
};

exports.refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        return res.status(401).json({error: "Refresh token missing."});
    }

    try{
        const payload = jwt.verify(refreshToken, REFRESH_SECRET);
        const newAccessToken = generateAccessToken(payload.id);
        res.json({accessToken: newAccessToken});
    }catch (error){
        return res.status(403).json({ error: "Invalid or expired refresh token" });
    }
}