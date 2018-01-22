var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    text: String,
    user: String
});

var postSchema = new mongoose.Schema({
    text: String,
    comments: [commentSchema],
    // img: { data: Buffer, contentType: String }
});

var Post = mongoose.model('post', postSchema);

module.exports = Post;