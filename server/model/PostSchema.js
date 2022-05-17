const mongoose = require ('mongoose');

const PostSchema =new mongoose.Schema({

    Title:{
        type:String,
        required:true
    },
    Descriptions:{
        type:String,
        required:true,
        unique:true
    },
    blogWriteing:{
        type:String,
        required:true
    },
});
const UsersBlog = mongoose.model('UsersBlog',PostSchema)
module.exports = UsersBlog;