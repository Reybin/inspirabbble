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
		this.$app = $('#app');

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

		// Refresh the shots.
		this.refresh();

		// Register global events.
		$(window).on('resize', function() {
			instance.render();
			instance.refresh();
		});

		$(document).on('mouseenter.app, mouseleave.app', '.shot', function(event) {

			var shot = $(event.target).closest('.shot'),
				caption = shot.find('.caption');

			$('.caption.in')
				.removeClass('in')
				.animate({
					marginTop: 0
				}, 100);

			if (event.type == 'mouseenter') {
				caption
					.addClass('in')
					.animate({
						marginTop: -caption.height()
					}, 100);
			} else {
				caption
					.removeClass('in')
					.animate({
						marginTop: 0
					}, 100);
			}


		});
	};

	/**
	 * Render the interface.
	 */
	App.prototype.render = function() {

		$('#shots').remove();
		this.$shots = [];

		var shots  = $(this.$templates.shots()).appendTo(this.$app),
			tmpl   = $(this.$templates.shot({})),
			cols   = parseInt(this.setting('cols'), 10),
			width  = Math.min(this.$app.width() / cols),
			height = Math.min(width * (3 / 4)),
			rows   = Math.ceil(this.$app.height() / height),
			cells  = rows * cols;

		for (var i = 0; i < cells; i++) {

			var s = tmpl.clone()
				.width(width)
				.height(height);

			s.find('.bg')
				.hide()
				.css('background-color', rainbow(cells, snake(i, cols)));

			s.appendTo(shots);
			this.$shots.push(s);
		};

		serie(this.$shots, function(s) {
			s.find('.bg').show();
		}, 100, cols);

	};

	/**
	 * Refresh shots.
	 */
	App.prototype.refresh = function() {

		var instance = this;

		$.ajax({
			dataType: 'jsonp',
			url: 'http://api.dribbble.com/shots/everyone?per_page=30',
			success: function(response) {

				var loaded = 0;

				$.each(instance.$shots, function(i, old) {
					var data   = response.shots[i],
						shot   = $(instance.$templates.shot(data)),
						loader = $('<img/>')
							.attr('src', data.image_url)
							.on('load', function() {
								old.html(shot.children());
								old.find('.caption').show();
								if (++loaded == instance.$shots.length) {
									setTimeout(function() {
										instance.refresh();
									}, instance.setting('refresh'));
								}
							});
				});
			}
		});

	};

	// Default user settings.
	var defaultSettings = {
		cols: 3,
		refresh: 10 * 1000
	};

	/**
	 * Set or get user settings.
	 */
	App.prototype.setting = function(name, value) {
		if (value === undefined) {
			return localStorage[name];
		} else {
			localStorage[name] = value;
		}
	};

	/**
	 * Determine if user settings exists.
	 */
	App.prototype.hasSettings = function() {
		for (var key in defaultSettings) {
			if (this.setting(defaultSettings[key]) === undefined) {
				return false;
			}
		}
		return true;
	};

	/**
	 * Reset all user settings.
	 */
	App.prototype.resetSettings = function() {
		localStorage.clear();
		for (key in defaultSettings) {
			this.setting(key, defaultSettings[key]);
		}
	};

	///////////////////////////
	// The wire up of events.

	$(document).on('ready', function() {
		setTimeout(function() {
			window.App = new App();
		}, 100);
	});

	// Private functions.

	function dialog(url) {
		$.get(url, function(data) {
			console.log(data);
		});
	}

	function unsupportedBrowser() {
		alert('Unsupported browser');
	}

	function rainbow(numOfSteps, step) {
		// This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
		// Adam Cole, 2011-Sept-14
		// HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
		var r, g, b;
		var h = step / numOfSteps;
		var i = ~~ (h * 6);
		var f = h * 6 - i;
		var q = 1 - f;
		switch (i % 6) {
			case 0:
				r = 1, g = f, b = 0;
				break;
			case 1:
				r = q, g = 1, b = 0;
				break;
			case 2:
				r = 0, g = 1, b = f;
				break;
			case 3:
				r = 0, g = q, b = 1;
				break;
			case 4:
				r = f, g = 0, b = 1;
				break;
			case 5:
				r = 1, g = 0, b = q;
				break;
		}
		var c = "#" + ("00" + (~~(r * 255)).toString(16)).slice(-2) + ("00" + (~~(g * 255)).toString(16)).slice(-2) + ("00" + (~~(b * 255)).toString(16)).slice(-2);
		return (c);
	}

	function snake(step, corner) {
		var way     = Math.floor(step / corner),
			reverse = !! (way % 2),
			steps   = (step % corner) + 1;
		return reverse ? ((way * corner) + (corner - steps)) : step;
	}

	function serie(args, fn, delay, corner) {

		var i = 0,
			run = function() {
				if (i == args.length) {
					return
				}
				fn(args[snake(i, corner)]);
				i++;
				setTimeout(run, delay);
			};

		run()

	}

}(window, jQuery);