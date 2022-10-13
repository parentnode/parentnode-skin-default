Util.Modules["pagination"] = new function() {
	this.init = function(pagination) {

		if(pagination) {
			u.ae(document.body, pagination);

			u.ac(page, "paginated");

			var next = u.qs(".next", pagination);
			if(next) {
				u.addNextArrow(next);
				next.a = u.qs("a", next);
				u.ce(next, {"type":"link"});
			}

			var prev = u.qs(".previous", pagination);
			if(prev) {
				u.addPreviousArrow(prev);
				prev.a = u.qs("a", prev);
				u.ce(prev, {"type":"link"});
			}

		}

		pagination.destroy = function() {
			u.rc(page, "paginated");
			document.body.removeChild(this);
		}

	}
}