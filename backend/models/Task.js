const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  taskUnderProject: { type: mongoose.Schema.Types.ObjectId, ref: "project", required: true },
  tasks: { type: Array, required: true },
});

module.exports = mongoose.model("task", taskSchema);
