var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect(process.env.CONNECTION_STRING || 'mongodb://localhost/spacebookDB', {useMongoClient: true}, function () {
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
    var newPost = new Post(req.body);
    newPost.comments = [];
    newPost.save(function(error, result) {
        if (error) { return console.error(error); }
        res.send(result); // result = post object
    });
});

// 3) to handle deleting a post
app.delete('/posts/:id', function(req, res) {
    Post.findByIdAndRemove(req.params.id, function(error, result) {
        if (error) throw error;
        res.send(result); // result = post object
    });
});

// 4) to handle adding a comment to a post
app.post('/posts/:id/comments', function(req, res) {
    var data = req.body;
    Post.findByIdAndUpdate(req.params.id, {$push: { comments: data }}, { new: true }, function (error, result) {
        if(error) { return console.error(error); }
        res.send(result); // result = post object
    });
});

// 5) to handle deleting a comment from a post
app.delete('/posts/:id/comments/:commentId', function(req, res) {
    Post.findById({ _id: req.params.id }, function (err, post) {
        if (err) throw err;
        post.comments.id(req.params.commentId).remove();
        post.save(function(error, result) {
            if (error) { return console.error(error); }
            res.send(result); // result = post object
        });
    });
});

// 6) to handle updating a post
app.put('/posts/:id', function(req, res) {
    Post.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }, function(error, result) {
        if (error) throw error;
        res.send(result); // result = post object
    });
});

// 7) to handle updating a comment
app.put('/posts/:id/comments/:commentId', function(req, res) {
    Post.findOneAndUpdate({ _id: req.params.id, "comments._id": req.params.commentId },
                            { $set: { "comments.$": req.body } }, { new: true }, // comments.$ - position of comment by id
                            function(error, result) {
                                if (error) { return console.error(error); }
                                res.send(result); // result = post object
                            });
});

app.listen(process.env.PORT || 8000, function () {
    console.log("what do you want from me! get me on 8000 ;-)");
});