// Enable delete-on-click for all cards (event delegation)
document.addEventListener('DOMContentLoaded', function() {
  const grid = document.getElementById('course-grid');
  if (grid) {
    grid.addEventListener('click', function(e) {
      let card = e.target.closest('.card');
      if (!card || !grid.contains(card)) return;
      // Only trigger if not clicking a button or link
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return;
      if (confirm('Delete this card?')) {
        card.remove();
      }
    });
  }
});
// main.js
// Handles login and dynamic service card addition

const ADMIN_EMAIL = "mrflux3602@gmail.com";
const ADMIN_PASSWORD = "3602mskt";

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

  if (username === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    setSession('admin');
    window.location.href = 'admin.html';
    return;
  }
  // Allow any username except admin to log in as client with any password (even empty)
  if (username !== ADMIN_EMAIL) {
    setSession('client');
    loginMsg.textContent = "Logged in as Client.";
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('main-content').style.display = '';
    document.getElementById('add-card-admin').style.display = 'none';
    return;
  }
  loginMsg.textContent = "Invalid username or password.";
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
    cardDiv.addEventListener('click', function(e) {
      // Only trigger if not clicking a button or link
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return;
      if (confirm('Delete this card?')) {
        cardDiv.remove();
      }
    });
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
    addDoc(collection(db, 'serviceCards'), {
      title,
      desc,
      img
    });
    document.getElementById('card-title').value = '';
    document.getElementById('card-desc').value = '';
    document.getElementById('card-img').value = '';
    hideAddCardForm();
  }
function showCards(cards) {
  const grid = document.getElementById('course-grid');
  grid.innerHTML = '';
  cards.forEach(card => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.innerHTML = `
      <img src="${card.img}" alt="Service">
      <h3>${card.title}</h3>
      <p>${card.desc}</p>
      <div class="card-buttons">
        <button class="details-btn"><a class="btn-link2" href="tel:+91 9061707348" target="_blank">📞 Call Us Now</a></button>
        <button class="join-btn"><a class="btn-link" href="https://wa.me/9061707348" target="_blank">Chat with Us Now</a></button>
        <button class="delete-btn" data-id="${card.id}">Delete</button>
      </div>
    `;
    grid.appendChild(cardDiv);
  });
}

// Delete from Firestore when delete button is clicked
document.addEventListener('click', async function(e) {
  if (e.target.classList.contains('delete-btn')) {
    const id = e.target.getAttribute('data-id');
    if (confirm('Delete this card?')) {
      await deleteDoc(doc(db, 'serviceCards', id));
    }
  }
});
// Real-time sync with Firestore
onSnapshot(collection(db, 'serviceCards'), (snapshot) => {
  const cards = [];
  snapshot.forEach(docSnap => {
    cards.push({ id: docSnap.id, ...docSnap.data() });
  });
  showCards(cards);
});
}
