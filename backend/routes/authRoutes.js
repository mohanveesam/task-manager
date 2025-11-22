const express = require("express");
const router = express.Router();
const { login,  resetPassword} = require("../controllers/authController");
// const cors = require("cors");

router.post("/login", login);
router.post("/reset-password", resetPassword);
module.exports = router;
