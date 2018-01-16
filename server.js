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

// Dummy post created to initiate the spacebookDB
// var dummyPost = new Post({
//     text: "Here is my post",
//     comments: [{text: "Here is one comment", user: "Moshe"}]
// });
// dummyPost.save();

// server routes to define my API
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
app.post('/posts/:id/comments', function(req, res) {
    var data = req.body;
    Post.findByIdAndUpdate(req.params.id, {$push: { comments: data }}, { new: true }, function (err, result) {
        if(err) { return console.error(err); }
        res.send('Comment added!\n' + result);
    });
});

// 5) to handle deleting a comment from a post
app.delete('/posts/:id/comments/:commentId', function(req, res) {
    Post.findById({ _id: req.params.id }, function (err, post) {
        if (err) throw err;
        post.comments.id(req.params.commentId).remove();
        post.save(function(error, data) {
            if (error) { return console.error(error); }
            console.log(data);
            res.send('Comment deleted!');
        });
    });
});

app.listen(8000, function () {
    console.log("what do you want from me! get me on 8000 ;-)");
});