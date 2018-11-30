
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
				image._image_src = "/images/" + image._id + "/" + (image._variant ? image._variant+"/" : "") + "480x." + image._format;
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

	}
}
