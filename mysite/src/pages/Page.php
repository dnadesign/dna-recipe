<?php

use SilverStripe\CMS\Model\SiteTree;


class Page extends SiteTree
{
    private static $icon = 'mysite/images/icons/page.svg';

    private static $db = array(

    );

    private static $has_one = array(

    );



    public function getCMSFields() {
        $fields = parent::getCMSFields();



        return $fields;
    }
}
