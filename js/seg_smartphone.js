/*
Manipulator v0.9.2-full Copyright 2017 http://manipulator.parentnode.dk
asset-builder @ 2018-11-08 15:28:35
*/

/*seg_smartphone_include.js*/
document.write('<script type="text/javascript" src=/js/manipulator/merged/seg_smartphone.js"></script>');

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


/*u-form-custom.js*/
u.f.fixFieldHTML = function(field) {
	u.bug("fixFieldHTML");
	var label = u.qs("label", field);
	if(label) {
		u.ae(label, field._indicator);
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
		page.hN = u.qs("#header");
		page.hN.service = u.qs(".servicenavigation", page.hN);
		u.e.drag(page.hN, page.hN);
		page.logo = u.ie(page.hN, "a", {"class":"logo", "html":u.eitherOr(u.site_name, "Frontpage")});
		page.logo.url = '/';
		page.cN = u.qs("#content", page);
		page.nN = u.qs("#navigation", page);
		page.nN = u.ie(page.hN, page.nN);
		page.fN = u.qs("#footer");
		page.fN.service = u.qs(".servicenavigation", page.fN);
		page.resized = function() {
			this.browser_h = u.browserH();
			this.browser_w = u.browserW();
			this.available_height = this.browser_h - this.hN.offsetHeight - this.fN.offsetHeight;
			u.as(this.cN, "min-height", "auto", false);
			if(this.available_height >= this.cN.offsetHeight) {
				u.as(this.cN, "min-height", this.available_height+"px", false);
			}
			if(this.cN && this.cN.scene && typeof(this.cN.scene.resized) == "function") {
				this.cN.scene.resized();
			}
			this.offsetHeight;
		}
		page.fixiOSScroll = function() {
			u.ass(this.hN, {
				"position":"absolute",
			});
			u.ass(this.hN, {
				"position":"fixed",
			});
		}
		page.scrolled = function() {
			u.t.resetTimer(this.t_fix);
			this.t_fix = u.t.setTimer(this, "fixiOSScroll", 200);
			this.scrolled_y = u.scrollY();
			if(this.cN && this.cN.scene && typeof(this.cN.scene.scrolled) == "function") {
				this.cN.scene.scrolled();
			}
		}
		page.orientationchanged = function() {
			if(u.hc(page.bn_nav, "open")) {
				u.as(page.hN, "height", window.innerHeight + "px");
			}
			if(page.cN && page.cN.scene && typeof(page.cN.scene.orientationchanged) == "function") {
				page.cN.scene.orientationchanged();
			}
		}
		page.ready = function() {
			if(!this.is_ready) {
				this.is_ready = true;
				u.e.addWindowEvent(this, "resize", this.resized);
				u.e.addWindowEvent(this, "scroll", this.scrolled);
				u.e.addWindowEvent(this, "orientationchange", this.orientationchanged);
				if(typeof(u.notifier) == "function") {
					u.notifier(this);
				}
				if(u.getCookie("smartphoneSwitch") == "on") {
					console.log("Back to desktop")
					var bn_switch = u.ae(document.body, "div", {id:"desktop_switch", html:"Back to desktop"});
					u.ce(bn_switch);
					bn_switch.clicked = function() {
						u.saveCookie("smartphoneSwitch", "off");
						location.href = location.href.replace(/[&]segment\=smartphone|segment\=smartphone[&]?/, "") + (location.href.match(/\?/) ? "&" : "?") + "segment=desktop";
					}
				}
				this.initNavigation();
				this.resized();
			}
		}
		page.acceptCookies = function() {
			if(u.terms_version && !u.getCookie(u.terms_version)) {
				var terms_link = u.qs("li.terms a");
				if(terms_link && (terms_link.href || terms_link.parentNode.url)) {
					var terms_url = terms_link.href || terms_link.parentNode.url;
					var terms = u.ie(page.cN, "div", {"class":"terms_notification"});
					u.ae(terms, "h3", {"html":u.stringOr(u.txt["terms-headline"], "We love <br />cookies and privacy")});
					var bn_accept = u.ae(terms, "a", {"class":"accept", "html":u.stringOr(u.txt["terms-accept"], "Accept")});
					bn_accept.terms = terms;
					u.ce(bn_accept);
					bn_accept.clicked = function() {
						this.terms.parentNode.removeChild(this.terms);
						u.saveCookie(u.terms_version, true, {"path":"/", "expires":false});
					}
					if(!location.href.match(terms_url)) {
						var bn_details = u.ae(terms, "a", {"class":"details", "html":u.stringOr(u.txt["terms-details"], "Details"), "href":terms_url});
						u.ce(bn_details, {"type":"link"});
					}
					u.a.transition(terms, "all 0.5s ease-in");
					u.ass(terms, {
						"opacity": 1
					});
				}
			}
		}
		page.initNavigation = function() {
			this.nN.list = u.qs("ul.navigation", this.nN);
			this.bn_nav = u.qs(".servicenavigation li.navigation", this.hN);
			if(this.bn_nav) {
				u.ae(this.bn_nav, "div");
				u.ae(this.bn_nav, "div");
				u.ae(this.bn_nav, "div");
				u.ce(this.bn_nav);
				this.bn_nav.clicked = function(event) {
					if(u.hc(this, "open")) {
						u.rc(this, "open");
						var i, node;
						for(i = 0; node = page.nN.nodes[i]; i++) {
							u.a.transition(node, "all 0.2s ease-in "+(i*100)+"ms");
							u.ass(node, {
								"opacity": 0,
								"transform":"translate(0, -30px)"
							});
						}
						page.hN.transitioned = function() {
							u.ass(page.nN, {
								"display": "none"
							});
						}
						u.a.transition(page.hN, "all 0.3s ease-in "+(page.nN.nodes.length*100)+"ms");
						u.ass(page.hN, {
							"height": "60px"
						});
					}
					else {
						u.ac(this, "open");
						var i, node;
						for(i = 0; node = page.nN.nodes[i]; i++) {
							u.ass(node, {
								"opacity": 0,
								"transform":"translate(0, 30px)"
							});
						}
						u.a.transition(page.hN, "all 0.3s ease-in");
						u.ass(page.hN, {
							"height": window.innerHeight+"px",
						});
						u.ass(page.nN, {
							"display": "block"
						});
						for(i = 0; node = page.nN.nodes[i]; i++) {
							u.a.transition(node, "all 0.3s ease-in "+(100 + (i*100))+"ms");
							u.ass(node, {
								"opacity": 1,
								"transform":"translate(0, 0)"
							});
						}
					}
					page.nN.start_drag_y = (window.innerHeight - 100) - page.nN.offsetHeight;
					page.nN.end_drag_y = page.nN.offsetHeight;
				}
				u.e.drag(this.nN, [0, (window.innerHeight - 100) - this.nN.offsetHeight, this.hN.offsetWidth, this.nN.offsetHeight], {"strict":false, "elastica":200, "vertical_lock":true});
			}
			if(page.fN.service) {
				nodes = u.qsa("li", page.fN.service);
				for(i = 0; node = nodes[i]; i++) {
					u.ae(page.nN.list, node);
				}
				page.fN.removeChild(page.fN.service);
			}
			if(page.hN.service) {
				nodes = u.qsa("li:not(.navigation)", page.hN.service);
				for(i = 0; node = nodes[i]; i++) {
					u.ae(page.nN.list, node);
				}
			}
			var i, node, nodes;
			nodes = u.qsa("#navigation li,a.logo", page.hN);
			for(i = 0; node = nodes[i]; i++) {
				u.ce(node, {"type":"link"});
				u.e.hover(node);
				node.over = function() {
					this.transitioned = function() {
						this.transitioned = function() {
							u.a.transition(this, "none");
						}
						u.a.transition(this, "all 0.1s ease-in-out");
						u.a.scale(this, 1.15);
					}
					u.a.transition(this, "all 0.1s ease-in-out");
					u.a.scale(this, 1.22);
				}
				node.out = function() {
					this.transitioned = function() {
						this.transitioned = function() {
							u.a.transition(this, "none");
						}
						u.a.transition(this, "all 0.1s ease-in-out");
						u.a.scale(this, 1);
					}
					u.a.transition(this, "all 0.1s ease-in-out");
					u.a.scale(this, 0.9);
				}
			}
			page.nN.nodes = u.qsa("li", page.nN.list);
			if(page.hN.service) {
				u.ass(page.hN.service, {
					"opacity":1
				});
			}
		}
		page.ready();
	}
}
u.e.addDOMReadyEvent(u.init);


/*i-front.js*/
Util.Objects["front"] = new function() {
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
				image._image_src = "/images/" + image._id + "/" + (image._variant ? image._variant+"/" : "") + "480x." + image._format;
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
	}
}

