const express = require("express");
const router = express.Router();

const { makeAnnouncement, updateAnnouncement, deleteAnnouncement, fetchAnnounceMent } = require("../controllers/announce")
const {makeEvent,fetchEvent,deleteEvents,updateEvents}=require("../controllers/event")

const { auth } = require("../middleware/auth")

router.post("/makeAnnouncement", auth, makeAnnouncement);
router.post("/updateAnnouncement", auth, updateAnnouncement);
router.get("/fetchAnnounceMent", fetchAnnounceMent);
router.post("/deleteAnnouncement", auth, deleteAnnouncement);


router.post("/makeEvent", auth, makeEvent);
router.get("/fetchEvent", auth, fetchEvent);
router.post("/deleteEvents", auth, deleteEvents);
router.post("/updateEvents", auth, updateEvents);









module.exports = router;
