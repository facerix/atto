<?php
header('Server: Sorry Charlie');
header('X-Powered-By: Mountain Dew');
header('Content-type: application/json');


// -- data types to use in seeding the return payload --

$givenNames = array(
    "Jacob","Isabella","Ethan","Sophia","Michael","Emma","Jayden","Olivia","William","Ava",
    "Alexander","Emily","Noah","Abigail","Daniel","Madison","Aiden","Chloe","Anthony","Mia"
);
$surnames = array(
    "Smith","Johnson","Williams","Brown","Jones","Miller","Davis","Garcia","Rodriguez","Wilson",
    "Martinez","Anderson","Taylor","Thomas","Hernandez","Moore","Martin","Jackson","Thompson","White"
);
$gender = array("m","f");
$urls = array(
    "http://dojotoolkit.org",
    "http://dojoconf.com",
    "http://google.com",
    "http://yahoo.com",
    "http://bing.com",
    ""
);

function genRandomString($min, $max) {
    if ($min == null) { $min = 10; }
    if ($max == null) { $max = 50; }
    $length = mt_rand($min,$max);
    $characters = "0123456789abcdefghijklmnopqrstuvwxyz";
    for ($p = 0; $p < $length; $p++) {
        $string .= $characters[mt_rand(0, strlen($characters))];
    }
    return $string;
}
date_default_timezone_set("America/New_York");

// ---------- end of column data type values -----------

if (array_key_exists("count", $_REQUEST)) {
    $return = array();
    $count = $_REQUEST['count'];
    for ($i = 0; $i < $count; $i++) {
        $return[] = getPerson();
    }
} else {
    $return = getPerson();
}

// build the return payload
function getPerson() {
    global $givenNames, $surnames, $gender, $urls;
    $rnd = mt_rand(0,30000);
    $birthDay = strtotime("- $rnd days");
    return array(
        'first_name'=>$givenNames[$rnd % 20],
        'surname'=>$surnames[mt_rand(0,12000) % 20],
        'gender'=>$gender[mt_rand(0,1)],
        'randomString'=>genRandomString(5,15),
        'link'=>$urls[mt_rand(0,5)],
        'birthDate'=>date("Y/m/d", $birthDay)
    );
}

print json_encode($return);
