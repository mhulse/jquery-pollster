/**
 * jQuery Pollster
 * Simple plugin to manage long polling for ajax JSON(p) requests.
 *
 * @author Micky Hulse
 * @link http://mky.io
 * @docs https://github.com/mhulse/jquery-pollster
 * @copyright Copyright (c) 2014 Micky Hulse.
 * @license Released under the Apache License, Version 2.0.
 * @version 1.0.1
 * @date 2014/10/25
 */

/**
 * jQuery Pollster
 * Simple plugin to manage long polling for ajax JSON(p) requests.
 *
 * @author Micky Hulse
 * @link http://mky.io
 * @docs https://github.com/mhulse/jquery-pollster
 * @copyright Copyright (c) 2014 Micky Hulse.
 * @license Released under the Apache License, Version 2.0.
 * @version 1.0.0
 * @date 2014/10/24
 */

;(function($, window) {
	
	'use strict';
	
	var NS = 'pollster';
	
	var $defaults = {
		timeout: 10,       // Refresh time in seconds (defaults to 10).
		api: '',           // FQDN API endpoint.
		target: '',        // ID name.
		loader: 'loader',  // Class name.
		callback: $.noop,  // Method to call upon JSONP success.
		dataType: 'jsonp', // Change to `json` if not JSONP.
		flag: false        // Will be `true` after first run.
	};
	
	var console = (window.console || { log : $.noop, warn : $.noop });
	
	var methods = {
		
		init: function($options) {
			
			var $settings = $.extend({}, $[NS].defaults, $options);
			var $target;
			var $loader;
			var timeout;
			var qs;
			
			if ($settings.api) {
				
				$target = (($settings.target instanceof jQuery) ? $settings.target : $('#' + $settings.target));
				
				if ($target.length) {
					
					if ($settings.callback) {
						
						$loader = (($settings.loader.length) ? $target.find('.' + $settings.loader) : '');
						timeout = ($settings.timeout * 1000); // Convert seconds to milliseconds.
						qs = ($settings.dataType == 'jsonp') ? '?callback=?' : ''; // Callback for JSONP only.
						
						$.ajax({
							url: ((($.isFunction($settings.api)) ? $settings.api() : $settings.api) + qs),
							dataType: $settings.dataType,
							beforeSend: function() {
								
								$loader.fadeIn(); // Fade IN loader if it exists.
								
							},
							success: function() {
								
								$loader.fadeOut(); // Fade OUT loader if it exists.
								
							}
							
						})
							.done(function($data) {
								
								$settings.callback.call($target, $data, $settings);
								
								$settings.flag = true;
								
								setTimeout(function() {
									
									$[NS].call($target, $settings);
									
								}, timeout);
								
							})
							.fail(function() {
								
								setTimeout(function() {
									
									$[NS].call($target, $settings);
									
								}, timeout);
								
							});
						
					} else {
						
						console.warn('jQuery.%s: Callback function not defined for %o.', NS, this);
						
					}
					
				} else {
					
					console.warn('jQuery.%s: Target element is required.', NS);
					
				}
				
			} else {
				
				console.warn('jQuery.%s: No API endpoint specified.', NS);
				
			}
			
		}
		
	};
	
	$[NS] = function(method) {
		
		if (methods[method]) {
			
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
			
		} else if ((typeof method === 'object') || ( ! method)) {
			
			return methods.init.apply(this, arguments);
			
		} else {
			
			$.error('Error using jQuery.%s "%s"!', NS, method);
			
		}
		
	};
	
	$[NS].defaults = $defaults;
	
}(jQuery, window));
