Util.Objects["docsindex"] = new function() {
	this.init = function(scene) {

		var files = u.qsa(".files li", scene);
		var i, node;

		// initialize search field
		scene.div_search = u.qs(".search", scene);
		scene.div_search.h2 = u.ae(scene.div_search, "h2", {"html":"Search utilities and tools"});

		var form = u.f.addForm(scene.div_search, {"class":"labelstyle:inject"});
		var fieldset = u.f.addFieldset(form);
		var field = u.f.addField(fieldset, {"name":"search", "label":"Search term of minimum 3 chars"})
		u.f.init(form);

		u.as(field._input, "width", (u.browserW()-60)+"px");

		// enable search
		field._input.div_search = scene.div_search;

		// content needs to be indexed
		// inject result container
		field._input.results = u.ae(scene.div_search, "div", {"class":"results"});
		for(i = 0; node = files[i]; i++) {

			u.ce(node, {"type":"link"});

			node.results = field._input.results;
			node.response = function(response) {

				var i, _function;
				var functions = u.qsa(".functions .function", response);
				for(i = 0; _function = functions[i]; i++) {
					
					_function.file_node = this;
					_function = this.results.appendChild(_function);

					u.ce(_function, {"type":"link"});
					_function.url = this.url+"#"+_function.id;

					// searchable areas
					_function._definition = u.qs(".definition", _function);
					_function._description = u.qs(".description", _function);
					u.as(_function, "display", "none");
				}
			}

			u.request(node, node.url);
		}

		// auto complete handler
		field._input._autocomplete = function() {

			var i, _function;

			// start search
			u.ac(this.div_search, "loading");

			// perform search
			for(i = 0; _function = this.results.childNodes[i]; i++) {
				if(
					this.value.length > 2 && 
					(
						escape(u.text(_function._definition).toLowerCase()).match(escape(this.value.toLowerCase())) || 
						escape(u.text(_function._description).toLowerCase()).match(escape(this.value.toLowerCase()))
					)
				) {
					u.as(_function, "display", "block");
				}
				else {
					u.as(_function, "display", "none");
				}
			}

			// done
			u.rc(this.div_search, "loading");

		}

		field._input._keyup = function(event) {

			// reset existing timer
			u.t.resetTimer(this.t_autocomplete);
			this.t_autocomplete = u.t.setTimer(this, this._autocomplete, 300);
		}

		field._input.focused = function() {
			u.e.addEvent(this, "keyup", this._keyup)
		}

		field._input.blurred = function() {
			u.t.resetTimer(this.t_autocomplete);
			u.e.removeEvent(this, "keyup", this._keyup)
		}

	}
}


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

			u.svg({
				"node":func._header,
				"width": "15px",
				"height": "12px",
				"shapes":[
					{
						"type":"line",
						"x1":1,
						"y1":0,
						"x2":7,
						"y2":12
					},
					{
						"type":"line",
						"x1":6,
						"y1":12,
						"x2":12,
						"y2":0
					}
				]
			});

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

			// FUNCTION USES

			func._uses = u.qs(".uses", func);
			u.as(func._uses, "height", "20px");
			func._uses._func = func;

			u.svg({
				"node":func._uses,
				"width": "15px",
				"height": "12px",
				"shapes":[
					{
						"type":"line",
						"x1":1,
						"y1":0,
						"x2":5,
						"y2":9
					},
					{
						"type":"line",
						"x1":4,
						"y1":9,
						"x2":8,
						"y2":0
					}
				]
			});

			u.e.click(func._uses);
			func._uses.clicked = function(event) {

				if(u.hc(this, "open")) {

					u.as(this, "height", "20px");
					u.rc(this, "open");
				}
				else {

					u.as(this, "height", "auto");
					u.ac(this, "open");
				}
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

			u.svg({
				"node":scene._files._header,
				"width": "15px",
				"height": "12px",
				"shapes":[
					{
						"type":"line",
						"x1":1,
						"y1":0,
						"x2":7,
						"y2":12
					},
					{
						"type":"line",
						"x1":6,
						"y1":12,
						"x2":12,
						"y2":0
					}
				]
			});

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

			u.svg({
				"node":scene._segments._header,
				"width": "15px",
				"height": "12px",
				"shapes":[
					{
						"type":"line",
						"x1":1,
						"y1":0,
						"x2":7,
						"y2":12
					},
					{
						"type":"line",
						"x1":6,
						"y1":12,
						"x2":12,
						"y2":0
					}
				]
			});

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