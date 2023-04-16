
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
const firstChild = sidebar.firstChild;


const mail = {}


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
  fetchData()


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

    const channel = realtime.channels.get(randomEmail);
    console.log(randomEmail)
    await channel.subscribe((msg) => {
      console.log("Received: " + JSON.stringify(msg.data.parsedEmail.from));
      document.getElementById('body-tag').innerHTML = msg.data;
      // Erstellen Sie ein neues Div-Element und fügen Sie es dem DOM hinzu
      // Import the emailjs-mime-parser library
      moddate = convertDate(msg.data.parsedEmail.date)
      moddate2 = convertDate2(msg.data.parsedEmail.date)

      randomid = generateRandomString(10)

      mail[randomid] = {
        sender: msg.data.parsedEmail.from.name,
        receiver: msg.data.parsedEmail.to.email,
        header: msg.data.parsedEmail.subject,
        body: msg.data.parsedEmail.html,
        date: moddate2,
      }
      // Parse the email data from the input string
      const newDiv = document.createElement('div');
      newDiv.innerHTML = `
          <div class="nk-msg-item" data-msg-id="1" onclick="select(event)">
          <div class="nk-msg-media user-avatar">
              <span>${msg.data.parsedEmail.from.name.slice(0, 2).toUpperCase()}</span>
          </div>
          <div class="nk-msg-info">
              <div class="nk-msg-from">
                  <div class="nk-msg-sender">
                      <div class="sender">${msg.data.parsedEmail.from.name}</div>
                      <!--div class="lable-tag dot bg-pink"></div-->
                  </div>
                  <div class="nk-msg-meta">
                      <div class="date">${moddate}</div>
                  </div>
              </div>
              <div class="nk-msg-context">
                  <div class="nk-msg-text">
                      <h6 class="title">${msg.data.parsedEmail.subject}</h6>
      
                  </div>
      
              </div>
          </div>
          <p class="id" style="display:none;">${randomid}</p>
      </div><!-- .nk-msg-item -->
          `;
      sidebar.insertBefore(newDiv, firstChild);
      document.getElementById('body-tag').innerHTML = msg.data.parsedEmail.html;
    });
  }
  fetchRealtime()
}

















async function fetchData() {
  try {
    const response = await fetch(`/api/mail?email=${e_email.innerText}`);
    const data = await response.json();

    const sidebar = document.getElementById('sidebar-mails');
    const firstChild = sidebar.firstChild;

    if (data.length < 1) {
      console.log('No new mails');
    } else {

      for (const d of data) {
        const email = e_email.innerText;


        // Überprüfen Sie, ob das JSON-Objekt die erwarteten Eigenschaften hat
        if (!d.sender || !d.receiver || !d.header || !d.body) {
          throw new Error("Ungültiges JSON-Objekt zurückgegeben.");
        }

        randomid = generateRandomString(10)

        mail[randomid] = {
          sender: d.sender,
          receiver: d.receiver,
          header: d.header,
          body: d.body,
          date: d.date,
        }

        // Speichern Sie die Daten in Variablen
        const id = d.id;


        moddate = convertDate(d.date)




        // Erstellen Sie ein neues Div-Element und fügen Sie es dem DOM hinzu
        const newDiv = document.createElement('div');
        newDiv.innerHTML = `
    <div class="nk-msg-item" data-msg-id="1" onclick="select(event)">
    <div class="nk-msg-media user-avatar">
        <span>${d.sender.slice(0, 2).toUpperCase()}</span>
    </div>
    <div class="nk-msg-info">
        <div class="nk-msg-from">
            <div class="nk-msg-sender">
                <div class="sender">${d.sender}</div>
                <!--div class="lable-tag dot bg-pink"></div-->
            </div>
            <div class="nk-msg-meta">
                <div class="date">${moddate}</div>
            </div>
        </div>
        <div class="nk-msg-context">
            <div class="nk-msg-text">
                <h6 class="title">${d.header}</h6>

            </div>

        </div>
    </div>
    <p class="id" style="display:none;">${d.id}</p>
</div><!-- .nk-msg-item -->
    `;
        sidebar.insertBefore(newDiv, firstChild);
      }
      messageElements = document.querySelectorAll('.nk-msg-item');
    }
    status.innerText = 'Connected';
    status.classList.add('text-success');
    status.classList.remove('text-danger');
    status_icon.classList.add('text-success');
    status_icon.classList.remove('text-danger');
  } catch (error) {
    console.log(error)
    status.innerText = 'Reconnecting...';
    status.classList.add('text-danger');
    status.classList.remove('text-success');
    status_icon.classList.add('text-danger');
    status_icon.classList.remove('text-success');
  }
}


function convertDate(date) {
  console.log(date)
  date = date.replace(' ', 'T');
  const dateObj = new Date(date);
  // Hole den Zeitzone-Offset des Clients in Minuten
  // Passe das Datum entsprechend dem Offset an

  // Erstelle Variablen für den heutigen Tag und das heutige Jahr
  const today = new Date();
  const currentYear = today.getFullYear();

  // Prüfe, ob das Datum heute ist
  if (dateObj.toDateString() === today.toDateString()) {
    // Zeige die Uhrzeit an, wenn es heute ist
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    return formattedTime;
  } else {
    // Zeige das Datum im Format "Tag. Monat" an, wenn es nicht heute ist
    const options = { day: 'numeric', month: 'short' };
    const formattedDate = dateObj.toLocaleDateString('de-DE', options);

    // Füge das Jahr hinzu, wenn es ein anderes Jahr als das aktuelle ist
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
  console.log(formattedDate);
  return formattedDate;

}

let messageElements = document.querySelectorAll('.nk-msg-item');

function select(event) {
  // Wähle alle Elemente mit der Klasse "element"
  const elements = document.querySelectorAll('.nk-msg-item');
  document.getElementById('nk-msg-head').style.display = 'block';
  document.getElementById('right').style.display = 'block';

  // Iteriere durch alle ausgewählten Elemente
  elements.forEach(function (element) {
    element.classList.remove('current')

  });

  const selected = event.currentTarget;
  selected.classList.add('current');


  const content = mail[selected.querySelector('.id').innerText];

  document.getElementById('title-tag').innerText = content.header;
  document.getElementById('date-tag').innerText = convertDate2(content.date);
  document.getElementById('body-tag').innerHTML = content.body;
  document.getElementById('sender-icon').innerText = content.sender.slice(0, 2).toUpperCase();
  if (content.sender.includes('<')) {
    const parts = content.sender.split("<");
    const sender_name = parts[0].trim();
    const sender_email = parts[1].replace(">", "").trim();
    document.getElementById('sender-name').innerText = sender_name;
    document.getElementById('sender-mail').innerText = sender_email;
  } else {
    document.getElementById('sender-mail').innerText = content.sender;
  };
}



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

// add event listener to price
var el = document.getElementById("changeMail");
el.addEventListener("keyup", modifyWidth, false);

function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


