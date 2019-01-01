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
/*
    if ($_POST['action'] == 'login') {
        # code...
    }*/