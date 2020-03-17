Util.Modules["articleList"] = new function() {
	this.init = function(list) {
		// u.bug("articleList:", list);

		list.articles = u.qsa("li.article", list);

		// Calculate browser sizes on resize
		list.resized = function() {

			this.browser_h = u.browserH();
			this.screen_middle = this.browser_h/2;

		}

		// scroll handler
		// loads next/prev and initializes focused articles
		list.scrolled = function(event) {
			// u.bug("list scrolled: " + u.scrollY(), event);

			// reset article load-timer
			u.t.resetTimer(this.t_init);

			// get values for calculations
			this.scroll_y = u.scrollY();


			// auto extend list, when appropriate
			// load next if list-bottom is less than scrolloffset + 2 x browser-height
			if(this._next_url) {

				var i, node, node_y, list_y;
				list_y = u.absY(this);

				if(list_y + this.offsetHeight < this.scroll_y + (this.browser_h*2)) {
					this.loadNext();
				}

			}


			// only initialize new articles when scrolling stops with article in focus
			this.t_init = u.t.setTimer(this, this.initFocusedArticles, 500);

		}

		// initialize focues article
		list.initFocusedArticles = function() {
			// u.bug("initFocusedArticles");

			var i, node, node_y;
			// loop through all items to find nodes within view
			for(i = 0; node = this.articles[i]; i++) {

				// if node is not already loaded
				if(!node.is_ready) {

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

						u.m.article.init(node);
						// this.initArticle(node);
						node.is_ready = true;

					}
				}
			}
		}


		// correct scroll postion after loading additional content
		// new_node is the inject node we need to compensate for
		// additional_offset is an optional compensation for margin etc.
		list.correctScroll = function(div_image) {
			// u.bug("correctScroll", div_image);

			if(this.scroll_y) {
				// Figure out if top of image is above screen center, then compensate for page growth
				var image_node_y = u.absY(div_image);
				if(image_node_y < this.scroll_y + this.screen_middle) {

					var new_scroll_y = this.scroll_y + (div_image.offsetHeight);
					window.scrollTo(0, new_scroll_y);

				}
			}
		}


		// look for next links
		var next = u.qs(".pagination li.next a", list.parentNode);
		list._next_url = false;
		if(next) {
			u.ac(u.pn(next, {include:"div"}), "autoload");

			// do we have pagination links
			list._next_url = next ? next.href : false;
		}



		// extend list with next items
		list.loadNext = function() {

			if(this._next_url) {
				// u.bug("loadNext", this._next_url);

				// receive previous items
				this.response = function(response) {

					// append result items
					var articles = u.qsa("li.article", response);
					var i, node;
					for(i = 0; i < articles.length; i++) {
						node = u.ae(this, articles[i]);

						// let article node know about list to enable scroll correction
						node.article_list = this;
					}

					// are more items available with the new load
					var next = u.qs(".pagination li.next a", response);
					this._next_url = next ? next.href : false;

					// update the article list item scope
					this.articles = u.qsa("li.article", this);
				}
				u.request(this, this._next_url);

				// do not attempt to load more while waiting for response
				this._next_url = false;
			}

		}


		// Map article_list to articles
		var i, node;
		for(i = 0; node = list.articles[i]; i++) {

			node.article_list = list;

		}


		// Pre-calculated browser size values
		list.resized();

		// initial load next check
		list.scrolled();

		// set specific resize handler for list
		u.e.addWindowEvent(list, "resize", list.resized);

		// set specific scroll handler for list
		u.e.addWindowEvent(list, "scroll", list.scrolled);

	}

}
