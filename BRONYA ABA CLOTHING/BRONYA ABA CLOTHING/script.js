/* =========================================================
   1. SETTINGS: change these before going live
   ========================================================= */
const SHOP_WHATSAPP = "+233 555824578";     // shop number, country code first, no + or spaces
const CURRENCY = "GH₵";
const SOCIAL_HANDLE = "@BRIDGET BRONYA";  // shown on every photo

const MOMO_NUMBER = "+233 555824578";         // shop's Mobile Money number
const MOMO_NAME = "BRIDGET BRONYA";    // name registered on that MoMo number
const MOMO_NETWORK = "MTN Mobile Money";  // or Telecel Cash, AT Money
const DEPOSIT_PERCENT = 50;               // deposit option, in percent of the total

/* =========================================================
   2. DATA: one object per style.
   Categories used by the filter buttons: kente, ankara, evening, kids
   To add a style: add a new line, give it a new id, and put the photo in /images
   ========================================================= */
const products = [
  { id: 1, name: "Teal Floral Peplum Set", category: "ankara", price: 450, image: "images/01-teal-floral-peplum.jpg" },
  { id: 2, name: "Emerald Gold Peplum Gown", category: "ankara", price: 750, image: "images/02-emerald-gold-peplum.jpg" },
  { id: 3, name: "Blue Lace Sleeve Peplum Gown", category: "ankara", price: 800, image: "images/03-blue-lace-sleeve-peplum.jpg" },
  { id: 4, name: "Pink Corset and Skirt Set", category: "evening", price: 600, image: "images/04-pink-corset-skirt-set.jpg" },
  { id: 5, name: "Red Butterfly Beaded Dress", category: "evening", price: 1200, image: "images/05-red-butterfly-beaded.jpg" },
  { id: 6, name: "Black Beaded Mermaid Gown", category: "evening", price: 1500, image: "images/06-black-beaded-mermaid.jpg" },
  { id: 7, name: "Maroon Flare Gown with Print Panel", category: "ankara", price: 550, image: "images/07-maroon-flare-gown.jpg" },
  { id: 8, name: "Purple Ruffle Hem Dress", category: "evening", price: 400, image: "images/08-purple-ruffle-hem.jpg" },
  { id: 9, name: "Kids Peacock Print Dress", category: "kids", price: 250, image: "images/09-kids-peacock-print.jpg" },
  { id: 10, name: "Kids Kente Smocked Dress", category: "kids", price: 220, image: "images/10-kids-kente-smocked.jpg" },
  { id: 11, name: "Floral Tiered Ankara Dress", category: "ankara", price: 350, image: "images/11-floral-tiered-ankara.jpg" },
  { id: 12, name: "Purple Tie-Dye Tiered Dress", category: "ankara", price: 380, image: "images/12-purple-tie-dye-tiered.jpg" },
  { id: 13, name: "Custom Print Flare Dress", category: "ankara", price: 420, image: "images/13-custom-print-flare.jpg" },
  { id: 14, name: "Kente Bow Party Dress", category: "kente", price: 480, image: "images/14-kente-bow-party.jpg" },
  { id: 15, name: "Red Corset Kente Skirt Set", category: "kente", price: 900, image: "images/15-red-corset-kente-skirt.jpg" },
  { id: 16, name: "Bright Kente Puff-Sleeve Set", category: "kente", price: 700, image: "images/16-bright-kente-puff-sleeve.jpg" },
  { id: 17, name: "Beaded Gown with Kente Train", category: "kente", price: 1300, image: "images/17-beaded-gown-kente-train.jpg" }
];

/* =========================================================
   3. STATE
   ========================================================= */
let currentCategory = "all";
let selection = loadSelection(); // [{ id, qty }]

/* =========================================================
   4. ELEMENTS
   ========================================================= */
const grid = document.getElementById("product-grid");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const filters = document.getElementById("filters");
const resultNote = document.getElementById("result-note");
const listEl = document.getElementById("selection-list");
const emptyEl = document.getElementById("empty");
const totalEl = document.getElementById("total");
const countEl = document.getElementById("count");
const payTypeEl = document.getElementById("pay-type");
const momoAmountEl = document.getElementById("momo-amount");
const nameInput = document.getElementById("customer-name");
const phoneInput = document.getElementById("customer-phone");
const refInput = document.getElementById("momo-ref");
const notesInput = document.getElementById("customer-notes");
const payMessage = document.getElementById("pay-message");
const copyBtn = document.getElementById("copy-btn");

/* Fill in the MoMo details and the deposit label */
document.getElementById("momo-number").textContent = MOMO_NUMBER;
document.getElementById("momo-name").textContent = MOMO_NAME;
document.getElementById("momo-network").textContent = MOMO_NETWORK;
payTypeEl.querySelector('option[value="deposit"]').textContent = `Pay a ${DEPOSIT_PERCENT}% deposit`;

/* =========================================================
   5. SHOW PRODUCTS (filter + search + sort)
   ========================================================= */
function showProducts() {
  const text = searchInput.value.trim().toLowerCase();

  let result = products.filter(p =>
    (currentCategory === "all" || p.category === currentCategory) &&
    p.name.toLowerCase().includes(text)
  );

  if (sortSelect.value === "low") result.sort((a, b) => a.price - b.price);
  if (sortSelect.value === "high") result.sort((a, b) => b.price - a.price);

  resultNote.textContent = result.length
    ? `${result.length} style${result.length === 1 ? "" : "s"} found`
    : "No styles match your search. Try another word or category.";

  grid.innerHTML = result.map(cardHTML).join("");
}

function cardHTML(p) {
  const askText = encodeURIComponent(
    `Hello BRONYA ABA CLOTHING, I am interested in the "${p.name}" (${CURRENCY} ${p.price}).`
  );
  return `
    <article class="card">
      <div class="photo-wrap">
        <img class="photo" src="${p.image}" alt="${p.name}" loading="lazy">
        <span class="handle"><i class="fa-brands fa-instagram"></i> ${SOCIAL_HANDLE}</span>
      </div>
      <div class="card-info">
        <h3>${p.name}</h3>
        <span class="category">${p.category}</span>
        <p class="price">${CURRENCY} ${p.price}</p>
        <button class="choose-btn" data-id="${p.id}">Choose</button>
        <a class="ask-link" href="https://wa.me/${SHOP_WHATSAPP}?text=${askText}" target="_blank" rel="noopener">
          <i class="fa-brands fa-whatsapp"></i> Ask about this style
        </a>
      </div>
    </article>`;
}

/* =========================================================
   6. SELECTION (add, change quantity, remove, totals)
   ========================================================= */
function addStyle(id) {
  const existing = selection.find(s => s.id === id);
  if (existing) existing.qty += 1;
  else selection.push({ id, qty: 1 });
  update();
}

function changeQty(id, change) {
  const item = selection.find(s => s.id === id);
  if (!item) return;
  item.qty += change;
  if (item.qty <= 0) selection = selection.filter(s => s.id !== id);
  update();
}

function getTotal() {
  return selection.reduce((sum, s) => {
    const p = products.find(x => x.id === s.id);
    return sum + p.price * s.qty;
  }, 0);
}

function getPayAmount() {
  const total = getTotal();
  return payTypeEl.value === "deposit"
    ? Math.round(total * DEPOSIT_PERCENT / 100)
    : total;
}

function itemsText() {
  return selection.map(s => {
    const p = products.find(x => x.id === s.id);
    return `${p.name} x${s.qty} (${CURRENCY} ${p.price * s.qty})`;
  }).join(", ");
}

function showSelection() {
  listEl.innerHTML = selection.map(s => {
    const p = products.find(x => x.id === s.id);
    return `
      <li>
        <span class="sel-name">${p.name}<small>${CURRENCY} ${p.price * s.qty}</small></span>
        <span class="qty">
          <button data-action="minus" data-id="${p.id}" aria-label="Remove one ${p.name}">−</button>
          <span>${s.qty}</span>
          <button data-action="plus" data-id="${p.id}" aria-label="Add one ${p.name}">+</button>
        </span>
      </li>`;
  }).join("");

  emptyEl.classList.toggle("hidden", selection.length > 0);
  totalEl.textContent = getTotal();
  momoAmountEl.textContent = getPayAmount();
  countEl.textContent = selection.reduce((n, s) => n + s.qty, 0);
}

function update() {
  showSelection();
  saveSelection();
}

/* =========================================================
   7. SAVE so the selection survives a page refresh
   ========================================================= */
function saveSelection() {
  try { localStorage.setItem("bronya-selection", JSON.stringify(selection)); } catch (e) {}
}

function loadSelection() {
  try {
    const saved = JSON.parse(localStorage.getItem("bronya-selection"));
    return Array.isArray(saved) ? saved : [];
  } catch (e) {
    return [];
  }
}

/* =========================================================
   8. MOBILE MONEY PAYMENT (customer sends money, then sends proof)
   ========================================================= */
function showPayMessage(html, type) {
  payMessage.className = "pay-message" + (type ? " " + type : "");
  payMessage.innerHTML = html;
  payMessage.hidden = false;
  payMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* Copy the MoMo number */
copyBtn.addEventListener("click", () => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(MOMO_NUMBER)
      .then(() => {
        copyBtn.textContent = "Copied";
        setTimeout(() => { copyBtn.textContent = "Copy"; }, 1500);
      })
      .catch(() => alert("MoMo number: " + MOMO_NUMBER));
  } else {
    alert("MoMo number: " + MOMO_NUMBER);
  }
});

/* "I have paid" sends the proof to the shop on WhatsApp */
document.getElementById("paid-btn").addEventListener("click", () => {
  payMessage.hidden = true;

  if (selection.length === 0) {
    showPayMessage("Please choose at least one style first.", "warn");
    return;
  }

  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const ref = refInput.value.trim();
  const notes = notesInput.value.trim();

  if (!name || !phone || !ref) {
    showPayMessage("Please fill in your name, phone number and the MoMo Transaction ID.", "warn");
    return;
  }

  const total = getTotal();
  const paid = getPayAmount();
  const balance = total - paid;

  const message =
    `Hello BRONYA ABA CLOTHING, I have paid by Mobile Money.\n` +
    `Name: ${name}\nPhone: ${phone}\n` +
    `Order: ${itemsText()}\n` +
    `Order total: ${CURRENCY} ${total}\nPaid now: ${CURRENCY} ${paid}\n` +
    (balance > 0 ? `Balance: ${CURRENCY} ${balance}\n` : "") +
    `MoMo Transaction ID: ${ref}` +
    (notes ? `\nNotes: ${notes}` : "");

  const link = `https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(message)}`;
  window.open(link, "_blank");

  selection = [];
  refInput.value = "";
  update();

  showPayMessage(
    `<strong>Thank you!</strong> We will confirm your payment and contact you.<br>` +
    `If WhatsApp did not open, tap the button below.` +
    `<a class="order-btn" href="${link}" target="_blank" rel="noopener">` +
    `<i class="fa-brands fa-whatsapp"></i> Send proof on WhatsApp</a>`
  );
});

/* =========================================================
   9. EVENTS
   ========================================================= */
grid.addEventListener("click", e => {
  const btn = e.target.closest(".choose-btn");
  if (btn) addStyle(Number(btn.dataset.id));
});

listEl.addEventListener("click", e => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  changeQty(Number(btn.dataset.id), btn.dataset.action === "plus" ? 1 : -1);
});

filters.addEventListener("click", e => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  filters.querySelector(".active").classList.remove("active");
  chip.classList.add("active");
  currentCategory = chip.dataset.category;
  showProducts();
});

searchInput.addEventListener("input", showProducts);
sortSelect.addEventListener("change", showProducts);
payTypeEl.addEventListener("change", showSelection);

document.getElementById("clear-btn").addEventListener("click", () => {
  selection = [];
  update();
});

/* Order on WhatsApp without paying yet */
document.getElementById("order-btn").addEventListener("click", () => {
  if (selection.length === 0) {
    showPayMessage("Please choose at least one style first.", "warn");
    return;
  }
  const customer = nameInput.value.trim() || "a customer";
  const notes = notesInput.value.trim();
  const message =
    `Hello BRONYA ABA CLOTHING,I would like to order:\n` +
    selection.map(s => {
      const p = products.find(x => x.id === s.id);
      return `- ${p.name} x${s.qty} (${CURRENCY} ${p.price * s.qty})`;
    }).join("\n") +
    `\nTotal: ${CURRENCY} ${getTotal()}` +
    (notes ? `\nNotes: ${notes}` : "");

  window.open(`https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(message)}`, "_blank");
});

/* =========================================================
   10. START
   ========================================================= */
showProducts();
showSelection();