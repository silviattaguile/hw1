<?php 
/*******************************************************
    Ritorna un JSON con i risultati dell'API selezionata
********************************************************/
require_once 'auth.php';

// Se la sessione è scaduta, esco
if (!checkAuth()) exit;

// Imposto l'header della risposta
header('Content-Type: application/json');

// A seconda del tipo scelto, eseguo una funzione diversa
switch($_GET['type']) {
    
    case 'spotify': spotify(); break;
    case 'books': books(); break;
    default: break;
}



function books()
{
            $query = urlencode($_GET["q"]);
            $curl=curl_init();
            curl_setopt($curl,CURLOPT_URL,"http://openlibrary.org/search.json?title=".$query);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER,1);
            $result=curl_exec($curl);
            curl_close($curl);
            echo $result;
}

function spotify() {
    $client_id = '9d4373c068a5430db42cd17b952ab6fd'; 
    $client_secret = '1c19b5dfe98645379f2e30c16e37f429'; 

    // ACCESS TOKEN
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://accounts.spotify.com/api/token' );
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    # Eseguo la POST
    curl_setopt($ch, CURLOPT_POST, 1);
    # Setto body e header della POST
    curl_setopt($ch, CURLOPT_POSTFIELDS, 'grant_type=client_credentials'); 
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Authorization: Basic '.base64_encode($client_id.':'.$client_secret))); 
    $token=json_decode(curl_exec($ch), true);
    curl_close($ch);    

    // QUERY EFFETTIVA
    $query = urlencode($_GET["q"]);
    $url = 'https://api.spotify.com/v1/search?type=track&q='.$query;
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    # Imposto il token
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Authorization: Bearer '.$token['access_token'])); 
    $res=curl_exec($ch);
    curl_close($ch);

    echo $res;
}




?>
