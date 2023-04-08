const e_email = document.getElementById('email');
const e_email2 = document.getElementById('email2');
const e_profile = document.getElementById('profile');

let lastdate = new Date(2000)
console.log(lastdate)

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

  e_email.innerText = randomEmail;
  e_email2.innerText = randomEmail;
  e_profile.innerText = randomEmail.slice(0, 2).toUpperCase();
  setInterval(fetchData, 2000);
}

async function fetchData() {
  const response = await fetch(`/api/mail?email=${e_email.innerText}&lastdate=${lastdate}`);
  const data = await response.json();
  
  const sidebar = document.getElementById('sidebar-mails');

  for (const d of data) {
    const email = e_email.innerText;

  
    // Überprüfen Sie, ob das JSON-Objekt die erwarteten Eigenschaften hat
    if (!d.sender || !d.receiver || !d.header || !d.body) {
      console.log(d)
      throw new Error("Ungültiges JSON-Objekt zurückgegeben.");
    }
  
    // Speichern Sie die Daten in Variablen
    const sender = d.sender;
    const receiver = d.receiver;
    const header = d.header;
    const body = d.body;
    const date = d.date;

    const date2 = new Date(date)
    if (date2 > lastdate) {
      lastdate = date2
      console.log(date)
    }
    
  
    // Erstellen Sie ein neues Div-Element und fügen Sie es dem DOM hinzu
    const newDiv = document.createElement('div');
    newDiv.innerHTML = `
    <div class="nk-msg-item current" data-msg-id="1">
    <div class="nk-msg-media user-avatar">
        <span>${sender.slice(0, 2).toUpperCase()}</span>
    </div>
    <div class="nk-msg-info">
        <div class="nk-msg-from">
            <div class="nk-msg-sender">
                <div class="name">${sender}</div>
                <div class="lable-tag dot bg-pink"></div>
            </div>
            <div class="nk-msg-meta">
                <div class="date">${date}</div>
            </div>
        </div>
        <div class="nk-msg-context">
            <div class="nk-msg-text">
                <h6 class="title">${header}</h6>
                <p>${body}</p>
            </div>
            <div class="nk-msg-lables">
                <div class="asterisk"><a href="#"><em
                            class="asterisk-off icon ni ni-star"></em><em
                            class="asterisk-on icon ni ni-star-fill"></em></a>
                </div>
            </div>
        </div>
    </div>
</div><!-- .nk-msg-item -->
    `;
    sidebar.appendChild(newDiv);
  }
}



