const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const Tutorial = require('./tutorialModel'); 
const Schema = mongoose.Schema

const userSchema = new Schema({

  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String
  },
  userEmail: {
    type: String,
    required: true,
    unique: true
  },
  userPassword: {
    type: String,
    required: false
  },
  enrolledTutorials: [
    {
      tutId: {
        type: Schema.Types.ObjectId,
        ref: 'Tutorial'
      },
      progLang: {
        type: String
      },
      progress: {
        type: Number,
        default: 0
      }
    }
  ],
  createdProjects: [{
    type: Schema.Types.ObjectId,
    ref: 'Project',
  }]
}, { timestamps: true })

userSchema.statics.signup = async function (firstName, lastName, email, password, userConfirmation) {

  console.log("Confirming me!!", userConfirmation)

  // validation
  if (!email || !password || !firstName) {
    throw Error('All fields must be filled')
  }
  if (!validator.isEmail(email)) {
    throw Error('Email not valid')
  }


  if (password != true && !validator.isStrongPassword(password)) {
    throw Error('Password not strong enough')
  }
  if (password != userConfirmation) {
    throw Error('Passwords do not match')

  }

  const exists = await this.findOne({ userEmail: email })
  var user;


  if (password == true) {

    if (exists) { user = await this.findOne({ userEmail: email }) } //user who already has an account signs up
    else {
      user = await this.create({ firstName, lastName, userEmail: email, userPassword: null, enrolledTutorials: [], createdProjects: [] }) //adds into the db

    }

    return user;

  }
  //user signs up manually (not through google) with an existing account
  if (exists) {
    throw Error('Email already in use')
  }

  //user signs up through google

  else {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    user = await this.create({ firstName, lastName, userEmail: email, userPassword: hash, enrolledTutorials: [], createdProjects: [] }) //adds into the db
  }
  return user
}

// static login method
userSchema.statics.login = async function (email, password) {

  if (!email || !password) {
    throw Error('All fields must be filled')
  }

  const user = await this.findOne({ userEmail: email })
  if (!user) {
    throw Error('Incorrect email')
  }

  if (password == true) return user;
  const match = await bcrypt.compare(password, user.userPassword)
  if (!match) {
    throw Error('Incorrect password')
  }

  return user
}


// //get User
// userSchema.statics.getUser = async function () {


//   const user = await this.findOne({ userEmail: email })
//   if (!user) {
//     throw Error('User does not exist! ')
//   }

//   return user
// }

module.exports = mongoose.model('User', userSchema)