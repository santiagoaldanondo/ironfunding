const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RewardSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  delivery: {
    type: Date,
    required: true
  },
  _campaign: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign'
  },
  _bidders: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
})

RewardSchema.methods.biddedOnBy = function (user) {
  return this._bidders.some(bidderId => bidderId.equals(user._id))
}

RewardSchema.methods.registerWithCampaign = function (amount, cb) {
  const campaignId = this._campaign
  console.log(campaignId)
  mongoose.model('Campaign').findByIdAndUpdate(campaignId, {
    $inc: {
      totalPledged: amount,
      backerCount: 1
    }
  }, (err) => {
    if (!err) {
      return cb()
    } else {
      return cb(err)
    }
  })
}

const Reward = mongoose.model('Reward', RewardSchema)

module.exports = Reward