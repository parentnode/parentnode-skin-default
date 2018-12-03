
// switch between segments handler
u.smartphoneSwitch = new function() {

	// Set initial state
	this.state = 0;

	this.init = function(node) {
//			console.log("smartphoneSwitch on")
		// map callback node
		this.callback_node = node;
		// set resize handler
		this.event_id = u.e.addWindowEvent(this, "resize", this.resized);

		this.resized();
	}

	this.resized = function() {
//		console.log("u.smartphoneSwitch.resized" + u.browserW());
//		console.log(this);

		if(u.browserW() < 500 && !this.state) {
//			console.log("switchOn");
			this.switchOn();
		}
		else if(u.browserW() > 500 && this.state) {
			this.switchOff();
		}
		
	}

	this.switchOn = function() {
//		console.log("this.switchOn");

		if(!this.panel) {
//			console.log("create it");

			this.state = true;
			
			this.panel = u.ae(document.body, "div", {"id":"smartphone_switch"});
			u.ass(this.panel, {
				opacity: 0
			});

			u.ae(this.panel, "h1", {html:u.stringOr(u.txt["smartphone-switch-headline"], "Hello curious")});
			if(u.txt["smartphone-switch-text"].length) {
				for(i = 0; i < u.txt["smartphone-switch-text"].length; i++) {
					u.ae(this.panel, "p", {html:u.txt["smartphone-switch-text"][i]});
				}
			}

			var ul_actions = u.ae(this.panel, "ul", {class:"actions"});
			var li; 
			li = u.ae(ul_actions, "li", {class:"hide"});
			var bn_hide = u.ae(li, "a", {class:"hide button", html:u.txt["smartphone-switch-bn-hide"]});

			li = u.ae(ul_actions, "li", {class:"switch"});
			var bn_switch = u.ae(li, "a", {class:"switch button primary", html:u.txt["smartphone-switch-bn-switch"]});



			u.e.click(bn_switch);
			bn_switch.clicked = function() {
				u.saveCookie("smartphoneSwitch", "on");
				location.href = location.href.replace(/[&]segment\=desktop|segment\=desktop[&]?/, "") + (location.href.match(/\?/) ? "&" : "?") + "segment=smartphone";
			}

			u.e.click(bn_hide);
			bn_hide.clicked = function() {
				u.e.removeWindowEvent(u.smartphoneSwitch, "resize", u.smartphoneSwitch.event_id);
				u.smartphoneSwitch.switchOff();
			}


			u.a.transition(this.panel, "all 0.5s ease-in-out");
			u.ass(this.panel, {
				opacity: 1
			});

		
			if(this.callback_node && typeof(this.callback_node.smartphoneSwitchedOn) == "function") {
				this.callback_node.smartphoneSwitchedOn();
			}
		}
	}


	this.switchOff = function() {

//		console.log("this.switchOff");

		if(this.panel) {
//			console.log("destroy it");

			this.state = false;

			this.panel.transitioned = function() {
				this.parentNode.removeChild(this);
				delete u.smartphoneSwitch.panel;
			}


			u.a.transition(this.panel, "all 0.5s ease-in-out");
			u.ass(this.panel, {
				opacity: 0
			});


			if(this.callback_node && typeof(this.callback_node.smartphoneSwitchedOff) == "function") {
				this.callback_node.smartphoneSwitchedOff();
			}

		}

	}

}

// Fancy fade-in
u.showScene = function(scene) {
	var i, node;

	// get all scene children
	var nodes = u.cn(scene);

	if(nodes.length) {

		var article = u.qs("div.article", scene);
		// is first item an article
		if(nodes[0] == article) {

			// get all article nodes
			var article_nodes = u.cn(article);

			// drop article node
			nodes.shift();
			// add nodes to new list
			for(x in nodes) {
				article_nodes.push(nodes[x]);
			}
			nodes = article_nodes;
		}

		var headline = u.qs("h1,h2", scene);

		// hide all childnodes
		for(i = 0; node = nodes[i]; i++) {
			u.ass(node, {
				"opacity":0,
			});

		}

		// show scene
		u.ass(scene, {
			"opacity":1,
		});

		// apply headline animation
		u._stepA1.call(headline);

		// show content
		for(i = 0; node = nodes[i]; i++) {

			u.a.transition(node, "all 0.2s ease-in "+((i*100)+200)+"ms");
			u.ass(node, {
				"opacity":1,
				"transform":"translate(0, 0)"
			});

		}

	}

	// don't know what we are dealing with here - just show scene
	else {

		// show scene
		u.ass(scene, {
			"opacity":1,
		});

	}
	
}


// ANIMATION METHODS

// Animation first step (fade in)
// executed on relevant node
u._stepA1 = function() {
//	u.bug("stepA1:" + u.text(this));

//	var chars = this.innerHTML.split(" ");

	// make sure there is spacing on each side of br.tag to get it indexed as word
	this.innerHTML = this.innerHTML.replace(/[ ]?<br[ \/]?>[ ]?/, " <br /> ");
	this.innerHTML = '<span class="word">'+this.innerHTML.split(" ").join('</span> <span class="word">')+'</span>'; 


	var word_spans = u.qsa("span.word", this);
	var i, span;
	// split each word into letter spans
	for(i = 0; span = word_spans[i]; i++) {

		// if span contains <br> then replace span with br tag
		if(span.innerHTML.match(/<br[ \/]?>/)) {
			span.parentNode.replaceChild(document.createElement("br"), span);
		}
		// split letters into spans
		else {
			span.innerHTML = "<span>"+span.innerHTML.split("").join("</span><span>")+"</span>";
		}
	}

	// get each letter
	this.spans = u.qsa("span:not(.word)", this);
	if(this.spans) {
		var i, span;
		// set initial state for each span
		for(i = 0; span = this.spans[i]; i++) {
			span.innerHTML = span.innerHTML.replace(/ /, "&nbsp;");
			u.ass(span, {
				"transformOrigin": "0 100% 0",
				"transform":"translate(0, 40px)",
				"opacity":0
			});
		}

		// show outer content node
		u.ass(this, {
			"opacity":1
		});

		// play span animation (fade in)
		for(i = 0; span = this.spans[i]; i++) {
			u.a.transition(span, "all 0.2s ease-in-out "+(15*u.random(0, 15))+"ms");
			u.ass(span, {
				"transform":"translate(0, 0)",
				"opacity":1
			});
			span.transitioned = function(event) {
				u.ass(this, {
					"transform":"none"
				});
			}
		}

	}

}

// Animation second step (fade out)
// executed on relevant node
u._stepA2 = function() {
//	u.bug("stepA2:" + u.text(this));

	if(this.spans) {
		var i, span;
		// play span animation (fade out)
		for(i = 0; span = this.spans[i]; i++) {
			u.a.transition(span, "all 0.2s ease-in-out "+(15*u.random(0, 15))+"ms");
			u.ass(span, {
				"transform":"translate(0, -40px)",
				"opacity":0
			});
		}
	}

}


