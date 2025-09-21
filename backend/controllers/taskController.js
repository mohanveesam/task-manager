const Task = require('../models/taskModel');

exports.createTask = async (req, res) => {
  try {
    const { selectedProject, taskAssignedTo, taskName, taskDescription, taskstatus } = req.body;

    // Correct condition
    if (!selectedProject || !taskAssignedTo || !taskName || !taskDescription || !taskstatus) {
      return res.status(400).json({ message: "Project, Assigned User, Task Name, Description and Status are required" });
    }

    // Only reached if all fields are valid
    const task = new Task({ selectedProject, taskAssignedTo, taskName, taskDescription, taskstatus });
    await task.save();
    res.status(201).json({ message: "Task created successfully", task });

  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getAllTask = async (req, res) => {
  try {
    const tasks = await Task.find().populate({
        path: "selectedProject",
        select: "createdBy projectName assignedTo",  
        populate: {
          path: "createdBy",
          select: "fullname"  
        }
      });
    res.status(200).json(tasks);  
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.updateTask = async (req, res) => {
  try{
    const { id } = req.params;
    const updateData = req.body;

    const taskUpdate = await Task.findByIdAndUpdate(id, updateData, { new: true });
    if(!taskUpdate) return res.status(400).json({message: 'User Id Not exist'});
    res.status(201).json(taskUpdate);
  }
  catch(error){
     res.status(500).json({ error: error.message });
  }
}

exports.deleteTask = async (req, res) => {
  try{
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted" });
  }
  catch(error){
    res.status(500).json({ error: error.message });
  }
}
