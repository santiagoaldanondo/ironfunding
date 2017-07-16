const express = require('express')
const router = express.Router()
const Campaign = require('../models/campaign')

router.get('/', (req, res, next) => {
  Campaign
    .find({})
    .populate('_creator')
    .exec((err, campaigns) => {
      if (err) {
        throw err
      } else {
        res.render('index', {
          campaigns
        })
      }
    })
})

module.exports = router
