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
        url: "https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&pithumbsize=300&format=json&titles=" + title,
        dataType: "jsonp",
        success: function (response) {
            let wiki_data = '';
            let baseLink = 'https://en.wikipedia.org/?curid=';
            let pageid = [];
            for (var pid in response.query.pages) {
                pageid.push(pid);
            }
            const iterator = pageid[Symbol.iterator]();
            $.each(response['query'], function (key, val) {
                id = iterator.next().value
                if (val[id]['thumbnail']) {
                    wiki_data += '<div data-aos="fade-up" class="col-4 col-6-medium col-12-small box box2 tooltip" title="' + title + '">';
                    wiki_data += '  <a href="#iframe-modal" rel="modal:open"><div class="evenboxinner" id="i' + id + '"> ' + title + '</div></a>';
                    wiki_data += '<a href=' + baseLink + id + ' target="loadwiki" class="image fit" id="' + id + '"><img src="' + val[id]['thumbnail']['source'] + '"></a>';
                    wiki_data += '<a href="https://en.wikipedia.org/api/rest_v1/page/pdf/' + title + '"><button>Download Article</button></a>';
                    wiki_data += '</div>';
                    $('#myframe').attr('src', 'https://en.wikipedia.org/?curid=' + id);
                }
                else {
                    let rand = (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
                    let fonts = ["lobster", "bebas", "noto", "museo"];
                    let font = fonts[Math.floor(Math.random() * fonts.length)];
                    wiki_data += '<div data-aos="fade-up" class="col-4 col-6-medium col-12-small box box2 tooltip" title="' + title + '" >';
                    wiki_data += '  <a href="#iframe-modal" rel="modal:open"><div class="evenboxinner" id="i' + id + '"> ' + title + '</div></a>';
                    wiki_data += '<td><a href=' + baseLink + id + ' target="loadwiki" class="image fit"><img src="https://fakeimg.pl/200x100/' + rand + '/000/?font=' + font + '&text=' + title.substring(0, 6) + '..." ></a>';
                    wiki_data += '<a href="https://en.wikipedia.org/api/rest_v1/page/pdf/' + title + '"><button>Download Article</button></a>';
                    wiki_data += '</div>';
                }
            });
            $('#wikidiv').append(wiki_data);
            let frameids = $('.evenboxinner').map(function (index) {
                // this callback function will be called once for each matching element
                return this.id;
            });
            $.each(frameids, function (index, value) {
                value = value.substr(1);
                $('#i' + value).click(function () {
                    $('#myframe').attr('src', 'https://en.m.wikipedia.org/?curid=' + value);
                });
            });
        },
        complete: function () {
            console.log('AJAX call 2 completed');
        },
    });
}

function getSearchData(data) {
    $.each(data, function (iter) {
        getData(data[iter]['title']);
    });
    let end = animateValue(0, data.length, 2000);
}




function onsubmitSearch() {
    $('#wikidiv').html('');
    input = $('#search').val();
    $.ajax({
        url: 'https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=' + input,
        dataType: 'jsonp',
        success: function (response) {
            getSearchData(response['query']['search'])
        }
    });
}

function animateValue(start, end, duration) {
    let range = end - start;
    let current = start;
    let increment = end > start ? 1 : -1;
    let stepTime = Math.abs(Math.floor(duration / range));
    let obj = document.getElementById('count');
    let timer = setInterval(function () {
        current += increment;
        obj.innerHTML = current;
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
    return end
}


var end = animateValue(0, 12, 2000);
fetchRandomWiki(12);

$(window).on("scroll", function () {
    let scrollHeight = $(document).height();
    let scrollPos = $(window).height() + $(window).scrollTop();
    if (((scrollHeight - 50) >= scrollPos) / scrollHeight == 0) {
        let incr = 12;
        fetchRandomWiki(incr);
         var end = animateValue(end, end + incr, 2000)
        $('#load').click();
    }
});