const express = require("express");
const router = express.Router();
const project = require("../models/Project");
const user = require('../models/User')
const task = require('../models/Task');

router.post("/createproject", async (req, res) => {
  try {
    await project.create({
      projectName: req.body.projectName,
      projectMembers: req.body.projectMembers,
      projectLeader: req.body.projectLeader,
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: "Something went wrong" });
    console.log(error);
  }
});

router.post("/userprojects", async (req, res) => {
  try {
    const data = await project.find({ projectLeader: req.body.id });
    res.send(data);
    // console.group(data)
  } catch (error) {
    res.status(400).json({ error: "Something went wrong" });
    console.log(error);
  }
});

router.delete('/:project' , async (req,res) => {
  try {
    const pid = req.params.project;
    // console.log(pid);
    await task.deleteOne({ taskUnderProject : pid });
    const result = await project.deleteOne({ _id: pid });
    res.status(200).send({success:true});
  } catch (error) {
    res.send({success : false, error : error});
    console.log(error)
  }
})

module.exports = router;
