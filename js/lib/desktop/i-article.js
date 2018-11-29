
// Stardard article enabling
Util.Objects["article"] = new function() {
	this.init = function(article) {
		u.bug("article init:", article);


		// csrf token for data manipulation
		article.csrf_token = article.getAttribute("data-csrf-token");


		// find primary header
		article.header = u.qs("h1,h2,h3", article);
		article.header.article = article;



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
					// "height": image.wrapper_height,
					"opacity": 0
				});

				image.loaded = function(queue) {

					u.ac(this, "loaded");

					this._image = u.ie(this, "img");
					this._image.image = this;
					this._image.src = queue[0].image.src;

					// correct scroll for image expansion
					if(this.node.article_list) {
						this.node.article_list.correctScroll(this.node, this, -10);
					}


					// apply full-width option
					u.ce(this._image);
					this._image.clicked = function() {
						// go back to normal size
						if(u.hc(this.image, "fullsize")) {

							u.a.transition(this, "all 0.3s ease-in-out");
							u.rc(this.image, "fullsize");
							this.src = this.image._image_src;
						}
						// switch to fullsize
						else {
							// full size image, might exceed autoconversion limit
							// test server response

							u.a.transition(this, "all 0.3s ease-in-out");
							u.ac(this.image, "fullsize");

							// fullsize already defined and tested
							if(this._fullsize_src) {
								this.src = this._fullsize_src;
							}
							else {
								this._fullsize_width = 1300;
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
						//"height": (this._image.offsetHeight + this.wrapper_height) +"px",
						"opacity": 1
					});
				}
				u.preloader(image, [image._image_src]);
			}
		}


		// INIT GEOLOCATION MAP
		article.geolocation = u.qs("ul.geo", article);
		if(article.geolocation && typeof(u.injectGeolocation) == "function") {

			u.injectGeolocation(article);

		}


		// INIT SHARING
		var hardlink = u.qs("li.main_entity.share", article);
		article.hardlink = hardlink ? (hardlink.hasAttribute("content") ? hardlink.getAttribute("content") : hardlink.innerHTML) : false;
		if(article.hardlink && typeof(u.injectSharing) == "function") {

			// Correct scroll offset - callback
			article.shareInjected = function() {
				if(this.article_list) {
					this.article_list.correctScroll(this, this.sharing);
				}
			}
			u.injectSharing(article);

		}

		// READ-STATE
		article.header.current_readstate = article.getAttribute("data-readstate");
		article.add_readstate_url = article.getAttribute("data-readstate-add");
		article.delete_readstate_url = article.getAttribute("data-readstate-delete");
		if(article.header.current_readstate || (article.add_readstate_url && article.delete_readstate_url)) {
			//			u.bug("add readstate:" + article.header.current_readstate);

			// add checkmark
			u.addCheckmark(article.header);

			u.ce(article.header.checkmark);
			article.header.checkmark.clicked = function(event) {

				// hide hint
				this.out(event);

				// already has readstate - delete it
				if(this.node.current_readstate) {
					this.response = function(response) {
						if(response.cms_status == "success" && response.cms_object) {

							// remove read info
							this.setAttribute("class", "checkmark not_read");
							this.node.current_readstate = false;
							this.node.article.setAttribute("data-readstate", "");
							this.hint_txt = u.txt["readstate-not_read"];

						}
					}
					u.request(this, this.node.article.delete_readstate_url, {"method":"post", "params":"csrf-token="+this.node.article.csrf_token+"&item_id"});
				}
				// add readstate
				else {
					this.response = function(response) {
						if(response.cms_status == "success" && response.cms_object) {

							// add read info
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
