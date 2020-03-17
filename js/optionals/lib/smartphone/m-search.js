Util.Modules["search"] = new function() {
	this.init = function(div) {

		div.form = u.qs("form", div);
		if(div.form) {
			u.f.init(div.form);
		}

	}
}
