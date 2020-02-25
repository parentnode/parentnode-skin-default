function unsupported() {
	var html_string = '';
	html_string += '<h1 style="text-align: center; margin: 30px 15% 30px; font-family: Arial; color: #333333">';
	html_string += 'Vi kan ikke genkende din browser.';
	html_string += '</h1>';

	html_string += '<p style="text-align: center; margin: 0 15% 20px; font-family: Arial; color: #333333">';
	html_string += 'Din browser er muligvis for gammel til at vise dette websted. ';
	html_string += 'Vi anbefaler at du opgraderer til nyeste version af ';
	html_string += '<a href="https://getfirefox.com/">Firefox</a> eller ';
	html_string += '<a href="https://www.google.com/chrome/">Chrome</a>.';
	html_string += '</p>';

	html_string += '<p style="text-align: center; margin: 0 15% 20px; font-family: Arial; color: #333333">';

	// Simple smartphone detection
	if(typeof(document.ontouchmove) == "object" || typeof(document.ontouchmove) == "function") {
		html_string += '<a href="' + location.href + (location.href.match(/\?/) ? "&segment=smartphone" : "?segment=smartphone") + '">Du kan besøge hjemmesiden alligevel, hvis du mener dette er en fejl</a>.';
	}
	else {
		html_string += '<a href="' + location.href + (location.href.match(/\?/) ? "&segment=desktop" : "?segment=desktop") + '">Du kan besøge hjemmesiden alligevel, hvis du mener dette er en fejl</a>.';
	}

	html_string += '</p>';

	document.body.innerHTML = html_string;
}

window.onload = unsupported;
