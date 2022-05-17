const { constants } = require('buffer');
var jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
require('../db/connection');
const bodyParser = require('body-parser');
const cors = require('cors');
router.use(cors());
router.use(bodyParser.urlencoded({ extended: true}));
router.use(bodyParser.json())

const User = require("../model/userSchema")
const BlogPost = require("../model/PostSchema")

router.get('/Apidata', async (req,res)=>{

    try{
        const userdata= await User.find({});
        res.send( userdata);
    }catch(e){
        res.status(500)(e);
    }
})
router.get('/BlogPost', async (req,res)=>{

    try{
        const blogdata= await BlogPost.find({});
        res.send( blogdata);
    }catch(e){
        res.status(500)(e);
    }
})
router.get('/FullPage', async (req,res)=>{

    try{
        const blogdata= await BlogPost.find({});
        res.send( blogdata);
    }catch(e){
        res.status(500)(e);
    }
})

router.post('/registerd', async (req, res) => {            //createing post req for registration

    const { fullname, email, contact, Password, CPassword } = req.body;

    if (!fullname || !email || !contact || !Password || !CPassword) {
        return res.status(422).json({ error: "plase fill the form properly"})
    }
    try {
        const finduserExist =await User.findOne({email:email})
            console.log(finduserExist)
        if(finduserExist){
            return res.status(422).json({error:"Email allready exist"})

        }else if (Password != CPassword){
            return res.status(422).json({error: "Password not match"})
            
        }else{
            const user = new User({ fullname, email, contact, Password, CPassword })
        // ---- before saving bycrpt is running in userSchema ----
        await user.save()
                console.log(`${user} user registerd scuss`)
        
        res.status(201).json({ message: "successfully saved" });

        }
        
    } catch (err) {
        console.log(err)
    }
});


// --------------------------------//createing post req for signUP form //-----------------------------> 


router.post('/singin', async (req, res) => {      
    try {
        const { email, Password } = req.body;

        if (!email || !Password) {

            return res.status(400).json({ error: "please fill the form" })

        }

        const UserExist = await User.findOne({ email: email })     //---------> email validation

        // console.log(UserExist);


        if( UserExist){
        const MatchingPasswords = await bcrypt.compare(Password, UserExist.Password )

        let token = await UserExist.generateAuthToken();
            console.log(token);

            res.cookie("jwtToken", token,{
                expire: new Date(Date.now() + 2592000000 ),
                httpOnly:true
            });

        if (!MatchingPasswords) {

            res.status(400).json({ error: " Password is wrong" });

        } else {

            res.json({ message: "Sign In successfully" })

        }
        }else{
            res.status(400).json({ error: "Email and Password is wrong" });
        } 

    } catch (err) {
        console.log(err);

    }
})
router.post('/BlogPostData', async (req, res) => {            //createing post req for blog

    const newPost =  new BlogPost(req.body);
    try{
        const savePost = await newPost.save();
        res.status(201).json(savePost) 

    }catch(err){
        res.status(500).json(err);
    }
});

// get signle data
router.get("/:id", async (req, res) => {
    try {
      const post = await BlogPost.findById(req.params.id);
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json(err);
    }
  });


module.exports = router;