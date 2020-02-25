Util.Objects["search"] = new function() {
	this.init = function(div) {
		u.bug("search init:", div);

		div.form = u.qs("form", div);
		if(div.form) {
			u.f.init(div.form);
		}


	}
}
