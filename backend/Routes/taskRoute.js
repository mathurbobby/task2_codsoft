const express = require("express");
const router = express.Router();
const task = require("../models/Task");
const project = require('../models/Project')

router.post("/addtask", async (req, res) => {
  let eId = await task.findOne({
    taskUnderProject: req.body.taskUnderProject,
  });

  if (eId === null) {
    try {
      await task.create({
        taskUnderProject: req.body.taskUnderProject,
        tasks: [req.body.taskData],
      });
      await res.status(200).json({ success: true });
    } catch (error) {
      console.log("this is the error", error);
    }
  } else {
    try {
      await task.findOneAndUpdate(
        { taskUnderProject: req.body.taskUnderProject },
        { $push: { tasks: req.body.taskData } }
      );
      await res.status(200).json({ success: true });
    } catch (error) {
      res.send("Server Error", error.message);
    }
  }
});

router.post("/projecttask", async (req, res) => {
    try {
      const data = await task.find({ taskUnderProject: req.body.id });
      res.status(200).send(data);
    } catch (error) {
      res.status(400).json({ error: "Something went wrong" });
      console.log(error);
    }
  });

module.exports = router;
