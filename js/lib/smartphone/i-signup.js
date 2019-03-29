Util.Objects["signup"] = new function() {
	this.init = function(scene) {
//		u.bug("scene init:", scene);


		scene.resized = function() {
//			u.bug("scene.resized:", this);
		}

		scene.scrolled = function() {
//			u.bug("scrolled:", this);
		}

		scene.ready = function() {
//			u.bug("scene.ready:", this);

			page.cN.scene = this;

			var signup_form = u.qs("form.signup", this);
			var place_holder = u.qs("div.articlebody .placeholder.signup", this);

			if(signup_form && place_holder) {
				place_holder.parentNode.replaceChild(signup_form, place_holder);
			}

			if(signup_form) {
				u.f.init(signup_form);
			}

			// Ajax janitor signup flow
			signup_form.submitted = function() {
				var data = u.f.getParams(this); // Get input

				// signup controller
				this.response = function(response) {
					// Success
					if (u.qs(".scene.verify", response)) {
						// Update scene
						scene.initVerify(response);
						
						// Update url
						u.h.navigate("/verify", false, true);
					}
					// Error
					else {
						// Remove past error from DOM
						if (this.error) {
							this.error.parentNode.removeChild(this.error);
						}
						
						// Append error to scene
						this.error = scene.showMessage(this, response);

						// Set inital state before animating
						u.ass(this.error, {
							transform:"translate3d(0, -15px, 0)",
							opacity:0
						});

						// Animate error
						u.a.transition(this.error, "all .5s ease-out");
						u.ass(this.error, {
							transform:"translate3d(0, 0, 0)",
							opacity:1
						});
					}
				}

				// Post input to action ("save" from signup controller)
				u.request(this, this.action, {"data":data, "method":"POST"});
			}

			// accept cookies?
			page.acceptCookies();

			u.showScene(this);

			page.resized();
		}


		scene.initVerify = function(response) {

			// Change scene to verify
			var verify_scene = scene.replaceScene(response);

			if(verify_scene) {
				// Initialize verify form
				u.init();
			}

		}

		scene.replaceScene = function(response) {
			var current_scene = u.qs(".scene", page);
			var new_scene = u.qs(".scene", response);
			page.cN.replaceChild(new_scene, current_scene); // Replace current scene with response scene

			return new_scene;
		}

		scene.showMessage = function(form, response) {
			// Get error message
			var new_error = (u.qs("p.errormessage", response) || u.qs("p.error", response));
			var current_error = (u.qs("p.errormessage", form) || u.qs("p.error", form));

			// Inject initial error
			if (!current_error) {
				u.ie(form, new_error);
			}
			// Update error
			else {
				form.replaceChild(new_error, current_error);
			}

			return new_error;
		}


		// scene is ready
		scene.ready();

	}

}
