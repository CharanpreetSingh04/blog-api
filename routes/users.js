const express = require('express')
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const Message = require('../models/Message')
const Comment = require('../models/Comment')

router.get('/login', (req,res) => res.render('login'))

router.post('/login', (req,res,next) => {
    passport.authenticate('local', { 
        failureRedirect: '/users/login', 
        successRedirect: '/dashboard',
        failureFlash: true
    })(req,res,next);
})

router.get('/logout', (req,res) => {
    req.logOut();
    req.flash('success_msg', 'You are successfully logged out')
    res.redirect('/users/login')
})

router.get('/register', (req,res) => res.render('register'))

router.post('/register', (req,res) => {
    const {name,email,password,password2} = req.body;
    const errors = [];
    if(!email || !name || !password || !password2){
        errors.push({msg: "Please fill all fields"})
    }
    if(password !== password2){
        errors.push({msg: "Passwords do not match"})
    }
    if(password.length < 6){
        errors.push({msg: 'Password should be atleast 6 characters'})
    }

    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else{
        User.findOne({email: email}).then(
            user => {
                if(user){
                    errors.push({msg: "User already registered with this email"})
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                }
                else{
                    const newUser = new User({
                        name,
                        email,
                        password
                    })

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash( newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            newUser.password = hash;
                            newUser.save()
                            .then( user => { 
                                req.flash('success_msg', 'You are now registered and can log in')
                                res.redirect('/users/login') 
                            })
                            .catch( err => console.log(err))
                        })
                    })
                }
            }
        )
    }
})


router.post('/messages',(req,res) => {
    // console.log(req.user)
    if(!req.body.name || !req.body.description){
        req.flash('error_msg','Fields cannot be empty')
        res.redirect('/dashboard')
    }
    else{
        if(req.user === undefined){
            req.flash("error_msg", 'There is some error happened. Please log in again.')
            return res.redirect('/users/login')
        }
        const newMessage = new Message({
            name: req.body.name,
            description: req.body.description,
            user: req.user.name,
            userId: req.user._id,
            time: new Date().getHours() +":"+ new Date().getMinutes() + ' ' + new Date().getDate() + '/' + new Date().getMonth() + '/' + new Date().getFullYear() 
        })
        newMessage.save();

        req.flash('success_msg', 'Your message is submitted')
        res.redirect('/dashboard')
    }
})


router.get('/comments/:id', (req,res) => {
    const {id} = req.params
    Message.findOne({_id: id}).lean()
    .then(message => {
        if(!message){
            req.flash('error_msg','Message does not exist')
            return res.status(400).redirect('/dashboard')
        }
        Comment.find({message: id}).lean()
        .then(comments => {
            res.render('comments',{id,comments})
        })
        .catch(err => console.log(err)) 
    })
    .catch(err => console.log(err))
    
})

router.post('/comments/:id', (req,res) => {
    const {id} = req.params
    if(!req.body.comment){
        req.flash('error_msg', 'Cannot leave fields empty')
        return res.redirect(`/users/comments/${id}`)
    }
    Message.findOne({_id: id}).lean()
    .then(message => {
        if(!message){
            req.flash('error_msg','Message does not exist')
            return res.status(400).redirect('/dashboard')
        }
        if(req.user === undefined){
            req.flash("error_msg", 'There is some error happened. Please log in again.')
            return res.redirect('/users/login')
        }
        const newComment = new Comment({
            user: req.user.name,
            comment: req.body.comment,
            message: id,
            time: new Date().getHours() +":"+ new Date().getMinutes() + ' ' + new Date().getDate() + '/' + new Date().getMonth() + '/' + new Date().getFullYear()
        })
        newComment.save()
        req.flash('success_msg', 'Your comment has been posted')
        res.redirect(`/users/comments/${id}`)
    })
    .catch(err => console.log(err))
})
module.exports = router