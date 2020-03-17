Util.Modules["columns"] = new function() {
	this.init = function(scene) {
		// u.bug("scene init:", scene);

		scene.resized = function() {
			// u.bug("scene.resized:", this);

			// refresh dom
			this.offsetHeight;
		}

		scene.scrolled = function() {
			// u.bug("scene.scrolled:", this);
		}

		scene.ready = function() {
			// u.bug("scene.ready:", this);

			u.columns(this, [
				{"c200": [
					"div.article", 
					"div.articles",
					"div.related"
					// ".pagination"
				]},
				{"c100": [
					".search",
					".categories"
				]},
				{"c300": [
					"div.company"
				]}
			]);


			u.showScene(this);

		}

		// Map scene – page will call scene.ready
		page.cN.scene = scene;

	}
}
