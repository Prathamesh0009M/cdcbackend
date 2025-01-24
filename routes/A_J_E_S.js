const express = require("express");
const router = express.Router();

const { makeAnnouncement, fetchAnnounceById, updateAnnouncement, deleteAnnouncement, fetchAnnounceMent } = require("../controllers/announce")
const { makeEvent, getEventById,fetchEvent, deleteEvents, deleteEventById, updateEvents } = require("../controllers/event")

const { createJob, updateJob, jobFetchByID, fetchAllJob, deleteJobs } = require("../controllers/job")
const { postSuccessStory, fetchAllSuccessStory, updateSuccessStory, deleteSuccessStory ,fetchSuccessById} = require("../controllers/successsStory")

// const { fetchAllSlidingData } = require("../controllers/slidingData");

const { auth } = require("../middleware/auth")

router.post("/makeAnnouncement", auth, makeAnnouncement);
router.post("/updateAnnouncement", auth, updateAnnouncement);
router.get("/fetchAnnounceMent", fetchAnnounceMent);
router.post("/deleteAnnouncement", auth, deleteAnnouncement);
router.post("/fetchById", auth, fetchAnnounceById);


router.post("/makeEvent", auth, makeEvent);
router.get("/fetchEvent", fetchEvent);
router.post("/deleteEvents", auth, deleteEvents);
router.post("/updateEvents", auth, updateEvents);
router.post("/deleteEventById", auth, deleteEventById);
router.post("/getEventById", auth, getEventById);


router.post("/createJob", auth, createJob);
router.post("/updateJob", auth, updateJob);
router.get("/fetchAllJob", fetchAllJob);
router.post("/deleteJob", auth, deleteJobs);
router.post("/jobFetchByID", auth, jobFetchByID);


router.post("/postSuccessStory", auth, postSuccessStory);
router.get("/fetchAllSuccessStory", fetchAllSuccessStory);
router.post("/updateSuccessStory", auth, updateSuccessStory);
router.post("/deleteSuccessStory", auth, deleteSuccessStory);
router.post("/fetchSuccessById", auth, fetchSuccessById);


// router.get("/fetchAllSlidingData",  fetchAllSlidingData);












module.exports = router;
