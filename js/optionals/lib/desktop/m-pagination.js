Util.Modules["pagination"] = new function() {
	this.init = function(pagination) {

		if(pagination) {
			u.ae(document.body, pagination);
			u.as(pagination, "transform", "none");
		
			pagination.next = u.qs(".next", pagination);
			if(pagination.next) {
				u.addNextArrow(pagination.next);
				pagination.next.a = u.qs("a", pagination.next);
				u.ce(pagination.next, {"type":"link"});
				u.e.hover(pagination.next);
				pagination.next.over = function() {
					u.ass(this, {
						"transition": "width 0.3s ease",
						"width":this.a.offsetWidth+"px"
					});
					u.ass(this.a, {
						"transition": "opacity 0.2s ease 0.2s",
						"opacity":1
					});
				}
				pagination.next.out = function() {
					u.ass(this.a, {
						"transition": "opacity 0.2s ease",
						"opacity":0
					});
					u.ass(this, {
						"transition": "width 0.3s ease 0.2s",
						"width":0
					});
				}
			}
			pagination.prev = u.qs(".previous", pagination);
			if(pagination.prev) {
				u.addPreviousArrow(pagination.prev);
				pagination.prev.a = u.qs("a", pagination.prev);
				u.ce(pagination.prev, {"type":"link"});
				u.e.hover(pagination.prev);
				pagination.prev.over = function() {
					u.ass(this, {
						"transition": "width 0.3s ease",
						"width":this.a.offsetWidth+"px"
					});
					u.ass(this.a, {
						"transition": "opacity 0.2s ease 0.2s",
						"opacity":1
					});
				}
				pagination.prev.out = function() {
					u.ass(this.a, {
						"transition": "opacity 0.2s ease",
						"opacity":0
					});
					u.ass(this, {
						"transition": "width 0.3s ease 0.2s",
						"width":0
					});
				}
			}
			
			pagination.destroy = function() {
				document.body.removeChild(this);
			}
		}
	}
}
