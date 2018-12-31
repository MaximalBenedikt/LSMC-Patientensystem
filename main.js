//Initialisieren des Loginfensters
function openLoginWindow() {
    $('#loginwindow').dialog({
        width:"auto",
        heigth:"auto",
        modal:true,
    });
    $('#login').tabs();
};

//Initialisiere die Hauptseite
function siteloader() {
    $('#main').tabs({

    });
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
    siteloader();
    openLoginWindow();
    $('#newtab').button().click(function() {
        newTab("Neuer Tab");
    })
})
