// Create needed constants
const usrIdInput = document.querySelector('#email');
const pwdInput = document.querySelector('#usrpwd');
const usrNameInput = document.querySelector('#name');

const urlInput = document.querySelector('#usrurl');
const yearInput = document.querySelector('#usrbirth');


const commentInput = document.querySelector('#comments');
const chkInput = document.querySelector('#chk');



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
   
    //
    
   let objectStore2 = db.createObjectStore('sessions', { keyPath: 'sessionusrid'});
   objectStore2.createIndex('date', 'date', { unique: false });
//
//
//
let objectStore3 = db.createObjectStore('flightbooking', { keyPath: 'id', autoIncrement:true });
objectStore3.createIndex('usrid', 'usrid', { unique: false });   
objectStore3.createIndex('flightfrom', 'flightfrom', { unique: false });
objectStore3.createIndex('flightto', 'flightto', { unique: false });
objectStore3.createIndex('flightdate', 'flightdate', { unique: false });
objectStore3.createIndex('flightpassengers', 'flightpassengers', { unique: false });
//
let objectStore4 = db.createObjectStore('hotelbooking',  { keyPath: 'id', autoIncrement:true });
objectStore4.createIndex('usrid', 'usrid', { unique: false });   
objectStore4.createIndex('hotelfrom', 'hotelfrom', { unique: false });
objectStore4.createIndex('hotelto', 'hotelto', { unique: false });
objectStore4.createIndex('hotelname', 'hotelname', { unique: false });
objectStore4.createIndex('cityname', 'cityname', { unique: false });
//
    console.log('Database setup complete');
  //  alert("setup done");
  };

  // Create an onsubmit handler so that when the form is submitted the addData() function is run
  form.onsubmit = addData;

  // Define the addData() function
  function addData(e) {
// prevent default - we don't want the form to submit in the conventional way
e.preventDefault();
    if(chkInput.checked)
    {
       
    
    const gender = document.querySelector('input[name="gender"]:checked').value;


    // grab the values entered into the form fields and store them in an object ready for being inserted into the DB
    let newItem = { usrid: usrIdInput.value, usrpwd: pwdInput.value,
                    usrname:  usrNameInput.value, usrurl: urlInput.value, usrbirth: yearInput.value,
                  usrgen: gender, usrcomments:   commentInput.value };

    // open a read/write db transaction, ready for adding the data
    let transaction = db.transaction(['users'], 'readwrite');

    // call an object store that's already been added to the database
    let objectStore = transaction.objectStore('users');

    // Make a request to add our newItem object to the object store
    var request = objectStore.add(newItem);
    request.onsuccess = function() {
      alert("Registration Successful..Redirecting to Login Page !!");
     
      window.location.href = "index.html";
     
    };

    // Report on the success of the transaction completing, when everything is done
    transaction.oncomplete = function() {
      console.log('Transaction completed: database modification finished.');
      
    };

    transaction.onerror = function() {
      console.log('Transaction not opened due to error');
    };
    } 
    else
    {
        alert("Kindly confirm the checkbox before proceeding");
    }


  }



};


$("form input").change(function() {
  var numValid = 0; 
  $("form input[required]").each(function() {
      if (this.validity.valid) {
          numValid++;       
      }
  });
  var progress = $("#progress");
if (numValid == 0) {
  progress.attr("value", "0");
  }
if (numValid == 1) {
  progress.attr("value", "25");
  
}
if (numValid == 2) {
  progress.attr("value", "50");
  
}
if (numValid == 3) {
  progress.attr("value", "75");
  
}
if (numValid == 4) {
  progress.attr("value", "100");
  
}

});

