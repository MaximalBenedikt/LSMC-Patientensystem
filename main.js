//USERVARIABLE!
var user = {};
var num_tabs = 0;

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
    $('#search').button().click(function() { searchPatient(); })
    $('#openadmin').button('disable')
    $('#newaction').button('disable')
}

//Neuen Tab Erstellen
function newTab(tabtitle) {
    num_tabs = num_tabs + 1;
    $("div#main #bodynavigator").append(
        "<li id='tabmain-" + num_tabs + "'><a href='#main-" + num_tabs + "' id='tabmain-" + num_tabs + "'>" + tabtitle + "</a><button id='closetabmain-" + num_tabs + "'>x</button></li>"
    );
    $("div#main").append(
        "<div id='main-" + num_tabs + "'>#" + num_tabs + "</div>"
    );
    $("#closetabmain-" + num_tabs).button().click(function(){
        if (confirm('Möchtest du diesen Tab wirklich schließen?')) {
            $($(this).siblings('a').attr('href')).remove();
            $(this).parent().remove();
            $("div#main").tabs("refresh");
        }
    })
    $("div#main").tabs("refresh");
    return "div#main-" + num_tabs;
}

//Patientenfunktionen!
//Suchen
function searchPatient(){
    name = $('#main-start').find('#name').val()
    $.ajax({
        type: "POST",
        url: 'data.php',
        data: {
            action:'searchPatient',
            name:name
        },
        success: function(data){
            patients = $.parseJSON(data)
            $('#main-start table tbody').html('')
            $.each(patients, function(index) {
                patient = patients[index]
                bday = patient['birthday'].split('-')
                if (patient['gender']=='man') {
                    gender = 'Männlich'
                } else {
                    gender = 'Weiblich'
                }
                birthday = bday[2] + '.' + bday[1] + '.' + bday[0]
                $('#main-start table tbody').append('<tr id="' + patient['identifier'] + '"></tr>')
                $('#main-start #' + patient['identifier']).append('<td>' + patient['surname'] + ', ' + patient['name'] + '</td>')
                $('#main-start #' + patient['identifier']).append('<td>' + birthday + '</td>')
                $('#main-start #' + patient['identifier']).append('<td>' + gender + '</td>')
                $('#main-start #' + patient['identifier']).click(function(){
                    openPatient($(this).attr('id'))
                })
            })
        },
    });
}

//Öffnen
function openPatient(id) {
    value = true
    $.each($('.patientidentifiers'),function(index){
        if ($('.patientidentifiers').eq(index).val() == id) {
            alert('Du hast diesen Patienten bereits offen!')
            value = false;
        }
    })
    if (value) {
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
        //Lade einen Eintrag
        if(id!='new'){
            $.ajax({
                type: "POST",
                url: 'data.php',
                data: {
                    action:'loadPatient',
                    id:id
                },
                success: function(data){
                    patient = $.parseJSON(data)
                    $.each(patient, function(index,value){
                        $(identifier + " #" + index).val(value);
                    })
                    $(identifier + " #identifier").prop("id", "patientsiteid" + patient['identifier'])
                    $(identifier + " #gender #" + patient['gender']).prop('selected', true)
                    $(identifier + " #bloodtype #" + patient['bloodtype']).prop('selected', true)
                    $(identifier + " #martialstatus #" + patient['martialstatus']).prop('selected', true)
                    $.each($.parseJSON(patient['addiction']), function(index, value){
                        $(identifier + " #addiction #" + value).prop('selected', true)
                    })
                    $('a#tab' + identifier.split('#')[1]).text(patient['surname'] + ", " + patient['name'])
                    $(identifier).find('#createtreatmentbutton').button('enable')
                    $(identifier).find('.minimum').attr('disabled', true)
                    updateTreatmentlists()
                },
            });
        }
    }
}

//Speichern
function savePatient(identifier) {
    //INFORMATIONSSAMMLER!
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
                updateTreatmentlists();
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
    } else {
        var tester=true;
        $.each($('ul a'),function (index, value) {
            if ($(value).text().split(' ')[1] == id) { tester = false }
        })
        if ( tester ) {
            identifier = newTab('Behandlung: ' + id)
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
                    $(identifier).find('#actionid').val( id );
                    $(identifier).find('#surname').val( user['surname'] );
                    $(identifier).find('#name').val( user['name'] );
                    $(identifier).find('#' + user['gender']).attr('selected', true)
                    $(identifier).find('#surname, #name, #gender').attr('disabled',true)
                }
            })
            $.ajax({
                type: "POST",
                url: 'data.php',
                data: {
                    action: 'loadTreatment',
                    treatment:id
                },
                success:function (data) {
                    treatment = $.parseJSON(data);
                    $(identifier).find('#symptoms').val( treatment['symptoms'] )
                    $(identifier).find('#medic').val( treatment['medic'] )
                    $(identifier).find('#assistingmedic').val( treatment['assistingmedic'] )
                    $(identifier).find('#diagnosis').val( treatment['diagnosis'] )
                    $(identifier).find('#treatment').val( treatment['treatment'] )
                    $(identifier).find('#drugs').val( treatment['drugs'] )
                    $(identifier).find('#datetime').val( treatment['datetime'] )
                    nu = date[2] + '.' + date[1] + '.' + date[0]
                    if (treatment['NU'] == '0000-00-00') {
                        nu = '/-/'
                    }
                    if (treatment['NU'] == '1970-01-01') {
                        nu = '/-/'
                    }
                    $(identifier).find('#NU').val( treatment['NU'] )
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
    //DATAGETTER
    var data = {};
    data['patient'] = $(identifier).find('#userid').val();
    data['datetime'] = $(identifier).find('#datetime').val();
    data['NU'] = $(identifier).find('#NU').val();
    data['symptoms'] = $(identifier).find('#symptoms').val();
    data['medic'] = $(identifier).find('#medic').val();
    if (data['medic'] == '') {
        alert('Kein Arzt eingetragen!');
        return;
    } else {
        data['medicid'] = data['medic'].split(' ')[0];
    }
    //data['injuries'] = $(identifier).find('.verletzungen input').prop('selected');
    data['assistingmedic'] = $(identifier).find('#assistingmedic').val();
    if (data['assistingmedic']!='') {
        data['assistingmedicid'] = data['assistingmedic'].split(' ')[0];
    }
    data['diagnosis'] = $(identifier).find('#diagnosis').val();
    data['treatment'] = $(identifier).find('#treatment').val();
    data['drugs'] = $(identifier).find('#drugs').val();
    actionid = $(identifier).find('input#actionid').val();
    //DATAGETTEREND
    $.ajax({
        type:'POST',
        url:"data.php",
        data:{
            action:'saveTreatment',
            treatment:data,
            id:actionid
        },
        success:function (data)  {
            $(identifier).find('input#actionid').val(data);
            updateTreatmentlists()
        }
    })
}

//Aktualisieren der Behandlungslisten (In den Patientenblättern)
function updateTreatmentlists() {
    $.each($('.patientidentifiers'),function(index,value){
        id = $(value).val()
        siteid = $(value).prop('id')
        if (id!='new') {
            insertpoint = $(value).parent().siblings('.treatmentsdata').find('.actionstable tbody')
            $(value).parent().siblings('.treatmentsdata').find('.actionstable tbody').html('')
            $.ajax({
                type:"POST",
                url:"data.php",
                data:{
                    action:'searchTreatments',
                    id:id,
                    siteid:siteid
                },
                success:function(data){
                    treatments = $.parseJSON(data)
                    insertpoint = $('#' + treatments[0]['siteid']).find('.actionstable tbody')
                    $.each(treatments,function(index,treatment){
                        date = treatment['NU'].split('-')
                        nu = date[2] + '.' + date[1] + '.' + date[0]
                        if (treatment['NU'] == '0000-00-00') {
                            nu = '/-/'
                        }
                        if (treatment['NU'] == '1970-01-01') {
                            nu = '/-/'
                        }
                        insert = '<tr id="' + treatment['id'] + '"><td>' + treatment['id'] + '</td><td>' + treatment['diagnosis'] + '</td><td>' + treatment['treatment'] + '</td><td>' + treatment['drugs'] + '</td><td>' + treatment['medic'] + '</td><td>' + nu + '</td></tr>'
                        $("#patientsiteid" + treatment['patient']).parent().parent().find('.actionstable tbody').append(insert)
                        $(insertpoint).find('#' + treatment['id']).click(function(){
                            openTreatment(id,$(this).attr('id'))
                        })
                    })
                }
            })
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
