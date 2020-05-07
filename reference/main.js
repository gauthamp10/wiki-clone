
var pos = 0;
var pages = [];

$( document ).ready(function() {
	initialize();

	// Bind left and right arrows
	Mousetrap.bind('left', function() {
		ga('send', 'event', 'Navigate', 'left-arrow', 'Keyboard Navigation');
		navigate(-1);
	});
	Mousetrap.bind('right', function() {
		ga('send', 'event', 'Navigate', 'right-arrow', 'Keyboard Navigation');
		navigate(1);
	});

	// Bind click handlers to buttons
	$(".nav-forward").on('click',function (event) {
		event.preventDefault();
		this.blur();
		ga('send', 'event', 'Navigate', 'click-next', 'Keyboard Navigation');
		navigate(1);
	});
	$(".nav-back").on('click',function (event) {
		event.preventDefault();
		this.blur();
		ga('send', 'event', 'Navigate', 'click-back', 'Keyboard Navigation');
		navigate(-1);
	});

	$('#pageURL').on('focus', function() {
		$(this).select();
	});

	// Handle copy URL tooltip
	$('#copyURL').tooltip();
	$('#copyURL').on('click',function(event) {
		clipboard.copy($('#newTab').attr('href'));
		this.blur();
		$(this).delay(1700).queue(function() {
				$(this).tooltip('hide');
			});
	});
});

function initialize(_callback) {
	console.log("Initializing...");
	var currentURL = window.location.search.substring(1);
  var urlParams = currentURL.split('&');
  for (var i = 0; i < urlParams.length; i++) {
		var paramName = urlParams[i].split('=');
    if (paramName[0] == "p") {
      pages[0] = paramName[1];
      setURL(0);
      break;
    }
  }
	loadMorePages();
}

function navigate(shift) {
	if (shift == -1 && pos < 1) {
		console.log('At the beginning');
	} 
	else {
		pos = pos + shift;
		if (pos == 0) {
			$(".nav-back").attr('disabled','disabled');
		} else {
			$(".nav-back").removeAttr('disabled');
		}

		if ((pages.length - 3) == pos) {
			loadMorePages();
		}
		setURL(pos);
		updateURL(pages[pos]);
	}
}

function loadMorePages() {
	console.log("Loading more random pages...");
	$.ajax({
		url: "https://en.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=10&format=json",
		dataType: "jsonp",

    // Work with the response
    success: function( response ) {
      $.each( response['query']['random'], function( key, val ) {
				pages.push(val['title'].replace(/ /g,"_"));
			});
      if (pages.length == 10) {
      	setURL(0);
      }
    }
	});
}

function setURL(pos) {
	$('#mainFrame').attr('src',"https://en.wikipedia.org/wiki/" + pages[pos]);
	$('#pageURL').attr('value',"https://en.wikipedia.org/wiki/" + pages[pos]);
	$('#newTab').attr('href',"https://en.wikipedia.org/wiki/" + pages[pos]);
}

function updateURL(url) {
	if (window.history.replaceState) {
		window.history.pushState("", "", '/?p=' + url);	
	}
}





