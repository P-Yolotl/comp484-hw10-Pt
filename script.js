//Giga Pet - Pablo P. Torres
// My two unique jQuery methods are: .html() and .addClass()

$(function () { // Makes sure that your function is called once all the DOM elements of the page are ready to be used.

  // HW10: Log a styled banner, an info message, and a table of the starting stats
  logStartupInfo();

  // Called function to update the name, happiness, and weight of our pet in our HTML
  checkAndUpdatePetInfoInHtml();

  // When each button is clicked, it will "call" function for that button (functions are below)
  $(".treat-button").click(clickedTreatButton);
  $(".play-button").click(clickedPlayButton);
  $(".exercise-button").click(clickedExerciseButton);
  $(".clean-button").click(clickedCleanButton);
});

// Add a variable "pet_info" equal to a object with the name (string), weight (number), and happiness (number) of your pet
var pet_info = { name: "Apollo", weight: 60, happiness: 50, cleanliness: 70 };
// What Apollo says after each action. Each action has an array of messages, and one of them is randomly selected when the action is performed.
var pet_messages = {
  treat: [
    "Yum! Thanks for the treat!",
    "Best. Snack Ever!",
    "*crunch crunch* Thank you!",
  ],
  play: [
    "Yay! Let's play!",
    "I love playing with you!",
    "Throw the ball again!",
  ],
  exercise: [
    "Pant... pant... are we done yet?",
    "Oh no! I don't want to exercise!",
    "Okay. One more time!",
  ],
  clean: [
    "Ahh! I feel so clean now!",
    "Bubbles! Bubbles! I love baths!",
    "Thanks for cleaning me up!",
    "Do I smell nice now?",
  ],
  //Complaints: When the pet is unhappy or dirty, he will complain. These messages are randomly selected when the pet is unhappy or dirty.
  muddy: [
    "Ew, I'm still all muddy! Can you groom me?",
    "My fur is so itchy... I need a bath!",
    "I'm leaving paw prints everywhere!"
  ],
  sad: [
    "I'm not feeling very happy...",
    "Can we play? Or maybe a treat?",
    "*whimper* I feel lonely...",
  ],
  muddyAndSad: [
    "I'm muddy AND sad... this is the worst day ever!",
    "*sniff* Nobody wants to pet a muddy husky...",
    "Please give me a bath and a hug!",
  ],
};
// ---------- Sad sound effect---extra feature- ----------
// new Audio(...) loads a sound file so we can play it with JavaScript.
var whimper_sound = new Audio("audio/Sad_Dog_sound.MP3");

// If Apollo was already sad after the last click,
// so the sound only plays at the moment he BECOMES sad
// not again on every click while he stays sad.
var was_sad = false;

// Plays the whimper sound when Apollo's happiness drops below 20.
// I use the same number as updatePetImage(), so the sound plays
// at the same time his picture changes to sad.
function playSadSound() {
  var is_sad = pet_info.happiness < 20;

  if (is_sad && !was_sad) {
    whimper_sound.currentTime = 0; // Start the sound from the beginning
    whimper_sound.play();
  }

  was_sad = is_sad; // Save for the next click
}

function clickedTreatButton() {
  // Increase pet happiness
  pet_info.happiness += 5; // Treats make him happy!
  // Increase pet weight
  pet_info.weight += 1; // .., but heavier too!
  checkAndUpdatePetInfoInHtml();
  showPetMessage(getRandomMessage(pet_messages.treat));
  showPetMessage(chooseMessage("treat")); // Show a message based on the action performed
  logPetAction("Treat"); // HW10: console logging demo
}

function clickedPlayButton() {
  // HW10: I save the happiness before the change so I can compare it in the debugger
  var happiness_before = pet_info.happiness;
  // Increase pet happiness
  pet_info.happiness += 5; // BUG (HW10): this should be += 5. Playing makes him happy!
  // Decrease pet weight
  pet_info.weight -= 1; // .., but lighter too!
  // Decrease pet cleanliness
  pet_info.cleanliness -= 5; // Playing makes him dirty!
  checkAndUpdatePetInfoInHtml();
  showPetMessage(getRandomMessage(pet_messages.play));
  showPetMessage(chooseMessage("play")); // Show a message based on the action performed
  logPetAction("Play"); // HW10: console logging demo
}

function clickedExerciseButton() {
  // Decrease pet happiness
  pet_info.happiness -= 5; // Exercise makes him sad!
  // Decrease pet weight
  pet_info.weight -= 2; // .., but lighter too!
  // Decrease pet cleanliness
  pet_info.cleanliness -= 10; // Exercise makes him dirty!

  checkAndUpdatePetInfoInHtml();
  showPetMessage(getRandomMessage(pet_messages.exercise));
  showPetMessage(chooseMessage("exercise")); // Show a message based on the action performed
  logPetAction("Exercise"); // HW10: console logging demo
}

function clickedCleanButton() {
  // Increase pet cleanliness
  pet_info.cleanliness += 20; // Cleaning makes him clean!
  checkAndUpdatePetInfoInHtml();
  showPetMessage(getRandomMessage(pet_messages.clean));
  showPetMessage(chooseMessage("clean")); // Show a message based on the action performed
  logPetAction("Groom"); // HW10: console logging demo
}

function checkAndUpdatePetInfoInHtml() {
  checkWeightAndHappinessBeforeUpdating();
  updatePetInfoInHtml();
  updatePetImage(); // Swap the pet's picture depending on how happy he is
  playSadSound(); // Play a sad sound if the pet is sad
}

function checkWeightAndHappinessBeforeUpdating() {
  // Add conditional so if weight is lower than zero.
  if (pet_info.weight < 0) {
    pet_info.weight = 0;
  }
  // Conditional so if happiness is lower than zero.
  if (pet_info.happiness < 0) {
    pet_info.happiness = 0;
  }
  // Conditional so if cleanliness is lower than zero.
  if (pet_info.cleanliness < 0) {
    pet_info.cleanliness = 0;
  }
  // Happiness and cleanliness should not exceed 100.
  if (pet_info.happiness > 100) {
    pet_info.happiness = 100;
  }
  if (pet_info.cleanliness > 100) {
    pet_info.cleanliness = 100;
  }
}

// Updates your HTML with the current values in your pet_info object
function updatePetInfoInHtml() {
  $(".name").text(pet_info["name"]);
  $(".weight").text(pet_info["weight"]);
  $(".happiness").text(pet_info["happiness"]);
  $(".cleanliness").text(pet_info["cleanliness"]);
}

// ---------- Changing Apollo's picture (extra feature) ----------
// Apollo's picture changes depending on how clean and how happy he is,
// so the player can see how he feels without reading the numbers.
// This function is called every time a button is clicked
// from checkAndUpdatePetInfoInHtml, so the picture is always up to date.
//
// .attr("src", ...) changes the "src" attribute of the <img>, which tells
// the browser which image file to show. I also change the "alt" text
// so it still describes the picture for screen readers.
function updatePetImage() {
  // The order of these checks matters: the first one that is true wins.
  // The most specific case (muddy AND sad) is checked first.
  if (pet_info.cleanliness < 30 && pet_info.happiness < 20) {
    // Muddy and sad: Apollo needs a bath and some cheering up.
  $(".pet-image").attr("src", "images/Muddy_Tearful_Husky.png");
  $(".pet-image").attr("alt", "Apollo the Husky is muddy and sad");

} else if (pet_info.cleanliness < 30) {
  // Muddy but still happy: Apollo needs grooming.
  $(".pet-image").attr("src", "images/Muddy_Husky.png");
  $(".pet-image").attr("alt", "Apollo the Husky is muddy");
} else if (pet_info.happiness < 20) {
   // Clean but sad: Apollo needs a treat or playtime.
  $(".pet-image").attr("src", "images/Sad_Husky.png");
  $(".pet-image").attr("alt", "Apollo the Husky looking sad");
} else {
  // Clean and happy: show the normal happy picture.
  $(".pet-image").attr("src", "images/Happy_Husky.png");
  $(".pet-image").attr("alt", "Apollo the Husky looking happy");
}
}
// Chooses what Apollo says after a button is clicked.
// If Apollo is muddy or sad, he complains instead of giving the normal message,
// so the player knows what he needs. The checks use the same numbers and
// the same order as updatePetImage(), so his words always match his picture.
// "action" is the name of the button ("treat", "play", "exercise", or "clean")
function chooseMessage(action) {
  if (pet_info.cleanliness < 30 && pet_info.happiness < 20) {
    return getRandomMessage(pet_messages.muddyAndSad);
  } else if (pet_info.cleanliness < 30) {
    return getRandomMessage(pet_messages.muddy);
  } else if (pet_info.happiness < 20) {
    return getRandomMessage(pet_messages.sad);
  }
  // Apollo is clean and happy, so it uses the normal message for this button.
  // pet_messages[action] picks the array by name, e.g. pet_messages["treat"].
  return getRandomMessage(pet_messages[action]);
}

//Picks a random message from the pet_messages object based on the action performed
function getRandomMessage(messages) {
  var randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

// Shows the pet's message in the husky-message-text element based on the action performed. Instead of alert/console.log, we are using jQuery to update the text of the element with class "husky-message-text"
function showPetMessage(message) {
  // jQuery METHOD #1: .html()
  // .html() changes what is inside an element on the page.
  // It's like .text(), but .html() also understands HTML tags.
  // If I used .text(), the <span> tag would just show up as words on the screen.
  // With .html(), the <span> turns into a real element, so I can add
  // a paw emoji after the message and style it in my CSS.
  // (I only use .html() with text I wrote myself, never with text a user types in,
  // because that text could contain harmful code.)
  $(".husky-message-text").html(message + ' <span class="paw">🐾</span>');

  // jQuery METHOD #2: .addClass()
  /**
   * .addClass() gives an element a new CSS class.
   * In my CSS, the "hop" class makes Apollo jump up and down,
   * and the "pop" class makes the message pop onto the screen.
   * So adding these classes starts the animations.
   */
  $(".pet-image").addClass("hop");
  $(".husky-message-text").addClass("pop");

  // An animation only plays when the class is added.
  // So after 400 milliseconds, when the animation is done,
  // I remove the classes. That way they can be added again next time the user clicks a button.
  setTimeout(function () {
    $(".pet-image").removeClass("hop");
    $(".husky-message-text").removeClass("pop");
  }, 400);
}

// =====================================================================
// HW10: Chrome DevTools console logging demo
// console method 
// =====================================================================

// Every action the user performs is saved here, so console.table() can show the history.
var action_history = [];

// A copy of the stats from before the last action, so we can log "before vs after".
// Object.assign({}, obj) makes a copy; without it both names would point to the same object.
var last_snapshot = Object.assign({}, pet_info);

// Runs once when the page loads.
function logStartupInfo() {
  // LOG CUSTOM: %c applies the CSS in the next argument to the text after it.
  // There are two %c, so there are two style strings (one for each piece of text).
  console.log(
    "%c🐾 My Giga Pet %c- Chrome DevTools demo",
    "background: #4c9a2a; color: #fff; font-size: 20px; font-weight: 700; padding: 6px 14px; border-radius: 999px;",
    "background: #ffd84d; color: #5a3b00; font-size: 14px; font-weight: 600; padding: 4px 12px; border-radius: 999px;"
  );

  // LOG INFO: console.info() is for general information.
  console.info("Giga Pet loaded. Your pet is " + pet_info.name + ".");

  // LOG TABLE: console.table() shows an array of objects as a table (one row per object).
  // pet_info is one object, so I put it inside an array to get a single row.
  console.table([pet_info]);
}

// Runs at the end of every button click. "action" is the name of the button.
function logPetAction(action) {
  var after = Object.assign({}, pet_info); // Stats after the action

  // LOG GROUP: console.group() starts a collapsible section in the console.
  // Everything logged until console.groupEnd() is indented inside it.
  // The %c styles the group title, just like in logStartupInfo().
  console.group("%c" + action + " button clicked", "background: #4c9a2a; color: #fff; font-weight: 700; padding: 2px 10px; border-radius: 999px;");

  // LOG: console.log() for the plain details. Logging an object lets you expand it.
  console.log("Before:", last_snapshot);
  console.log("After:", after);

  // LOG INFO: a short summary of what changed.
  console.info(
    "Changes -> happiness: " + (after.happiness - last_snapshot.happiness) +
    ", weight: " + (after.weight - last_snapshot.weight) +
    ", cleanliness: " + (after.cleanliness - last_snapshot.cleanliness)
  );

  // LOG WARNING: console.warn() is for something that is not broken yet, but needs attention.
  // These use the same numbers as updatePetImage() (muddy < 30, sad < 20).
  if (after.cleanliness < 30) {
    console.warn(after.name + " is muddy! Cleanliness is " + after.cleanliness + ". He needs a bath.");
  }
  if (after.happiness < 20) {
    console.warn(after.name + " is sad! Happiness is " + after.happiness + ". He needs a treat or playtime.");
  }

  // LOG ERROR: console.error() is for something that is really wrong.
  // A stat that reaches 0 means Apollo is in serious trouble.
  if (after.happiness === 0) {
    console.error("Critical: " + after.name + "'s happiness reached 0!");
  }
  if (after.cleanliness === 0) {
    console.error("Critical: " + after.name + "'s cleanliness reached 0!");
  }
  if (after.weight === 0) {
    console.error("Critical: " + after.name + "'s weight reached 0!");
  }

  console.groupEnd(); // Closes the group. Anything logged after this is not indented.

  // Save this action in the history, then show the whole history as a table.
  action_history.push({
    action: action,
    happiness: after.happiness,
    weight: after.weight,
    cleanliness: after.cleanliness,
    time: new Date().toLocaleTimeString()
  });
  console.table(action_history);

  last_snapshot = after; // The "after" of this click is the "before" of the next click
}

// =====================================================================
// HW10: Browser-logged messages 
// These functions only run when I call them from the Console, so the app
// works normally until I trigger a demo on purpose.
// =====================================================================

// 404 NETWORK ERROR: ask for an image file that does not exist.
// The browser logs "GET .../Missing_Husky.png 404 (Not Found)" and the request
// also shows up in the Network tab with status 404.
function demo404() {
  var missing_image = new Image();
  missing_image.src = "images/Missing_Husky.png"; // This file does not exist on purpose
}

// TYPEERROR: use a property of something that is undefined.
// pet_info has no "owner" property, so pet_info.owner is undefined,
// and asking for .name of undefined is an invalid operation.
function demoTypeError() {
  var owner_name = pet_info.owner.name; // TypeError: Cannot read properties of undefined (reading 'name')
  console.log(owner_name); // Never runs, because the line above throws first
}

// A busy loop that blocks the page for "ms" milliseconds (nothing else can run meanwhile).
function busyWait(ms) {
  var start = Date.now();
  while (Date.now() - start < ms) {
    // Do nothing, just keep the browser busy
  }
}

// VIOLATION: an event handler that takes too long.
// After this runs, the NEXT click anywhere on the page runs a handler that
// blocks the page for 300ms. Chrome logs "[Violation] 'click' handler took 300ms".
// (Chrome shows violations at the "Verbose" level, so turn that level on in the Console.)
function demoViolation() {
  $(document).one("click", function () { // .one() runs the handler only once
    busyWait(300); // Much longer than the 50ms Chrome allows before it complains
  });
  console.info("Violation demo ready: click anywhere on the page.");
}

// Runs the 404 and the TypeError, and gets the violation ready.
function runAllBrowserDemos() {
  demo404();
  setTimeout(demoTypeError, 100); // In a timer, so the error does not stop the other demos
  demoViolation();
}