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
			var seconds;
			var context;
			
			// Check required params:
			if ($settings.url || $settings.ajax.url) {
				
				// Pause the timeout?
				if ($settings.pause) {
					
					window.clearInterval($timeout);
					
					$timeout = 0;
					
				} else {
					
					// Convert seconds to milliseconds:
					seconds = ($settings.seconds * 1000);
					
					// Allow for url to be a function:
					$settings.ajax.url = ((typeof $settings.url == 'function') ? $settings.url() : $settings.ajax.url);							
					
					// Give optional context to all ajax-related callbacks:
					context = ($settings.ajax.context || null);
					
					// Return `$.ajax` to allow client to access chained events:
					return $.ajax($settings.ajax)
						.done(function($data) {
							
							// Success, call user's code:
							$settings.callback.call(context, $data, $settings);
							
							// Helpers:
							$settings.first = false;
							$settings.count++;
							
							$timeout = setTimeout(function() {
								
								// Wash, rinse and repeat:
								$[NS].call(context, $settings);
								
							}, seconds);
							
						})
						.fail(function() {
							
							$timeout = setTimeout(function() {
								
								// Ain't no thang!
								$[NS].call($settings.ajax.context, $settings);
								
							}, seconds);
							
						});
					
				}
				
			} else {
				
				console.warn('jQuery.%s: No URL endpoint specified.', NS);
				
			}
			
		},
		
		destroy: function() {
			
			return this.each(function() {
				
				// @TODO, this.
				
			});
			
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
