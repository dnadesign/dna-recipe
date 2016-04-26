<?php

global $project;
$project = 'app';

global $database;
$database = 'dna-dev';

require_once('conf/ConfigureFromEnv.php');

// Set the site locale
i18n::set_locale('en_US');
