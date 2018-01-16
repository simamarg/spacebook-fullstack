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

    function addPost(newPost) {
        $.post('posts', { text: newPost }, function(data) { fetch(); });
    }

    var removePost = function (id) {
        var url = 'posts/' + id;
        console.log(url);
        $.ajax({
            method: "DELETE",
            url: url,
            success: function (data) {
                console.log(data);
                fetch();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    };

    var addComment = function (newComment, postId) {
        var url = 'posts/' + postId + '/comments';
        $.ajax({
            method: "POST",
            url: url,
            data: newComment,
            success: function (data) {
                console.log(data);
                fetch();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    };


    var deleteComment = function (postId, commentId) {
        var url = 'posts/' + postId + '/comments/' + commentId;
        console.log(url);
        $.ajax({
            method: "DELETE",
            url: url,
            success: function (data) {
                console.log(data);
                fetch();
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
        removePost: removePost,
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
    app.removePost(id);
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