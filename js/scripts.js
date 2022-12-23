// Shows a preview of the GitHub page link
function show_preview() {
    username = document.getElementById("username-input").value
    github_page = (username != "") ? ("github.com/" + username) : "";
    github_page_url = (username != "") ? ("https://" + github_page) : "";
    document.getElementById("link-preview").innerText = github_page
    document.getElementById("link-preview").setAttribute("href", github_page_url);
}

// Updates the interface from either LocalStorage or the GitHub API
function submit_username() {
    username = document.getElementById("username-input").value
    var data;
    if (username_exists_in_local(username)) {
        data = read_from_local(username)
        console.log("Retrieved " + username + "'s data from LocalStorage.")
    } else {
        data = retrieve_user_data_from_github(username);
        if (!data) return;
        respos = retrieve_user_repos_from_github(username);
        data["lanauge"] = get_favorite_language(respos);    // Favorite language
        console.log("Retrieved " + username + "'s data from GitHub.")
        save_to_local(data);
    }
    update_interface(data);
    document.getElementById("username-input").value = "";
    document.getElementById("link-preview").innerText = "";
}

// Retrieve the user data from the GitHub API
function retrieve_user_data_from_github(username) {
    response = httpRequest("https://api.github.com/users/" + username, "GET")
    if (response.status == 200) {
        data = JSON.parse(response.responseText)
        console.log(data);
        return data
    } else {
        show_err("Hmmm... Username doesn't seem to exist!");
        console.log("Error: " + response.status + " " + response.statusText);
    }
}

// Retrieve the user repositories from the GitHub API
function retrieve_user_repos_from_github(username) {
    response = httpRequest("https://api.github.com/users/" + username + "/repos", "GET")
    if (response.status == 200) {
        data = JSON.parse(response.responseText)
        console.log(data);
        return data
    } else {
        show_err("Woops! Something went wrong while reading repostories!");
        console.log("Error: " + response.status + " " + response.statusText);
    }
}

// Sends an HTTP request to the given address and waits for a response
function httpRequest(address, reqType, asyncProc) {
    var req = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    if (asyncProc) { 
      req.onreadystatechange = function() { 
        if (this.readyState == 4) {
          asyncProc(this);
        } 
      };
    }
    req.open(reqType, address, !(!asyncProc));
    req.send();
    console.log("Sent " + reqType + " request to " + address + " (Status" + req.status + ")")
    return req;
}

// Update the page objects with the given user data
function update_interface(data) {
    document.getElementById("fullname").innerText = data["name"];
    document.getElementById("username").innerText = "@" + data["login"];

    if (data["avatar_url"])
        document.getElementById("avatar").setAttribute("src", data["avatar_url"]);
    else
        document.getElementById("avatar").setAttribute("src", "images/octocat.png");

    if (data["bio"])
        document.getElementById("bio").innerText = data["bio"];
    else
        document.getElementById("bio").innerText = "This user is too shy (:";

    if (data["blog"]) {
        document.getElementById("blog").innerText = data["blog"];
    } else
        document.getElementById("blog").innerText = "";

    if (data["location"])
        document.getElementById("location").innerHTML = 'Location: <span id="location-span" style="text-decoration: underline;">' + data["location"] + '</span>'
    else
        document.getElementById("location").innerText = "";

    if (data["lanauge"])
        document.getElementById("language").innerText = "Killer Language: " + data["lanauge"];
    else
        document.getElementById("language").innerText = ""

    console.log("Updated the page objects with " + data["login"] + "'s data.")
}

function get_favorite_language(repos) {

    if (repos.length == 0)
        return

    // Select 5 most recently pushed repos
    repos = repos.sort((a, b) => Date(b.pushed_at) - Date(a.pushed_at)).slice(0, 5)
    console.log(repos)

    // Calculate popularity dictionary
    lanauge_popularity = {}
    for (var i = 0; i < repos.length; i++) {
        if (repos[i]["language"] in lanauge_popularity)
            lanauge_popularity[repos[i]["language"]] += 1;
        else
            lanauge_popularity[repos[i]["language"]] = 1;
    }
    console.log(lanauge_popularity)

    // Get the most popular language
    return Object.keys(lanauge_popularity).reduce(function(a, b){ return lanauge_popularity[a] > lanauge_popularity[b] ? a : b });
}

// Stores the given user data to LocalStorage
function save_to_local(data) {
    localStorage.setItem(data["login"], JSON.stringify(data));
    console.log("Saved " + data["login"] + "'s data to LocalStorage.")
}

// Checks if the given username exists in LocalStorage
function username_exists_in_local(username) {
    return localStorage.getItem(username) != null
}

// Reads the user data from LocalStorage
function read_from_local(username) {
    return JSON.parse(localStorage.getItem(username))
}

// Shows an error message on the alert box
function show_err(message) {
    document.getElementById("alert").innerText = message;
    document.getElementById("alert").style.opacity = '1';
    setTimeout(function(){document.getElementById("alert").style.opacity = '0'}, 2000);
}