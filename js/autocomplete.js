$( function() {
    $( "#tags" ).autocomplete({
      source: function( request, response ) {
        $.ajax( {
          url: "https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=",
          dataType: "jsonp",
          data: {
            srsearch: request.term
          },
          success: function( data ) {
            var titles = [];
            for (var title in data.query.search) {
                titles.push(data.query.search[title].title);
            }
            data = titles
            response( data );
          }
        } );
      },
      minLength: 2,
      select: function( event, ui ) {
        log( "Selected: " + ui.item.value + " aka " + ui.item.id );
      }
    } );
  } );