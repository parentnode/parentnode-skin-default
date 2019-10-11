Util.Objects["dynamicVariablesPost"] = new function() {
	this.init = function(post) {

		var extension_start = u.qs(".extension_start", post);

		var form = u.f.addForm(post, {"class":"labelstyle:inject dynamicVariablesPost"});
		var extension_text = u.ae(form, "p", {"html":"To make the following commands Copy/Paste ready, enter your information here:"});

		var fieldset = u.f.addFieldset(form);

		var var_names = [];
		var var_labels = {};

		// get all dynamic variables in post
		var dyn_vars = u.qsa("span.dynvar");
		var i, dyn_var, label;
		for(i = 0; dyn_var = dyn_vars[i]; i++) {
			dyn_var.var_name = dyn_var.className.replace(/(dynvar|[ ]|label\:[^$ ]+)/g, "");
//			console.log(dyn_var.var_name);

			// did we already find a label? (label doesn't have to be stated on each an every occurence – just once)
			if(!var_labels[dyn_var.var_name]) {

				// check for label classVar
				label = u.cv(dyn_var, "label");
				// and save it if we found one
				if(label) {
					var_labels[dyn_var.var_name] = label.replace(/_/, " ");
				}
			}

			// add dynamic var to collection if it's not already there
			if(var_names.indexOf(dyn_var.var_name) == -1) {
				var_names.push(dyn_var.var_name);
			}


		}


		for(i = 0; dyn_var_name = var_names[i]; i++) {
//			u.bug("dyn_var_name:" + dyn_var_name);

			label = var_labels[dyn_var_name] ? decodeURI(var_labels[dyn_var_name]) : u.qs("span.dynvar."+dyn_var_name).innerHTML;
//			if(!var_names[dyn_var.var_name]) {
				//var_names[dyn_var_name] = 
				u.f.addField(fieldset, {"label":label, "name":dyn_var_name, "class":dyn_var_name+"_master"});

//			}

		}


		u.f.init(form);

		// let input updates update all dyn var occurences
		for(i = 0; dyn_var = dyn_vars[i]; i++) {

			form.inputs[dyn_var.var_name].placeholders = u.qsa("span.dynvar."+dyn_var.var_name, post);
			form.inputs[dyn_var.var_name].updated = function() {
				var i, placeholder;
				for(i = 0; placeholder = this.placeholders[i]; i++) {
					placeholder.innerHTML = this.val();
				}
			}
		}

		extension_start.parentNode.insertBefore(form, extension_start);

	}
}