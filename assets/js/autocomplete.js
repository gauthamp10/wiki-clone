$(function () {
  $("#search").autocomplete({
    source: function (request, response) {
      $.ajax({
        url: "https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=",
        dataType: "jsonp",
        data: {
          srsearch: request.term
        },
        success: function (data) {
          var titles = [];
          for (var title in data.query.search) {
            titles.push(data.query.search[title].title);
          }
          data = titles
          response(data);
        }
      });
    },
    minLength: 2,
    select: function (event, ui) {
      $("input#search").val(ui.item.value);
      $("#searchtag").submit();
    }
  });
});

// Add something to given element placeholder
function addToPlaceholder(toAdd, el) {
  el.attr('placeholder', el.attr('placeholder') + toAdd);
  // Delay between symbols "typing" 
  return new Promise(resolve => setTimeout(resolve, 100));
}

// Cleare placeholder attribute in given element
function clearPlaceholder(el) {
  el.attr("placeholder", "");
}

// Print one phrase
function printPhrase(phrase, el) {
  return new Promise(resolve => {
    // Clear placeholder before typing next phrase
    clearPlaceholder(el);
    let letters = phrase.split('');
    // For each letter in phrase
    letters.reduce(
      (promise, letter, index) => promise.then(_ => {
        // Resolve promise when all letters are typed
        if (index === letters.length - 1) {
          // Delay before start next phrase "typing"
          setTimeout(resolve, 1000);
        }
        return addToPlaceholder(letter, el);
      }),
      Promise.resolve()
    );
  });
}

// Print given phrases to element
function printPhrases(phrases, el) {
  // For each phrase
  // wait for phrase to be typed
  // before start typing next
  phrases.reduce(
    (promise, phrase) => promise.then(_ => printPhrase(phrase, el)),
    Promise.resolve()
  );
}

// Start typing
function run() {
  let phrases = [
    "How ? Where ? When ? What ?",
    "Search the entire Wikipedia",
    "List of presidents of United States",
    "Download articles"
  ];

  printPhrases(phrases, $('#search'));
}

$(document).ready(function () {
  run();
});
