<?php 

	function is_planet($planet){
		return isset($planet)
			&& (
				$planet == 'jupiter'
				|| $planet == 'mercury'
				|| $planet == 'mars'
				|| $planet == 'neptune'
				|| $planet == 'saturn'
				|| $planet == 'uranus'
				|| $planet == 'venus'
			);
	}

?>