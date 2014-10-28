;(function($, window) {
	
	'use strict';
	
	var NS = 'pollster';
	
	var $defaults = {
		seconds: 10,       // Refresh time in seconds (defaults to 10).
		api: '',           // FQDN API endpoint.
		target: '',        // ID name.
		loader: 'loader',  // Class name.
		callback: $.noop,  // Method to call upon JSONP success.
		dataType: 'jsonp', // Change to `json` if not JSONP.
		first: false,      // Will be `true` after first run.
		count: 1,          // Loop counter.
		destroy: false,    // Remove plugin instance.
		pause: false       // Pause the plugin instance?
	};
	
	var console = (window.console || { log : $.noop, warn : $.noop });
	
	var methods = {
		
		init: function($options) {
			
			var $settings = $.extend({}, $[NS].defaults, $options);
			var $target;
			var $loader;
			var seconds;
			var qs;
			
			if ($settings.api) {
				
				$target = (($settings.target instanceof jQuery) ? $settings.target : $('#' + $settings.target));
				
				if ($target.length) {
					
					if ($settings.callback) {
						
						$loader = (($settings.loader.length) ? $target.find('.' + $settings.loader) : '');
						seconds = ($settings.seconds * 1000); // Convert seconds to milliseconds.
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
								
								// Helpers:
								$settings.first = true;
								$settings.count++;
								
								setTimeout(function() {
									
									$[NS].call($target, $settings);
									
								}, seconds);
								
							})
							.fail(function() {
								
								setTimeout(function() {
									
									$[NS].call($target, $settings);
									
								}, seconds);
								
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
			
		}, // methods()
		
		destroy: function() {
			
			return this.each(function() {
				
				
				
			});
			
		} // destroy()
		
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
