const jwt = require("jsonwebtoken");
require("dotenv").config();



// auth
exports.auth = async (req, res, next) => {
    try {
        
        // extract token
        
        // const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer", "");
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "token is missing",
            })
        }

        console.log(" token are checked ", token);
        // verify the token 
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded data is ",decode);
            req.user = decode;

        } catch (e) {
            return res.status(401).json({
                success: false,
                message: "token is Invalid ",
            })

        }
        next();

    } catch (e) {
        return res.status(401).json({
            success: false,
            message: "something went wrong while vaidating the token",
        })
    }
}


// is student 



















