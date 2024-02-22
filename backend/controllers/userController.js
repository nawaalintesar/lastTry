const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const Tutorial = require('./tutorialController');
const Project = require('./projectController');
const mongoose = require('mongoose')

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}


// login a user
const loginUser = async (req, res) => {
  const { userEmail, userPassword } = req.body

  try {
    const user = await User.login(userEmail, userPassword)

    const token = createToken(user._id)
    const firstName = user.firstName;
    const userID = user._id;

    res.status(200).json({ userEmail, firstName, token, userID })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}



// signup a user
const signupUser = async (req, res) => {

  console.log(req.body)
  const { firstName, lastName, userEmail, userPassword, userConfirmation } = req.body
  try {
    const user = await User.signup(firstName, lastName, userEmail, userPassword, userConfirmation)
    //const firstName = user.firstName;
    const userID = user._id;
    const token = createToken(user._id)
    res.status(200).json({ userEmail, firstName, token, userID })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }


}


const getAccountInfo = async (req, res) => {
  // const userId =  req.user.id;
  const userId = req.user.id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'No such workout' })
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({ error: 'No such workout' })
  }

  res.status(200).json(user)
};

const updateAccountInfo = async (req, res) => {


  //const userId =  req.user.id;
  const userId = req.user._id;
  console.log("ID IS userID", userId);
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'No aasdf such user' })
  }

  const user = await User.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userEmail: req.body.userEmail,
        // Add other fields you want to update as needed
      },
    },
    { new: true }
  );

  if (!user) {
    return res.status(400).json({ error: 'No such user' })
  }

  res.status(200).json(user)
};

const deleteAccount = async (req, res) => {
  const userId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'No such user' })
  }

  const user = await User.findOneAndDelete({ _id: userId })

  if (!user) {
    return res.status(400).json({ error: 'No such user' })
  }

  res.status(200).json(user)
}

async function forgotPassword() {

}



module.exports = { signupUser, loginUser, getAccountInfo, updateAccountInfo, deleteAccount }