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

    // clear stats
    $('#userDisplay').hide();
    $('#user').empty();
    $('#trees').empty();
    $('#pages').empty();
});


// Listener for sign in / sign out
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
            console.log(firebaseUser);
            $('#togglers').addClass('d-none');
            $('#btnLogout').removeClass('d-none');

            // display username and stats
            $('#userDisplay').show();
            $('#user').text("Logged in as "+firebaseUser.email);

            // count new page for the user
            newPageUpdate();
    } else {
            console.log("not logged in");

            $('#togglers').removeClass('d-none');
            $('#btnLogout').addClass('d-none');

            // clear displayed username
            $('#userDisplay').hide();
            $('#user').empty();
            $('#trees').empty();
            $('#pages').empty();
    }
});

// Toggler to expand / collapse login div
$('#toggleLogin').on('click', () => {
    $('#btnSignup').toggle(); // toggle display: none
    $('#toggleSignup').toggleClass('invisible'); // toggle visibility: hidden

    // clear any previous auth error messages
    $('#authError').empty();
});


// Toggler to expand / collapse signup div
$('#toggleSignup').on('click', () => {
    $('#btnLogin').toggle(); // toggle display: none
    $('#toggleLogin').toggleClass('invisible'); // toggle visibility: hidden

    // clear any previous auth error messages
    $('#authError').empty();
});


// Development button for imitating a page load
$('#btnPage').on('click', () => {
    // TODO: delete this
    newPageUpdate();
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
function newPageUpdate() {
    // Get db path to user stats
    let userId = firebase.auth().currentUser.uid;
    let statsRef = firebase.database().ref("users/"+userId+"/user_stats");

    // Get user stats from db
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

        // Update user stats in db appropriately
        statsRef.update({
            pages_left: pages,
            tree_count: trees
        });

        // Update display on DOM
        $('#trees').text(trees+" "+pluralize(trees, "", "planted"));
        $('#pages').text(pages+" "+pluralize(pages,"pages", "to go"));
    });
}

/**
 * Formats strings correctly according to plurality i.e. 0 trees, 1 tree, 2 trees
 *
 * @param  {number} number [description]
 * @param  {string} units  [description]
 * @param  {string} end    [description]
 * @return {string}        [description]
 */
function pluralize (number, units, end) {
    if (number == 1) {
        units = units.slice(0, -1); // slice off the s at the end of the word
    }
    return units+" "+end;
}
