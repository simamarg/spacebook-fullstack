var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/spacebookDB', {useMongoClient: true}, function () {
    console.log("DB connection established!!!");
})

var Post = require('./models/postModel');

var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// var dummyPost = new Post({
//     text: "Here is my post",
//     comments: [{text: "Here is one comment", user: "Moshe"}]
// });

// dummyPost.save();

// You will need to create 5 server routes
// These will define your API:
// 1) to handle getting all posts and their comments
app.get('/posts', function(req, res) {
    Post.find(function(error, result) {
        if(error) { return console.error(error); }
        res.send(result);
    });
});

// 2) to handle adding a post
app.post('/posts', function(req, res) {
    var data = req.body;
    var newPost = new Post(data);
    newPost.comments = [];
    newPost.save();
    res.send('Post added!')
});

// 3) to handle deleting a post
app.delete('/posts/:id', function(req, res) {
    Post.findByIdAndRemove(req.params.id, function(err) {
        if (err) throw err;
        res.send('Post deleted!');
    });
});

// 4) to handle adding a comment to a post
// 5) to handle deleting a comment from a post

app.listen(8000, function () {
    console.log("what do you want from me! get me on 8000 ;-)");
});
