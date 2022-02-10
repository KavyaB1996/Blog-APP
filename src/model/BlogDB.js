const mongoose = require('mongoose');
//connect mongoose & backend, blod-db = db name
// mongoose.connect('mongodb://localhost:27017/blog-db');
mongoose.connect('mongodb+srv://kavya:KavyaAtlas123@cluster0.s7eqb.mongodb.net/my-blog?retryWrites=true&w=majority');


//create schema, i.e, structure of data
const Schema = mongoose.Schema;

var articleSchema = new Schema({
    name:String,
    title:String,
    description:String,
    username : String,
    upvotes : Number,
    comments : Array
})

//create a model(collection, schema)
var ArticleInfo = mongoose.model('articles', articleSchema);

//export model
module.exports = ArticleInfo;