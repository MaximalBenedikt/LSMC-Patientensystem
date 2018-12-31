//USERVARIABLE!
var userauttoken;

//Initialisieren des Loginfensters
function openLoginWindow() {
    $('#login').tabs();
    $('#submit_login').button().click(function () {
        user = {};
        user['username'] = $('#login_username').val();
        user['password'] = $('#login_password').val();
        $('#loginwindow').dialog('destroy').remove();
    });
    $('#submit_register').button().click(function () {
    });
    $('#loginwindow').dialog({
        width:"auto",
        heigth:"auto",
        modal:true,
        dialogClass:'notCloseableDialog'
    });
};

//Initialisiere die Hauptseite
function siteloader() {
    $('#main').tabs();

}

//Neuen Tab Erstellen
function newTab(tabtitle) {
    var num_tabs = $("div#main ul li").length + 1;
    $("div#main ul").append(
        "<li><a href='#main-" + num_tabs + "'>" + tabtitle + "</a></li>"
    );
    $("div#main").append(
        "<div id='main-" + num_tabs + "'>#" + num_tabs + "</div>"
    );
    $("div#main").tabs("refresh");
    return "div#" + num_tabs;
}


//Functioncaller
$(function () {
    openLoginWindow();
    siteloader();
    $('#newtab').button().click(function() {
        id = newTab("Neuer Tab");
        console.log(id);
    })
})
