// Initialize Firebase
var config = {
    apiKey: "AIzaSyAH0VmLa4tb2GufSDpY5bF0V2h395dhPxU",
    authDomain: "forestly-db.firebaseapp.com",
    databaseURL: "https://forestly-db.firebaseio.com",
    projectId: "forestly-db",
    storageBucket: "forestly-db.appspot.com",
    messagingSenderId: "1074936879696"
};
firebase.initializeApp(config);

'use strict';


// Login button functionality
$('#btnLogin').on('click', () => {
    // clear any previous auth error messages
    $('#authError').empty();

    // Get email and password
    const email = $('#txtEmail').val();
    const password = $('#txtPassword').val();

    // Sign in
    firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(err => $('#authError').text(err.message));
});

// Signup button functionality
$('#btnSignup').on('click', () => {
    // clear any previous auth error messages
    $('#authError').empty();

    // Get email and password
    const email = $('#txtEmail').val(); // TODO: check for real email
    const password = $('#txtPassword').val();

    // Sign up
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => initializeUserInDb(email))
        .catch(err => $('#authError').text(err.message));
});

// Log out button functionality
$('#btnLogout').on('click', () => {
    firebase.auth().signOut(); // sign out currently authenticated user
    //onAuthStateChanged listener handles the logic
});


// Listener for sign in / sign out
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
            console.log(firebaseUser);

            $('#userForm').addClass('d-none');

            // count new page for the user
            incrementTreesPages();

            // prepare username
            $('#user').text("Logged in as "+firebaseUser.email);
            // show username and stats
            $('#userDisplay').removeClass('d-none');
    } else {
            console.log("not logged in");

            $('#userForm').removeClass('d-none');

            // hide stats and username
            $('#userDisplay').addClass('d-none');
            // clear them
            $('#user').empty();
            $('#trees').empty();
            $('#pages').empty();
    }
});




/**
 * Initialises a user's data in the Firebase real-time database
 *
 * @param  {string} email email address of the user to be initialised
 */
function initializeUserInDb(email) {
    let userId = firebase.auth().currentUser.uid;
    let userRef = firebase.database().ref("users/"+userId);
    userRef.set({
        "email": email,
        "user_stats": {
            "tree_count": 0,
            "pages_left": 100,
            "snoozed": false
        },
    });
}

/**
 * New page logic for updating Firebase db and DOM
 */
function incrementTreesPages() {
    // Get db path to user stats
    let userId = firebase.auth().currentUser.uid;
    let statsRef = firebase.database().ref("users/"+userId+"/user_stats");

    // Update user stats in db
    statsRef.once('value', (snapshot) => {
        let pages = snapshot.val().pages_left;
        let trees = snapshot.val().tree_count;

        // Evaluate correct new values
        if (pages == 1) {
            pages = 100;
            trees++;
        } else {
            pages--;
        }

        // Update in db
        statsRef.update({
            pages_left: pages,
            tree_count: trees
        });
    });

    // All tabs to listen for live-updated stats and display in DOM
    statsRef.on('value', (snapshot) => {
        let pages = snapshot.val().pages_left;
        let trees = snapshot.val().tree_count;
        $('#trees_num').text(trees);
        $('#pages_num').text(pages);
        $('#trees_units').text(pluralize(trees, "", "planted"));
        $('#pages_units').text(pluralize(pages,"pages", "to go"));
        $('#trees_icon').attr('src', 'images/TreesPlantedIcon.png');
        $('#pages_icon').attr('src', selectPagesLeftIcon(pages));
    });
}

/**
 * Formats strings correctly according to plurality i.e. 0 trees, 1 tree, 2 trees
 *
 * @param  {number} number integer representing quantity
 * @param  {string} units  the plural units e.g. "cats"
 * @param  {string} end    phrase to add at the end
 * @return {string}        correctly formatted string for regular verbs
 */
function pluralize (number, units, end) {
    if (number == 1) {
        units = units.slice(0, -1); // slice off the s at the end of the word
    }
    return units+" "+end;
}



function selectPagesLeftIcon (pagesLeftNum) {
  let progressImgURL = "";
  if (pagesLeftNum > 93){
    progressImgURL = 'images/Animation1.png';
  } else if (pagesLeftNum > 87){
    progressImgURL = 'images/Animation2.png';
  } else if (pagesLeftNum > 81){
    progressImgURL = 'images/Animation3.png';
  } else if (pagesLeftNum > 75){
    progressImgURL = 'images/Animation4.png';
  } else if (pagesLeftNum > 68){
    progressImgURL = 'images/Animation5.png';
  } else if (pagesLeftNum > 62){
    progressImgURL = 'images/Animation6.png';
  } else if (pagesLeftNum > 56){
    progressImgURL = 'images/Animation7.png';
  } else if (pagesLeftNum > 50){
    progressImgURL = 'images/Animation8.png';
  } else if (pagesLeftNum > 44){
    progressImgURL = 'images/Animation9.png';
  } else if (pagesLeftNum > 37){
    progressImgURL = 'images/Animation10.png';
  } else if (pagesLeftNum > 31){
    progressImgURL = 'images/Animation11.png';
  } else if (pagesLeftNum > 25){
    progressImgURL = 'images/Animation12.png';
  } else if (pagesLeftNum > 19){
    progressImgURL = 'images/Animation13.png';
  } else if (pagesLeftNum > 13){
    progressImgURL = 'images/Animation14.png';
  } else if (pagesLeftNum > 7){
    progressImgURL = 'images/Animation15.png';
  } else if (pagesLeftNum > 1){
    progressImgURL = 'images/Animation16.png';
  } else {
    progressImgURL = 'images/Animation17.png';
  }
  return progressImgURL;
}
