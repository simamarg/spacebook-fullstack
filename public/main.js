var SpacebookApp = function () {

    var posts = [];

    var $posts = $(".posts");

    _renderPosts();

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
        // posts.push({ text: newPost, comments: [] });
        // _renderPosts();
        $.post('posts', { text: newPost });
        fetch();
    }

    var removePost = function (id) {
        // posts.splice(index, 1);
        // _renderPosts();
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

    var addComment = function (newComment, postIndex) {
        posts[postIndex].comments.push(newComment);
        _renderComments(postIndex);
    };


    var deleteComment = function (postIndex, commentIndex) {
        posts[postIndex].comments.splice(commentIndex, 1);
        _renderComments(postIndex);
    };

    function _renderPosts() {
        $posts.empty();
        var source = $('#post-template').html();
        var template = Handlebars.compile(source);
        for (var i = 0; i < posts.length; i++) {
            var newHTML = template(posts[i]);
            // console.log(newHTML);
            $posts.append(newHTML);
            _renderComments(i);
        }
    }

    function _renderComments(postIndex) {
        var post = $('.post')[postIndex];
        $commentsList = $(post).find('.comments-list')
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
        fetch: fetch,
        posts: posts
    };
};

var app = SpacebookApp();

app.fetch();

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
    $clickedPost.find('.add-comment-form').toggleClass('show');
});

$posts.on('click', '.add-comment', function () {

    var $comment = $(this).siblings('.comment');
    var $user = $(this).siblings('.name');

    if ($comment.val() === "" || $user.val() === "") {
        alert("Please enter your name and a comment!");
        return;
    }

    var postIndex = $(this).closest('.post').index();
    var newComment = { text: $comment.val(), user: $user.val() };

    app.addComment(newComment, postIndex);

    $comment.val("");
    $user.val("");

});

$posts.on('click', '.remove-comment', function () {
    var $commentsList = $(this).closest('.post').find('.comments-list');
    var postIndex = $(this).closest('.post').index();
    var commentIndex = $(this).closest('.comment').index();

    app.deleteComment(postIndex, commentIndex);
});