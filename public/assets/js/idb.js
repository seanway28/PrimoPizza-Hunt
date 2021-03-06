const { get } = require("../../../routes/api/comment-routes");

// Create variable to hold the db connection
let db;
// Establish a connnection to IndexedDB database named 'piiza_hunt' and set to version #1
const request = indexedDB.open('pizza_hunt', 1);

// This event will emit if the database version changes (nonexistent to version 1, v1, v2, v3, etc)
request.onupgradeneeded = function (event) {
    // Save a refer3ence to the database
    const db = event.target.result;
    // Create an object store (table) called 'new_pizza', set it to have an auto incrementing primary key of some kind
    db.createObjectStore('new_pizza', { autoIncrement: true});
};

// When Successful
request.onsuccess = function (event) {
    // when db is seccessfully created with it's object store (from onupgradedneeded event above) or simply establish a connection, save ref to  db in global variables
    db = event.target.result;
    // Check if app us online. If yes, run uploadPizza() fuction to send all local db data to api
    if (navigator.onLine){
        uploadPizza();
    }
};

request.onerror = function (event) {
    // Log Error
    console.log(event.target.errorCode);
};

// This fuction will be exectued IF we attempt submit a new pizza, but without internet access
function saveRecord(record) {
    // Open a new transaction with the database with the database with read and write permissions
    const transaction = db.transaction(['new_pizza'], 'redwrite');
    // Access the object store for 'new_pizza'
    const pizzaObjectStore = transaction.createObjectStore('new_pizza');
    // Add record to your store by adding method
    pizzaObjectStore.add(record);
}

function uploadPizza() {
    // Open a transaction on the db
    const transaction = db.transaction(['new_pizza'], 'readwrite');
    // Access your object store
    const pizzaObjectStore = transaction.pizzaObjectStore('new_pizza');
    //Get all records from store and set to a variable
    const getAll = pizzaObjectStore.getAll();
    // When succesful .getAll() execution, run the following fuction
    getAll.onsuccess = fuction();
        //If there was data in indexeddb's store, send it to the api server
        if(getAll.results.length > 0) {
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.results),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
            }
        })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(severResponse);
                    }
                    // Open one more transaction
                    const tranaction = db.tranaction(['new_pizza'], 'readwrite');
                    // Access the new_pizza object store
                    const pizzaObjectStore = transaction.objectStore('new_pizza');
                    // Clear all items in your store
                    pizzaObjectStore.clear();

                    alert('All saved pizza has been submitted.');
                })
                .catch(err => {
                    console.log(err);
                });
            }
        };
        // Listen for app coming back online
        windown.addEventListener('online', uploadPizza);
                        
                    

