Util.Objects["generic"] = new function() {
	this.init = function(scene) {
		u.bug("scene init:" + u.nodeId(scene))
		

		scene.resized = function() {
			u.bug("scene.resized:" + u.nodeId(this));

			// refresh dom
			//this.offsetHeight;
		}

		scene.scrolled = function() {
//			u.bug("scrolled:" + u.nodeId(this))
		}

		scene.ready = function() {
//			u.bug("scene.ready:" + u.nodeId(this));

			page.cN.scene = this;
			page.resized();
		}

		// scene is ready
		scene.ready();
	}
}
Util.Objects["standardForm"] = new function() {
	this.init = function(form) {
		u.f.init(form);
	}
}