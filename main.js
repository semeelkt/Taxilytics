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
  window.showAddCardForm = showAddCardForm;
  window.hideAddCardForm = hideAddCardForm;
  window.addServiceCard = addServiceCard;
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
