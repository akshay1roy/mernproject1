const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

const Authenticate = async (req, res, next) => {

    try {
        let token;

        // console.log(Object.keys(req));
        // console.log(req.headers.cookie);
        const cookiesHeaders=req.headers.cookie;
        const cookies=cookiesHeaders.split(';');

        cookies.forEach(cookies=>{
            const [name,value]=cookies.trim().split('=');

            //console.log("name:-",name,"value",value);
            token=value;
        })

        // const token = value;
       // console.log("value",token);
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

        const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token });

        if (!rootUser) {
            throw new Error("User not found");
            // console.log("User not found")
        }

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next();

    }
    catch (err) {
        res.status(401).send('Unauthorized :No token Provided');
        console.log(err);

    }

}

module.exports = Authenticate;