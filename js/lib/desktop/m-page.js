Util.Modules["page"] = new function() {
	this.init = function(page) {
		// u.bug("init page");

		// show parentnode comment in console
		u.bug_force = true;
		u.bug("This site is built using the combined powers of body, mind and spirit. Well, and also Manipulator, Janitor and Detector");
		if(document.domain !== "parentnode.dk") {
			u.bug("Visit https://parentnode.dk for more information");
		}
		u.bug_force = false;


		// create a generel style rule
		page.style_tag = document.createElement("style");
		page.style_tag.setAttribute("media", "all");
		page.style_tag.setAttribute("type", "text/css");
		page.style_tag = u.ae(document.head, page.style_tag);


		// header reference
		page.hN = u.qs("#header");
		page.hN.service = u.qs("ul.servicenavigation", page.hN);


		// content reference
		page.cN = u.qs("#content", page);


		// navigation reference
		page.nN = u.qs("#navigation", page);
		page.nN = u.ie(page.hN, page.nN);


		// footer reference
		page.fN = u.qs("#footer");
		page.fN.service = u.qs("ul.servicenavigation", page.fN);



		// global resize handler
		page.resized = function(event) {
			// u.bug("page resized");

			page.browser_h = u.browserH();
			page.browser_w = u.browserW();


			// adjust content height
			page.available_height = page.browser_h - page.hN.offsetHeight - page.fN.offsetHeight;
			// Reset to auto height to be able to calculate real height
			u.as(page.cN, "min-height", "auto", false);
			if(page.available_height >= page.cN.offsetHeight) {
				u.as(page.cN, "min-height", page.available_height+"px", false);
			}


			// Fixed width above 1080 px
			if(page.browser_w > 1080) {
				u.ac(page, "fixed");
			}
			else {
				u.rc(page, "fixed");
			}


			// forward resize event to current scene
			if(page.cN && page.cN.scene && typeof(page.cN.scene.resized) == "function") {
				page.cN.scene.resized(event);
			}

			// refresh DOM
			page.offsetHeight;

		}

		// global scroll handler
		page.scrolled = function(event) {

			this.scrolled_y = u.scrollY();


			// allow for custom logo reduction (used on stopknappen)
			if(fun(u.logoScroller)) {
				u.logoScroller();
			}
			else {
				// reduce logo
				if(this.scrolled_y < this.logo.top_offset) {

					this.logo.is_reduced = false;

					var reduce_font = (1-(this.logo.top_offset-this.scrolled_y)/this.logo.top_offset) * this.logo.font_size_gap;
					this.logo.css_rule.style.setProperty("font-size", (this.logo.font_size-reduce_font)+"px", "important");
				}
				// claim end state, once
				else if(!this.logo.is_reduced) {

					this.logo.is_reduced = true;
					this.logo.css_rule.style.setProperty("font-size", (this.logo.font_size-this.logo.font_size_gap)+"px", "important");
				}
			}


			// reduce navigation
			if(this.nN.top_offset && this.scrolled_y < this.nN.top_offset) {

				this.nN.is_reduced = false;

				var factor = (1-(this.nN.top_offset-this.scrolled_y)/this.nN.top_offset);

				var reduce_font = factor * this.nN.font_size_gap;
				this.nN.list.css_rule.style.setProperty("font-size", (this.nN.font_size-reduce_font)+"px", "important");

				var reduce_top = factor * this.nN.top_offset_gap;
				this.nN.css_rule.style.setProperty("top", (this.nN.top_offset-reduce_top)+"px", "important");

			}
			// claim end state, once
			else if(this.nN.top_offset && !this.nN.is_reduced) {

				this.nN.is_reduced = true;

				this.nN.list.css_rule.style.setProperty("font-size", (this.nN.font_size-this.nN.font_size_gap)+"px", "important");
				this.nN.css_rule.style.setProperty("top", (this.nN.top_offset-this.nN.top_offset_gap)+"px", "important");
			}


			// forward scroll event to current scene
			if(this.cN && this.cN.scene && typeof(this.cN.scene.scrolled) == "function") {
				this.cN.scene.scrolled(event);
			}

		}

		// Preload page assets
		page.preload = function() {

			// Local pagePreloader
			if(fun(u.pagePreloader)) {
				u.pagePreloader();
			}
			else {

				// preload fonts
				u.fontsReady(this, [
					{"family":"OpenSans", "weight":"normal", "style":"normal"},
					{"family":"OpenSans", "weight":"bold", "style":"normal"},
					{"family":"OpenSans", "weight":"normal", "style":"italic"},
					{"family":"PT Serif", "weight":"normal", "style":"normal"}
				], {"callback": "ready"});

			}
		}


		// Page is ready - called from several places, evaluates when page is ready to be shown
		page.ready = function() {
			// u.bug("page ready");

			// page is ready to be shown - only initalize if not already shown
			if(!this.is_ready) {

				// page is ready
				this.is_ready = true;

				// set resize handler
				u.e.addWindowEvent(this, "resize", this.resized);
				// set scroll handler
				u.e.addWindowEvent(this, "scroll", this.scrolled);


				if(fun(u.notifier)) {
					u.notifier(this);
				}
				if(obj(u.smartphoneSwitch)) {
					u.smartphoneSwitch.init(this);
				}
				if(fun(u.navigation)) {
					u.navigation();
				}



				this.initHeader();

				this.initNavigation();

				this.initFooter();

				this.resized();

				this.scrolled();

				// Start showing the page
				if(!fun(this.cN.scene.revealPage)) {
					this.revealPage();
				}

				this.cN.scene.ready();

			}
		}

		// Handle popstate url changes
		page.cN.navigate = function(url, raw_url) {
			if(raw_url) {
				location.reload(true);
			}
			else {
				location.href = url;
			}
		}

		// show accept cookies dialogue
		page.acceptCookies = function() {
			// u.bug("acceptCookies", u.terms_version);

			// show terms notification
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

					// show terms/cookie approval
					u.a.transition(terms, "all 0.5s ease-in");
					u.ass(terms, {
						"opacity": 1
					});

				}

			}

		}


		// initialize header elements
		page.initHeader = function() {

			// LOGO
			// add logo to navigation
			page.logo = u.ie(page.hN, "a", {"class":"logo", "html":u.eitherOr(u.site_name, "Frontpage")});
			page.logo.url = '/';
			page.logo.font_size = parseInt(u.gcs(page.logo, "font-size"));
			page.logo.font_size_gap = page.logo.font_size-14;
			page.logo.top_offset = u.absY(page.nN) + parseInt(u.gcs(page.nN, "padding-top"));


			// create rule for logo
			page.style_tag.sheet.insertRule("#header a.logo {}", 0);
			page.logo.css_rule = page.style_tag.sheet.cssRules[0];

		}

		// initialize navigation elements
		page.initNavigation = function() {

			var i, node, nodes;

			page.nN.list = u.qs("ul", page.nN);
			if(page.nN.list) {
				page.nN.list.nodes = u.qsa("li", page.nN.list);

				if(page.nN.list.nodes.length > 1) {
					// set reducing scope
					page.nN.font_size = parseInt(u.gcs(page.nN.list.nodes[1], "font-size"));
					page.nN.font_size_gap = page.nN.font_size-14;
					page.nN.top_offset = u.absY(page.nN) + parseInt(u.gcs(page.nN, "padding-top"));
					page.nN.top_offset_gap = page.nN.top_offset-10;

					// create rule for Navigation
					page.style_tag.sheet.insertRule("#navigation {}", 0);
					page.nN.css_rule = page.style_tag.sheet.cssRules[0];

					// create rule for Navigation nodes
					page.style_tag.sheet.insertRule("#navigation ul li {}", 0);
					page.nN.list.css_rule = page.style_tag.sheet.cssRules[0];
		//			u.bug("cssText:" + page.nN.css_rule.cssText + ", " + u.nodeId(page.nN));
				}
			}


			// enable navigation link animation where relevant
			nodes = u.qsa("#navigation li,a.logo", page.hN);
			for(i = 0; node = nodes[i]; i++) {

				u.ce(node, {"type":"link"});

				// add over and out animation
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

			// remove accessibility #navigation anchor from header servicenavigation
			if(page.hN.service) {
				var nav_anchor = u.qs("li.navigation", page.hN.service);
				if(nav_anchor) {
					page.hN.service.removeChild(nav_anchor);
				}
			}

			// insert footer servicenavigation into header servicenavigation
			if(page.fN.service) {
				nodes = u.qsa("li", page.fN.service);
				for(i = 0; node = nodes[i]; i++) {
					u.ie(page.hN.service, node);
				}
				page.fN.removeChild(page.fN.service);
			}

			// Add FORK ME?
			if(u.github_fork) {
				var github = u.ae(page.hN.service, "li", {"html":'<a href="'+u.github_fork.url+'">'+u.github_fork.text+'</a>', "class":"github"});
				u.ce(github, {"type":"link"});
			}

			if(fun(u.logoInjected)) {
				u.logoInjected();
			}

		}

		// initialize footer elements
		page.initFooter = function() {}

		// Show page elements (header, navigation, footer)
		page.revealPage = function() {
			// u.bug("page.revealPage");

			u.a.transition(page.hN, "all 0.3s ease-in");
			u.ass(page.hN, {
				"opacity":1
			});

			u.a.transition(page.nN, "all 0.3s ease-in");
			u.ass(page.nN, {
				"opacity":1
			});

			u.a.transition(page.fN, "all 0.3s ease-in");
			u.ass(page.fN, {
				"opacity":1
			});

			// accept cookies?
			this.acceptCookies();

		}

		// ready to start page preload process
		page.preload();

	}
}

u.e.addDOMReadyEvent(u.init);
