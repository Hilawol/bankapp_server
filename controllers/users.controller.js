const userModel = require('../models/users.model');

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    return res.send(users);
  } catch (error) {
    return res.status(500).json({ "error": error });
  }
}


//Gets user by identificatioh number (not the _id object)
const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findOne({ id: id });
    if (!user) {
      return res.status(404).json({ "error": "User not found" });
    }
    return res.send(user);
  } catch (error) {
    return res.status(500).json({ "error": error });
  }
}

const addUser = async (req, res) => {
  const { id } = req.body;
  const user = new userModel({
    id: id
  });
  try {
    const result = await user.save();
    return res.status(201).json({ "success": result });
  } catch (error) {
    return res.status(500).json({ "error": error })
  }
}

module.exports = {
  getAllUsers,
  addUser,
  getUser
}