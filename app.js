const express = require('express');
require("dotenv").config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./model/user'); // Importing the user model
const auth=require('./middleware/auth')
// const user = require('./model/user');
require('./config/database').connect(); // Importing the config database
const app = express();
app.use(express.json()); // Middleware

app.get('/', (req, res) => {
    res.send("<H1>hello from auth system</H1>");
});

app.post('/register', async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;
    
    if (!(email && firstname && lastname && password)) {
        res.status(400).send("All fields are required");
    }
    
    const existing_user = await User.findOne({ email }); // Promise 
    console.log(existing_user,"------------");

    if (existing_user) {
        res.status(401).send("User already exists");
    }

    const myencriptpass = await bcrypt.hash(password, 5);

    const newUser = await User.create({
        firstname,
        lastname,
        email: email.toLowerCase(),
        password: myencriptpass
    });
    console.log(newUser);
    // newUser.password=undefined;;
//creating the token
    const token = jwt.sign({
        user_id: newUser._id,
        email
    }, process.env.SECRET_KEY, {
        expiresIn: "5d"
    });

    newUser.token = token;
    //update or not in db
    //todo: handling the password situation
    res.status(201).json(newUser);
        
    } catch (error) {
        console.log(error);
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            res.status(400).json("Required fields are missing");
        }
        const user = await User.findOne({ email });
        console.log(user);
         if(!user){
             res.status(401).json("user doesnt register")
         }
        
         console.log(user);
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.SECRET_KEY,
                { expiresIn: "5d" }
            );
                console.log(user);
            user.token = token;
            //user.password = undefined;
            res.status(200).json(user);
        } else {
            res.status(400).send("Email or password is incorrect");
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }

});
app.get('/dashboard', auth,async(req,res)=>{
    res.send("welcome to secret information");
})

module.exports = app;
