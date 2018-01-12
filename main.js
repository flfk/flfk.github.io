//Resize document body to make room for bottom bar
var height = '110px';
document.body.style.padding = '0px 0px '+height; //set margin height

//Create and add container for bottom bar
var iframe = document.createElement('iframe');
iframe.src = 'https://mikey-yang.github.io/';
iframe.id = 'iframe';
iframe.classList.add('iframe_element');
iframe.style.height = height;
document.documentElement.appendChild(iframe);﻿

//Add a close/snooze button
var kill = document.createElement('img');
kill.classList.add('kill');
kill.classList.add('iframe_element');
kill.src = chrome.extension.getURL('images/cross.png');
document.documentElement.appendChild(kill);﻿

//Click to kill functionality
kill.addEventListener('click', () => {
    var iframe_elements = document.getElementsByClassName('iframe_element');
    for (i=0; i<iframe_elements.length; i++) {
        iframe_elements[i].classList.add('hide');
    }
    document.body.style.padding = '0';

    //Send message to background.js for snooze start
    chrome.runtime.sendMessage({message: "snooze"}, function(response) {});
});

//Add empty div to display Trees Planted Number
var treesPlantedNum = document.createElement('div');
treesPlantedNum.classList.add('arbol_test');
treesPlantedNum.classList.add('iframe_element');
treesPlantedNum.classList.add('treesPlantedNum');
document.documentElement.appendChild(treesPlantedNum);

//Add empty div to display Trees Planted Text
var treesPlantedText = document.createElement('div');
treesPlantedText.classList.add('arbol_test');
treesPlantedText.classList.add('iframe_element');
treesPlantedText.classList.add('treesPlantedText');
document.documentElement.appendChild(treesPlantedText);

//Add empty div to display Pages Left Number
var pagesLeftNum = document.createElement('div');
pagesLeftNum.classList.add('arbol_test');
pagesLeftNum.classList.add('iframe_element');
pagesLeftNum.classList.add('pagesLeftNum');
document.documentElement.appendChild(pagesLeftNum);

//Add empty div to display Trees Planted Text
var pagesLeftText = document.createElement('div');
pagesLeftText.classList.add('arbol_test');
pagesLeftText.classList.add('iframe_element');
pagesLeftText.classList.add('pagesLeftText');
document.documentElement.appendChild(pagesLeftText);

//Send message to background.js to count new page load
chrome.runtime.sendMessage({message: "new page"}, function(response) {});

//Listen for the updated tree stats from background.js even if this isn't the active tab
chrome.runtime.onMessage.addListener(function(stats_received, sender, sendResponse){

    treesPlantedNum.innerHTML = stats_received.trees_planted;
    pagesLeftNum.innerHTML = stats_received.pages_left;
    treesPlantedText.innerHTML = pluralize(stats_received.trees_planted, "trees", "planted");
    pagesLeftText.innerHTML = pluralize(stats_received.pages_left, "pages", "to next tree");

    // sendResponse({}); // no need to send response

});

// formats strings correctly according to plurality i.e. 0 trees, 1 tree, 2 trees
function pluralize (number, units, end) {
    if (number == 1) {
        units = units.slice(0, -1); // slice off the s at the end of the word
    }
    return units+" "+end;
}
