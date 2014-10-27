
(function(global) {

	/*
	 * HELPERS
	 */

	var _get_encoder = function(parameters) {

		var count = 0;
		var str   = '';

		for (var key in parameters) {

			var value = parameters[key];
			if (value instanceof Object) {
				value = JSON.stringify(parameters[key]);
			}

			if (count === 0) {
				str += '?' + key + '=' + value;
			} else {
				str += '&' + key + '=' + value;
			}

			count++;

		}


		return str;

	};



	/*
	 * IMPLEMENTATION
	 */

	var API = function(identifier, send, callback, scope) {

		identifier = typeof identifier === 'string' ? identifier : 'search';
		callback   = callback instanceof Function   ? callback   : null;
		scope      = scope !== undefined            ? scope      : this;


		var xhr = new XMLHttpRequest();

		xhr.open('GET', '/api/' + identifier + _get_encoder(send), true);
		xhr.setRequestHeader('Content-Type', 'application/json; charset=utf8');
		xhr.withCredentials = true;


		xhr.onload = function() {

			var receive = null;
			try {
				receive = JSON.parse(this.responseText);
			} catch(e) {
				receive = null;
			}


			if (callback !== null) {
				callback.call(scope, receive);
			}

		};

		xhr.onerror = xhr.ontimeout = function() {

			if (callback !== null) {
				callback.call(scope, null);
			}

		};


		xhr.send(null);

	};


	global.API = API;

})(this);

