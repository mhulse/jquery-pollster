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
			
			if ($settings.api) {
				
				if ($settings.target) {
					
					if ($settings.callback) {
						
						var $this = (($settings.target instanceof jQuery) ? $settings.target : $('#' + $settings.target));
						var $loader = (($settings.loader.length) ? $this.find('.' + $settings.loader) : '');
						var timeout = ($settings.timeout * 1000); // Convert seconds to milliseconds.
						var qs = ($settings.dataType == 'jsonp') ? '?callback=?' : ''; // Callback for JSONP only.
						
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
								
								$settings.callback.call($this, $data, $settings);
								
								$settings.flag = true;
								
								setTimeout(function() {
									
									$[NS].call($this, $settings);
									
								}, timeout);
								
							})
							.fail(function() {
								
								setTimeout(function() {
									
									$[NS].call($this, $settings);
									
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
