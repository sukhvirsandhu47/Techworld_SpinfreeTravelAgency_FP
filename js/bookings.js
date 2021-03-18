const list = document.querySelector('#flightlist');
const hotellist = document.querySelector('#hotellist');

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

    //
    fetchsession();
    displayData();
    displayHotelData();
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
   
    
   let objectStore2 = db.createObjectStore('sessions', { keyPath: 'sessionusrid'});
   objectStore2.createIndex('date', 'date', { unique: false });
///////////////
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
   // alert("setup done");
  };



};
// Define the fetchsession()
  
function fetchsession() {

  let objectStore = db.transaction('sessions').objectStore('sessions');
  objectStore.openCursor().onsuccess = function(e) {
    // Get a reference to the cursor
    let cursor = e.target.result;
      console.log(cursor);       
      if(cursor==null) 
      {
            alert("Can't proceed without login...Redirecting to login page");
            window.location.href = "index.html";   
      }
      else
      {
        alert("Session exists !!");
      }
  }
}


  // Define the displayData() function
  function displayData() {
    // Here we empty the contents of the list element each time the display is updated
    // If you ddn't do this, you'd get duplicates listed each time a new note is added
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }

    // Open our object store and then get a cursor - which iterates through all the
    // different data items in the store
    let objectStore = db.transaction('flightbooking').objectStore('flightbooking');
    objectStore.openCursor().onsuccess = function(e) {
      // Get a reference to the cursor
      let cursor = e.target.result;

      // If there is still another data item to iterate through, keep running this code
      if(cursor) {
        // Create a list item, h3, and p to put each data item inside when displaying it
        // structure the HTML fragment, and append it inside the list
        const listItem = document.createElement('li');
        const h3 = document.createElement('h3');
        const para = document.createElement('p');

        listItem.appendChild(h3);
        listItem.appendChild(para);
        list.appendChild(listItem);

        // Put the data from the cursor inside the h3 and para
        //h3.textContent = cursor.value.usrid;
        
        para.textContent = "Date - " + cursor.value.flightdate +"  Passengers - " + cursor.value.flightpassengers;
       
        h3.textContent = cursor.value.flightfrom + "  --> " + cursor.value.flightto;

        // Store the ID of the data item inside an attribute on the listItem, so we know
        // which item it corresponds to. This will be useful later when we want to delete items
        listItem.setAttribute('flight-id', cursor.value.id);

        // Create a button and place it inside each listItem
        const deleteBtn = document.createElement('button');
        listItem.appendChild(deleteBtn);
        deleteBtn.textContent = 'Delete';

        // Set an event handler so that when the button is clicked, the deleteItem()
        // function is run
        deleteBtn.onclick = deleteFlight;

        // Iterate to the next item in the cursor
        cursor.continue();
      } else {
        // Again, if list item is empty, display a 'No notes stored' message
        if(!list.firstChild) {
          const listItem = document.createElement('li');
          listItem.textContent = 'No Flight Bookings.'
          list.appendChild(listItem);
        }
        // if there are no more cursor items to iterate through, say so
        console.log('All flights displayed');
      }
    };
  }



 
 function deleteFlight(e) {
  
  let noteId = Number(e.target.parentNode.getAttribute('flight-id'));

  // open a database transaction and delete the task, finding it using the id we retrieved above
  let transaction = db.transaction(['flightbooking'], 'readwrite');
  let objectStore = transaction.objectStore('flightbooking');
  let request = objectStore.delete(noteId);

  // report that the data item has been deleted
  transaction.oncomplete = function() {
    // delete the parent of the button
    // which is the list item, so it is no longer displayed
    e.target.parentNode.parentNode.removeChild(e.target.parentNode);
    console.log('Flight ' + noteId + ' deleted.');

    // Again, if list item is empty, display a 'No notes stored' message
    if(!list.firstChild) {
      const listItem = document.createElement('li');
      listItem.textContent = 'No Flights booked.';
      list.appendChild(listItem);
    }
  };
}




function displayHotelData() {
  // Here we empty the contents of the list element each time the display is updated
  // If you ddn't do this, you'd get duplicates listed each time a new note is added
  while (hotellist.firstChild) {
    hotellist.removeChild(hotellist.firstChild);
  }

  // Open our object store and then get a cursor - which iterates through all the
  // different data items in the store
  let objectStore = db.transaction('hotelbooking').objectStore('hotelbooking');
  objectStore.openCursor().onsuccess = function(e) {
    // Get a reference to the cursor
    let cursor = e.target.result;

    // If there is still another data item to iterate through, keep running this code
    if(cursor) {
      // Create a list item, h3, and p to put each data item inside when displaying it
      // structure the HTML fragment, and append it inside the list
      const listItem = document.createElement('li');
      const h3 = document.createElement('h3');
      const para = document.createElement('p');

      listItem.appendChild(h3);
      listItem.appendChild(para);
      hotellist.appendChild(listItem);

      // Put the data from the cursor inside the h3 and para
      //h3.textContent = cursor.value.usrid;
      
      para.textContent = cursor.value.hotelfrom +" ---> " + cursor.value.hotelto;
     
      h3.textContent = cursor.value.hotelname + ", " + cursor.value.cityname;
      
      listItem.setAttribute('hotel-id', cursor.value.id);

      // Create a button and place it inside each listItem
      const deleteBtn = document.createElement('button');
      listItem.appendChild(deleteBtn);
      deleteBtn.textContent = 'Delete';

      // Set an event handler so that when the button is clicked, the deleteItem()
      // function is run
      deleteBtn.onclick = deleteHotel;

      // Iterate to the next item in the cursor
      cursor.continue();
    } else {
      
      if(!hotellist.firstChild) {
        const listItem = document.createElement('li');
        listItem.textContent = 'No Hotel Bookings.'
        hotellist.appendChild(listItem);
      }
      
      console.log('All Hotel bookings displayed');
    }
  };
}




function deleteHotel(e) {
  
  let noteId = Number(e.target.parentNode.getAttribute('hotel-id'));
  
  let transaction = db.transaction(['hotelbooking'], 'readwrite');
  let objectStore = transaction.objectStore('hotelbooking');
  let request = objectStore.delete(noteId);
  
  transaction.oncomplete = function() {
   
    e.target.parentNode.parentNode.removeChild(e.target.parentNode);
    console.log('Hotel ' + noteId + ' deleted.');

    if(!hotellist.firstChild) {
      const listItem = document.createElement('li');
      listItem.textContent = 'No Hotel booked.';
      hotellist.appendChild(listItem);
    }
  };
}

