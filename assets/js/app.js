const api_url = 'https://en.wikipedia.org/w/api.php';
const random_count = 12;
const init_parameters = { action: 'query', list: 'random', rnnamespace: 0, rnlimit: random_count, format: 'json' };

function GenericAjax(parameters, successCallback) {

    $.ajax({
        url: api_url,
        data: parameters,
        dataType: 'jsonp',
        contentType: 'applicatio-n/json;',
        success: successCallback,
        error: function (errorThrown) {
            console.log('error');
        }
    });
}

function returnRandom(response) {
    $.each(response['query']['random'], function (key, val) {
        title = val['title'];
        let parameters = { action: 'query', prop: 'pageimages', pithumbsize: '300', titles: title, format: 'json' };
        console.log('returnRandom');
        GenericAjax(parameters, placeRandom);
    });
}

function placeRandom(response) {
    let wiki_data = '';
    let baseLink = 'https://en.wikipedia.org/?curid=';
    let pageid = [];
    for (var pid in response.query.pages) {
        pageid.push(pid);
    }

    $.each(response['query'], function (key, val) {
        let id = val[pageid]['pageid'];
        let thumbnail = val[pageid]['thumbnail'];
        let heading = val[pageid]['title'];
        if (thumbnail) {
            wiki_data += '<div data-aos="fade-up" class="col-4 col-6-medium col-12-small box box2 tooltip" title="' + heading + '">';
            wiki_data += '  <a href=' + baseLink + id + ' target="loadwiki"><div class="evenboxinner"> ' + heading + '</div></a>';
            wiki_data += '<a href="#iframe-modal" rel="modal:open"><div class="evenboxinner image fit" id="i' + id + '"><img src="' + thumbnail['source'] + '"></div></a>';
            wiki_data += '<a href="https://en.wikipedia.org/api/rest_v1/page/pdf/' + heading + '"><button>Download Article</button></a>';
            wiki_data += '</div>';
        }
        else {
            let rand = (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
            let fonts = ["lobster", "bebas", "noto", "museo"];
            let font = fonts[Math.floor(Math.random() * fonts.length)];
            wiki_data += '<div data-aos="fade-up" class="col-4 col-6-medium col-12-small box box2 tooltip" title="' + heading + '" >';
            wiki_data += '<a href=' + baseLink + id + ' target="loadwiki"><div class="evenboxinner"> ' + heading + '</div></a>';
            wiki_data += '<a href="#iframe-modal" rel="modal:open"><div class="evenboxinner image fit" id="i' + id + '"><img src="https://fakeimg.pl/200x100/' + rand + '/000/?font=' + font + '&text=' + heading.substring(0, 6) + '..." ></div></a>';
            wiki_data += '<a href="https://en.wikipedia.org/api/rest_v1/page/pdf/' + heading + '"><button>Download Article</button></a>';
            wiki_data += '</div>';
        }
    });
    $('#wikidiv').append(wiki_data);
    let frameids = $('.evenboxinner').map(function (index) {
    
        return this.id;
    });
    $.each(frameids, function (index, value) {
        value = value.substr(1);
        $('#i' + value).click(function () {
            $('#myframe').attr('src', 'https://en.m.wikipedia.org/?curid=' + value);
        });
    });
}

function onsubmitSearch() {
    $('#wikidiv').html('');
    let input = $('#search').val();
    let parameters = { action: 'query', list: 'search', srsearch: input, format: 'json' }
    GenericAjax(parameters, returnSearch);
}

function returnSearch(response) {
    data = response['query']['search']
    $.each(data, function (iter) {
        let title = data[iter]['title'];
        let parameters = { action: 'query', prop: 'pageimages', pithumbsize: '300', titles: title, format: 'json' }
        GenericAjax(parameters, placeRandom);
    });
    let end = animateValue(0, data.length, 2000);
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
    return parseInt(end)
}

$(document).ready(function () {
    GenericAjax(init_parameters, returnRandom);
    var end = animateValue(0, random_count, 2000);
    $(window).on("scroll", function () {
        let scrollHeight = $(document).height();
        let scrollPos = $(window).height() + $(window).scrollTop();
        if (((scrollHeight - 10) >= scrollPos) / scrollHeight == 0) {
            GenericAjax(init_parameters, returnRandom);
            end = animateValue(end, end + random_count, 2000);
        }
    });

});