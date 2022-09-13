<?php

namespace Blocks\UPASDNtp;

use Blocks\Block;
use Extended\RemoteData;

/**
 * Class UPASDNtp
 * @package Blocks\UPASDNtp
 */
class UPASDNtp extends Block {

	public function __construct() {
		// Set block settings
		parent::__construct([
			'title' 	  => __('UPASD - Novo Tempo Portugal', 'iasd'),
			'description' => __('Novo Tempo Portugal content block.', 'iasd'),
			'category' 	  => 'pa-adventista',
			'keywords' 	  => ['feliz', '7', 'seven', 'play'],
			'icon' 		  => '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 92.3 64.7" style="enable-background:new 0 0 92.3 64.7" xml:space="preserve">
			<path class="st0" d="M66.4 15.5C58.9 25 50.5 36 47.7 38.9 50.5 36 58.9 25 66.4 15.5zM66.9 14.9c.7-.9 1.4-1.8 2.1-2.6-.7.8-1.4 1.7-2.1 2.6zM49.4 30.4c-.1 0-.2 0-.3.1.1-.1.2-.1.3-.1zM38.9 28.2c-2.5-2.1-4.1-5.3-4.1-8.8 0-6.3 5-11.4 11.3-11.4 6.2 0 11.3 5.1 11.3 11.5 0-6.3-5-11.4-11.2-11.5-6.2 0-11.3 5.1-11.3 11.4-.1 3.6 1.5 6.7 4 8.8zM24.1 28.6c3 4.4 5.8 9.3 6.7 13.3.2 1.1.5 2.1.7 3.1-.2-1-.4-2-.7-3.1-1-4-3.7-8.9-6.7-13.3zM14.8 17.1c-.5-.5-.9-1.3-.7-1.7-.2.4.2 1.2.7 1.7.6.6 4.8 5.2 8.7 10.8-3.9-5.6-8.1-10.2-8.7-10.8zM17.4 15.8c4.2 2.1 8.1 4.7 11.5 7.3-3.5-2.6-7.3-5.2-11.5-7.3-2-1-2.9-1-3.2-.5.2-.4 1.1-.5 3.2.5z"/>
			<path class="st1" d="M12 59.7s1.3 6.1 6.9 4.8l12.9-3.8.1-.7c.6-8 .2-11.5-.5-15-.2-1-.4-2-.7-3.1-.9-4.1-3.7-9-6.7-13.3-.2-.2-.3-.5-.5-.7-4-5.6-8.1-10.2-8.8-10.8-.5-.5-.9-1.3-.7-1.7.3-.5 1.2-.5 3.2.5 4.2 2.1 8.1 4.7 11.5 7.3.9.7 1.7 1.3 2.5 2 8.9 7.3 14.6 14.5 15.3 14.5.2 0 .5-.3.9-.7 3.1-3 11.5-14 19-23.5.2-.2.3-.4.4-.6.7-.9 1.4-1.8 2.1-2.6 3.2-3.9 6-7.4 8.1-9.5.5-.5.9-.9 1.3-1.2C77.3.7 75.9 0 74 0H4.6S-1.1-.3.2 5.8L12 59.7zM46.1 8c6.2 0 11.3 5.1 11.3 11.5 0 5.1-3.3 9.5-8 10.9-.1 0-.2 0-.3.1-1 .3-2 .4-3 .4-2.7 0-5.2-1-7.2-2.6-2.5-2.1-4.1-5.3-4.1-8.8 0-6.4 5-11.5 11.3-11.5zM76 13.1c-7.6 15.6-12.2 27-13.1 38.5l25.3-7.5s5.6-1.2 3.8-7.2L81.5 6.2s-.3-1-1-2.3c-1.6 3.3-3.1 6.3-4.5 9.2z"/>
		  </svg>',
		]);
	}

	/**
	 * setFields Register ACF fields with WordPlate/Acf lib
	 *
	 * @return array Fields array
	 */
	protected function setFields(): array {

		$api = "https://". API_NTP ."/v1/episodes?wp=true";

		return [
			RemoteData::make(__('Itens', 'iasd'), 'items')
				->endpoints( [
					$api
					// 'https://api.feliz7play.com/v4/pt/pa-blocks'
				])
				->searchFilter(false)
				->canSticky(false)
				->manualItems(false)
				->filterFields(false)
				->limitFilter(false),			
		];
	}

	/**
	 * with Inject fields values into template
	 *
	 * @return array
	 */
	public function with(): array {
		return [
			'items'	=> get_field('items')['data'],
		];
	}
}
