Util.Modules["articlePreviewList"] = new function() {
	this.init = function(list) {
		// u.bug("articlePreviewList:", list);

		list.articles = u.qsa("li.article", list);

		// Init article preview
		list.initArticle = function(article) {
			// u.bug("initArticle", article);

			// FIND LINK
			article._a = u.qs("h3 a", article);
			if(article._a) {
				article._link = article._a.href ? article._a.href : article._a.url;
			}

			// READ MORE
			article._description_p = u.qs("div.description p", article)
			if(article._description_p && article._link) {
				u.ae(article._description_p, "br");
				u.ae(article._description_p, "a", {href: article._link, class:"readmore", html:u.txt("readmore")});
			}

			// INIT IMAGES
			var i, image;
			article._images = u.qsa("div.image,div.media", article);
			for(i = 0; image = article._images[i]; i++) {

				image.node = article;

				// remove link from caption
				image.caption = u.qs("p a", image);
				if(image.caption) {
					image.caption.removeAttribute("href");
				}

				// get image variables
				image._id = u.cv(image, "item_id");
				image._format = u.cv(image, "format");
				image._variant = u.cv(image, "variant");


				// if image
				if(image._id && image._format) {

					// add image
					image._image_src = "/images/" + image._id + "/" + (image._variant ? image._variant+"/" : "") + "540x." + image._format;
					u.ass(image, {
						"opacity": 0
					});

					image.loaded = function(queue) {

						u.ac(this, "loaded");

						this._image = u.ie(this, "img");
						this._image.image = this;
						this._image.src = queue[0].image.src;

						// correct scroll for image expansion
						if(this.node.article_list && fun(this.node.article_list.correctScroll)) {
							this.node.article_list.correctScroll(this);
						}


						// apply full-width option
						u.ce(this._image);
						this._image.clicked = function() {
							// go back to normal size
							if(u.hc(this.image, "fullsize")) {

								u.a.transition(this, "all 0.3s ease-in-out");
								u.rc(this.image, "fullsize");
								this.src = this.image._image_src;

								u.ass(this, {
									width: ""
								});

							}
							// switch to fullsize
							else {
								// full size image, might exceed autoconversion limit
								// test server response

								u.a.transition(this, "all 0.3s ease-in-out");
								u.ac(this.image, "fullsize");
								u.ass(this, {
									width: (page.browser_w < 1080 ? page.browser_w : 1080) + "px"
								});

								// fullsize already defined and tested
								if(this._fullsize_src) {
									this.src = this._fullsize_src;
								}
								else {
									this._fullsize_width = 1080;
									this._fullsize_src = "/images/" + this.image._id + "/" + (this.image._variant ? this.image._variant+"/" : "") + this._fullsize_width + "x." + this.image._format;

									// valid response - set new src
									this.response = function() {
										this.src = this._fullsize_src;
									}
									// 404 - reduce size and try again
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



			// INIT VIDEOS
			var video;
			article._videos = u.qsa("div.youtube, div.vimeo", article);
			for (i = 0; video = article._videos[i]; i++) {

				video._src = u.cv(video, "video_id");
				video._type = video._src.match(/youtube|youtu\.be/) ? "youtube" : "vimeo";

				// Youtube
				if (video._type == "youtube") {
					video._id = video._src.match(/watch\?v\=/) ? video._src.split("?v=")[1] : video._src.split("/")[video._src.split("/").length-1];

					video.iframe = u.ae(video, "iframe", {
						src: 'https://www.youtube.com/embed/'+video._id+'?autoplay=false&loop=0&color=f0f0ee&modestbranding=1&rel=0&playsinline=1',
						id: "ytplayer",
						type: "text/html",
						webkitallowfullscreen: true,
						mozallowfullscreen: true,
						allowfullscreen: true,
						frameborder: 0,
						allow: "autoplay",
						sandbox:"allow-same-origin allow-scripts",
						width: "100%",
						height: 540 / 1.7777,
					});
				}

				// Vimeo
				else {
					video._id = video._src.split("/")[video._src.split("/").length-1];

					video.iframe = u.ae(video, "iframe", {
						src: 'https://player.vimeo.com/video/'+video._id+'?autoplay=false&loop=0&byline=0&portrait=0',
						webkitallowfullscreen: true,
						mozallowfullscreen: true,
						allowfullscreen: true,
						frameborder: 0,
						sandbox:"allow-same-origin allow-scripts",
						width: "100%",
						height: 540 / 1.7777,
					});
				}

			}




			// Readstate
			var header = u.qs("h2,h3", article);
			header.current_readstate = article.getAttribute("data-readstate");
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

						this.initArticle(node);
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
