Util.Objects["articleMiniList"] = new function() {
	this.init = function(list) {
		u.bug("articleMiniList");

		list.articles = u.qsa("li.article", list);
//		list.add_readmore = u.hc(list, "readmore");

		var i, node;
		for(i = 0; node = list.articles[i]; i++) {

			var header = u.qs("h2,h3", node);
			header.current_readstate = node.getAttribute("data-readstate");
//			u.bug("header.current_readstate:" + header.current_readstate );

			if(header.current_readstate) {
				u.ac(header, "read");
				u.addCheckmark(header);
			}

// 			// does header have link?
// 			link = u.qs("a", header);
//
// 			// should node be extended with readmore link
// 			u.bug(list.add_readmore + "; " + link);
// 			if(list.add_readmore && link) {
// //				var anchor_point = u.qs(".description p", node);
// //				u.ae(anchor_point, "a", {"href":link.href, "html":" "+u.txt["readmore"]});
//
// 				ul = u.ae(node, "ul", {"class":"actions"});
// 				li = u.ae(ul, "li", {"class":"readmore"});
// 				u.ae(li, "a", {"href":link.href, "html":" "+u.txt["readmore"]});
//
// 			}

		}

	}
}
