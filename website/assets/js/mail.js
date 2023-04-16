
const e_email = document.getElementById('email');
const change_email = document.getElementById('changeMail');
const e_email2 = document.getElementById('email2');
const e_email3 = document.getElementById('email3');
const e_profile = document.getElementById('profile');
const status = document.getElementById('status');
const status_icon = document.getElementById('status-icon');
const senderElement = document.getElementById('sender-tag');
const titleElement = document.getElementById('title-tag');
const dateElement = document.getElementById('date-tag');
const input = document.getElementById("changeMail");
const sidebar = document.getElementById('sidebar-mails');


const mail = {}
mail.active = false


function runsync() {

  function generateRandomEmail() {
    const randomString = generateRandomString();
    const email = randomString + '@goog.re';
    return email;
  }
  function generateRandomString() {
    const allowedChars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-';
    const length = Math.floor(Math.random() * 6) + 5;
    let randomString = '';
    for (let i = 0; i < length; i++) {
      randomString += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
    }
    return randomString;
  }

  function sanitizeEmail(email) {
    email = email.toLowerCase();
    email = email.replace(/[^a-z0-9.-@]/g, '');
    return email;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const emailParam = urlParams.get('email');

  let randomEmail;
  if (emailParam) {
    randomEmail = sanitizeEmail(emailParam) + "@goog.re"

  } else {
    randomEmail = generateRandomEmail();
  }

  urlParams.set('email', randomEmail.replace('@goog.re', ''));
  const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
  window.history.pushState({}, '', newUrl);

  e_email.innerHTML = randomEmail;
  change_email.value = randomEmail.replace('@goog.re', '')
  e_email2.innerText = randomEmail;
  e_email3.innerText = randomEmail;
  e_profile.innerText = randomEmail.slice(0, 2).toUpperCase();

  fetch(`https://get.goog.re/?${randomEmail}`)
  .then(response => response.json()) 
  .then(htmlBody => {
    const keys = Object.keys(htmlBody);
    for (let i = 0; i < keys.length; i++) {
      const id = keys[i];
      const info = htmlBody[id];
      console.log(info);
      mail[info.randomid] = info
      moddate = convertDate(info.date)
      const newDiv = document.createElement('div');
      newDiv.innerHTML = `
          <div class="nk-msg-item" data-msg-id="1" onclick="select(event)">
          <div class="nk-msg-media user-avatar">
              <span>${info.from.slice(0, 2).toUpperCase()}</span>
          </div>
          <div class="nk-msg-info">
              <div class="nk-msg-from">
                  <div class="nk-msg-sender">
                      <div class="sender">${info.from}</div>
                      <!--div class="lable-tag dot bg-pink"></div-->
                  </div>
                  <div class="nk-msg-meta">
                      <div class="date">${moddate}</div>
                  </div>
              </div>
              <div class="nk-msg-context">
                  <div class="nk-msg-text">
                      <h6 class="title" style="font-weight:300">${info.subject}</h6>
                  </div>
              </div>
          </div>
          <p class="id" style="display:none;">${info.randomid}</p>
      </div><!-- .nk-msg-item -->
          `;
      sidebar.insertBefore(newDiv, sidebar.firstChild);
    }
  })
  .catch(error => {
    console.error(error);
  });

  async function fetchRealtime() {
    const realtime = new Ably.Realtime.Promise("KrffQw.Xhhj-g:Hfp5GLom4hVodQ6jmqF4WoVFP9POX1-fRFsGOe8dPgc");

    realtime.connection.on("connecting", () => {
      console.log("Verbinden...");
      status.innerText = 'Connecting...';
      status.classList.remove('text-success');
      status.classList.remove('text-danger');
      status_icon.classList.remove('text-success');
      status_icon.classList.remove('text-danger');
    });

    realtime.connection.on("connected", () => {
      console.log("Verbindung erfolgreich.");
      status.innerText = 'Connected';
      status.classList.add('text-success');
      status.classList.remove('text-danger');
      status_icon.classList.add('text-success');
      status_icon.classList.remove('text-danger');
    });

    realtime.connection.on("disconnected", () => {
      console.log("Verbindung geschlossen.");
      status.innerText = 'Disconnected';
      status.classList.remove('text-success');
      status.classList.add('text-danger');
      status_icon.classList.remove('text-success');
      status_icon.classList.add('text-danger');
    });

    realtime.connection.on("suspended", () => {
      console.log("Verbindung geschlossen.");
      status.innerText = 'Disconnected';
      status.classList.remove('text-success');
      status.classList.add('text-danger');
      status_icon.classList.remove('text-success');
      status_icon.classList.add('text-danger');
    });

    realtime.connection.on("failed", () => {
      console.log("Verbindung geschlossen.");
      status.innerText = 'Disconnected';
      status.classList.remove('text-success');
      status.classList.add('text-danger');
      status_icon.classList.remove('text-success');
      status_icon.classList.add('text-danger');
    });

    realtime.connection.on("closed", () => {
      console.log("Verbindung geschlossen.");
      status.innerText = 'Disconnected';
      status.classList.remove('text-success');
      status.classList.add('text-danger');
      status_icon.classList.remove('text-success');
      status_icon.classList.add('text-danger');
    });


    await realtime.connection.once("connected");
    status.innerText = 'Connected';
    status.classList.add('text-success');
    status.classList.remove('text-danger');
    status_icon.classList.add('text-success');
    status_icon.classList.remove('text-danger');

    const channel = realtime.channels.get(randomEmail.replace('@goog.re', '').toLowerCase());
    await channel.subscribe((msg) => {
      console.log("Received: " + JSON.stringify(msg.data.from));
      moddate = convertDate(msg.data.date)
      moddate2 = convertDate2(msg.data.date)
      randomid = msg.data.id

      mail[randomid] = msg.data

      const newDiv = document.createElement('div');
      newDiv.innerHTML = `
          <div class="nk-msg-item" data-msg-id="1" onclick="select(event)">
          <div class="nk-msg-media user-avatar">
              <span>${msg.data.from.slice(0, 2).toUpperCase()}</span>
          </div>
          <div class="nk-msg-info">
              <div class="nk-msg-from">
                  <div class="nk-msg-sender">
                      <div class="sender">${msg.data.from}</div>
                      <!--div class="lable-tag dot bg-pink"></div-->
                  </div>
                  <div class="nk-msg-meta">
                      <div class="date">${moddate}</div>
                  </div>
              </div>
              <div class="nk-msg-context">
                  <div class="nk-msg-text">
                      <h6 class="title">${msg.data.subject}</h6>
                  </div>
              </div>
          </div>
          <p class="id" style="display:none;">${randomid}</p>
      </div><!-- .nk-msg-item -->
          `;
      sidebar.insertBefore(newDiv, sidebar.firstChild);
    });
  }
  fetchRealtime()
}



// Show date formated
function convertDate(date) {
  date = date.replace(' ', 'T');
  const dateObj = new Date(date);
  const today = new Date();
  const currentYear = today.getFullYear();
  if (dateObj.toDateString() === today.toDateString()) {
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    return formattedTime;
  } else {
    const options = { day: 'numeric', month: 'short' };
    const formattedDate = dateObj.toLocaleDateString('de-DE', options);
    const year = dateObj.getFullYear();
    const yearSuffix = (year !== currentYear) ? ` ${year}` : '';
    return `${formattedDate}${yearSuffix}`;
  }
}
function convertDate2(isoDateString) {
  let date = new Date(isoDateString);
  const options = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true
  };
  const formattedDate = date.toLocaleDateString("en-US", options);
  return formattedDate;
}

let messageElements = document.querySelectorAll('.nk-msg-item');


// Select message and handle CSS
function select(event) {
  if(mail.active === false){
    mail.active = true;
  }
  const elements = document.querySelectorAll('.nk-msg-item');
  document.getElementById('nk-msg-head').style.display = 'block';
  document.getElementById('right').style.display = 'block';
  elements.forEach(function (element) {
    element.classList.remove('current')
  });
  const selected = event.currentTarget;
  selected.classList.add('current');
  const content = mail[selected.querySelector('.id').innerText];
  document.getElementById('title-tag').innerText = content.subject;
  document.getElementById('receiver-tag').innerText = "To: "+content.to
  document.getElementById('date-tag').innerText = convertDate2(content.date);
  document.getElementById('headers').innerText = "Message Identifier: "+content.messageId;
  document.getElementById('sender-icon').innerText = content.from.slice(0, 2).toUpperCase();
  if (content.from) {
    document.getElementById('sender-name').innerText = content.from;
    document.getElementById('sender-mail').innerText = content.from_mail;
  } else {
    document.getElementById('sender-mail').innerText = content.from_mail;
  };

  fetch(`https://get.goog.re/?${content.to}&${selected.querySelector('.id').innerText}`)
    .then(response => response.text()) 
    .then(htmlBody => {
      document.getElementById('body-tag').innerHTML = htmlBody; 
      console.log(htmlBody)
    })
    .catch(error => {
      console.error(error);
    });

}


//Copy Email on Click
const textToCopy = document.getElementById('copy');
textToCopy.addEventListener('click', function () {
  const text = document.getElementById('email').innerText;
  navigator.clipboard.writeText(text).then(function () {
    textToCopy.classList.remove('bi-clipboard')
    textToCopy.classList.add('bi-clipboard2-check-fill')
    textToCopy.style.color = "green"
    setTimeout(function () {
      textToCopy.classList.add('bi-clipboard')
      textToCopy.classList.remove('bi-clipboard2-check-fill')
      textToCopy.style.color = "#526484"
    }, 1000)
  }, function () {
    console.error('Fehler beim Kopieren des Textes.');
  });
});
e_email.addEventListener('click', function () {
  const text = document.getElementById('email').innerText;
  navigator.clipboard.writeText(text).then(function () {
    textToCopy.classList.remove('bi-clipboard')
    textToCopy.classList.add('bi-clipboard2-check-fill')
    textToCopy.style.color = "green"
    setTimeout(function () {
      textToCopy.classList.add('bi-clipboard')
      textToCopy.classList.remove('bi-clipboard2-check-fill')
      textToCopy.style.color = "#526484"
    }, 1000)
  }, function () {
    console.error('Fehler beim Kopieren des Textes.');
  });
});

// Edit function for Email
function edit() {
  modifyWidth()
  input.style.display = "inline-block";
  e_email.innerText = "@goog.re"
  document.getElementById('changeMail').focus();
  document.getElementById('confirm').style.display = "inline-block";
  document.getElementById('close').style.display = "inline-block";
  document.getElementById('copy').style.display = "none";
  document.getElementById('reload').style.display = "none";
  document.getElementById('edit').style.display = "none";
}

// Confirm after editing
function confirm() {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('email', input.value.replace('@goog.re', ''));
  const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
  window.history.pushState({}, '', newUrl);
  location.reload()
}

// Function to change the width of input
function modifyWidth() {
  input.style.width = (input.value.length * 0.55 + 3) + "em";
}
var el = document.getElementById("changeMail");
el.addEventListener("keyup", modifyWidth, false);





