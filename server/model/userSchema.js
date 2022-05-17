const mongoose = require ('mongoose');
const bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY

const userSchema =new mongoose.Schema({

    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    contact:{
        type:Number,
        required:true
    },
    Password:{
        type:String,
        required:true
    },
    
    tokens:[
        {
        token:{
            type:String,
            required:true
        }

    }]
});

userSchema.pre('save', async function (next){
    console.log("hello world");
    try{
        if(this.isModified('Password')){
            this.Password = await bcrypt.hash(this.Password,10);
            this.CPassword = await bcrypt.hash(this.CPassword,10);
        }

    }catch(err){
        console.log(err)
    }
    next();
});

// generateAuthToken here
userSchema.methods.generateAuthToken = async function (){
    try {
        let token = jwt.sign({_id:this._id},SECRET_KEY );
        this.tokens = this.tokens.concat({token: token});

       await this.save();
       return token;

    } catch (err) {
        console.log(err);
    }
    
}

const UsersData = mongoose.model('UsersData',userSchema)
module.exports = UsersData;