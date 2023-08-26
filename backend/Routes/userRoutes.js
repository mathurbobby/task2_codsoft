const express = require("express");
const router = express.Router();
const user = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET_KEY;

router.post(
  "/createuser",
  
  body("name", "name is too short").isLength({ min: 5 }),
  body("email", "invalid email").isEmail(),
  body("password", "Password is too short").isLength({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({error: errors.array()[0].msg});
    }
    const salt = await bcrypt.genSalt(10);
    const secpassword = await bcrypt.hash(req.body.password, salt);
    try {
      await user.create({
        name: req.body.name,
        email: req.body.email,
        password: secpassword,
      });
      res.status(200).json({ success: true });
    } catch (error) {
      res.json({ success: false, error : 'This id is already registered' });
    }
  }
);

router.post(
    "/loginuser",
    body("email", 'invalid email').isEmail(),
    body("password", 'Password is incorrect').isLength({ min: 5 }),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
      }
      let email = req.body.email;
      try {
        let userData = await user.findOne({ email });
        let username = userData.name;
        let id = userData._id
        if (!userData) {
          return res
            .status(400)
            .json({ error: "This email id is not registered yet" });
        }
        const pwdCompare = await bcrypt.compare(req.body.password, userData.password);
        if (!pwdCompare) {
          return res.status(400).json({ error: "Password is incorrect" });
        }
  
        const payload = {
          id: userData._id
        }
        const authToken = jwt.sign(payload, secretKey);
        res.json({ success: true, authToken: authToken, userName:username, userId:id});
      } catch (error) {
        // console.log(error);
        res.json({ success: false, error: 'This email id is not registered yet' });
      }
    }
  );

  router.get('/userid', async (req, res) => {
    try {
        const data = await user.find({}, 'email');
        res.send( data);
    } catch (error) {
        console.log(error);
    }
  })
  

module.exports = router