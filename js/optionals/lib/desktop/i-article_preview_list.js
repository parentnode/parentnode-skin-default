Util.Objects["articlePreviewList"] = new function() {
	this.init = function(list) {
		u.bug("articlePreviewList:", list);

		list.articles = u.qsa("li.article", list);


		list.initArticle = function(article) {



			// Readstate
			var header = u.qs("h2,h3", node);
			header.current_readstate = node.getAttribute("data-readstate");
			if(header.current_readstate) {
				u.ac(header, "read");
				u.addCheckmark(header);
			}


			// Geolocation map
			article.geolocation = u.qs("ul.geo", article);
			if(article.geolocation && typeof(u.injectGeolocation) == "function") {

				u.injectGeolocation(article);

			}



		}




		// scroll handler
		// loads next/prev and initializes focused articles
		list.scrolled = function() {
//				u.bug("list scrolled:" + u.scrollY());

			// reset article load-timer
			u.t.resetTimer(this.t_init);

			// get values for calculations
			this.scroll_y = u.scrollY();
			this.browser_h = u.browserH();
			this.screen_middle = this.browser_h/2;


			var i, node, node_y, list_y;
			list_y = u.absY(this);


			// auto extend list, when appropriate
			// load previous if list-top + browser-height is more than scrolloffset
			if(this._prev_url && list_y + this.browser_h > this.scroll_y) {
				this.loadPrev();
			}
			// load next if list-bottom is less than scrolloffset + 2 x browser-height
			else if(this._next_url && list_y + this.offsetHeight < this.scroll_y + (this.browser_h*2)) {
				this.loadNext();
			}

			// if article list is below screen middle and this is not a fresh page load
			// (on fresh page loads we want to maintain url)
			// (removed initial scroll check - url is maintained due to)
//				if(this.initial_scroll !== 0 && list_y > this.scroll_y + this.screen_middle) {
			if(list_y > this.scroll_y + this.screen_middle) {

				// return to "root"-url if possible
				var root_link = this.getRootLink();
				if(root_link) {
					history.replaceState({}, root_link, root_link);

					// no current node, when returning to root url
					this.current_node = false;
				}
			}
			// adjust page url to current focused item
			else {

				// loop through all items
				for(i = 0; node = this.items[i]; i++) {

					// get position of node
					node_y = u.absY(node);

					// stop checking if node is below view (to avoid wasting resources)
					if(node_y > this.scroll_y + this.browser_h) {
						break;
					}

						// if node is in the middle of the screen, set url
					else if(node_y <= this.scroll_y + this.screen_middle && node_y + node.offsetHeight > this.scroll_y + this.screen_middle) {

						// remember current node
						this.current_node = node;

						// can only update url if data is available
						if(this.popstate && node._ready && node.hardlink) {

							// add hardlink to collection for root identification
							this.addHardlink(node.hardlink);

							history.replaceState({}, node.hardlink, node.hardlink);
						}
					}

				}

			}

			// only initialize new articles when scrolling stops with article in focus
			this.t_init = u.t.setTimer(this, this.initFocusedArticles, 500);
		}

		// initialize focues article
		list.initFocusedArticles = function() {
//			u.bug("initFocusedArticles");

			var i, node, node_y;
			// loop through all items to find nodes within view
			for(i = 0; node = this.items[i]; i++) {

				// if node is not already loaded
				if(!node._ready) {

					// get y coordinate of item
					node_y = u.absY(node);

					// check first if node is below visible area
					// then we are past point of interest and don't need to waste resources
					if(node_y > this.scroll_y + this.browser_h) {
						break;
					}

					// if node is in visible area
					else if(
						// bottom of node is in view
						// if node-bottom is more than scroll position
						// and node-bottom is less than scroll position + browser height
						(
							node_y + node.offsetHeight > this.scroll_y && 
							node_y + node.offsetHeight < this.scroll_y + this.browser_h
						)
						 || 

						// top of node is in view
						// if node-top is more than scroll position
						// and node-top is less than scroll position + browser height
						(
							node_y > this.scroll_y &&
							node_y < this.scroll_y + this.browser_h
						)
						 ||

						// node is larger than view
						// if node-top is less than scroll position
						// and node-bottom is 
						(
							node_y < this.scroll_y &&
							node_y + node.offsetHeight > this.scroll_y + this.browser_h
						)
					) {
//							u.bug("init node:" + u.nodeId(node) + "::" + this.scroll_y + "," + node_y + "," + node.offsetHeight);
						u.o.article.init(node);
						node._ready = true;


						// repeat the scroll process to ensure url get set correctly
						this.scrolled();
					}
				}
			}
		}



		var i, node;
		for(i = 0; node = list.articles[i]; i++) {


			// Mediae





			node.article_list = list;






			// let article node know about list to enable scroll correction and url handling
			var i, node;
			for(i = 0; node = list.items[i]; i++) {
			}




			// look for next and previous links
			var prev = u.qs(".pagination li.previous a", list.parentNode);
			var next = u.qs(".pagination li.next a", list.parentNode);

			// do we have pagination links
			list._prev_url = prev ? prev.href : false;
			list._next_url = next ? next.href : false;

			// extend list with prev items
			list.loadPrev = function() {
				if(this._prev_url) {
	//				u.bug("load prev function")
				
					// receive previous items
					this.response = function(response) {

						// this.before_prev_load_scroll_y = u.scrollY();
						// this.before_prev_load_first_node = this.items[0];
						// this.before_prev_load_first_node.

						// insert result items
						var items = u.qsa(".item", response);
						var i, node;
						for(i = items.length; i; i--) {
							node = u.ie(this, items[i-1]);

							// let article node know about list to enable scroll correction
							node.article_list = this;

//							u.bug("should compensate:" + node.offsetHeight)


							this.correctScroll(node, node);
							// correct scroll offset because these items injected above current position
	//						window.scrollTo(0, u.scrollY()+node.offsetHeight);
						}

						// are more items available with the new load
						var prev = u.qs(".pagination li.previous a", response);
						this._prev_url = prev ? prev.href : false;

						// update the article list item scope
						this.items = u.qsa(".item", this);
					}
					u.request(this, this._prev_url);

					// do not attempt to load more while waiting for response
					this._prev_url = false;
				}
		
			}


			// extend list with next items
			list.loadNext = function() {
				if(this._next_url) {
	//				u.bug("load next function")

					// receive previous items
					this.response = function(response) {

						// append result items
						var items = u.qsa(".item", response);
						var i, node;
						for(i = 0; i < items.length; i++) {
							node = u.ae(this, items[i]);

							// let article node know about list to enable scroll correction
							node.article_list = this;
						}

						// are more items available with the new load
						var next = u.qs(".pagination li.next a", response);
						this._next_url = next ? next.href : false;

						// update the article list item scope
						this.items = u.qsa(".item", this);
					}
					u.request(this, this._next_url);

					// do not attempt to load more while waiting for response
					this._next_url = false;
				}
			}


			// if initial scroll exists this indicates a page refresh
			list.initial_scroll = u.scrollY();



			// initial load prev/next check
			list.scrolled();


			// set specific scroll handler for list
			u.e.addWindowEvent(list, "scroll", list.scrolled);




// 			// does header have link?
// 			link = u.qs("a", header);
//
// 			// should node be extended with readmore link
// 			u.bug(list.add_readmore + "; " + link);
// 			if(list.add_readmore && link) {
// //				var anchor_point = u.qs(".description p", node);
// //				u.ae(anchor_point, "a", {"href":link.href, "html":" "+u.txt["readmore"]});
//
// 				ul = u.ae(node, "ul", {"class":"actions"});
// 				li = u.ae(ul, "li", {"class":"readmore"});
// 				u.ae(li, "a", {"href":link.href, "html":" "+u.txt["readmore"]});
//
// 			}

		}

	}
}
