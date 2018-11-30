
// global function to add checkmark
u.addCheckmark = function(node) {

//	u.bug("add checkmark:" + node.current_readstate + ", ", + node.parentNode + ", " + (node.current_readstate ? (u.txt["readstate-read"] + ", " + u.date("Y-m-d H:i:s", node.current_readstate)) : u.txt["readstate-not_read"])); 

	node.checkmark = u.svg({
		"name":"checkmark",
		"node":node,
		"class":"checkmark "+(node.current_readstate ? "read" : "not_read"),
//		"title":(node.current_readstate ? (u.txt["readstate-read"] + ", " + u.date("Y-m-d H:i:s", node.current_readstate)) : u.txt["readstate-not_read"]),
		"width":17,
		"height":17,
		"shapes":[
			{
				"type": "line",
				"x1": 2,
				"y1": 8,
				"x2": 7,
				"y2": 15
			},
			{
				"type": "line",
				"x1": 6,
				"y1": 15,
				"x2": 12,
				"y2": 2
			}
		]
	});
	node.checkmark.hint_txt = (node.current_readstate ? (u.txt["readstate-read"] + ", " + u.date("Y-m-d H:i:s", node.current_readstate)) : u.txt["readstate-not_read"]),
	node.checkmark.node = node;

	u.e.hover(node.checkmark);
	node.checkmark.over = function(event) {
		this.hint = u.ae(document.body, "div", {"class":"hint", "html":this.hint_txt});
		u.ass(this.hint, {
			"top":(u.absY(this.parentNode)+parseInt(u.gcs(this, "top"))+(Number(this.getAttribute("height")))) + "px",
			"left":(u.absX(this.parentNode)+parseInt(u.gcs(this, "left"))+Number(this.getAttribute("width"))) + "px"
		});
	}
	node.checkmark.out = function(event) {
		if(this.hint) {
			this.hint.parentNode.removeChild(this.hint);
			delete this.hint;
		}
	}
}

// global function to remove checkmark
u.removeCheckmark = function(node) {
	if(node.checkmark.hint) {
		node.checkmark.hint.parentNode.removeChild(node.checkmark.hint);
	}

	if(node.checkmark) {
		node.checkmark.parentNode.removeChild(node.checkmark);
		node.checkmark = false;
	}
}
