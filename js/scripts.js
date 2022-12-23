// Shows a preview of the GitHub page link
function show_preview() {
    username = $("#username-input").val();
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
        data = retrieve_from_github(username);
        console.log("Retrieved " + username + "'s data from GitHub.")
        save_to_local(data);
    }
    update_interface(data);
}

// Retrieve the user data from the GitHub API
function retrieve_from_github(username) {
    response = httpRequest("https://api.github.com/users/" + username, "GET")
    if (response.status == 200) {
        data = JSON.parse(response.responseText)
        console.log(data);
        return data
    }
    console.log("Error: " + response.status + " " + response.statusText);
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
    document.getElementById("avatar").setAttribute("src", data["avatar_url"]);
    document.getElementById("bio").innerText = data["bio"];
    document.getElementById("blog").innerText = data["blog"];
    document.getElementById("location").innerText = data["location"];
    console.log("Updated the page objects with " + data["login"] + "'s data.")
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