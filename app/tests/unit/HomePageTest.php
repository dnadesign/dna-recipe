<?php

class HomePageTest extends SapphireTest
{
	public function setUpOnce()
	{
		parent::setUpOnce();
	}

	public function testInstantiation()
	{
		$page = new HomePage(array(
			'Title' => 'Home'
		));
		$page->write();
		$page->publish('Stage', 'Live');

		$this->assertGreaterThan(0, $page->ID);
		$this->assertEquals('Home', $page->Title);
	}
}
