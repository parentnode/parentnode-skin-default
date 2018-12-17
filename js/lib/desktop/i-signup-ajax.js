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
					if (u.qs("form.verify_code", response)) {
						scene.initVerify(response);
					}
					// Error
					else {
						scene.showMessage(this, response);
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

			var verify_scene = scene.replaceScene(response);

			if(verify_scene) {
				var verify_form = u.qs("form.verify_code", verify_scene);
				u.f.init(verify_form);
			}

			// Using the new verify form
			verify_form.submitted = function() {
				data = u.f.getParams(this);

				this.response = function(response) {
					// User is already verified
					if (u.qs(".login", response)) {
						location.href = "/login";
					}
					// Verification success
					else if (u.qs(".confirmed", response)) {
						u.showScene(scene.replaceScene(response));
					}
					// Error
					else {
						scene.showMessage(this, response);
					}
				}

				// Post to "confirm"
				u.request(this, this.action, {"data":data, "method":"POST", "responseType":"document"});
			}

			u.showScene(verify_scene);
		}

		scene.replaceScene = function(response) {
			var current_scene = u.qs(".scene", page);
			var new_scene = u.qs(".scene", response);
			page.cN.replaceChild(new_scene, current_scene); // Replace current scene with response scene

			return new_scene;
		}

		scene.showMessage = function(form, response) {
			// Getting new error and current error
			var new_error;
			var current_error;

			// Find out what error class to search for
			if (u.qs("p.errormessage", response)) {
				new_error = u.qs("p.errormessage", response)
				current_error = u.qs("p.errormessage", form);
			}
			else {
				new_error = u.qs("p.error", response)
				current_error = u.qs("p.error", form);
			}

			// Injecting error
			if (!current_error) {
				u.ie(form, new_error);
			}
			else {
				// Updating error message
				form.replaceChild(new_error, current_error);

				// Animating error message
				u.a.transition(new_error, "all 0.15s linear", animationDone);
				u.a.scale(new_error, 1.05);
				
				function animationDone() {
					u.a.transition(this, "all 0.15s linear");
					u.a.scale(this, 1);
				}
			}
		}


		// scene is ready
		scene.ready();

	}

}
