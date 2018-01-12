//Adapted from Page Counter extension by alberto.moratilla@gmail.com  January 2011 and revised on December 2014
//http://about.me/alberto.moratilla

        // config variables
        var pages_per_tree = 100;
        var snooze_minutes = 60;

        // script variables
        var page_count = 0;
        var trees_planted = 0;
        var pages_left = pages_per_tree;
        var last_snoozed = new Date(0);
        var snooze_duration = snooze_minutes*60*1000;
        // var session_start = new Date();	    //To save the amount of time browsing this session
        // var first_initialized = new Date();	    //Check the time when chrome loads
        // var time_acumulated = 0

        // // localStorage.PC_uses counts the number of times script has run
        // // localStorage.PC_stored_page_count
        // // localStorage.PC_first_initialized stores the date first initialized
        // // localStorage.PC_time_acumulated

        //Initializes statistics - not sure if necessary WIP
        // if (!localStorage.PC_uses)
        //     localStorage.PC_uses = 1;
        // else
        //     localStorage.PC_uses = (parseInt(localStorage.PC_uses))+1;


        //Event when the extension is loaded: whether it is chrome who start or the user who enables the extension
        window.onload = function() {
            loadStatistics();
            updateBadge();
        };


        //Event when extension closes.
        window.onunload = function () {
            saveStatistics();
        };


        //Listen for the new page load message from the content script (main.js).
        chrome.runtime.onMessage.addListener(function(message_received, sender, sendResponse){
            switch (message_received.message) {
                case "new page":
                    increment_page_count(); //store new page count to localStorage

                    //send message to all tabs with updated stats
                    var updated_stats = {
                        trees_planted: trees_planted,
                        pages_left: pages_left,
                        page_count: page_count
                    }
                    messageAllTabs (updated_stats);
                    break;


                case "snooze":
                    last_snoozed = new Date();
                    saveStatistics();
                    alert("currentlySnoozedtrue="+currentlySnoozed());
                    break;


                case "unsnooze":
                    last_snoozed = new Date(0);
                    saveStatistics();
                    alert("currentlySnoozedfalse="+currentlySnoozed());
                    break;


                default:
                    alert('background.js onMessage.addListener error')
                    break;
            }
        });



//================ FUNCTIONS ================//

        // Display latest page count on the extension badge next to omnibar
        function updateBadge() {
            if (currentlySnoozed()) {
                var now = new Date();
                var snooze_left = snooze_duration - ( now.getTime() - last_snoozed.getTime() );
                chrome.browserAction.setBadgeText({text:formatTime(snooze_left)});
                chrome.browserAction.setBadgeBackgroundColor({color:[0,151,151,151]});
            } else {
                var texto = String(trees_planted);
                if(trees_planted>1000)
                {
                    texto = String(Math.floor(trees_planted/1000) + "K")
                }
                chrome.browserAction.setBadgeText({text:texto});
                chrome.browserAction.setBadgeBackgroundColor({color:[0,151,151,151]});
            }
        }


        //When extension ends, saves the counter and the time.
        function saveStatistics() {
            localStorage.PC_stored_page_count =  JSON.stringify(page_count);
            localStorage.PC_trees_planted_save = JSON.stringify(trees_planted);
            localStorage.PC_pages_left_save = JSON.stringify(pages_left);
            localStorage.PC_last_snoozed = JSON.stringify(last_snoozed.getTime());
            // localStorage.PC_first_initialized =  JSON.stringify( first_initialized.getTime() ) ;
            //
            // //Not sure if this block is necessary WIP
            // if (!localStorage.PC_time_acumulated)
            // {
            //     localStorage.PC_time_acumulated = 0;
            // }
            //
            // var now = new Date();	//current time
            // localStorage.PC_time_acumulated = JSON.stringify(time_acumulated+(now.getTime()-session_start.getTime()));
        }


        //Load the number of pages visited from the last time
        function loadStatistics() {

            if (!localStorage.PC_stored_page_count)   //If no data found
            {
                page_count = 0;
                trees_planted = 0;
                pages_left = pages_per_tree;
                last_snoozed = new Date(0);
                // first_initialized = new Date();
                // time_acumulated = 0
            }
            else  //There are data in localstorage
            {
                page_count = JSON.parse(localStorage.PC_stored_page_count);
                trees_planted = JSON.parse(localStorage.PC_trees_planted_save);
                pages_left = JSON.parse(localStorage.PC_pages_left_save);
                last_snoozed = new Date((Number(JSON.parse(localStorage.PC_last_snoozed))));
                // first_initialized = new Date((Number(JSON.parse(localStorage.PC_first_initialized))));
                // time_acumulated = (Number(JSON.parse(localStorage.PC_time_acumulated)));
            }
        }


        // returns true/false for current snooze status
        function currentlySnoozed() {
            var now = new Date();
            var time_since_last_snooze = now.getTime() - last_snoozed.getTime();

            if (time_since_last_snooze < snooze_duration) {
                return true;
            } else {
                return false;
            }
        }



        //increases the counter and calls badge's refresh function
        function increment_page_count() {
            if (pages_left == 1) {
              trees_planted++;
              pages_left = pages_per_tree;
            } else {
              pages_left--;
            }

            page_count++;
            updateBadge();
            saveStatistics();
        }

        //send a message to (main.js in) all tabs
        function messageAllTabs (message) {
          // message should be a JSON object
          chrome.tabs.query({}, function(tabs) { // {} means no tab conditions/restrictions
              for (i=0; i<tabs.length; i++) {
                  chrome.tabs.sendMessage(tabs[i].id, message, function(response){});
              }
          });
        }


        //Transforms from ms to d:hh:mm:ss format
        function formatTime(ms)
        {
            var days = Math.floor(ms / (1000*60*60*24));
            ms = ms - days*(1000*60*60*24);

            var hours = Math.floor(ms / (1000*60*60));
            ms = ms - hours*(1000*60*60);

            var minutes = Math.floor(ms / (1000*60));
            minutes=(minutes <=9)?"0"+minutes:minutes;
            ms = ms - minutes*(1000*60);


            var seconds = Math.floor(ms / (1000));
            seconds=(seconds <=9)?"0"+seconds:seconds;
            ms = ms%(1000);

            var badgeText = "";

            if (days>0) {
                badgeText = days+"d";
            } else if (hours>0) {
                badgeText = hours+"h";
            } else if (minutes>0) {
                badgeText = minutes+"m";
            } else {
                badgeText = seconds+"s";
            }

            return badgeText;
        }


//================ UNUSED FUNCTIONS ================//

        //Time object
        function tiempo (inicio, fin)
        {
            this.inicio = inicio;
            this.fin = fin;
        }

        //Returns the time has been accumulated since the start of the program
        function getAcumulado()
        {
            var now = new Date();
            return (now.getTime() - session_start.getTime()) + time_acumulated;

        }
