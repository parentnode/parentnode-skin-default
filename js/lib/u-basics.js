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

	// Remove svg before indexing letters
	var svg_icon = u.qs("svg", this);
	if(svg_icon) {
		this.removeChild(svg_icon);
	}

	// make sure there is spacing on each side of br.tag to get it indexed as word
	this.innerHTML = this.innerHTML.replace(/[ ]?<br[ \/]?>[ ]?/, " <br /> ");
	this.innerHTML = '<span class="word">'+this.innerHTML.split(" ").join('</span> <span class="word">')+'</span>'; 


	var word_spans = u.qsa("span.word", this);
	var i, span, letters, spanned_word;
	// split each word into letter spans
	for(i = 0; span = word_spans[i]; i++) {

		// if span contains <br> then replace span with br tag
		if(span.innerHTML.match(/<br[ \/]?>/)) {
			span.parentNode.replaceChild(document.createElement("br"), span);
		}
		// split letters into spans
		else {
			if(span.innerHTML.match(/&[a-zA-Z0-9#]+;/)) {

				letters = span.innerHTML.split("");
				span.innerHTML = "";

				for(j = 0; j < letters.length; j++) {
					if(letters[j] === "&") {
						spanned_word = letters[j];
						while(letters[++j] !== ";") {
							spanned_word += letters[j];
						}
						spanned_word += letters[j];
						span.innerHTML += "<span>" + spanned_word + "</span>";
					}
					else {
						span.innerHTML += "<span>" + letters[j] + "</span>";
					}
				}

			}
			else {
				span.innerHTML = "<span>"+span.innerHTML.split("").join("</span><span>")+"</span>";
				
			}
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

	if(svg_icon) {
		this.appendChild(svg_icon);
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


