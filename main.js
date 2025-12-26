
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
      <img src="${img}" alt="Service" loading="lazy">
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
      <img src="${card.img}" alt="Service" loading="lazy">
      <h3>${card.title}</h3>
      <p>${card.desc}</p>
      <div class="card-buttons">
        <button class="details-btn"><a class="btn-link2" href="tel:+91 9061707348" target="_blank">📞 Call Us Now</a></button>
        <button class="join-btn"><a class="btn-link" href="https://wa.me/9061707348" target="_blank">Chat with Us Now</a></button>

      </div>
    `;
    grid.appendChild(cardDiv);
  });
}


// Real-time sync with Firestore
onSnapshot(collection(db, 'serviceCards'), (snapshot) => {
  const cards = [];
  snapshot.forEach(docSnap => {
    cards.push({ id: docSnap.id, ...docSnap.data() });
  });
  showCards(cards);
});
}
