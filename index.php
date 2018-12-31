<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Page Title</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" type="text/css" media="screen" href="main.css" />
        <link rel="stylesheet" type="text/css" media="screen" href="jquery/jquery-ui.min.css" />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
        <script src="jquery/jquery-ui.min.js"></script>
        <script src="main.js"></script>
    </head>
    <body>
        <div id="loginwindow" title="Patientensystem">
            <div id="login">
                <ul>
                    <li><a href="#login-1">Login</a></li>
                    <li><a href="#login-2">Registrieren</a></li>
                </ul>
                <div id='login-1'>
                    <table>
                        <tr>
                            <td>Nutzername:</td>
                            <td><input id="login_username" /></td>
                        </tr>
                        <tr>
                            <td>Passwort:</td>
                            <td><input id="login_passwort" type="password" /></td>
                        </tr>
                        <tr>
                            <td colspan="2"><button id="submit_login" type="button">Anmelden</button></td>
                        </tr>
                    </table>
                </div>
                <div id='login-2'>
                    <table>
                        <tr>
                            <td>Nutzername:</td>
                            <td><input id="register_username" /></td>
                        </tr>
                        <tr>
                            <td>Passwort:</td>
                            <td><input id="register_passwort" type="password" /></td>
                        </tr>
                        <tr>
                            <td colspan="2"><button id="submit_register" type="button">Registrieren</button></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </body>
</html>