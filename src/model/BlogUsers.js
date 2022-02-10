const mongoose = require('mongoose');
//connect mongoose & backend, blod-db = db name
// mongoose.connect('mongodb://localhost:27017/blog-db');
mongoose.connect('mongodb+srv://kavya:KavyaAtlas123@cluster0.s7eqb.mongodb.net/my-blog?retryWrites=true&w=majority');


//create schema, i.e, structure of data
const Schema = mongoose.Schema;

var userSchema = new Schema({
    username:String,
    password:String,
    email:String,
    isadmin:Boolean
})

//create a model(collection, schema)
var UserInfo = mongoose.model('users', userSchema);

//export model
module.exports = UserInfo;