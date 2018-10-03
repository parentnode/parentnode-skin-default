Util.Objects["docpage"] = new function() {
	this.init = function(scene) {

		var i, func;
		var header, body;

		var sections = u.qsa(".section", scene);


		// loop through functions in page
		var functions = u.qsa(".function", scene);
		for(i = 0; func = functions[i]; i++) {
			func._header = u.qs(".header", func);
			func._header._func = func;
			func._body = u.qs(".body", func);
			u.as(func._body, "display", "none");
			func._body._func = func;


			u.e.click(func._header);
			func._header.clicked = function(event) {

				if(u.hc(this._func, "open")) {

					// ignore state
					u.deleteNodeCookie(this._func, "state");
					u.as(this._func._body, "display", "none");
					u.rc(this._func, "open");
				}
				else {

					// remember state
					u.saveNodeCookie(this._func, "state", "open");
					u.as(this._func._body, "display", "block");
					u.ac(this._func, "open");
				}
			}

			// check prev state
			if(u.getNodeCookie(func, "state") == "open") {
				func._header.clicked();
			}

		}

		// is specific function stated in url
		if(location.hash) {
			var selected_function = u.ge(location.hash.replace("#", ""))
			if(selected_function) {
				if(!u.hc(selected_function, "open")) {
					selected_function._header.clicked();
				}

				window.scrollTo(0, u.absY(selected_function));
			}
		}


		// FILES
		scene._files = u.qs("div.includefiles", scene);
		if(scene._files) {

			scene._files._header = u.qs("div.header", scene._files);
			scene._files._header._files = scene._files;

			scene._files._body = u.qs("div.body", scene._files);
			u.as(scene._files._body, "display", "none");
			scene._files._body._files = scene._files;

			u.e.click(scene._files._header);
			scene._files._header.clicked = function(event) {

				if(u.hc(this._files, "open")) {

				u.as(this._files._body, "display", "none");
					u.rc(this._files, "open");
				}
				else {

					u.as(this._files._body, "display", "block");
					u.ac(this._files, "open");
				}
			}
		}

		// SEGMENTS
		scene._segments = u.qs("div.segmentsupport", scene);
		if(scene._segments) {

			scene._segments._header = u.qs("div.header", scene._segments);
			scene._segments._header._segments = scene._segments;

			scene._segments._body = u.qs("div.body", scene._segments);
			u.as(scene._segments._body, "display", "none");
			scene._segments._body._segments = scene._segments;

			u.e.click(scene._segments._header);
			scene._segments._header.clicked = function(event) {

				if(u.hc(this._segments, "open")) {

				u.as(this._segments._body, "display", "none");
					u.rc(this._segments, "open");
				}
				else {

					u.as(this._segments._body, "display", "block");
					u.ac(this._segments, "open");
				}
			}
		}
	}
}