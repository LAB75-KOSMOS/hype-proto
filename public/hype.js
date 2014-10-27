
(function(global) {

	var _BLOB   = { query: '' };
	var _INPUTS = {};
	var _LISTS  = {};
	var _VIEWS  = {};

	var _header = document.querySelector('header');
	var _menu   = document.querySelector('menu');


	/*
	 * FEATURE DETECTION
	 */

	(function() {

		var articles = document.querySelectorAll('article');
		for (var a = 0, al = articles.length; a < al; a++) {

			var article = articles[a];
			var view_id = article.id.substr(5) || null;
			var active  = article.className === 'active';

			if (view_id !== null) {

				_VIEWS[view_id] = {
					element: article,
					active:  active
				};

			}

		}


		var buttons = document.querySelectorAll('button[data-view]');
		for (var b = 0, bl = buttons.length; b < bl; b++) {

			var button = buttons[b];
			var view   = buttons[b].getAttribute('data-view') || null;
			if (view !== null) {

				button.onclick = function() {

					var my_api  = this.getAttribute('data-api')  || null;
					var my_view = this.getAttribute('data-view') || null;

					if (my_api !== null) {

						_sync_api(my_api, function() {

							if (my_view !== null) {
								_set_view(my_view);
							}

						}, this);

					} else if (my_view !== null) {

						hype.setView(my_view);

					}

				};

			}

		}


		var inputs = document.querySelectorAll('input[data-send]');
		for (var i = 0, il = inputs.length; i < il; i++) {

			var input = inputs[i];
			var blob  = inputs[i].getAttribute('data-send') || null;
			if (blob !== null) {

				var cache = _INPUTS[blob] || null;
				if (cache === null) {
					cache = _INPUTS[blob] = {
						elements: []
					};
				}


				if (cache.elements.indexOf(input) === -1) {
					cache.elements.push(input);
				}


				input.onchange = function() {

					var my_api     = this.getAttribute('data-api')     || null;
					var my_send    = this.getAttribute('data-send')    || null;
					var my_receive = this.getAttribute('data-receive') || null;
					var my_value   = this.value;


					if (my_send !== null) {
						_sync_blob(my_send, my_value);
					}


					if (my_api !== null) {

						_sync_api(my_api, function(data) {

							if (my_receive !== null && data[my_receive] !== undefined) {
								this.value = data[my_receive];
							}

						}, this);

					}

				};

			}

		}


		var lists = document.querySelectorAll('ul[data-receive]');
		for (var l = 0, ll = lists.length; l < ll; l++) {

			var list = lists[l];
			var blob = lists[l].getAttribute('data-receive') || null;
			if (blob !== null) {

				var cache = _LISTS[blob] || null;
				if (cache === null) {
					cache = _LISTS[blob] = {
						elements: []
					};
				}


				if (cache.elements.indexOf(list) === -1) {
					cache.elements.push(list);
				}

			}

		}

	})();



	/*
	 * HELPERS
	 */

	var _sync_api = function(identifier, callback, scope) {

		identifier = typeof identifier === 'string' ? identifier : null;
		callback   = callback instanceof Function   ? callback   : null;
		scope      = scope !== undefined            ? scope      : this;


		if (identifier !== null) {

			API(identifier, _BLOB, function(data) {

				for (var prop in data) {
					_sync_blob(prop, data[prop]);
				}

				if (callback !== null) {
					callback.call(scope, data);
				}

			}, this);


			return true;

		}


		return false;

	};

	var _sync_blob = function(key, value) {

		key = typeof key === 'string' ? key : null;


		if (key !== null) {

			_BLOB[key] = value;


			var elements = _INPUTS[key].elements;
			for (var e = 0, el = elements.length; e < el; e++) {

				var element = elements[e];
				if (element.value !== value) {
					element.value = value;
				}

			}


			return true;

		}


		return false;

	};

	var _set_view = function(identifier) {

		identifier = typeof identifier === 'string' ? identifier : null;


		if (identifier !== null) {

			var curr = null;
			var next = _VIEWS[identifier] || null;

			for (var id in _VIEWS) {

				if (_VIEWS[id].active === true) {
					curr = _VIEWS[id];
					break;
				}

			}


			if (curr !== null && next !== null) {

				curr.element.className = '';
				curr.active = false;

				next.element.className = 'active';
				next.active = true;


				if (identifier === 'search') {
					_header.className = '';
					_menu.className   = 'hidden';
				} else {
					_header.className = 'hidden';
					_menu.className   = '';
				}


				return true;

			}

		}


		return false;

	};



	/*
	 * IMPLEMENTATION
	 */

	var hype = {

		view:    'search',

		setView: function(identifier) {

			var result = _set_view(identifier);
			if (result === true) {

				this.view = identifier;

				return true;

			}


			return false;

		}

	};


	(function(hype) {

		var search = document.location.search || '';
		if (search.length > 2) {

			var view = search.substr(1).split('&')[0];
			if (view.match(/search|explore|results|create/)) {
				hype.setView(view);
			}

		}

	})(hype);


	global.HYPE = hype;

})(typeof global !== 'undefined' ? global : this);

