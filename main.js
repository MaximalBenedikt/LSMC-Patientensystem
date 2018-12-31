//Initialisieren des Loginfensters
function openLoginWindow() {
    $('#loginwindow').dialog({
        width:"auto",
        heigth:"auto",
    });
    $('#login').tabs();
};





//Functioncaller
$(function () {
    openLoginWindow();
})
