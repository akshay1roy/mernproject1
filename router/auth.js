const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate")

require('../DB/conn')
const User = require('../model/userSchema')


router.get('/', (req, res) => {
    res.send(`Hello world from the router server`)
})


router.post("/register", async (req, res) => {
    // console.log(req.body);

    // res.json({message:req.body});
    // to display the output of the data on the postman body which is enters by the user on the UI . 
    // first we convert the the json file which is comming from the ui (postman) into the object and then again we convert the object into json 

    // async await

    const { name, email, phone, work, password, cpassword } = req.body;

    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ error: "plz field the details properly " })
    }

    try {
        const userExist = await User.findOne({ email: email });

        if (userExist) {
            return res.status(422).json({ error: "Email already exit" });
        }
        else if (password !== cpassword) {
            res.status(422).json({ error: "password are not matching" });
        }
        else {
            const user = new User({ name, email, phone, work, password, cpassword });

            // hashing the password

            const userRegister = await user.save();

            if (userRegister) {
                res.status(201).json({ message: "user Registered successful" });
            }
            else {
                res.status(500).json({ error: "Filed to registered" });
            }

        }



    } catch (err) {
        console.log(err);
    }

})

// login route

router.post('/signin', async (req, res) => {
    // console.log(req.body);
    // res.json({message:"awesome"})

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "plz filled the data" })
        }

        const userLogin = await User.findOne({ email: email });
        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);

            if (!isMatch) {
                res.status(400).json({ error: "Invalid credientials " })
            }
            else {

                token = await userLogin.generateAuthToken();
                console.log(token);

                res.cookie("jwtoken", token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true
                })
                res.json({ message: "user login successful" })
            }
        }
        else {
            res.status(400).json({ error: "Invalid Credientials" });

        }

    } catch (err) {
        console.log(err);
    }
})


router.get('/about', authenticate, (req, res) => {
    // res.send({test:`Hello my About`});
    res.send(req.rootUser);
})


router.get('/getdata', authenticate, (req, res) => {
    console.log("hello from contact")
    res.send(req.rootUser);
})



router.post('/contact', authenticate, async (req, res) => {
    // res.cookie("Test","thapa")
    // res.send(`Hello contact from the server`)

    try {
        const { name, email, phone, message } = req.body;

        if (!name || !email || !phone || !message) {
            console.log("error in contact form ")
            return res.json({ error: "plzz fill the contant form" })
        }

        const userContact = await User.findOne({ _id: req.userID })

        if (userContact) {
            const userMessage = await userContact.addMessage(name, email, phone, message);

            await userContact.save();

            res.status(200).json({ message: "user Contact successfully" })
        }
    }
    catch (err) {

    }
})


// logout ka page

router.get('/logout', (req, res) => {
    res.clearCookie('jwtoken', { path: '/' })
    res.status(200).send('user Logout');
})

module.exports = router;