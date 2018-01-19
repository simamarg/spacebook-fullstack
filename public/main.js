var SpacebookApp = function () {
    var posts = [];
    var $posts = $(".posts");

    _renderPosts();

    // get the all posts from the server and put in the posts array
    var fetch = function() {
        $.ajax({
            method: "GET",
            url: 'posts',
            success: function (data) {
                console.log(data);
                posts = data;
                _renderPosts();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    };

    function findIndexByID(array, id) {
        return array.findIndex(function(element) {
            return element._id === id;
        });
    }

    // send request to server to add post to DB and then add the data from DB to posts array
    function addPost(newPost) {
        $.ajax({
            method: "POST",
            url: 'posts',
            data: {text: newPost},
            success: function (data) {
                posts.push(data);
                _renderPosts();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    }

    // send request to server to delete post from DB and then delete it from posts array
    var deletePost = function (id) {
        var url = 'posts/' + id;
        $.ajax({
            method: "DELETE",
            url: url,
            success: function (data) {
                var index = findIndexByID(posts, data._id);
                posts.splice(index, 1);
                _renderPosts();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    };

    // send request to server to add comment to a post in DB and then save the data from DB to post's comments array
    var addComment = function (newComment, postId) {
        var url = 'posts/' + postId + '/comments';
        $.ajax({
            method: "POST",
            url: url,
            data: newComment,
            success: function (data) {
                posts[findIndexByID(posts, postId)].comments = data.comments;
                _renderPosts();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    };

    // send request to server to delete comment of a post in DB and then save the data from DB to post's comments array
    var deleteComment = function (postId, commentId) {
        var url = 'posts/' + postId + '/comments/' + commentId;
        $.ajax({
            method: "DELETE",
            url: url,
            success: function (data) {
                posts[findIndexByID(posts, postId)].comments = data.comments;
                _renderPosts();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    };

    function _renderPosts() {
        $posts.empty();
        var source = $('#post-template').html();
        var template = Handlebars.compile(source);
        for (var i = 0; i < posts.length; i++) {
            var newHTML = template(posts[i]);
            $posts.append(newHTML);
            _renderComments(i);
        }
    }

    function _renderComments(postIndex) {
        var post = $('.post')[postIndex];
        $commentsList = $(post).find('.comments-list');
        $commentsList.empty();
        var source = $('#comment-template').html();
        var template = Handlebars.compile(source);
        for (var i = 0; i < posts[postIndex].comments.length; i++) {
            var newHTML = template(posts[postIndex].comments[i]);
            $commentsList.append(newHTML);
        }
    }

    return {
        addPost: addPost,
        deletePost: deletePost,
        addComment: addComment,
        deleteComment: deleteComment,
        fetch: fetch
    };
};

var app = SpacebookApp();

// get all posts from the server into the post array when the page loads
app.fetch();

// on-click events
$('#addpost').on('click', function () {
    var $input = $("#postText");
    if ($input.val() === "") {
        alert("Please enter text!");
    } else {
        app.addPost($input.val());
        $input.val("");
    }
});

var $posts = $(".posts");

$posts.on('click', '.remove-post', function () {
    var id = $(this).closest('.post').data().id;
    app.deletePost(id);
});

$posts.on('click', '.toggle-comments', function () {
    var $clickedPost = $(this).closest('.post');
    $clickedPost.find('.comments-container').toggleClass('show');
});

$posts.on('click', '.add-comment', function () {
    var $comment = $(this).siblings('.comment');
    var $user = $(this).siblings('.name');

    if ($comment.val() === "" || $user.val() === "") {
        alert("Please enter your name and a comment!");
        return;
    }

    var newComment = { text: $comment.val(), user: $user.val() };
    var postId = $(this).closest('.post').data().id;

    app.addComment(newComment, postId);

    $comment.val("");
    $user.val("");
});

$posts.on('click', '.remove-comment', function () {
    var postId = $(this).closest('.post').data().id;
    var commentId = $(this).closest('.comment').data().id;
    app.deleteComment(postId, commentId);
});