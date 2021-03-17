// Create needed constants
const usrIdInput = document.querySelector('#email');
const pwdInput = document.querySelector('#usrpwd');

const form = document.querySelector('form');
const submitBtn = document.querySelector('form button');

// Create an instance of a db object for us to store the open database in
let db;

window.onload = function() {
  // Open our database; it is created if it doesn't already exist
  // (see onupgradeneeded below)
  let request = window.indexedDB.open('spi', 1);

  // onerror handler signifies that the database didn't open successfully
  request.onerror = function() {
    console.log('Database failed to open');
  };

  // onsuccess handler signifies that the database opened successfully
  request.onsuccess = function() {
    console.log('Database opened succesfully');

    // Store the opened database object in the db variable. This is used a lot below
    db = request.result;
  };
   // Setup the database tables if this has not already been done
   request.onupgradeneeded = function(e) {

    // Grab a reference to the opened database
    let db = e.target.result;

   let objectStore = db.createObjectStore('users', { keyPath: 'usrid'});

   
   objectStore.createIndex('usrpwd', 'usrpwd', { unique: false });
   objectStore.createIndex('usrname', 'usrname', { unique: false });
   objectStore.createIndex('usrurl', 'usrurl', { unique: false });
   objectStore.createIndex('usrbirth', 'usrbirth', { unique: false });
   objectStore.createIndex('usrgen', 'usrgen', { unique: false });
   objectStore.createIndex('usrcomments', 'usrcomments', { unique: false });
   
};