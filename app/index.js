// Feature #1: Photo upload/preview for each category
function previewImage(event, id) {
  const reader = new FileReader();
  reader.onload = function(){
    const img = document.getElementById(id);
    img.src = reader.result;
    img.style.display = "block";
    if (document.body.classList.contains('high-contrast')) img.classList.add('high-contrast');
    else img.classList.remove('high-contrast');
  };
  if(event.target.files[0]) reader.readAsDataURL(event.target.files[0]);
}

// Feature #2: Live listings (simulated data, per category)
let listings = {
  clothing: [{desc:'Red scarf', reserved:false}, {desc:'Kids boots EU32', reserved:false}],
  home: [{desc:'Steel teapot', reserved:false}],
  books: [{desc:'Crime novel (EN)', reserved:false}],
  electronics: [{desc:'Bluetooth speaker', reserved:false}],
  toys: [{desc:'Puzzle set', reserved:false}],
  sports: []
};

function renderListings(cat) {
  const ul = document.getElementById('listings-' + cat);
  if(!ul) return;
  ul.innerHTML = listings[cat].map((item, idx) =>
    `<li class="${item.reserved ? 'reserved': ''}">
      ${item.desc}
      ${item.img ? `<br><img src="${item.img}" class="img-preview" style="max-width:40px;">` : ''}
      ${!item.reserved ? `<button onclick="claimItem('${cat}',${idx})" aria-label="Claim item ${item.desc}">Claim</button>` : '(Reserved)'}
    </li>`
  ).join('');
}

// Feature #3: Reservation system
function claimItem(cat, idx) {
  if (!listings[cat][idx].reserved) {
    listings[cat][idx].reserved = true;
    addPoints(5);
    scheduleNotification(`Your '${listings[cat][idx].desc}' reservation is confirmed!`);
    renderListings(cat);
  }
}

// Feature #5: Accessibility - contrast toggle
function toggleContrast() {
  document.body.classList.toggle('high-contrast');
  document.querySelector('.container').classList.toggle('high-contrast');
  document.querySelectorAll('.img-preview').forEach(img=>{
    if(document.body.classList.contains('high-contrast')) img.classList.add('high-contrast');
    else img.classList.remove('high-contrast');
  });
}

// Feature #7: Points system
let points = 0;
function addPoints(amt) {
  points += amt;
  document.getElementById('points-val').textContent = points;
}

// Feature #9: Notification/reminder (simulated)
function scheduleNotification(msg) {
  document.getElementById('notification-message').textContent = msg;
  document.getElementById('notification-modal').style.display = '';
  setTimeout(closeNotification, 3200);
}
function closeNotification(){
  document.getElementById('notification-modal').style.display = 'none';
}

// Bin status simulation (simulated for each)
const binStatuses = [
  "Pick-up slots available",
  "Receiving lots of new items!",
  "Popular category today",
  "Ready for new treasures"
];
function updateBinStatuses() {
  ["clothing","home","books","electronics","toys","sports"].forEach(cat => {
    const statusEl = document.getElementById("status-" + cat);
    if(statusEl) statusEl.textContent = binStatuses[Math.floor(Math.random()*binStatuses.length)];
  });
}

// Clock
function updateClock() {
  const now = new Date();
  let h = now.getHours(), m = now.getMinutes();
  document.getElementById("clock").textContent = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

// Tabs
function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tc => tc.style.display = "none");
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabId).style.display = "";
  const idx = ["clothing","home","books","electronics","toys","sports"].indexOf(tabId);
  if(idx >= 0) document.querySelectorAll('.tab')[idx].classList.add('active');
  document.getElementById("alerts").textContent = "";
}

// Drop-off with photo and text storage
function dropOff(cat) {
  if (!accessGranted) {
    document.getElementById("alerts").textContent = "Enter your member code/card before offering items.";
    return;
  }
  let desc = document.getElementById("item-desc-" + cat).value || "(No description)";
  let imgSrc = document.getElementById("img-preview-" + cat).src;
  let imgExists = imgSrc && imgSrc.startsWith("data:image/");
  listings[cat].push({desc:desc, img:imgExists ? imgSrc : null, reserved:false});
  renderListings(cat);
  addPoints(10);
  showCelebration(`${desc} shared! +10 community points!`);
  scheduleNotification(`Thank you for your offer: '${desc}'. Someone may claim it soon!`);
  // Clear fields:
  document.getElementById("item-desc-" + cat).value = "";
  document.getElementById("img-preview-" + cat).src = "";
  document.getElementById("img-preview-" + cat).style.display = "none";
}

// Basic celebration function
function showCelebration(msg) {
  const alerts = document.getElementById("alerts");
  alerts.innerHTML = `<span style="color:#25bc88;">🎉 ${msg}</span>`;
  setTimeout(() => { alerts.innerHTML = ""; }, 2300);
}

// Languages
let isDanish = false;
function setBinLanguage() {
  document.querySelectorAll('.tab-content').forEach(el => {
    let p = el.querySelector('p');
    if (p) {
      p.textContent = p.getAttribute(isDanish ? 'data-da' : 'data-en');
    }
  });
}
function toggleLanguage() {
  isDanish = !isDanish;
  setBinLanguage();
}

// Access
let accessGranted = false;
function checkAccess() {
  const code = document.getElementById("access").value;
  let msg = document.getElementById("access-msg");
  if (code === "246810") {
    msg.textContent = "Welcome! Select category.";
    accessGranted = true;
    msg.style.color = "#207567";
  } else {
    msg.textContent = "Invalid code/card!";
    accessGranted = false;
    msg.style.color = "#F46A60";
  }
}

// Help & Emergency
function showHelp() {
  document.getElementById("instructions-modal").style.display = "";
}
function closeModal() {
  document.getElementById("instructions-modal").style.display = "none";
}
function triggerEmergency() {
  alert("Emergency! Staff notified. Please remain calm.");
}

// Setup
window.onload = function () {
  setBinLanguage();
  updateBinStatuses();
  updateClock();
  ["clothing","home","books","electronics","toys","sports"].forEach(renderListings);
  showTab('clothing');
  setInterval(updateBinStatuses, 5100);
  setInterval(updateClock, 1000);
};
