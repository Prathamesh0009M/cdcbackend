const express = require("express");
const router = express.Router();

const {sendOTP,signUp,login}=require("../controllers/Auth")





router.post("/login", login);
router.post("/signUp", signUp);
router.post("/sendOTP", sendOTP);



module.exports = router;





