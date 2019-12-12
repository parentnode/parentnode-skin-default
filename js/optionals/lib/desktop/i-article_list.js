// TODO: do not load images while scrolling is in process

// keep track of all hardlinks
// to be able to remove hardlink fragment



Util.Objects["articlelist"] = new function() {
	this.init = function(list) {
		u.bug("init articlelist");

		// only set urls if browser supports popstate
		list.popstate = ("onpopstate" in window);

		// get all list items
		list.items = u.qsa(".item", list);

		// only continue if list has items
		if(list.items) {


			// let article node know about list to enable scroll correction and url handling
			var i, node;
			for(i = 0; node = list.items[i]; i++) {
				node.article_list = list;
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

			// keep track of all hardlinks to be able to know root
			list.all_hardlinks = [];
			// add hardlink to hardlink array
			list.addHardlink = function(hardlink) {
				if(this.all_hardlinks.indexOf(hardlink) == -1) {
					this.all_hardlinks.push(hardlink);
				}
			}
			// get root if current url can be found in hardlinks array
			list.getRootLink = function() {
				if(this.all_hardlinks.indexOf(location.href) != -1) {
					// remove last fragment (should be sindex format)
					return location.href.replace(/\/[a-zA-Z0-9\-_]+$/, "");
				}
				return false;
			}

			// correct scroll postion after loading additional content
			// new_node is the inject node we need to compensate for
			// additional_offset is an optional compensation for margin etc.
			list.correctScroll = function(article_node, new_node, additional_offset) {
//				u.bug("correctScroll:" + (this.current_node ? u.qs("h2", this.current_node).innerHTML : "no current"))

				// only do anything if current_node is set
				if(this.current_node) {

					// optional additional offset
					additional_offset = additional_offset ? additional_offset : 0;

					// get postions for comparison
					var a_node_y = u.absY(article_node);
					var c_node_y = u.absY(this.current_node);

					// on compensate if article node is above current node
					if(a_node_y < c_node_y) {

						// if initial_scroll is 0, this is a fresh page load
						// adjust scrolling position to focus current node 
						if(this.initial_scroll === 0) {
							var current_scroll = u.absY(this) - 100;
							this.initial_scroll = false;
						}
						// use current scroll position in all other cases
						else {
							var current_scroll = u.scrollY();
						}

						// calculate the new scroll position
						var new_scroll_y = (current_scroll + (new_node.offsetHeight + additional_offset));
						window.scrollTo(0, new_scroll_y);
					}
				}
			}


			// look for next and previous links
			var next = u.qs(".pagination li.next a", list.parentNode);
			var prev = u.qs(".pagination li.previous a", list.parentNode);

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



			// DETECT INITIAL STATE (for dynamic load/scroll compensation)

			// if initial scroll exists this indicates a page refresh
			list.initial_scroll = u.scrollY();

//			u.bug("list.initial_scroll:" + list.initial_scroll)

			// find hardlinks to check for specific load
			list.current_node = false;
			var hardlink = u.qs("dd.hardlink a", list.items[0]);
			if(hardlink) {
				if(location.href == hardlink.href) {
					list.current_node = list.items[0];

//					u.bug("list.current_node:" + u.qs("h2", list.current_node).innerHTML )
				}
			}


			// adjust initial scrolling if we know current node
			// if no previous url exists or we inherited a scroll offset due to a page refresh with scroll offset
			// we need to compensate for this
			//
			// (if previous url exists it will be loaded automatically 
			// which will cause the scroll-offset to be updated automatically)
			if(list.current_node && (!list._prev_url || list.initial_scroll)) {

//				u.bug("one of those:" + u.absY(list.current_node))
				window.scrollTo(0, u.absY(list.current_node)-100);

				// correct initial scroll value to match
				list.initial_scroll = false;
			}


			// initial load prev/next check
			list.scrolled();


			// set specific scroll handler for list
			u.e.addWindowEvent(list, "scroll", list.scrolled);

		}
	}
}