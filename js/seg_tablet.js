/*
Manipulator v0.9.2-full Copyright 2017 http://manipulator.parentnode.dk
asset-builder @ 2018-11-08 15:28:34
*/

/*seg_tablet_include.js*/
document.write('<script type="text/javascript" src=/js/manipulator/merged/tablet.js"></script>');

/*u-basics.js*/
u.smartphoneSwitch = new function() {
	this.state = 0;
	this.init = function(node) {
		this.callback_node = node;
		this.event_id = u.e.addWindowEvent(this, "resize", this.resized);
		this.resized();
	}
	this.resized = function() {
		if(u.browserW() < 500 && !this.state) {
			this.switchOn();
		}
		else if(u.browserW() > 500 && this.state) {
			this.switchOff();
		}
	}
	this.switchOn = function() {
		if(!this.panel) {
			this.state = true;
			this.panel = u.ae(document.body, "div", {"id":"smartphone_switch"});
			u.ass(this.panel, {
				opacity: 0
			});
			u.ae(this.panel, "h1", {html:u.stringOr(u.txt["smartphone-switch-headline"], "Hello curious")});
			if(u.txt["smartphone-switch-text"].length) {
				for(i = 0; i < u.txt["smartphone-switch-text"].length; i++) {
					u.ae(this.panel, "p", {html:u.txt["smartphone-switch-text"][i]});
				}
			}
			var ul_actions = u.ae(this.panel, "ul", {class:"actions"});
			var li; 
			li = u.ae(ul_actions, "li", {class:"hide"});
			var bn_hide = u.ae(li, "a", {class:"hide button", html:u.txt["smartphone-switch-bn-hide"]});
			li = u.ae(ul_actions, "li", {class:"switch"});
			var bn_switch = u.ae(li, "a", {class:"switch button primary", html:u.txt["smartphone-switch-bn-switch"]});
			u.e.click(bn_switch);
			bn_switch.clicked = function() {
				u.saveCookie("smartphoneSwitch", "on");
				location.href = location.href.replace(/[&]segment\=desktop|segment\=desktop[&]?/, "") + (location.href.match(/\?/) ? "&" : "?") + "segment=smartphone";
			}
			u.e.click(bn_hide);
			bn_hide.clicked = function() {
				u.e.removeWindowEvent(u.smartphoneSwitch, "resize", u.smartphoneSwitch.event_id);
				u.smartphoneSwitch.switchOff();
			}
			u.a.transition(this.panel, "all 0.5s ease-in-out");
			u.ass(this.panel, {
				opacity: 1
			});
			if(this.callback_node && typeof(this.callback_node.smartphoneSwitchedOn) == "function") {
				this.callback_node.smartphoneSwitchedOn();
			}
		}
	}
	this.switchOff = function() {
		if(this.panel) {
			this.state = false;
			this.panel.transitioned = function() {
				this.parentNode.removeChild(this);
				delete u.smartphoneSwitch.panel;
			}
			u.a.transition(this.panel, "all 0.5s ease-in-out");
			u.ass(this.panel, {
				opacity: 0
			});
			if(this.callback_node && typeof(this.callback_node.smartphoneSwitchedOff) == "function") {
				this.callback_node.smartphoneSwitchedOff();
			}
		}
	}
}


/*beta-u-animation-to.js*/
	u.a.parseSVGPolygon = function(value) {
		var pairs = value.trim().split(" ");
		var sets = [];
		var part;
		for(x in pairs) {
			parts = pairs[x].trim().split(",");
			for(part in parts) {
				parts[part] = Number(parts[part]);
			}
			sets[x] = parts;
		}
		return sets;
	}
	u.a.parseSVGPath = function(value) {
		var pairs = {"m":2, "l":2, "a":7, "c":6, "s":4, "q":4, "z":0};
		var x, sets;
		value = value.replace(/-/g, " -");
		value = value.replace(/,/g, " ");
		value = value.replace(/(m|l|a|c|s|q|M|L|A|C|S|Q)/g, " $1 ");
		value = value.replace(/  /g, " ");
		sets = value.match(/(m|l|a|c|s|q|M|L|A|C|S|Q)([0-9 \-\.]+)/g);
		for(x in sets) {
			parts = sets[x].trim().split(" ");
			sets[x] = parts;
			if(parts && pairs[parts[0].toLowerCase()] == parts.length-1) {
			}
			else {
			}
		}
		return sets;
	}
	u.a.getInitialValue = function(node, attribute) {
		var value = (node.getAttribute(attribute) ? node.getAttribute(attribute) : u.gcs(node, attribute)).replace(node._unit[attribute], "")
		if(attribute.match(/^(d|points)$/)) {
			return value;
		}
		else {
			return Number(value.replace(/auto/, 0));
		}
	}
	u.a.to = function(node, transition, attributes) {
		var transition_parts = transition.split(" ");
		if(transition_parts.length >= 3) {
			node._target = transition_parts[0];
			node.duration = transition_parts[1].match("ms") ? parseFloat(transition_parts[1]) : (parseFloat(transition_parts[1]) * 1000);
			node._ease = transition_parts[2];
			if(transition_parts.length == 4) {
				node.delay = transition_parts[3].match("ms") ? parseFloat(transition_parts[3]) : (parseFloat(transition_parts[3]) * 1000);
			}
		}
		var value, d;
		node._start = {};
		node._end = {};
		node._unit = {};
		for(attribute in attributes) {
			if(attribute.match(/^(d)$/)) {
				node._start[attribute] = this.parseSVGPath(this.getInitialValue(node, attribute));
				node._end[attribute] = this.parseSVGPath(attributes[attribute]);
			}
			else if(attribute.match(/^(points)$/)) {
				node._start[attribute] = this.parseSVGPolygon(this.getInitialValue(node, attribute));
				node._end[attribute] = this.parseSVGPolygon(attributes[attribute]);
			}
			else {
				node._unit[attribute] = attributes[attribute].toString().match(/\%|px/);
				node._start[attribute] = this.getInitialValue(node, attribute);
				node._end[attribute] = attributes[attribute].toString().replace(node._unit[attribute], "");
			}
		}
		node.easing = u.easings[node._ease];
		node.transitionTo = function(progress) {
			var easing = node.easing(progress);
			for(attribute in attributes) {
				if(attribute.match(/^(translate|rotate|scale)$/)) {
					if(attribute == "translate") {
						u.a.translate(this, Math.round((this._end_x - this._start_x) * easing), Math.round((this._end_y - this._start_y) * easing))
					}
					else if(attribute == "rotate") {
					}
				}
				else if(attribute.match(/^(x1|y1|x2|y2|r|cx|cy|stroke-width)$/)) {
					var new_value = (this._start[attribute] + ((this._end[attribute] - this._start[attribute]) * easing)) +  this._unit[attribute]
					this.setAttribute(attribute, new_value);
				}
				else if(attribute.match(/^(d)$/)) {
					var new_value = "";
					for(x in this._start[attribute]) {
						for(y in this._start[attribute][x]) {
							if(parseFloat(this._start[attribute][x][y]) == this._start[attribute][x][y]) {
								new_value += (Number(this._start[attribute][x][y]) + ((Number(this._end[attribute][x][y]) - Number(this._start[attribute][x][y])) * easing)) + " ";
							}
							else {
								new_value += this._end[attribute][x][y] + " ";
							}
						}
					}
					this.setAttribute(attribute, new_value);
				}
				else if(attribute.match(/^(points)$/)) {
					var new_value = "";
					for(x in this._start[attribute]) {
						new_value += (this._start[attribute][x][0] + ((this._end[attribute][x][0] - this._start[attribute][x][0]) * easing)) + ",";
						new_value += (this._start[attribute][x][1] + ((this._end[attribute][x][1] - this._start[attribute][x][1]) * easing)) + " ";
					}
					this.setAttribute(attribute, new_value);
				}
				else {
					var new_value = (this._start[attribute] + ((this._end[attribute] - this._start[attribute]) * easing)) +  this._unit[attribute]
					u.as(node, attribute, new_value, false);
				}
			}
		}
		u.a.requestAnimationFrame(node, "transitionTo", node.duration);
	}


/*beta-u-fontsReady.js*/
u.fontsReady = function(node, fonts, _options) {
	var callback_loaded = "fontsLoaded";
	var callback_timeout = "fontsNotLoaded";
	var max_time = 3000;
	if(obj(_options)) {
		var _argument;
		for(_argument in _options) {
			switch(_argument) {
				case "callback"					: callback_loaded		= _options[_argument]; break;
				case "timeout"					: callback_timeout		= _options[_argument]; break;
				case "max"						: max_time				= _options[_argument]; break;
			}
		}
	}
	window["_man_fonts_"] = window["_man_fonts_"] || {};
	window["_man_fonts_"].fontApi = document.fonts && fun(document.fonts.check) ? true : false;
	window["_man_fonts_"].fonts = window["_man_fonts_"].fonts || {};
	var font, node, i;
	if(typeof(fonts.length) == "undefined") {
		font = fonts;
		fonts = new Array();
		fonts.push(font);
	}
	var loadkey = u.randomString(8);
	if(window["_man_fonts_"].fontApi) {
		window["_man_fonts_"+loadkey] = {};
		window["_man_fonts_"+loadkey].t_timeout = u.t.setTimer(window["_man_fonts_"+loadkey], "checkFontsStatus", max_time);
	}
	else {
		window["_man_fonts_"+loadkey] = u.ae(document.body, "div");
		window["_man_fonts_"+loadkey].basenodes = {};
	}
	window["_man_fonts_"+loadkey].nodes = [];
	window["_man_fonts_"+loadkey].loadkey = loadkey;
	window["_man_fonts_"+loadkey].callback_node = node;
	window["_man_fonts_"+loadkey].callback_name = callback_loaded;
	window["_man_fonts_"+loadkey].callback_timeout = callback_timeout;
	window["_man_fonts_"+loadkey].max_time = max_time;
	window["_man_fonts_"+loadkey].start_time = new Date().getTime();
	for(i = 0; i < fonts.length; i++) {
		font = fonts[i];
		font.style = font.style || "normal";
		font.weight = font.weight || "400";
		font.size = font.size || "16px";
		font.status = "waiting";
		font.id = u.normalize(font.family+font.style+font.weight);
		if(!window["_man_fonts_"].fonts[font.id]) {
			window["_man_fonts_"].fonts[font.id] = font;
		}
		if(window["_man_fonts_"].fontApi) {
			node = {};
		}
		else {
			if(!window["_man_fonts_"+loadkey].basenodes[font.style+font.weight]) {
				window["_man_fonts_"+loadkey].basenodes[font.style+font.weight] = u.ae(window["_man_fonts_"+loadkey], "span", {"html":"I'm waiting for your fonts to load!","style":"font-family: Times !important; font-style: "+font.style+" !important; font-weight: "+font.weight+" !important; font-size: "+font.size+" !important; line-height: 1em !important; opacity: 0 !important;"});
			}
			node = u.ae(window["_man_fonts_"+loadkey], "span", {"html":"I'm waiting for your fonts to load!","style":"font-family: '"+font.family+"', Times !important; font-style: "+font.style+" !important; font-weight: "+font.weight+" !important; font-size: "+font.size+" !important; line-height: 1em !important; opacity: 0 !important;"});
		}
		node.font_size = font.size;
		node.font_family = font.family;
		node.font_weight = font.weight;
		node.font_style = font.style;
		node.font_id = font.id;
		node.loadkey = loadkey;
		window["_man_fonts_"+loadkey].nodes.push(node);
	}
	window["_man_fonts_"+loadkey].checkFontsAPI = function() {
		var i, node, font_string;
		for(i = 0; i < this.nodes.length; i++) {
			node = this.nodes[i];
			if(window["_man_fonts_"].fonts[node.font_id] && window["_man_fonts_"].fonts[node.font_id].status == "waiting") {
				font_string = node.font_style + " " + node.font_weight + " " + node.font_size + " " + node.font_family;
				document.fonts.load(font_string).then(function(fontFaceSetEvent) {
					if(fontFaceSetEvent && fontFaceSetEvent.length && fontFaceSetEvent[0].status == "loaded") {
						window["_man_fonts_"].fonts[this.font_id].status = "loaded";
					}
					else {
						window["_man_fonts_"].fonts[this.font_id].status = "failed";
					}
					if(window["_man_fonts_"+this.loadkey] && fun(window["_man_fonts_"+this.loadkey].checkFontsStatus)) {
						window["_man_fonts_"+this.loadkey].checkFontsStatus();
					}
				}.bind(node));
			}
			else {
			}
		}
		if(fun(this.checkFontsStatus)) {
			this.checkFontsStatus();
		}
	}
	window["_man_fonts_"+loadkey].checkFontsStatus = function(event) {
		var i, node;
		for(i = 0; i < this.nodes.length; i++) {
			node = this.nodes[i];
			if(window["_man_fonts_"].fonts[node.font_id].status == "waiting") {
				if(this.start_time + this.max_time <= new Date().getTime()) {
					if(fun(this.callback_node[this.callback_timeout])) {
						this.callback_node[this.callback_timeout]();
					}
					else if(fun(this.callback_node[this.callback_name])) {
						this.callback_node[this.callback_name]();
					}
					u.t.resetTimer(this.t_timeout);
					delete window["_man_fonts_"+this.loadkey];
				}
				return;
			}
		}
		if(fun(this.callback_node[this.callback_name])) {
			this.callback_node[this.callback_name]();
		}
		u.t.resetTimer(this.t_timeout);
		delete window["_man_fonts_"+this.loadkey];
	}
	window["_man_fonts_"+loadkey].checkFontsFallback = function() {
		var basenode, i, node, loaded = 0;
		for(i = 0; i < this.nodes.length; i++) {
			node = this.nodes[i];
			basenode = this.basenodes[node.font_style+node.font_weight];
			if(node.offsetWidth != basenode.offsetWidth || node.offsetHeight != basenode.offsetHeight) {
				loaded++;
			}
		}
		if(loaded == this.nodes.length) {
			if(fun(this.callback_node[this.callback_name])) {
				this.callback_node[this.callback_name]();
			}
			this.parentNode.removeChild(this);
		}
		else {
			if(this.start_time + this.max_time > new Date().getTime()) {
				u.t.setTimer(this, "checkfonts", 30);
			}
			else {
				if(fun(this.callback_node[this.callback_timeout])) {
					this.callback_node[this.callback_timeout]();
				}
				else if(fun(this.callback_node[this.callback_name])) {
					this.callback_node[this.callback_name]();
				}
			}
		}
	}
	if(window["_man_fonts_"].fontApi) {
		window["_man_fonts_"+loadkey].checkFontsAPI();
	}
	else {
		window["_man_fonts_"+loadkey].checkFontsFallback();
	}
}

/*beta-u-notifier.js*/
u.notifier = function(node) {
	u.bug_force = true;
	u.bug("enable notifier");
	var notifications = u.qs("div.notifications", node);
	if(!notifications) {
		node.notifications = u.ae(node, "div", {"id":"notifications"});
	}
	node.notifications.hide_delay = 4500;
	node.notifications.hide = function(node) {
		u.a.transition(this, "all 0.5s ease-in-out");
		u.a.translate(this, 0, -this.offsetHeight);
	}
	node.notify = function(response, _options) {
		var class_name = "message";
		if(obj(_options)) {
			var argument;
			for(argument in _options) {
				switch(argument) {
					case "class"	: class_name	= _options[argument]; break;
				}
			}
		}
		var output = [];
		if(obj(response)) {
			var message = response.cms_message;
			var cms_status = typeof(response.cms_status) != "undefined" ? response.cms_status : "";
			if(obj(message)) {
				for(type in message) {
					if(str(message[type])) {
						output.push(u.ae(this.notifications, "div", {"class":class_name+" "+cms_status+" "+type, "html":message[type]}));
					}
					else if(obj(message[type]) && message[type].length) {
						var node, i;
						for(i = 0; i < message[type].length; i++) {
							_message = message[type][i];
							output.push(u.ae(this.notifications, "div", {"class":class_name+" "+cms_status+" "+type, "html":_message}));
						}
					}
				}
			}
			else if(str(message)) {
				output.push(u.ae(this.notifications, "div", {"class":class_name+" "+cms_status, "html":message}));
			}
			if(fun(this.notifications.show)) {
				this.notifications.show();
			}
		}
		else if(obj(response) && response.isHTML) {
			var login = u.qs(".scene.login form", response);
			var messages = u.qsa(".scene div.messages p", response);
			if(login && !u.qs("#login_overlay")) {
				// 
				// 
				this.autosave_disabled = true;
				if(page.t_autosave) {
					u.t.resetTimer(page.t_autosave);
				}
				var overlay = u.ae(document.body, "div", {"id":"login_overlay"});
				overlay.node = this;
				u.ae(overlay, login);
				u.as(document.body, "overflow", "hidden");
				var relogin = u.ie(login, "h1", {"class":"relogin", "html":(u.txt["relogin"] ? u.txt["relogin"] : "Your session expired")});
				login.overlay = overlay;
				u.ae(login, "input", {"type":"hidden", "name":"ajaxlogin", "value":"true"})
				u.f.init(login);
				login.fields["username"].focus();
				login.submitted = function() {
					this.response = function(response) {
						if(response.isJSON && response.cms_status == "success") {
							var csrf_token = response.cms_object["csrf-token"];
							var data_vars = u.qsa("[data-csrf-token]", page);
							var input_vars = u.qsa("[name=csrf-token]", page);
							var dom_vars = u.qsa("*", page);
							var i, node;
							for(i = 0; i < data_vars.length; i++) {
								node = data_vars[i];
								node.setAttribute("data-csrf-token", csrf_token);
							}
							for(i = 0; ni <input_vars.length; i++) {
								node = input_vars[i];
								node.value = csrf_token;
							}
							for(i = 0;i <= dom_vars.length; i++) {
								node = dom_vars[i];
								if(node.csrf_token) {
									node.csrf_token = csrf_token;
								}
							}
							this.overlay.parentNode.removeChild(this.overlay);
							var multiple_overlays = u.qsa("#login_overlay");
							if(multiple_overlays) {
								for(i = 0; i < multiple_overlays.length; i++) {
									overlay = multiple_overlays[i];
									overlay.parentNode.removeChild(overlay);
								}
							}
							u.as(document.body, "overflow", "auto");
							this.overlay.node.autosave_disabled = false;
							if(this.overlay.node._autosave_node && this.overlay.node._autosave_interval) {
								u.t.setTimer(this.overlay.node._autosave_node, "autosave", this.overlay.node._autosave_interval);
							}
						}
						else {
							this.fields["username"].focus();
							this.fields["password"].val("");
							var error_message = u.qs(".errormessage", response);
							if(error_message) {
								this.overlay.node.notify({"isJSON":true, "cms_status":"error", "cms_message":error_message.innerHTML});
							}
							else {
								this.overlay.node.notify({"isJSON":true, "cms_status":"error", "cms_message":"An error occured"});
							}
						}
					}
					u.request(this, this.action, {"method":this.method, "params":u.f.getParams(this)});
				}
			}
			else if(messages) {
				for(i = 0; i < messages.length; i++) {
					message = messages[i];
					output.push(u.ae(this.notifications, "div", {"class":message.className, "html":message.innerHTML}));
				}
			}
		}
		this.t_notifier = u.t.setTimer(this.notifications, this.notifications.hide, this.notifications.hide_delay, output);
	}
}


/*i-page.js*/
u.bug_console_only = true;
Util.Objects["page"] = new function() {
	this.init = function(page) {
		window.page = page;
		u.bug_force = true;
		u.bug("This site is built using the combined powers of body, mind and spirit. Well, and also Manipulator, Janitor and Detector");
		u.bug("Visit https://parentnode.dk for more information");
		u.bug_force = false;
		page.style_tag = document.createElement("style");
		page.style_tag.setAttribute("media", "all")
		page.style_tag.setAttribute("type", "text/css")
		page.style_tag = u.ae(document.head, page.style_tag);
		page.hN = u.qs("#header");
		page.hN.service = u.qs("ul.servicenavigation", page.hN);
		page.cN = u.qs("#content", page);
		page.nN = u.qs("#navigation", page);
		page.nN = u.ie(page.hN, page.nN);
		page.fN = u.qs("#footer");
		page.fN.service = u.qs("ul.servicenavigation", page.fN);
		page.resized = function(event) {
			page.browser_h = u.browserH();
			page.browser_w = u.browserW();
			page.available_height = page.browser_h - page.hN.offsetHeight - page.fN.offsetHeight;
			u.as(page.cN, "min-height", "auto", false);
			if(page.available_height >= page.cN.offsetHeight) {
				u.as(page.cN, "min-height", page.available_height+"px", false);
			}
			if(page.browser_w > 1300) {
				u.ac(page, "fixed");
			}
			else {
				u.rc(page, "fixed");
			}
			if(page.cN && page.cN.scene && typeof(page.cN.scene.resized) == "function") {
				page.cN.scene.resized(event);
			}
			page.offsetHeight;
		}
		page.scrolled = function(event) {
			page.scrolled_y = u.scrollY();
			if(typeof(u.logoScroller) == "function") {
				u.logoScroller();
			}
			else {
				if(page.scrolled_y < page.logo.top_offset) {
					page.logo.is_reduced = false;
					var reduce_font = (1-(page.logo.top_offset-page.scrolled_y)/page.logo.top_offset) * page.logo.font_size_gap;
					page.logo.css_rule.style.setProperty("font-size", (page.logo.font_size-reduce_font)+"px", "important");
				}
				else if(!page.logo.is_reduced) {
					page.logo.is_reduced = true;
					page.logo.css_rule.style.setProperty("font-size", (page.logo.font_size-page.logo.font_size_gap)+"px", "important");
				}
			}
			if(page.nN.top_offset && page.scrolled_y < page.nN.top_offset) {
				page.nN.is_reduced = false;
				var factor = (1-(page.nN.top_offset-page.scrolled_y)/page.nN.top_offset);
				var reduce_font = factor * page.nN.font_size_gap;
				page.nN.list.css_rule.style.setProperty("font-size", (page.nN.font_size-reduce_font)+"px", "important");
				var reduce_top = factor * page.nN.top_offset_gap;
				page.nN.css_rule.style.setProperty("top", (page.nN.top_offset-reduce_top)+"px", "important");
			}
			else if(page.nN.top_offset && !page.nN.is_reduced) {
				page.nN.is_reduced = true;
				page.nN.list.css_rule.style.setProperty("font-size", (page.nN.font_size-page.nN.font_size_gap)+"px", "important");
				page.nN.css_rule.style.setProperty("top", (page.nN.top_offset-page.nN.top_offset_gap)+"px", "important");
			}
			if(page.cN && page.cN.scene && typeof(page.cN.scene.scrolled) == "function") {
				page.cN.scene.scrolled(event);
			}
		}
		page.ready = function() {
			if(!this.is_ready) {
				this.is_ready = true;
				u.e.addEvent(window, "resize", page.resized);
				u.e.addEvent(window, "scroll", page.scrolled);
				if(typeof(u.notifier) == "function") {
					u.notifier(this);
				}
				if(typeof(u.smartphoneSwitch) == "object") {
					u.smartphoneSwitch.init(this);
				}
				this.initHeader();
				this.initNavigation();
				this.initFooter();
				this.resized();
			}
		}
		page.acceptCookies = function() {
			if(u.terms_version && !u.getCookie(u.terms_version)) {
				var terms_link = u.qs("li.terms a");
				if(terms_link && terms_link.href) {
					var terms = u.ie(document.body, "div", {"class":"terms_notification"});
					u.ae(terms, "h3", {"html":u.stringOr(u.txt["terms-headline"], "We love <br />cookies and privacy")});
					var bn_accept = u.ae(terms, "a", {"class":"accept", "html":u.stringOr(u.txt["terms-accept"], "Accept")});
					bn_accept.terms = terms;
					u.ce(bn_accept);
					bn_accept.clicked = function() {
						this.terms.parentNode.removeChild(this.terms);
						u.saveCookie(u.terms_version, true, {"path":"/", "expires":false});
					}
					if(!location.href.match(terms_link.href)) {
						var bn_details = u.ae(terms, "a", {"class":"details", "html":u.stringOr(u.txt["terms-details"], "Details"), "href":terms_link.href});
						u.ce(bn_details, {"type":"link"});
					}
					u.a.transition(terms, "all 0.5s ease-in");
					u.ass(terms, {
						"opacity": 1
					});
				}
			}
		}
		page.initHeader = function() {
			page.logo = u.ie(page.hN, "a", {"class":"logo", "html":u.eitherOr(u.site_name, "Frontpage")});
			page.logo.url = '/';
			page.logo.font_size = parseInt(u.gcs(page.logo, "font-size"));
			page.logo.font_size_gap = page.logo.font_size-14;
			page.logo.top_offset = u.absY(page.nN) + parseInt(u.gcs(page.nN, "padding-top"));
			page.style_tag.sheet.insertRule("#header a.logo {}", 0);
			page.logo.css_rule = page.style_tag.sheet.cssRules[0];
		}
		page.initNavigation = function() {
			var i, node, nodes;
			page.nN.list = u.qs("ul", page.nN);
			if(page.nN.list) {
				page.nN.list.nodes = u.qsa("li", page.nN.list);
				if(page.nN.list.nodes.length > 1) {
					page.nN.font_size = parseInt(u.gcs(page.nN.list.nodes[1], "font-size"));
					page.nN.font_size_gap = page.nN.font_size-14;
					page.nN.top_offset = u.absY(page.nN) + parseInt(u.gcs(page.nN, "padding-top"));
					page.nN.top_offset_gap = page.nN.top_offset-10;
					page.style_tag.sheet.insertRule("#navigation {}", 0);
					page.nN.css_rule = page.style_tag.sheet.cssRules[0];
					page.style_tag.sheet.insertRule("#navigation ul li {}", 0);
					page.nN.list.css_rule = page.style_tag.sheet.cssRules[0];
				}
			}
			nodes = u.qsa("#navigation li,a.logo", page.hN);
			for(i = 0; node = nodes[i]; i++) {
				u.ce(node, {"type":"link"});
				u.e.hover(node);
				node.over = function() {
					u.a.transition(this, "none");
					this.transitioned = function() {
						this.transitioned = function() {
							this.transitioned = function() {
								u.a.transition(this, "none");
							}
							u.a.transition(this, "all 0.1s ease-in-out");
							u.a.scale(this, 1.2);
						}
						u.a.transition(this, "all 0.1s ease-in-out");
						u.a.scale(this, 1.15);
					}
					if(this._scale != 1.22) {
						u.a.transition(this, "all 0.1s ease-in-out");
						u.a.scale(this, 1.22);
					}
					else {
						this.transitioned();
					}
				}
				node.out = function() {
					u.a.transition(this, "none");
					this.transitioned = function() {
						this.transitioned = function() {
							u.a.transition(this, "none");
						}
						u.a.transition(this, "all 0.1s ease-in");
						u.a.scale(this, 1);
					}
					if(this._scale != 0.8) {
						u.a.transition(this, "all 0.1s ease-in");
						u.a.scale(this, 0.8);
					}
					else {
						this.transitioned();
					}
				}
			}
			if(page.hN.service) {
				var nav_anchor = u.qs("li.navigation", page.hN.service);
				if(nav_anchor) {
					page.hN.service.removeChild(nav_anchor);
				}
			}
			if(page.fN.service) {
				nodes = u.qsa("li", page.fN.service);
				for(i = 0; node = nodes[i]; i++) {
					u.ie(page.hN.service, node);
				}
				page.fN.removeChild(page.fN.service);
			}
			if(u.github_fork) {
				var github = u.ae(page.hN.service, "li", {"html":'<a href="'+u.github_fork.url+'">'+u.github_fork.text+'</a>', "class":"github"});
				u.ce(github, {"type":"link"});
			}
		}
		page.initFooter = function() {
			u.a.transition(page.fN, "all 0.5s ease-in");
			u.ass(page.fN, {
				"opacity":1
			});
		}
		page.ready();
	}
}
u.e.addDOMReadyEvent(u.init);


/*i-front.js*/
Util.Objects["scene"] = new function() {
	this.init = function(scene) {
		scene.resized = function() {
			this.offsetHeight;
		}
		scene.scrolled = function() {
		}
		scene.ready = function() {
			page.cN.scene = this;
			page.acceptCookies();
			page.resized();
		}
		scene.ready();
	}
}

/*i-scene.js*/
Util.Objects["scene"] = new function() {
	this.init = function(scene) {
		scene.resized = function() {
			this.offsetHeight;
		}
		scene.scrolled = function() {
		}
		scene.ready = function() {
			page.cN.scene = this;
			page.acceptCookies();
			page.resized();
		}
		scene.ready();
	}
}

/*i-login.js*/
Util.Objects["login"] = new function() {
	this.init = function(scene) {
		u.bug("scene init:" + u.nodeId(scene))
		scene.resized = function() {
		}
		scene.scrolled = function() {
		}
		scene.ready = function() {
			this._form = u.qs("form", this);
			u.f.init(this._form);
			this._form.fields["username"].focus();
			page.cN.scene = this;
			page.resized();
		}
		scene.ready();
	}
}


/*i-signup.js*/
Util.Objects["signup"] = new function() {
	this.init = function(scene) {
		scene.resized = function() {
		}
		scene.scrolled = function() {
		}
		scene.ready = function() {
			page.cN.scene = this;
			var signup_form = u.qs("form.signup", this);
			var place_holder = u.qs("div.articlebody .placeholder.signup", this);
			if(signup_form && place_holder) {
				place_holder.parentNode.replaceChild(signup_form, place_holder);
			}
			if(signup_form) {
				u.f.init(signup_form);
			}
			page.acceptCookies();
			page.resized();
		}
		scene.ready();
	}
}


/*i-newsletter.js*/
Util.Objects["newsletter"] = new function() {
	this.init = function(scene) {
		scene.resized = function() {
		}
		scene.scrolled = function() {
		}
		scene.ready = function() {
			this._form = u.qs("form", this);
			u.f.init(this._form);
			page.cN.scene = this;
			page.resized();
		}
		scene.ready();
	}
}


/*i-article.js*/
Util.Objects["article"] = new function() {
	this.init = function(article) {
		u.bug("article init:" + u.nodeId(article));
		article.csrf_token = article.getAttribute("data-csrf-token");
		article.header = u.qs("h1,h2,h3", article);
		article.header.article = article;
		var i, image;
		article._images = u.qsa("div.image,div.media", article);
		for(i = 0; image = article._images[i]; i++) {
			image.node = article;
			image.caption = u.qs("p a", image);
			if(image.caption) {
				image.caption.removeAttribute("href");
			}
			image._id = u.cv(image, "item_id");
			image._format = u.cv(image, "format");
			image._variant = u.cv(image, "variant");
			if(image._id && image._format) {
				image._image_src = "/images/" + image._id + "/" + (image._variant ? image._variant+"/" : "") + "540x." + image._format;
				u.ass(image, {
					"opacity": 0
				});
				image.loaded = function(queue) {
					u.ac(this, "loaded");
					this._image = u.ie(this, "img");
					this._image.image = this;
					this._image.src = queue[0].image.src;
					if(this.node.article_list) {
						this.node.article_list.correctScroll(this.node, this, -10);
					}
					u.ce(this._image);
					this._image.clicked = function() {
						if(u.hc(this.image, "fullsize")) {
							u.a.transition(this, "all 0.3s ease-in-out");
							u.rc(this.image, "fullsize");
							this.src = this.image._image_src;
						}
						else {
							u.a.transition(this, "all 0.3s ease-in-out");
							u.ac(this.image, "fullsize");
							if(this._fullsize_src) {
								this.src = this._fullsize_src;
							}
							else {
								this._fullsize_width = 1300;
								this._fullsize_src = "/images/" + this.image._id + "/" + (this.image._variant ? this.image._variant+"/" : "") + this._fullsize_width + "x." + this.image._format;
								this.response = function() {
									this.src = this._fullsize_src;
								}
								this.responseError = function() {
									this._fullsize_width = this._fullsize_width-200;
									this._fullsize_src = "/images/" + this._id + "/" + (this.image._variant ? this.image._variant+"/" : "") + this._fullsize_width + "x." + this.image._format;
									u.request(this, this._fullsize_src);
								}
								u.request(this, this._fullsize_src);
							}
						}
					}
					u.a.transition(this, "all 0.5s ease-in-out");
					u.ass(this, {
						"opacity": 1
					});
				}
				u.preloader(image, [image._image_src]);
			}
		}
		article.geolocation = u.qs("ul.geo", article);
		if(article.geolocation && typeof(u.injectGeolocation) == "function") {
			u.injectGeolocation(article);
		}
		var hardlink = u.qs("li.main_entity.share", article);
		article.hardlink = hardlink ? (hardlink.hasAttribute("content") ? hardlink.getAttribute("content") : hardlink.innerHTML) : false;
		if(article.hardlink && typeof(u.injectSharing) == "function") {
			article.shareInjected = function() {
				if(this.article_list) {
					this.article_list.correctScroll(this, this.sharing);
				}
			}
			u.injectSharing(article);
		}
		article.header.current_readstate = article.getAttribute("data-readstate");
		article.add_readstate_url = article.getAttribute("data-readstate-add");
		article.delete_readstate_url = article.getAttribute("data-readstate-delete");
		if(article.header.current_readstate || (article.add_readstate_url && article.delete_readstate_url)) {
			u.addCheckmark(article.header);
			u.ce(article.header.checkmark);
			article.header.checkmark.clicked = function(event) {
				this.out(event);
				if(this.node.current_readstate) {
					this.response = function(response) {
						if(response.cms_status == "success" && response.cms_object) {
							this.setAttribute("class", "checkmark not_read");
							this.node.current_readstate = false;
							this.node.article.setAttribute("data-readstate", "");
							this.hint_txt = u.txt["readstate-not_read"];
						}
					}
					u.request(this, this.node.article.delete_readstate_url, {"method":"post", "params":"csrf-token="+this.node.article.csrf_token+"&item_id"});
				}
				else {
					this.response = function(response) {
						if(response.cms_status == "success" && response.cms_object) {
							this.setAttribute("class", "checkmark read");
							this.node.current_readstate = new Date();
							this.node.article.setAttribute("data-readstate", this.node.current_readstate);
							this.hint_txt = u.txt["readstate-read"] + ", " + u.date("Y-m-d H:i:s", this.node.current_readstate);
						}
					}
					u.request(this, this.node.article.add_readstate_url, {"method":"post", "params":"csrf-token="+this.node.article.csrf_token});
				}
			}
		}
	}
}


/*i-todolist.js*/
Util.Objects["todolist"] = new function() {
	this.init = function(scene) {
		scene.resized = function() {
		}
		scene.scrolled = function() {
		}
		scene.ready = function() {
			u.bug("scene.ready:" + u.nodeId(this));
			this.nodes = u.qsa("li.item", this);
			if(this.nodes.length) {
				var i, node;
				for(i = 0; node = this.nodes[i]; i++) {
					node.item_id = u.cv(node, "id");
					node.actions = u.qs("ul.actions", node);
					node.close_form = u.qs("li.close form", node);
					u.f.init(node.close_form);
					node.bn_close = u.qs("input[type=submit]", node.close_form);
					node.bn_close.node = node;
					u.e.click(node.bn_close)
					node.bn_close.clicked = function(event) {
						u.e.kill(event);
						this.response = function(response) {
							if(response.cms_status == "success") {
								u.ac(this.node.actions, "closed");
							}
							else {
							}
						}
						u.request(this, this.form.action, {"method":this.form.method, "params":u.f.getParams(this.form)});
					}
					node.open_form = u.qs("li.open form", node);
					u.f.init(node.open_form);
					node.bn_open = u.qs("input[type=submit]", node.open_form);
					node.bn_open.node = node;
					u.e.click(node.bn_open)
					node.bn_open.clicked = function(event) {
						u.e.kill(event);
						this.response = function(response) {
							if(response.cms_status == "success") {
								u.rc(this.node.actions, "closed");
							}
							else {
							}
						}
						u.request(this, this.form.action, {"method":this.form.method, "params":u.f.getParams(this.form)});
					}
				}
			}
			page.cN.scene = this;
			page.resized();
		}
		scene.ready();
	}
}

