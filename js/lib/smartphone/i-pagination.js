Util.Objects["pagination"] = new function() {
	this.init = function(pagination) {

		if(pagination) {
			u.ae(document.body, pagination);
//			u.a.removeTransform(pagination);
			
			u.ac(page, "paginated");

			var next = u.qs(".next", pagination);
			if(next) {
				u.addNextArrow(next);
				next.a = u.qs("a", next);
				u.ce(next, {"type":"link"});
				// u.e.hover(next);
				// next.over = function() {
				// 	u.ass(this, {
				// 		"width":this.a.offsetWidth+"px"
				// 	});
				// 	u.ass(this.a, {
				// 		"opacity":1
				// 	});
				// }
				// next.out = function() {
				// 	u.ass(this.a, {
				// 		"opacity":0
				// 	});
				// 	u.ass(this, {
				// 		"width":0
				// 	});
				// }
			}
			var prev = u.qs(".previous", pagination);
			if(prev) {
				u.addPreviousArrow(prev);
				prev.a = u.qs("a", prev);
				u.ce(prev, {"type":"link"});
				// u.e.hover(prev);
				// prev.over = function() {
				// 	u.ass(this, {
				// 		"width":this.a.offsetWidth+"px"
				// 	});
				// 	u.ass(this.a, {
				// 		"opacity":1
				// 	});
				// }
				// prev.out = function() {
				// 	u.ass(this.a, {
				// 		"opacity":0
				// 	});
				// 	u.ass(this, {
				// 		"width":0
				// 	});
				// }
			}
		}
	}
}