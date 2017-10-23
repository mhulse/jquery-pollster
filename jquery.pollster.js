/*! https://github.com/mhulse/jquery-pollster */

;(function($, window) {
	
	'use strict';
	
	// Plugin namespace:
	var NS = 'pollster';
	
	// Initialization public defaults:
	var $defaults = {
		ajax: {},         // Options for `jQuery.ajax()` (http://api.jquery.com/jquery.ajax/).
		callback: $.noop, // Method to call upon JSONP success.
		count: 1,         // Loop counter.
		first: true,      // Will be `false` after first run.
		seconds: 10,      // Refresh time in seconds (defaults to 10).
		url: ''           // Override `jQuery.ajax()` url option (useful if `url` is a function).
	};
	
	var console = (window.console || { log : $.noop, warn : $.noop });
	
	var methods = {
		
		init: function($options) {
			
			var $settings = $.extend(true, {}, $defaults, $[NS].defaults, $options);
			var $timeout;
			
			// Check required params:
			if ($settings.url || $settings.ajax.url) {
				
				// Pause the timeout?
				if ($settings.pause) {
					
					window.clearInterval($timeout);
					
					$timeout = 0;
					
				} else {
					
					// Allow for url to be a function:
					$settings.ajax.url = ((typeof $settings.url == 'function') ? $settings.url() : $settings.ajax.url);
					
					if ($.inArray($settings.count, $settings.skip) !== -1) {
						
						$settings.skipped = true;
						
						$timeout = methods.restart($settings);
						
					} else {
						
						$settings.skipped = false;
						
						$.ajax($settings.ajax)
							.always(function($data) {
								
								$timeout = methods.restart($settings, $data);
								
							});
						
					}
					
				}
				
			} else {
				
				console.warn('jQuery.%s: No URL endpoint specified.', NS);
				
			}
			
		},
		
		restart: function($settings, $data) {
			
			$data = ($data || {});
				
			// Success, call user's code:
			$settings.callback.call(
				($settings.ajax.context || null), // Give optional context to all ajax-related callbacks.
				$settings,
				$data
			);
			
			// Helpers:
			$settings.first = false;
			$settings.count++;
			
			return setTimeout(function() {
				
				// Wash, rinse and repeat:
				$[NS].call(this, $settings);
				
			}, ($settings.seconds * 1000)); // Converts seconds to milliseconds.
			
		}
		
	};
	
	// Boilerplate method calling logic:
	$[NS] = function(method) {
		
		if (methods[method]) {
			
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
			
		} else if ((typeof method === 'object') || ( ! method)) {
			
			return methods.init.apply(this, arguments);
			
		} else {
			
			$.error('Error using jQuery.%s "%s"!', NS, method);
			
		}
		
	};
	
	// Pre-initialization public defaults.
	$[NS].defaults = $defaults;
	
}(jQuery, window));
