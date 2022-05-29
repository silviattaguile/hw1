<?php
    /*******************************************************
        Inserisce nel database il post da pubblicare 
    ********************************************************/

# SPOTIFY   9d4373c068a5430db42cd17b952ab6fd    1c19b5dfe98645379f2e30c16e37f429

# OPENLIBRARY     


    require_once 'auth.php';
    if (!$userid = checkAuth()) exit;

    switch($_POST['type']) {
        case 'book': book(); break;
        case 'spotify': spotify(); break;
        
        default: break;
    }

    function spotify() {
        GLOBAL $dbconfig, $userid;

        $conn = mysqli_connect($dbconfig['host'], $dbconfig['user'], $dbconfig['password'], $dbconfig['name']);
        
        # Costruisco la query
        $userid = mysqli_real_escape_string($conn, $userid);
        $type = mysqli_real_escape_string($conn, $_POST['type']);
        $id = mysqli_real_escape_string($conn, $_POST['id']);
        $text = mysqli_real_escape_string($conn, $_POST['text']);

        # Eseguo
        $query = "INSERT INTO posts(user, content) VALUES('.$userid.', JSON_OBJECT('type', '$type', 'text', '$text', 'id', '$id'))";

        # Se corretta, ritorna un JSON con {ok: true}
        if(mysqli_query($conn, $query) or die(mysqli_error($conn))) {
            echo json_encode(array('ok' => true));
            exit;
        }

        mysqli_close($conn);
        echo json_encode(array('ok' => false));
    }


    /*function book() {
        GLOBAL $dbconfig, $userid;

        $url = 'http://covers.openlibrary.org/b/isbn/' + isbn + '-M.jpg';
        $data =  file_get_contents($url);
        $json = json_decode($data, true);

        if($json['meta']['status'] == 200) {
            $conn = mysqli_connect($dbconfig['host'], $dbconfig['user'], $dbconfig['password'], $dbconfig['name']);
            
            $userid = mysqli_real_escape_string($conn, $userid);
            $type = mysqli_real_escape_string($conn, $_POST['type']);
            $id = mysqli_real_escape_string($conn, $_POST['id']);
            $text = mysqli_real_escape_string($conn, $_POST['text']);
            $url = mysqli_real_escape_string($conn, $json['data']['images']['original']['url']);

            $query = "INSERT INTO posts(user, content) VALUES('.$userid.', JSON_OBJECT('type', '$type', 'text', '$text', 'id', '$id', 'url', '$url'))";

            if(mysqli_query($conn, $query) or die(mysqli_error($conn))) {
                echo json_encode(array('ok' => true));
                exit;
            }
            
        }

        echo json_encode(array('ok' => false));
    }*/

    function text() {
        GLOBAL $dbconfig, $userid;
        if (!empty($_POST['text'])) {

            $conn = mysqli_connect($dbconfig['host'], $dbconfig['user'], $dbconfig['password'], $dbconfig['name']);
            
            $userid = mysqli_real_escape_string($conn, $userid);
            $type = mysqli_real_escape_string($conn, $_POST['type']);
            $text = mysqli_real_escape_string($conn, $_POST['text']);

            $query = "INSERT INTO posts(user, content) VALUES('.$userid.', JSON_OBJECT('type', '$type', 'text', '$text'))";
            
            if(mysqli_query($conn, $query)) {
                echo json_encode(array('ok' => true));
                exit;
            }
        }
            
        echo json_encode(array('ok' => false));
    }
    


    


?>
