<?php
    $pdo = new PDO('mysql:host=localhost;dbname=lsmc_db', 'root', '');

    function utf8ize($mixed) {
        if (is_array($mixed)) {
            foreach ($mixed as $key => $value) {
                $mixed[$key] = utf8ize($value);
            }
        } else if (is_string ($mixed)) {
            return utf8_encode($mixed);
        }
        return $mixed;
    }

    //Useractionen
    if ($_POST['action'] == 'loaduserslist') {
        $sql = "SELECT `id`, `dienstid`, `name`, `surname`, `training`, `username` FROM `users`";
        $statement = $pdo->prepare($sql);
        $statement->execute();
        $return = $statement->fetchAll();
        echo json_encode(utf8ize($return));
        
    }


    //Patientenaktionen
    //Speichern
    if ($_POST['action'] == 'savepatient') {
        $patient = $_POST['patient'];
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


    //Laden der Daten für Neue Behandlung bei einer vorher ausgewählten Person!
    if ($_POST['action'] == 'loadnewtreatmentpatient') {
        $sql = "SELECT `name`,`surname`,`gender`,`identifier` FROM `patients` WHERE `identifier` = " . $_POST['id'];
        $statement = $pdo->prepare($sql);
        $statement->execute();
        $return = $statement->fetch();
        echo json_encode(utf8ize($return));
    }

    if ($_POST['action'] == 'saveTreatment') {
        $treatment = $_POST['treatment'];
        echo "test";
        $treatment['datetime'] = date('Y-m-d H:i:s', strtotime($treatment['datetime']));        
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
        echo $sql;
        $statement = $pdo->prepare($sql);
        $statement->execute();
        /*$sql = "SELECT `identifier` FROM `protocols` ORDER BY `id` DESC LIMIT 1";
        $statement = $pdo->prepare($sql);
        $statement->execute();
        $return = $statement->fetch();
        echo $return['identifier'];*/
    }




    //Laden für Auswahl (Startseite)
    if ($_POST['action'] == 'savpatient') {
        $sql = "SELECT `identifier` FROM `patients` ORDER BY `identifier` DESC LIMIT 25";
        $statement = $pdo->prepare($sql);
        $statement->execute();
        $return = $statement->fetch();
        echo json_encode(utf8ize($return));
    }