<?php
    include('config.php');
    $pdo = new PDO( $config['dbhost'] , $config['dbuser'] , $config['dbpass'] );
    function encodeUTFarray($mixed) {
        if (is_array($mixed)) {
            foreach ($mixed as $key => $value) {
                $mixed[$key] = encodeUTFarray($value);
            }
        } else if (is_string ($mixed)) {
            return utf8_encode($mixed);
        }
        return $mixed;
    }
 
    function decodeUTFarray($mixed) {
        if (is_array($mixed)) {
            foreach ($mixed as $key => $value) {
                $mixed[$key] = decodeUTFarray($value);
            }
        } else if (is_string ($mixed)) {
            return utf8_decode($mixed);
        }
        return $mixed;
    }

    //Useractionen
    //Lädt alle Nutzer des Systems für Behandlungsakten und Adminbackend
    if ($_POST['action'] == 'loaduserslist') {
        $sql = "SELECT `id`, `dienstid`, `name`, `surname`, `training`, `username` FROM `users`";
        $statement = $pdo->prepare($sql);
        $statement->execute();
        $return = $statement->fetchAll();
        echo json_encode(encodeUTFarray($return));
        
    }


    //Patientenaktionen
    //Suchen
    if ($_POST['action'] == 'searchPatient') {
        $sql = "SELECT `name`,`surname`,`gender`,`identifier`,`birthday` FROM `patients` WHERE LOWER(`name`) LIKE LOWER('%" . $_POST['name'] . "%') OR LOWER(`surname`) LIKE LOWER('%" . $_POST['name'] . "%') ";
        $statement = $pdo->prepare($sql);
        $statement->execute();
        $return = $statement->fetchAll();
        echo json_encode(encodeUTFarray($return));
    }
    //Öffnen
    if ($_POST['action'] == 'loadPatient') {
        $sql = "SELECT * FROM `patients` WHERE `identifier` = " . $_POST['id'];
        $statement = $pdo->prepare($sql);
        $statement->execute();
        $return = $statement->fetch();
        echo json_encode(encodeUTFarray($return));
        //Hmmm was passiert wohl jetzt?
    }
    //Speichern
    if ($_POST['action'] == 'savepatient') {
        $patient = decodeUTFarray($_POST['patient']);

        $patient['birthday'] = date('Y-m-d', strtotime($patient['birthday']));        
        $sql = '';
        if ($_POST['id'] == 'new') {
            $vars = ""; $values = "";
            foreach ($patient as $key => $value) {
                $vars = $vars . '`' . $key . '`,';
                $values = $values . "'" . $value . "',";
            }
            $values = rtrim($values,',');
            $vars = rtrim($vars,',');
            $sql = 'INSERT INTO `patients`(' . $vars . ') VALUES (' . $values . ')';
        } else {
            $values ="";
            foreach ($patient as $key => $value) {
                $values = $values . "`" . $key . "`='" . $value . "',";
            }
            $values = rtrim($values,',');
            $sql = 'UPDATE `patients` SET ' . $values . ' WHERE `identifier` = ' . $_POST['id'] . '';
        }
        $statement = $pdo->prepare($sql);
        $statement->execute();
        $sql = "SELECT `identifier` FROM `patients` ORDER BY `identifier` DESC LIMIT 1";
        $statement = $pdo->prepare($sql);
        $statement->execute();
        $return = $statement->fetch();
        echo $return['identifier'];
    }
    //Suche alle Behandlungsakten einer Person
    if ($_POST['action'] == 'searchTreatments') {
        $sql = "SELECT `id`,`patient`,`diagnosis`,`treatment`,`drugs`,`medic`,`NU` FROM `protocols` WHERE `patient`=" . $_POST['id'] . " ORDER BY 'datetime' ";
        $statement = $pdo->prepare($sql);
        $statement->execute();
        $return = $statement->fetchAll();
        $return[0]['siteid']=$_POST['siteid'];
        echo json_encode(encodeUTFarray($return));
    }

    if ($_POST['action'] == 'loadTreatment') {
        $sql = "SELECT * FROM `protocols` WHERE `id`=" . $_POST['treatment'];
        $statement = $pdo->prepare($sql);
        $statement->execute();
        $return = $statement->fetch(); 
        $return['datetime'] = date("Y-m-d",strtotime($return['datetime'])) . 'T' . date("H:i:s",strtotime($return['datetime']));
        echo json_encode(encodeUTFarray($return));
    }
    //Laden der Daten für Neue Behandlung bei einer vorher ausgewählten Person!
    if ($_POST['action'] == 'loadnewtreatmentpatient') {
        $sql = "SELECT `name`,`surname`,`gender`,`identifier` FROM `patients` WHERE `identifier` = " . $_POST['id'];
        $statement = $pdo->prepare($sql);
        $statement->execute();
        $return = $statement->fetch();
        echo json_encode(encodeUTFarray($return));
    }
    //Behandlung speichern
    if ($_POST['action'] == 'saveTreatment') {
        $treatment = decodeUTFarray($_POST['treatment']);
        $treatment['datetime'] = date('Y-m-d H:i:s', strtotime($treatment['datetime']));
        $treatment['NU'] = date('Y-m-d H:i:s', strtotime($treatment['NU']));        
        $sql = '';
        if ($_POST['id'] == 'new') {
            $vars = ""; $values = "";
            foreach ($treatment as $key => $value) {
                $vars = $vars . '`' . $key . '`,';
                $values = $values . "'" . $value . "',";
            }
            $values = rtrim($values,',');
            $vars = rtrim($vars,',');
            $sql = 'INSERT INTO `protocols`(' . $vars . ') VALUES (' . $values . ')';
        } else {
            $values ="";
            foreach ($treatment as $key => $value) {
                $values = $values . "`" . $key . "`='" . $value . "',";
            }
            $values = rtrim($values,',');
            $sql = 'UPDATE `protocols` SET ' . $values . ' WHERE `id` = ' . $_POST['id'] . '';
        }
        $statement = $pdo->prepare($sql);
        $statement->execute();
        $returnid = $_POST['id'];
        if ($_POST['id'] == 'new') {
            $sql = "SELECT `id` FROM `protocols` ORDER BY `id` DESC LIMIT 1";
            $statement = $pdo->prepare($sql);
            $statement->execute();
            $return = $statement->fetch();
            $returnid = $return['id'];
        }
        echo $returnid;
    }