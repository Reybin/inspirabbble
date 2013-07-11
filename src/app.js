/**
 * Inspirabbble - A web app to inspire you with the latest Dribbble shots.
 *
 * Copyright - Rubens Mariuzzo 2013
 */
! function(doc, $) {

	/////////////////////////////////////
	// The class definition of the app.

	var App = function() {
		this.init();
	};

	/**
	 * Initialize the app.
	 */
	App.prototype.init = function() {

		var instance = this;
		this.$shots = [];

		// Check for user settings.
		if (!this.hasSettings()) {
			this.resetSettings();
		}

		// Check dependencies.
		if (!Modernizr.localstorage) {
			return unsupportedBrowser();
		}

		// Compile templates.
		this.$templates = {};
		$('[type="text/x-template"]').each(function() {
			var template = $(this);
			instance.$templates[template.attr('id')] = Mustache.compile(template.text());
		});
		
		// Render the interface.
		this.render();

		// Schedule the refresher.
		this.refresh();
		this.$irefresh = setInterval(this.refresh, 10 * 1000); // 10 seconds.
		
		// Register global events.
		$(window).on('resize', function() {
			instance.render();
		});
	};

	/**
	 * Render the interface.
	 */
	App.prototype.render = function() {

		$('#shots').remove();
		this.$shots = [];

		var body = $('body'),
			shots = $(this.$templates.shots()).appendTo(body),
			shot = $(this.$templates.shot({})),
			cols = parseInt(this.setting('cols'), 10),
			width = body.width() / cols,
			rows = Math.ceil(body.height() / width),
			cells = rows * cols;

		for (var i = 0; i < cells; i++) {
			this.$shots.push(shot
				.clone()
				.css({
					backgroundColor : rainbow(cells, snake(i, cols)),
					width : width })
				.appendTo(shots)
				.addClass('bounceIn animated'));
		};

		$('.shot').height(width);

	};

	// Refresh dribbbles.
	App.prototype.refresh = function() {
		// 1. Get latest dribbble via AJAX http://dribbble.com/api
		// 2. Load the image into the containers: .container > img
	};

	// Add/set user settings.
	App.prototype.setting = function(name, value) {
		if (value === undefined) {
			return localStorage[name];
		} else {
			localStorage[name] = value;
		}
	};

	// Determine if any setting exists.
	App.prototype.hasSettings = function() {
		for (var key in defaultSettings) {
			if (this.setting(defaultSettings[key]) === undefined) {
				return false;
			}
		}
		return true;
	};

	var defaultSettings = {
		cols : 5
	};

	App.prototype.resetSettings = function() {
		localStorage.clear();
		this.setting('cols', 5);
		this.setting('hasSettings', true);
	};

	///////////////////////////
	// The wire up of events.

	$(document).on('ready', function() {
		setTimeout(function() {
			// Initialize app.
			var app = window.App = new App();
		}, 100);
	});

	// Private functions.

	function unsupportedBrowser() {
		alert('Unsupported browser');
	}

	function rainbow(numOfSteps, step) {
	    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
	    // Adam Cole, 2011-Sept-14
	    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
	    var r, g, b;
	    var h = step / numOfSteps;
	    var i = ~~(h * 6);
	    var f = h * 6 - i;
	    var q = 1 - f;
	    switch(i % 6){
	        case 0: r = 1, g = f, b = 0; break;
	        case 1: r = q, g = 1, b = 0; break;
	        case 2: r = 0, g = 1, b = f; break;
	        case 3: r = 0, g = q, b = 1; break;
	        case 4: r = f, g = 0, b = 1; break;
	        case 5: r = 1, g = 0, b = q; break;
	    }
	    var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
	    return (c);
	}

	function snake(step, corner) {
		var way = Math.floor(step / corner),
			reverse = !!(way % 2),
			steps = (step % corner) + 1;
		return reverse ? ((way * corner) + (corner - steps)) : step;
	}

}(window, jQuery);