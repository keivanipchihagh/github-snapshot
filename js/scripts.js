// Shows a preview of the GitHub page link
function show_preview() {
    username = $("#username-input").val();
    github_page = (username != "") ? ("github.com/" + username) : "";
    github_page_url = (username != "") ? ("https://" + github_page) : "";

    document.getElementById("link-preview").innerText = github_page
    document.getElementById("link-preview").setAttribute("href", github_page_url);
}

// Sends a request to the GitHub API to retrieve the user data
function submit_username() {
    var xhttp = new XMLHttpRequest();
    username = document.getElementById("username-input").value
    url = "https://api.github.com/users/" + username;

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            document.getElementById("fullname").innerText = data["name"];
            document.getElementById("username").innerText = "@" + data["login"];
            document.getElementById("avatar").setAttribute("src", data["avatar_url"]);
            document.getElementById("bio").innerText = data["bio"];
            document.getElementById("blog").innerText = data["blog"];
            document.getElementById("location").innerText = data["location"];
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}
