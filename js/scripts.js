$(document).ready(function() {

    // Show a preview of the actual GitHub link and a hyperlink to it
    $("body").on("input", "#username-input", function() {

        username = $("#username-input").val();
        github_page = (username != "") ? ("github.com/" + username) : "";
        github_page_url = (username != "") ? ("https://" + github_page) : "";

        $("#link-preview").text(github_page);
        $("#link-preview").attr("href", github_page_url);
    });

    // Submit the form and retrieve the GitHub user data
    $("#submit").click(function() {
        $.ajax({
            url: "https://api.github.com/users/" + $("#username-input").val(),
            type: "GET",
            dataType: "jsonp",  // JSONP is required to avoid CORS
            headers: {
                "accept": "application/json",
                "Access-Control-Allow-Origin": "x-requested-with",  // CORS header
            },
            success: function(response) {
                data = response["data"]
                avatar_url = data["avatar_url"]
                bio = data["bio"]
                blog = data["blog"]
                company = data["company"]
                followers = data["followers"]
                followings = data["following"]
                location = data["location"]
                name = data["name"]
                public_repos = data["public_repos"]
            },
            error: function(response) {
                alert(response);
            }
        });
    });
})