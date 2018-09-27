$.getJSON("/scrape", function(data) {
    for(let i = 0; i < data.length; i++) {
        $('#scrapes').append("<p data-id='" + data[i]._id + ">" + data[i].title + "<br />" + "</p>");
    }
});
$(document).on("click", "p", function() {
    $('#notes').empty();
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "GET",
        url: "/scrapes/" + thisId
    })
    .then(function(data) {
        console.log(data) 
        $("#comments").append("<h2>" + data.title + "</h2>");
        $("#comments").append("<input id='titleinput' name='title' >");
        $("#comments").append("textarea id='bodyinput' name='body'></textarea>");
        $("#comments").append("button data-id='" + data._id + "' id='savecomment'>Save Comment</button>");

        if(data.comment) {
            $("#titleinput").val(data.comment.post);
            $("#bodyinput").val(data.comment.body);
        }
    });
});

$(document).on("click", "savecomment", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/scrapes/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("bodyinput").val()
        }
    })
        .then(function(data) {
            console.log(data);
            $("#commments").empty();
        });
    $("#titleinput").val("");
    $("#bodyinput").val("");
})