//same like import
const express = require('express');
//importing mongodb model
const ArticleInfo = require('./src/model/BlogDB')
const UserInfo = require('./src/model/BlogUsers')
const bcrpt=require('bcrypt')
const jwt=require('jsonwebtoken')

//obj intialization
const app = express();


//instead of body parser, use this to read data from body for post method
//body means in the site, white space like comments we write
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const path = require('path')
app.use(express.static('./build/'));

// //Fake DB
//removing to move data to DB
// const articleInfo = {
//     'node':{
//         upvotes : 0,
//         comments : []
//     },
//     'react':{
//         upvotes : 0,
//         comments : []
//     },
//     'express':{
//         upvotes : 0,
//         comments : []
//     }
// }


   

//names of all articles, articleslist
app.get('/api/articles', (req, res) => {
    try {
        // const articleName = req.params.name;
        ArticleInfo.find()
            .then(function (articles) {
                res.status(200).json(articles);
            })
    }   
catch (error) {
        res.status(500).json({ message: 'Error', error });
    }
});



//all details abt articles
app.get('/api/article/:name', (req, res) => {
    try {
        const articleName = req.params.name;
        ArticleInfo.findOne({ name: articleName })
            .then(function (article) {
                res.status(200).json(article);
            })
    }   
catch (error) {
        res.status(500).json({ message: 'Error', error });
    }
});

//Upvotes using DB
app.post('/api/article/:name/upvotes', (req, res) => {
    const articleName = req.params.name;
    // filter for articleName
    const filter = { name: articleName };
    //what we need to update DB
    const update = { $inc: { upvotes: 1 } };
    //You should set the new option to true to return the document after update was applied.
    ArticleInfo.findOneAndUpdate(filter, update, { new: true })
        .then(function (article) {
            res.json(article);
        })
})


//Upvotes routing
// app.post('/api/article/:name/upvotes', (req,res)=>{
//     const articleName = req.params.name;
//     articleInfo[articleName].upvotes += 1;
//     res.send(`${articleName} now has ${articleInfo[articleName].upvotes} upvotes`)
// })

// //Comments routing
// app.post('/api/article/:name/comments', (req,res)=>{
//     const articleName = req.params.name;
//     const {username, text} = req.body;
//     // add something to array by push
//     articleInfo[articleName].comments.push({ username, text });
//     res.send(articleInfo[articleName].comments);
// })

//Comments routing by dB
app.post('/api/article/:name/comments', (req, res) => {
    const articleName = req.params.name;
    const { username, text } = req.body;
    const filter = { name: articleName };
    const update = { $push: { comments: { username, text } } };
    ArticleInfo.findOneAndUpdate(filter, update, { new: true })
        .then(function (article) {
            res.json(article);
        })
})

//Updating article
app.put('/api/article/update/:name', (req, res) => {
    const articleName = req.params.name;
    const { username, title, name, description  } = req.body;
    const filter = { name: articleName };
    const update = { username : username, title : title, description : description, name : name };
    ArticleInfo.findOneAndUpdate(filter, update, { new: true })
        .then(function (data, err) {
            if(data)
            {
                res.json('Article updated Successfully');
            }
            else{
                res.status(500).json('Error occured', err)
            }

        })
})

//Deleting article
app.delete('/api/article/delete/:name', (req, res) => {
    const articleName = req.params.name;
    // const { username, title, name, description  } = req.body;
    const filter = { name: articleName };
    // const update = { username : username, title : title, description : description, name : name };
    ArticleInfo.findOneAndDelete(filter, (err, data)=>{
        if(err){
            res.status(500).json('Error occured', err)
        }
        else{
            res.json('Article deleted Successfully');
        }
    })
})


//Adding Article
app.post('/api/add-article', (req, res) => {
    // const articleName = req.params.name;
    var item = {
        name:req.body.name,
        title:req.body.title,
        description:req.body.description,
        username:req.body.username,
    }
    console.log(item);
    const article = new ArticleInfo(item);
    article.save().then(res.status(200).json("Article Added"))
})

//Adding User
// app.post('/api/signup', (req, res) => {
//     try{
  
//     // const articleName = req.params.name;
//     var item = {
//         username:req.body.username,
//         password:req.body.pwd,
//         email:req.body.email,
//     }
//     console.log(item);
//     const user = new UserInfo(item);
//     user.save().then(res.status(200).json("User Added"))
// }
// catch(err){
//     res.json("Error", err)
// }
// })


app.post("/api/signup",async(req,res)=>{
    try{
        UserInfo.find({email:req.body.email},(err,data)=>{
        if(data.length==0){

        let user=new UserInfo({ username: req.body.username, 
        email: req.body.email,
        password: req.body.pwd })

        let result= user.save( (err,data)=>{
        if(err){
            res.json({status:'error happened'})
        }
        else{
            res.json({status:'success'})
        }
    })}
    else{
        res.json({status:'email id already exists'})
    }
})}
    catch(error)
    {
        res.json({status:'error'})
    }
})

//Login user check
app.post('/api/login', async (req, res) => {
        // const articleName = req.params.name;
        const user = await UserInfo.findOne({ username:req.body.username,
            password:req.body.pwd })
        const isadmin = req.body.admincheck;
            
        console.log(user);
        if (user){
            return res.json({user:true})
        }
        else{
            return res.json({user:false})
        }
});

//Login
// app.post("/api/login",async(req,res)=>{
//     try{
//         console.log(req.body)
//         var username = req.body.username
//         var userPass= req.body.pwd
//         let result=  userModel.find({username:username},(err,data)=>{
//             if(data.length>0){
//                 const passwordValidator=bcrpt.compareSync(userPass,data[0].pwd)
//                 console.log(passwordValidator)
//                 if(passwordValidator)
//                 {
//                     // token generation
//                     jwt.sign({username:data[0].username,id:data[0]._id},
//                         'ictacademy',
//                         {expiresIn:'1d'},
//                         (err,token)=>{
//                             if(err){
//                                 res.json({status:'error in token generation'})
//                             }
//                             else{
//                                 res.json({status:'success',token:token})
//                             }
//                         }

//                     )


//                     /////////


//                 }
//                 else{
//                     res.json({status:'invalid password'})

//                 }

//             }
//             else{
//                 res.json({status:'invalid Username'})

//             }
//         })
//     }
//     catch(error)
//     {
//         res.json({status:'error'})

//     }
// })

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/build/index.html'))
   });

Back End Routing
app.get('/', (req,res)=>{
    res.send('Blog Server Up!!');
})

app.post('/', (req,res)=>{
    res.send(`Hi ${req.body.name} Post Method Working!!`);
})

app.get('/article/:name', (req,res)=>{
    const name = req.params.name;
    res.send(`${name}...URL params working`);
})


//Port number
app.listen(process.env.PORT || 5000, ()=>{
    console.log("Listening on port 5000");
})