//ENTIRE FILE DEFUNCT 11/01/17

$(document).ready(function() {
  // Populate stats
  // var tree_count = 400;
  // $('#treeCount').prepend(tree_count);
  // var pages_left = 48;
  // $('#pagesLeft').prepend(pages_left);
  // pages_left--; // doesn't work this way

  // Snooze functionality
  $('.cross').hover(
    function(){
      $('.cross').addClass('mouseOver');
    },
    function(){
      $('.cross').removeClass('mouseOver');
    }
  );
  $('.cross').on('click', function(){
    //$('.bottomBar').hide();
    //parent.document.getElementById(window.name).style.display = 'none';
    //console.log($('#iframe'));
    //iframe.contentWindow.postMessage(/*any variable or object here*/, '*');

    //https://developer.chrome.com/extensions/tabs#method-query
    /*chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
        console.log(response.farewell);
      });
    });*/
  });
});
