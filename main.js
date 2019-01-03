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
    $('#newaction').button().click(function() { openTreatment(0,'new'); })
    $('#openadmin').button().click(function() { openAdmin(); })
}

//Neuen Tab Erstellen
function newTab(tabtitle) {
    var num_tabs = $("div#main ul li").length + 1;
    $("div#main #bodynavigator").append(
        "<li><a href='#main-" + num_tabs + "' id='tabmain-" + num_tabs + "'>" + tabtitle + "</a></li>"
    );
    $("div#main").append(
        "<div id='main-" + num_tabs + "'>#" + num_tabs + "</div>"
    );
    $("div#main").tabs("refresh");
    return "div#main-" + num_tabs;
}

//Patientenfunktionen!
//Suchen
function searchPatient(){
    
}
//Öffnen
function openPatient(id) {
    /* Hier Informationsgetter hinzufügen */
    identifier = newTab('Neuer Patient')
    $.post("sites/patient.html", 
        function(data, status){
            $(identifier).html(data);
            $(identifier).find('#savebutton').button().click(function(){
                savePatient( "#" + $(this).parents('.patientsdata').parent().attr('id'))
            })
            $(identifier).find('#createtreatmentbutton').button().click(function(){
                openTreatment($(this).parents('table').parent().find('#identifier').val(),"new")
            })
            $(identifier).find('#createtreatmentbutton').button('disable')
        }
    );
    //LADEFUNKTION!!!
    if(id!='new'){
        $.post("data.php", 
            function(data, status){
                patient = $.parseJSON(data);
                patient.each(function(data){

                })
            }
        )
        $(identifier).find('.minimum').attr('disabled', true)
    }
    
}

//Speichern
function savePatient(identifier) {
    var patient = {};
    $.each($(identifier).find('.table_patientsdata').find('input'),
        function (index){
            patient[$(identifier).find('.table_patientsdata').find('input:eq(' + index + ')').attr('id')]=$(identifier).find('.table_patientsdata').find('input:eq(' + index + ')').val()
        }
    );
    if (patient['name'] == "" || patient['surname'] == "" || patient['gender'] == "" || patient['birthday'] == "") {
        alert('Diese Felder müssen Mindestens Ausgefüllt sein!');
        $(identifier).find('.minimum').css('background-color', 'red');
        return;
    } else {
        $(identifier).find('.minimum').css('background-color', '');
    }
    var addictions = {}
    $.each($(identifier).find('#addiction option:selected'),
        function (index){
            addictions[index]=$(identifier).find('#addiction option:selected:eq(' + index + ')').attr('id')
        }
    );
    patient['addiction'] = JSON.stringify(addictions)
    patient['gender']=$(identifier).find('#gender option:selected').attr('id');
    patient['martialstatus']=$(identifier).find('#martialstatus option:selected').attr('id');
    patient['bloodtype']=$(identifier).find('#bloodtype option:selected').attr('id');
    patient['notes']=$(identifier).find('#notes').val();
    patient['emergencycontacts']=$(identifier).find('#emergencycontacts').val();
    id=$(identifier).find('#identifier').val();
    $.ajax({
        type: "POST",
        url: 'data.php',
        data: {
            action:'savepatient',
            patient:patient, 
            id:id
        },
        success: function(data){
            if (id=='new') {
                $(identifier).find('#identifier').val(data);
                $(identifier).find('.minimum').attr('disabled', true)
                $(identifier).find('#createtreatmentbutton').button('enable')
                $('a#tab' + identifier.split('#')[1]).text(patient['surname'] + ", " + patient['name'])
            }
        },
    });
}

//Löschen


//BEHANDLUNGEN
//ÖFFNEN
function openTreatment(userid, id) {
    var identifier = "";
    /* Hier Informationsgetter hinzufügen */
    if (id=='new') {
        identifier = newTab('Neue Behandlung')
        $.ajax({
            type:"POST",
            url:"sites/protokoll.html",
            success:function(data, status){
                $(identifier).html(data);
                $(identifier).find('#savebutton').button().click(function(){
                    saveTreatment($(this).parents('.behandlungsprotokoll').find('#userid').val(),$(this).parents('.behandlungsprotokoll').find('#actionid').val(),$(this).parents('.behandlungsprotokoll').parent())
                })
            }
        })
        if (userid != 0) {
            $.ajax({
                type: "POST",
                url: 'data.php',
                data: {
                    action: 'loadnewtreatmentpatient',
                    id:userid
                },
                success:function (data) {
                    user = $.parseJSON(data);
                    $(identifier).find('#userid').val( user['identifier'] );
                    $(identifier).find('#actionid').val( 'new' );
                    $(identifier).find('#surname').val( user['surname'] );
                    $(identifier).find('#name').val( user['name'] );
                    $(identifier).find('#' + user['gender']).attr('selected', true)
                    $(identifier).find('#surname, #name, #gender').attr('disabled',true)
                }
            })
        }
    }
    //Lädt die 2 Ärztelisten
    $.ajax({
        url:"data.php",
        method:'POST',
        data:{
            action:"loaduserslist"
        },
        success:function(data){
            users = $.parseJSON(data);
            $.each(users,function(index){
                user = users[index];
                $(identifier + " #doc, #assi").append('<option value="' + user['dienstid'] + ' | ' + user['surname'] + ', ' + user['name'] + '">' + user['training'] + '</option>');
            })
        }
    })
    $(identifier).find('#userid').val(userid)
    $(identifier).find('#actionid').val(id)
}

//Speichern
function saveTreatment(userid, actionid, identifier) {
    var data = {};
    data['patient'] = $(identifier).find('#userid').val();
    data['datetime'] = $(identifier).find('#datetime').val();
    data['symptoms'] = $(identifier).find('#symptoms').val();
    data['medic'] = $(identifier).find('#medic').val();
    if (data['medic'] == '') {
        alert('Kein Arzt eingetragen!');
        return;
    } else {
        data['medic'] = data['medic'].split(' ')[0];
    }
    //data['injuries'] = $(identifier).find('.verletzungen input').prop('selected');
    data['assistingmedic'] = $(identifier).find('#assistingmedic').val();
    if (data['assistingmedic']!='') {
        data['assistingmedic'] = data['assistingmedic'].split(' ')[0];
    }
    data['diagnosis'] = $(identifier).find('#diagnosis').val();
    data['treatment'] = $(identifier).find('#treatment').val();
    data['drugs'] = $(identifier).find('#drugs').val();
    actionid = $(identifier).find('input#actionid').val();
    $.ajax({
        type:'POST',
        url:"data.php",
        data:{
            action:'saveTreatment',
            treatment:data,
            id:actionid
        },
        success:function (data)  {
            console.log(data)
        }
    })
}


//ADMINFUNKTIONEN!
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
                        openUserEdit($(this).prop('id'));
                    }
                )
            })
        }
    })
}

//Einzelnes Userfenster öffnen
function openUserEdit(userid) {
    
}

//Functioncaller
$(function () {
    openLoginWindow();
    //DEBUGFUNKTION!!!
    $('#loginwindow').dialog('destroy').remove();
    //DEBUG ENDE!!!
    siteloader();
})
