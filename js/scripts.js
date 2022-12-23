$(document).ready(function() {
    $("body").on("input", "#username-input", function() {
        input_value = $("#username-input").val();
        if (input_value != "") {
            $("#link-preview").attr("href", "https://github.com/" + $("#username-input").val());
            $("#link-preview").text("github.com/" + $("#username-input").val());
        } else {
            $("#link-preview").attr("href", "");
            $("#link-preview").text("");
        }
    });
})