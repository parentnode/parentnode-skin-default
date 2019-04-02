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

			var form_signup = u.qs("form.signup", this);
			var place_holder = u.qs("div.articlebody .placeholder.signup", this);

			if(form_signup && place_holder) {
				place_holder.parentNode.replaceChild(form_signup, place_holder);
			}

			if(form_signup) {
				u.f.init(form_signup);

				// Loader
				form_signup.preSubmitted = function() {
					this.is_submitting = true; 

				//	this.actions["signup"].value = "Submitting";
					u.ac(this, "submitting");
					u.ac(this.actions["signup"], "disabled");
				}
			}

			// Ajax janitor signup flow
			form_signup.submitted = function() {
				var data = u.f.getParams(this);

				// signup controller
				this.response = function(response) {
					// Success
					if (u.qs(".scene.verify", response)) {
						// Update scene
						scene.replaceScene(response);

						// Update url
						u.h.navigate("/verify", false, true);
					}
					// Error
					else {
						// Remove loader if present
						if (this.is_submitting) {
							this.is_submitting = false; 

						//	this.actions["signup"].value = "Join";
							u.rc(this, "submitting");
							u.rc(this.actions["signup"], "disabled");
						}

						// Remove past error from DOM
						if (this.error) {
							this.error.parentNode.removeChild(this.error);
						}
						
						// Append error to scene
						this.error = scene.showMessage(this, response);

						// Set inital state before animating
						u.ass(this.error, {
							transform:"translate3d(0, -20px, 0) rotate3d(-1, 0, 0, 90deg)",
							opacity:0
						});

						// Animate error
						u.a.transition(this.error, "all .6s ease");
						u.ass(this.error, {
							transform:"translate3d(0, 0, 0) rotate3d(0, 0, 0, 0deg)",
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

		scene.replaceScene = function(response) {
			var current_scene = u.qs(".scene", page);
			var new_scene = u.qs(".scene", response);
			page.cN.replaceChild(new_scene, current_scene); // Replace current scene with response scene

			// Initialize new scene
			u.init();

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
