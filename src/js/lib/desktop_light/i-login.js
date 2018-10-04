Util.Objects["login"] = new function() {
	this.init = function(scene) {
//		u.bug("scene init:" + u.nodeId(scene))


		scene.resized = function() {
//			u.bug("scene.resized:" + u.nodeId(this));


			// refresh dom
			//this.offsetHeight;
		}

		scene.scrolled = function() {
//			u.bug("scrolled:" + u.nodeId(this))
		}

		scene.ready = function() {
//			u.bug("scene.ready:" + u.nodeId(this));

			u.ae(this, "p", {"html":"Your browser is not supported by the Administration system.<br />Please upgrade:"})

			var ul = u.ae(this, "ul");
			u.ae(ul, "li", {"html":'<a href="https://firefox.com/download" target="_blank">Firefox</a>'});
			u.ae(ul, "li", {"html":'<a href="https://www.google.com/chrome/" target="_blank">Chrome</a>'});

			// this._form = u.qs("form", this);
			// u.f.init(this._form);


			page.cN.scene = this;
//			page.resized();
		}


		// scene is ready
		scene.ready();

	}

}
