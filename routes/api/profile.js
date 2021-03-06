const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

//Load validation
const validateProfileInput = require('../../validation/profile')

//Load Profile model
const Profile = require('../../models/Profile')
//load User Model
const User = require('../../models/User')
const { json } = require('body-parser')

//api/profile
//access private
router.get('/', passport.authenticate('jwt',{session:false}),(req,res)=>{
    const errors ={};

    Profile.findOne({user:req.user.id})
        .populate('user',['name','avatar'])
        .then(profile =>{
            if(!profile){
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
})

//@route GET /api/profile/all
//@desc get all profiles
//@access public
router.get('/all',(req,res)=>{
    const errors = {};

    Profile.find()
        .populate('user',['name','avatar'])
        .then(profiles =>{
            if(!profiles){
                errors.noprofile = 'There are no profiles'
                res.status(404).json(errors);
            }
            res.json(profiles)
        })
        .catch(err =>{
            res.status(404).json({
                profile:'There are no profile'
            })
        })
})

//@route GET /api/profile/handle/:handle
//@desc get profile by handle
//@access public
router.get('/handle/:handle',(req,res)=>{
    const errors = {};

    Profile.findOne({handle:req.params.handle})
        .populate('user',['name','avatar'])
        .then(profile =>{
            if(!profile){
                errors.noprofile = 'There is no profile found for this user';
                res.status(404).json(errors)
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
})

//@route GET /api/profile/user/:user_id
//@desc get profile by user_id
//@access public
router.get('/user/:user_id',(req,res)=>{
    const errors = {};

    Profile.findOne({user:req.params.user_id})
        .populate('user',['name','avatar'])
        .then(profile =>{
            if(!profile){
                errors.noprofile = 'There is no profile found for this user';
                res.status(404).json(errors)
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json({
            profile:'There is no profile for this user'
        }));
})

// Post api/profile
// Create or edit Profile Route
//access private
router.post('/', passport.authenticate('jwt',{session:false}),(req,res)=>{

    //destructure errors, validate
    const {errors, isValid} = validateProfileInput(req.body);

    //check validate
    if(!isValid){
        //return errors with status 400
        return res.status(400).json(errors)
    }

    //GET fields
    const profileFields ={};

    profileFields.user = req.user.id;
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    //skills - split into array
    if(typeof req.body.skills !== 'undefined'){
        profileFields.skills = req.body.skills.split(',');
    } 
    //Social
    profileFields.social ={};
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({user:req.user.id})
        .then(profile =>{
            if(profile){
                //if profile exists, then update profile
                Profile.findOneAndUpdate({user: req.user.id},{$set:profileFields},{new:true})
                    .then(profile => res.json(profile))

            }else{
                //if profile doesn't exists, then create profile

                //check if handle exists
                Profile.findOne({ handle:profileFields.handle }).then(profile =>{
                    if(profile){
                        errors.handle = 'That handle already exists!';
                        res.status(400).json(errors)
                    }

                    //save Profile
                    new Profile(profileFields).save().then(profile =>{
                        res.json(profile);
                    })
                })
            }
        })
})

//@route POST /api/profile/experience
//@desc ADD experience to profile
//@access private
router.post('/experience',passport.authenticate('jwt',{session:false}), (req,res)=>{
    Profile.findOne({user: req.user.id})
        .then(profile =>{
            const newExp = {
                title:req.body.title,
                company:req.body.company,
                location:req.body.location,
                from:req.body.from,
                to:req.body.to,
                current:req.body.current,
                description:req.body.description,
            }
            //add experience to profile
            profile.experience.unshift(newExp);
            profile.save().then(profile => res.json(profile));
        })
})

module.exports = router;