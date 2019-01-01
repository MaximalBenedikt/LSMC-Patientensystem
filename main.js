//USERVARIABLE!
var user = {};

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
    //Buttons aktivieren
    $('#newpatient').button().click(function() { openPatient('new'); })
    $('#newaction').button().click(function() { openTreatment('new'); })
    $('#openadmin').button().click(function() { openAdmin(); })
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
    return "div#main-" + num_tabs;
}

function openPatient(id) {
    /* Hier Informationsgetter hinzufügen */
    identifier = newTab('Neuer Patient')
    $.post("sites/patient.html", 
        function(data, status){
            $(identifier).html(data);
        }
    )
}

function openTreatment(id) {
    /* Hier Informationsgetter hinzufügen */
    identifier = newTab('Neue Behandlung')
    $.post("sites/protokoll.html", 
        function(data, status){
            $(identifier).html(data);
        }
    )
}

function openAdmin() {
    if (user['admin'] == false) {
        alert('Du hast keine Adminberechtigung!')
        return false
    } 
    identifier = newTab('ADMIN Seite');
    $(identifier).addClass('adminfullscreen');
    $.post("sites/admin.html", 
        function(data, status){
            $(identifier).html(data);
            $('#admin').tabs();
        }
    )
    $.ajax({
        url:"data.php",
        method:'POST',
        data:{
            action:"loaduserslist"
        },
        success:function(data){
            $('#userinsert').html('');
            users = $.parseJSON(data);
            $.each(users,function(index){
                user = users[index];
                $('#userinsert').append('<tr id="user' + user['id'] + '"></tr>');
                $('#user' + user['id']).append('<td>' + user['dienstid'] + '</td>');
                $('#user' + user['id']).append('<td>' + user['surname'] + ', ' + user['name'] + '</td>');
                $('#user' + user['id']).append('<td>' + user['training'] + '</td>');
                $('#user' + user['id']).append('<td>' + user['username'] + '</td>');
                $('#user' + user['id']).click(
                    function () {
                        console.log($(this).prop('id'));
                    }
                )
            })
        }
    })
}


//Functioncaller
$(function () {
    openLoginWindow();
    //DEBUGFUNKTION!!!
    $('#loginwindow').dialog('destroy').remove();
    //DEBUG ENDE!!!
    siteloader();
})
