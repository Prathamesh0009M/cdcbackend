const mailsender = require("../utils/mailsender");
const messageTemplate=require("../template/messageTemplate")


// only for max 400 student at a time 
exports.sendMailToStudent = async (req, res) => {
    try {
        const { MailList,title,content } = req.body;
        if (!MailList||!isArray(MailList)) {

            res.status(400).json({
                success: false,
                message:"send mail properly",
            })
        }
        const result = mailsender(MailList, "Public Mail For students", messageTemplate(title,content));
        console.log("result of mail", result);

        res.status(200).json({
            success: true,
            message:"Mail sent to student successfully",
        })
        
    } catch (e) {
        res.status(400).json({
            success: false,
            message:"Couldn't send mail",
        })
        
    }
}












