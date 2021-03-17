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
   
    ///////////
   let objectStore2 = db.createObjectStore('sessions', { keyPath: 'sessionusrid'});
   objectStore2.createIndex('date', 'date', { unique: false });
//////////////////
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
////////////////
    console.log('Database setup complete');
   // alert("setup done");
  };

  // Create an onsubmit handler so that when the form is submitted the addData() function is run
  form.onsubmit = logincheck;

  // Define the logincheck() function
  function logincheck(e) {
    // prevent default - we don't want the form to submit in the conventional way
    e.preventDefault();

    // open a read/write db transaction, ready for adding the data
    let transaction = db.transaction(['users'], 'readonly');

    let objectStore = transaction.objectStore('users');
    var request = objectStore.get(usrIdInput.value);

    request.onsuccess = function(e) {
        var result = e.target.result;
        //alert(result);
        if(typeof(result) == "undefined")
        {
          console.log("Invalid Userid");
          alert("Invalid ID...");
        }
        else{
        if(result.usrpwd == usrpwd.value)
        {
          console.log("Login successful");
          alert("Login Successful !!");

           sessioninfo();
        }
        else
        {
          console.log("Invalid Password");
          alert("Invalid Password !!");
        }
      }
        console.dir(result);
    }
  request.onerror = function(e) {
        console.log("Invalid ID");
        console.dir(e);
    }
    }
};

function sessioninfo()
{
  let transaction = db.transaction(['sessions'], 'readwrite');

    // call an object store that's already been added to the database
    let objectStore = transaction.objectStore('sessions');
     objectStore.clear();
    let today = new Date().toISOString().slice(0, 10);

    let newItem = { sessionusrid: usrIdInput.value,date: today  };
    



    // Make a request to add our newItem object to the object store
    var request = objectStore.add(newItem);
    request.onsuccess = function() {
      window.location.href = "home.html";     
    };

    // Report on the success of the transaction completing, when everything is done
    transaction.oncomplete = function() {
      console.log('Transaction completed: database modification finished.');
      
    };

    transaction.onerror = function() {
      console.log('Transaction not opened due to error');
    };
}