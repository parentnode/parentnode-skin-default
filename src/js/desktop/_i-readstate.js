Util.Objects["readstate"] = new function() {
	this.init = function(node) {

		// CMS interaction urls
		node.csrf_token = node.getAttribute("data-csrf-token");
		node.readstate = node.getAttribute("data-readstate");

		node.update_readstate_url = node.getAttribute("data-readstate-update");
		node.delete_readstate_url = node.getAttribute("data-readstate-delete");

//		node._not_read = u.txt["readstate-not_read"]; //"Klik på <em>Tjek</em>-ikonet når du har læst et emne, så husker vi det for dig.";
//		node._read = u.txt["readstate-read"];//"Læst";


		//node.parent_li = u.pn(node, {"include":"li"});

//		var header = u.qs("h1,h2,h3", node.parentNode);
		u.addCheckmark(node);

		// u.ass(node, {
		// 	"top":u.qs("h1,h2,h3", node.parentNode).offsetTop+"px"
		// });

		// if interaction data available
		if(node.update_readstate_url && node.delete_readstate_url && node.csrf_token) {


			//
			u.ce(node);

			// node.div = u.ae(node, "div");
			//
			// if(node.readstate) {
			// 	node.checkmark.title = node.readstate ? (u.txt["readstate-read"] + ", " + u.date("Y-m-d", node.readstate)) : u.txt["readstate-not_read"];
			// // 	u.ac(node, "is_read");
			// // 	node.text = u.ae(node.div, "p", {"html":node._read + " " + u.date("Y-m-d", node.readstate)});
			// }
			// else {
			// 	node.text = u.ae(node.div, "p", {"html":node._not_read});
			// }


			// node.div.node = node;
			// u.ce(node.checkmark);
			node.clicked = function() {

				// already has readstate - delete it
				if(this.node.readstate) {
					this.response = function(response) {
						if(response.cms_status == "success" && response.cms_object) {

							// remove read info
							u.rc(this.node, "is_read");
							this.node.readstate = false;
							this.node.text.innerHTML = this.node._not_read;
							this.checkmark.setAttribute("title", "");

							// remove checkmark from parent li if it exists
							if(this.node.parent_li) {
								u.removeCheckmark(this.node.parent_li);
							}
						}
					}
					u.request(this, this.node.delete_readstate_url, {"method":"post", "params":"csrf-token="+this.node.csrf_token});
				}
				// add readstate
				else {
					this.response = function(response) {
						if(response.cms_status == "success" && response.cms_object) {

							// add read info
							u.ac(this.node, "is_read");
							this.node.readstate = true;
							this.node.text.innerHTML = this.node._read + " " + u.date("Y-m-d", new Date().getTime());

							// add checkmark to parent li if it exists
							if(this.node.parent_li) {
								u.addCheckmark(this.node.parent_li);
							}
						}
					}
					u.request(this, this.node.update_readstate_url, {"method":"post", "params":"csrf-token="+this.node.csrf_token});
				}
			
			}

		}

	}
}