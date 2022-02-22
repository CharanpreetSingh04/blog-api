const express = require('express')
const router = express.Router();
const { isAuthenticated } = require('../config/auth')
const Message = require('../models/Message')

router.get('/', (req,res) => res.render('welcome'))

router.get('/dashboard', isAuthenticated , (req,res)=>{
    Message.find({}).lean()
        .then(messages => {
            res.render('dashboard', {messages,name: req.user.name})
    })
})
module.exports = router