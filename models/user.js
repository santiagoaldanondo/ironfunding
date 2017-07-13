const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DEFAULT_IMG_URL = 'https://www.google.es/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwiVzvKx4IbVAhVCLlAKHS4dDOwQjRwIBw&url=http%3A%2F%2Fwww.freeiconspng.com%2Fimages%2Fprofile-icon-png&psig=AFQjCNFeL1sIsM_MNmIdTppi5i3-ZMpCxA&ust=1500052271309882'

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  imgUrl: {
    type: String,
    default: DEFAULT_IMG_URL
  }
})

const User = mongoose.model('User', UserSchema)
module.exports = User
