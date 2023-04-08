const e_email = document.getElementById('email');
const e_email2 = document.getElementById('email2');
const e_profile = document.getElementById('profile');
const status = document.getElementById('status');
const status_icon = document.getElementById('status-icon');
const senderElement = document.getElementById('sender-tag');
const titleElement = document.getElementById('title-tag');
const dateElement = document.getElementById('date-tag');

const mail = {}

let lastdate = new Date(2000)

function runsync() {
  //Führe nach 2 sekunden aus
  setTimeout(() => {
    document.getElementById('turnstile').remove()
  }, 2000);

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

  e_email.innerText = randomEmail;
  e_email2.innerText = randomEmail;
  e_profile.innerText = randomEmail.slice(0, 2).toUpperCase();
  setInterval(fetchData, 2000);
}

async function fetchData() {
  try {
    const response = await fetch(`/api/mail?email=${e_email.innerText}&lastdate=${lastdate}`);
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

        mail[d.id] = {
          sender : d.sender,
          receiver : d.receiver,
          header : d.header,
          body : d.body,
          date : d.date,
        }

        // Speichern Sie die Daten in Variablen
        const id = d.id;


        moddate = convertDate(d.date)
        const date2 = new Date(d.date)
        date2.setHours(date2.getHours() - 7);
        if (date2 > lastdate) {
          lastdate = date2
        }



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
                <div class="date">${d.moddate}</div>
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
  date = date.replace(' ', 'T');
  const dateObj = new Date(date);
  // Hole den Zeitzone-Offset des Clients in Minuten
  dateObj.setHours(dateObj.getHours() - 7);
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



let messageElements = document.querySelectorAll('.nk-msg-item');


function select(event) {
  console.log(event)
  const selected = event.currentTarget;
  selected.classList.add('current');


  const content = mail[selected.querySelector('.id').innerText];
  console.log(content)

  document.getElementById('title-tag').innerText = content.header;
  document.getElementById('date-tag').innerText = content.date;
  document.getElementById('body-tag').innerHTML = content.body;

};




