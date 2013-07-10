/**
 * Inspirabbble - A web app to inspire you with the latest Dribbble shots.
 *
 * Copyright - Rubens Mariuzzo 2013
 */
! function(doc, $) {

	/////////////////////////////////////
	// The class definition of the app.

	var App = function(doc) {
		this.$doc = $(doc);
		this.init();
	};

	App.prototype.init = function() {
		var instance = this;
		// Compile templates.
		this.$templates = {};
		$('[type="text/x-template"]').each(function() {
			var template = $(this);
			instance.$templates[template.attr('id')] = Mustache.compile(template.text());
		});
		// Render the interface.
		this.render(5, 5);
		// Schedule the refresher.
		this.refresh();
		this.$irefresh = setInterval(this.refresh, 10 * 1000); // 10 seconds.
	};

	// Render the interface.
	App.prototype.render = function(rows, cols) {
		$('#containers').remove();
		var containers = $('<div id="containers" />').appendTo('body'),
			container = $('<div />').addClass('container bounceIn animated'),
			cells = rows * cols;
		for (var i = 0; i < cells; i++) {
			container
				.clone()
				.css({
					backgroundColor : rainbow(cells, snake(i, cols)),
					width : (100 / cols) + '%' })
				.appendTo(containers);
		};
		containers = $('.container');
		containers.height(containers.width());
	};

	// Refresh dribbbles.
	App.prototype.refresh = function() {
		// 1. Get latest dribbble via AJAX http://dribbble.com/api
		// 2. Load the image into the containers: .container > img
	};

	///////////////////////////
	// The wire up of events.

	$(doc).on('ready.app', function() {
		setTimeout(function() {
			// Initialize app.
			doc.App = new App(doc);
			// Register global events.
			$(doc).on('resize', function() {
				doc.App.init();
			});
		}, 100);
	});

	// Private functions.

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