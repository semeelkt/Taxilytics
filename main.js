// main.js
// Handles login and dynamic service card addition

const ADMIN_PASSWORD = "admin123";
const CLIENT_PASSWORDS = ["client1", "client2"];

function setSession(type) {
  localStorage.setItem('taxilytics_session', type);
}

function clearSession() {
  localStorage.removeItem('taxilytics_session');
}

function getSession() {
  return localStorage.getItem('taxilytics_session');
}

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const loginMsg = document.getElementById('login-message');

  if (password === ADMIN_PASSWORD) {
    setSession('admin');
    loginMsg.textContent = "Logged in as Admin.";
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('main-content').style.display = '';
    document.getElementById('add-card-admin').style.display = '';
  } else if (CLIENT_PASSWORDS.includes(password)) {
    setSession('client');
    loginMsg.textContent = "Logged in as Client.";
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('main-content').style.display = '';
    document.getElementById('add-card-admin').style.display = 'none';
  } else {
    loginMsg.textContent = "Invalid password.";
  }
}

function logout() {
  clearSession();
  document.getElementById('main-content').style.display = 'none';
  document.getElementById('login-section').style.display = '';
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
  document.getElementById('login-message').textContent = '';
}

function autoLogin() {
  const session = getSession();
  if (session === 'admin') {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('main-content').style.display = '';
    document.getElementById('add-card-admin').style.display = '';
  } else if (session === 'client') {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('main-content').style.display = '';
    document.getElementById('add-card-admin').style.display = 'none';
  }
}

function showAddCardForm() {
  document.getElementById('add-card-form').style.display = '';
}
function hideAddCardForm() {
  document.getElementById('add-card-form').style.display = 'none';
}
function addServiceCard() {
  const title = document.getElementById('card-title').value;
  const desc = document.getElementById('card-desc').value;
  const img = document.getElementById('card-img').value || 'img/taxation.jpg';
  if (title && desc) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.innerHTML = `
      <img src="${img}" alt="Service">
      <h3>${title}</h3>
      <p>${desc}</p>
      <div class="card-buttons">
        <button class="details-btn"><a class="btn-link2" href="tel:+91 9061707348" target="_blank">📞 Call Us Now</a></button>
        <button class="join-btn"><a class="btn-link" href="https://wa.me/9061707348" target="_blank">Chat with Us Now</a></button>
      </div>
    `;
    document.getElementById('course-grid').appendChild(cardDiv);
    document.getElementById('card-title').value = '';
    document.getElementById('card-desc').value = '';
    document.getElementById('card-img').value = '';
    hideAddCardForm();
  }
}

// Ensure JS runs after DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  window.login = login;
  window.logout = logout;
  window.showAddCardForm = showAddCardForm;
  window.hideAddCardForm = hideAddCardForm;
  window.addServiceCard = addServiceCard;
  autoLogin();
});

// Debugging: add alerts to show function calls
function showAddCardForm() {
  alert('Show Add Card Form called');
  document.getElementById('add-card-form').style.display = '';
}
function addServiceCard() {
  alert('Add Service Card called');
  const title = document.getElementById('card-title').value;
  const desc = document.getElementById('card-desc').value;
  const img = document.getElementById('card-img').value || 'img/taxation.jpg';
  if (title && desc) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.innerHTML = `
      <img src="${img}" alt="Service">
      <h3>${title}</h3>
      <p>${desc}</p>
      <div class="card-buttons">
        <button class="details-btn"><a class="btn-link2" href="tel:+91 9061707348" target="_blank">📞 Call Us Now</a></button>
        <button class="join-btn"><a class="btn-link" href="https://wa.me/9061707348" target="_blank">Chat with Us Now</a></button>
      </div>
    `;
    document.getElementById('course-grid').appendChild(cardDiv);
    document.getElementById('card-title').value = '';
    document.getElementById('card-desc').value = '';
    document.getElementById('card-img').value = '';
    hideAddCardForm();
  }
}
