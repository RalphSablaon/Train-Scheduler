// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyBhwQnbbdJS2e69z-MjPqBi2eFzwbDlCF8",
    authDomain: "train-scheduler-da1c6.firebaseapp.com",
    databaseURL: "https://train-scheduler-da1c6.firebaseio.com",
    projectId: "train-scheduler-da1c6",
    storageBucket: "",
    messagingSenderId: "1051980359395",
    appId: "1:1051980359395:web:b79bc868bf60bb74"
  };
  
firebase.initializeApp(firebaseConfig);

  
  // Create a variable to reference the database
  var database = firebase.database();
  
  // Create an on click function that adds trains to the top table
  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // create variables with the user input from form
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    var trainFreq = $("#frequency-input").val().trim();
  
    // create a temporary object for holding the new train data
    var newTrain = {
      name: trainName,
      destination: trainDestination,
      firstTime: firstTrain,
      frequency: trainFreq
    };
  
    // upload the new train data to the database
    database.ref().push(newTrain);
  
    // console log the values that were just pushed to the database
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTime);
    console.log(newTrain.frequency);
  
    // clear the form values after values have been stored
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
  });
  
  // create a firebase event for adding the data from the new trains and then populating them in the DOM.
  database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());
  
    // store snapshot changes in variables
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var firstTrain = childSnapshot.val().firstTime;
    var trainFreq = childSnapshot.val().frequency;
  
    // log the values
    console.log(trainName);
    console.log(trainDestination);
    console.log(firstTrain);
    console.log(trainFreq);
  
    // process for calculating the Next Arrival and Minutes Away fields...
    // make sure the first train time is after the eventual current time
    var firstTrainConv = moment(firstTrain, "hh:mm a").subtract(1, "years");
    // store variable for current time
    var currentTime = moment().format("HH:mm a");
    console.log("Current Time:" + currentTime);
    // store variable for difference of current time and first train time
    var trnTimeCurrentTimeDiff = moment().diff(moment(firstTrainConv), "minutes");
    // store the time left
    var timeLeft = trnTimeCurrentTimeDiff % trainFreq;
    // calculate and store the minutes until next train arrives
    var minutesAway = trainFreq - timeLeft;
    // calculate the next arriving train
    var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");
  
    // add the data into the DOM/html
    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFreq + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
  });