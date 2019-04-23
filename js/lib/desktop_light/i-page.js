// can be removed after updating to next version of Manipulator
u.bug_console_only = true;

Util.Objects["page"] = new function() {
	this.init = function(page) {

		window.page = page;

		// show parentnode comment in console
		u.bug_force = true;
		u.bug("This site is built using the combined powers of body, mind and spirit. Well, and also Manipulator, Janitor and Detector");
		u.bug("Visit https://parentnode.dk for more information");
//		u.bug("Free lunch for new contributers ;-)");
		u.bug_force = false;


		// header reference
		page.hN = u.qs("#header");
		page.hN.service = u.qs(".servicenavigation", page.hN);


		// content reference
		page.cN = u.qs("#content", page);


		// navigation reference
		page.nN = u.qs("#navigation", page);
		page.nN = u.ie(page.hN, page.nN);


		// footer reference
		page.fN = u.qs("#footer");
		page.fN.service = u.qs(".servicenavigation", page.fN);


		// add logo to navigation
		page.logo = u.ie(page.hN, "a", {"class":"logo", "html":u.eitherOr(u.site_name, "Frontpage")});
		u.ce(page.logo);
		page.logo.clicked = function(event) {
			location.href = '/';
		}


		// global resize handler
		page.resized = function() {
//			u.bug("page resized");

			page.browser_h = u.browserH();
			page.browser_w = u.browserW();

			// forward resize event to current scene
			if(page.cN && page.cN.scene && typeof(page.cN.scene.resized) == "function") {
				page.cN.scene.resized();
			}

		}

		// global scroll handler
		page.scrolled = function() {

			page.scrolled_y = u.scrollY();

			// forward scroll event to current scene
			if(page.cN && page.cN.scene && typeof(page.cN.scene.scrolled) == "function") {
				page.cN.scene.scrolled();
			}

		}


		// Page is ready - called from several places, evaluates when page is ready to be shown
		page.ready = function() {
//				u.bug("page ready");

			// page is ready to be shown - only initalize if not already shown
			if(!u.hc(this, "ready")) {

				// page is ready
				u.ac(this, "ready");

				this.initNavigation();

				this.resized();

				// accept cookies
				this.acceptCookies();
			}
		}


		// show accept cookies dialogue
		page.acceptCookies = function() {

			// show terms notification
			if(u.terms_version && !u.getCookie(u.terms_version)) {

				var terms = u.ie(document.body, "div", {"class":"terms_notification"});
				u.ae(terms, "h3", {"html":"We love <br />cookies and privacy"});
				var bn_accept = u.ae(terms, "a", {"class":"accept", "html":"Accept"});
				bn_accept.terms = terms;
				u.ce(bn_accept);
				bn_accept.clicked = function() {
					this.terms.parentNode.removeChild(this.terms);
					u.saveCookie(u.terms_version, true, {"expiry":new Date(new Date().getTime()+(1000*60*60*24*365)).toGMTString()});
				}

				if(!location.href.match(/\/terms\//)) {
					var bn_details = u.ae(terms, "a", {"class":"details", "html":"Details", "href":"/terms"});
					u.ce(bn_details, {"type":"link"});
				}

			}

		}

		// initialize navigation elements
		page.initNavigation = function() {

			var i, node, nodes;

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

		}

		// ready to start page builing process
		page.ready();

	}
}

window.onload = u.init;
