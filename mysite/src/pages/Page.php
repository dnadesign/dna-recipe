<?php

use SilverStripe\CMS\Model\SiteTree;
use SilverStripe\Forms\TextField;


class Page extends SiteTree
{
    private static $db = array(

    );

    private static $has_one = array(

    );

    public function getCMSFields() {
        $fields = parent::getCMSFields();

        // $fields->addFieldToTab('Root.Main', TextField::create());

        return $fields;
    }
}
