$(document).ready(function(){ 
    $("#search").keyup(function(){ 
      var search = $(this).val(); 
      if(search != ""){ 
         $.ajax({ 
           url: 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+search+'&limit=150&namespace=0&format=json', 
           dataType: 'jsonp', 
           success:function(response){  
           
            $.each(response, function () {
               
                
                title = response[1][0];
                link = response[3][0];
                getData(title,link)
                
            });
           }
        });
    }
    else{
        fetchRandomWiki(2);
    }
});
});











function fetchRandomWiki(count) {
    $.ajax({
        url: "https://en.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=" + count + "&format=json&origin=*",
        dataType: "jsonp",
        success: function (response) {
            $.each(response['query']['random'], function (key, val) {
                title = val['title']
                id = val['id']
                getData(title, id); //call to get data to fetch images as well
            });
        },
        complete: function () {
            console.log('AJAX call 1 completed');
        },
    });
}

function getData(title, id) {
    $.ajax({
        url: "https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&pithumbsize=200&format=json&titles=" + title,
        dataType: "jsonp",
        success: function (response) {

            $("#wikitable").find("tbody").empty();
            var wiki_data = '';
            var baseLink = 'https://en.wikipedia.org/?curid=';

            var pageid = [];
            for( var pid in response.query.pages ) {
                pageid.push( pid );
            }
          
            const iterator = pageid[Symbol.iterator]();
            $.each(response['query'], function (key, val) {
                id = iterator.next().value
                if (val[id]['thumbnail']) {

                    
                    wiki_data += '<tr>';
                    wiki_data += '<td><a href=' + baseLink + id + ' target="loadwiki"><img src="' + val[id]['thumbnail']['source'] + '"><br>' + title + '</a></td>';
                    wiki_data += '</tr>';
                }
                else {
                    rand = (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
                    let fonts = ["lobster", "bebas", "noto", "museo"];
                    let font = fonts[Math.floor(Math.random() * fonts.length)];
                    wiki_data += '<tr>';
                    wiki_data += '<td><a href=' + baseLink + id + ' target="loadwiki"><img src="https://fakeimg.pl/350x200/' + rand + '/000/?font=' + font + '&text=' + title.substring(0, 6) + '..."><br>' + title + '</a></td>';
                    wiki_data += '</tr>';

                }
            });
            $('#wikitable').append(wiki_data);
        },
        complete: function () {
            console.log('AJAX call 2 completed');
        },
    });
}



fetchRandomWiki(2);




$(window).on("scroll", function () {
    var scrollHeight = $(document).height();
    var scrollPos = $(window).height() + $(window).scrollTop();
    if (((scrollHeight - 300) >= scrollPos) / scrollHeight == 0) {
        fetchRandomWiki(2);
        $('#load').click();
    }
});