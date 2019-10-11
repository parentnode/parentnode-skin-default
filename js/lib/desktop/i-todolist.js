Util.Objects["todolist"] = new function() {
	this.init = function(scene) {
//		u.bug("scene init:", scene);



		scene.resized = function() {
//			u.bug("scene.resized:", this);


			// resize text nodes
			// var text_width = this.nodes[0].offsetWidth - this.image_width;
			// for(i = 0; node = this.nodes[i]; i++) {
			// 	u.as(node.text_mask, "width", text_width+"px", false);
			// }

			// refresh dom
//			this.offsetHeight;
		}

		scene.scrolled = function() {
//			u.bug("scrolled");
		}

		scene.ready = function() {
			u.bug("scene.ready:", this);

			this.nodes = u.qsa("li.item", this);
			if(this.nodes.length) {

				var i, node;
				for(i = 0; node = this.nodes[i]; i++) {

					node.item_id = u.cv(node, "id");

					// restructure content
					// node.text_mask = u.ae(node, "div", {"class":"text"});
					// u.ae(node.text_mask, u.qs("h3", node));
					// u.ae(node.text_mask, u.qs("dl", node));
					// u.ae(node.text_mask, u.qs("div.description", node));
					//
					node.actions = u.qs("ul.actions", node);

					// initialize forms
					node.close_form = u.qs("li.close form", node);
					u.f.init(node.close_form);
					node.bn_close = u.qs("input[type=submit]", node.close_form);
					node.bn_close.node = node;
					u.e.click(node.bn_close)
					node.bn_close.clicked = function(event) {
						u.e.kill(event);

						this.response = function(response) {
							if(response.cms_status == "success") {
								// remove element
//								this.node.parentNode.removeChild(this.node);

								// change state
								u.ac(this.node.actions, "closed");
							}
							else {
//								alert("server communication failed");
							}
						}
						u.request(this, this.form.action, {"method":this.form.method, "data":this.form.getData()});
					}

					node.open_form = u.qs("li.open form", node);
					u.f.init(node.open_form);
					node.bn_open = u.qs("input[type=submit]", node.open_form);
					node.bn_open.node = node;
					u.e.click(node.bn_open)
					node.bn_open.clicked = function(event) {
						u.e.kill(event);

						this.response = function(response) {
							if(response.cms_status == "success") {

								// change state
								u.rc(this.node.actions, "closed");
							}
							else {
//								alert("server communication failed");
							}
						}
						u.request(this, this.form.action, {"method":this.form.method, "data":this.form.getData()});
					}
				}
			}


			page.cN.scene = this;
			page.resized();
		}

		// scene is ready
		scene.ready();
	}
}
