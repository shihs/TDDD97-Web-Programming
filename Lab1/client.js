

displayWelcomePage = function() {
  // the code required to display a view
  var wp = document.getElementById("welcomepage");
  document.body.innerHTML = wp.text;
};

displayProfileView = function() {
  var mp = document.getElementById("memberpage");
  document.body.innerHTML = mp.text;

  document.getElementById('Home').style.display = "block";
  getUserData();
  openTab(event, "Home");
  postReload();
};


window.onload = function(){
  if (localStorage.getItem("token") != null) {
    displayProfileView();
  } else {
    displayWelcomePage();
  }
};


//==================Welcome Page==================//
//Sign In
validateSingIn = function() {
  var email = document.getElementById("emailsignin").value;
  var password = document.getElementById("passwordsignin").value;

  var response = serverstub.signIn(email, password);
  console.log(response);

  if (response.success == true) {
    localStorage.setItem('token', response.data);    // UPDATE: store token in the localstorage without the help from serverstub.js
    displayProfileView();
  } else {
    document.getElementById("signInAlert").innerHTML = response.message;
  }
};

//Sign Up
validateSignUp = function() {
  var pass1 = document.getElementById("password").value;
  var pass2 = document.getElementById("confirm_password").value;
  if (pass1 != pass2) {
    document.getElementById("signUpAlert").innerHTML = "Passwords do not match!";
    return false;
  }
  var dataObject = {
    "email": document.getElementById("email").value,
    "password": document.getElementById("password").value,
    "firstname": document.getElementById("firstname").value,
    "familyname": document.getElementById("familyname").value,
    "gender": document.getElementById("gender").value,
    "city": document.getElementById("city").value,
    "country": document.getElementById("country").value
  };
  
  var response = serverstub.signUp(dataObject);
  console.log(response);
  if (response.success == true) {
    var signInMessage = serverstub.signIn(dataObject["email"], dataObject["password"]);
    localStorage.setItem('token', signInMessage.data);    // UPDATE
    displayProfileView();
  } else {
      document.getElementById("signUpAlert").innerHTML = response.message;
  }
};

//==================Member Page==================//
openTab = function(evt, tabName) {
  var i, tabconten, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }

  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.classList.add("active");
  // x=evt.currentTarget.classList; 
  // alert("The id of the triggered element: "+ x);
};

getUserData = function() {
  var token = localStorage.getItem("token");
  var userData = serverstub.getUserDataByToken(token).data;
  var email = userData.email;
  var firstname = userData.firstname;
  var familyname = userData.familyname;
  var gender = userData.gender;
  var city = userData.city;
  var country = userData.country;
  var data = "Email: " + email + "<br>" + "Firstname: " + firstname + "<br>" + "Familyname: " + familyname + "<br>" + "Gender: " + gender + "<br>" + "City: " + city + "<br>" + "Country: " + country + "<br>";
  document.getElementById("userdata").innerHTML = data;
};

writePost = function() {
  var token = localStorage.getItem("token");
  var content = document.getElementById("userTextareaHome").value;
  var userData = serverstub.getUserDataByToken(token).data;
  var email = userData.email;
  var sendBackMessage = serverstub.postMessage(token, content, email);
  document.getElementById("writepostmessage").innerHTML = sendBackMessage.message;
};

postReload = function() {
  var token = localStorage.getItem("token");
  var sendBackMessage = serverstub.getUserMessagesByToken(token);
  if (sendBackMessage.success == true) {
    var objs = sendBackMessage.data;
    var messages = ""
    for (var obj in objs) {
      messages = messages + objs[obj].writer + " said: " + objs[obj].content + "<br>"
    }
    
  } else {
    messages = sendBackMessage.message;
  }
  document.getElementById("posts").innerHTML = messages;
};

searchUser = function() {
  var token = localStorage.getItem("token");
  var email = document.getElementById("searchemail").value;
  var sendBackMessage = serverstub.getUserDataByEmail(token, email);

  if (sendBackMessage.success == true) {
    var userData = sendBackMessage.data;
    var firstname = userData.firstname;
    var familyname = userData.familyname;
    var gender = userData.gender;
    var city = userData.city;
    var country = userData.country;
    var data = "Email: " + email + "<br>" + "Firstname: " + firstname + "<br>" + "Familyname: " + familyname + "<br>" + "Gender: " + gender + "<br>" + "City: " + city + "<br>" + "Country: " + country + "<br>";
  } else {
    var data = sendBackMessage.message;
  }
  document.getElementById("searchresult").innerHTML = data;
};

signOut = function() {
  var token = localStorage.getItem("token");
  var sendBackMessage = serverstub.signOut(token);
  if (sendBackMessage.success == true) {
    localStorage.removeItem("token");
    displayWelcomePage();
  }
};

changePassword = function() {
  var token = localStorage.getItem("token");
  var userData = serverstub.getUserDataByToken(token).data;
  var email = userData.email;
  var users;
  users = JSON.parse(localStorage.getItem("users"));
  var password = users[email].password;

  var oldpassword = document.getElementById("oldpassword").value;
  var newpassword = document.getElementById("newpassword").value;
  var repeatpassword = document.getElementById("repeatpassword").value;

  if (password != oldpassword) {
    document.getElementById("labelAlertChangePSW").innerHTML = "Old passwords is wrong!";
  } else if (newpassword != repeatpassword) {
    document.getElementById("labelAlertChangePSW").innerHTML = "Passwords do not match!";
  } else {
    var sendBackMessage = serverstub.changePassword(token, oldpassword, newpassword);    
    document.getElementById("labelAlertChangePSW").innerHTML = sendBackMessage.message;
  }
};







