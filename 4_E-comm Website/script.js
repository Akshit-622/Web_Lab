// 1. DARK MODE
let theme = document.getElementById("theme-toggle");

if (localStorage.getItem("theme") == "dark")
    document.body.classList.add("dark");

if (theme) {
    theme.onclick = function () {
        document.body.classList.toggle("dark");
        let mode = document.body.classList.contains("dark") ? "dark" : "light";
        localStorage.setItem("theme", mode);
    };
}
// 2. SHOPPING CART
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCart() {
    let count = 0;
    cart.forEach(item => count += item.quantity);

    let counter = document.getElementById("cart-count");
    if (counter) {
        counter.textContent = count
    };

    localStorage.setItem("cart", JSON.stringify(cart));
    showCart();
}
function showCart() {
    let box = document.getElementById("cart-items");
    if (!box) return;

    box.innerHTML = "";
    let total = 0, count = 0;
    cart.forEach((item, i) => {
        total += item.price * item.quantity;
        count += item.quantity;

        let row = document.createElement("div");
        row.className = "cart-item";
        row.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div>
        <strong>${item.name}</strong> - ₹${item.price}
        <p>Quantity: ${item.quantity}</p>
        <button class="minus">−</button>
        <button class="plus">+</button>
        <button class="remove">Remove</button>
      </div>`;

        row.querySelector(".minus").onclick = function () {
            item.quantity--;
            if (item.quantity == 0) cart.splice(i, 1);//remove the product if quantity=0
            updateCart();
        };
        row.querySelector(".plus").onclick = function () {
            item.quantity++;
            updateCart();
        };
        row.querySelector(".remove").onclick = function () {
            cart.splice(i, 1);
            updateCart();
        };
        box.appendChild(row);
    });

    document.getElementById("empty-cart").hidden = cart.length > 0;
    document.getElementById("summary-count").textContent = count;
    document.getElementById("cart-total").textContent = "₹" + total;
}
document.querySelectorAll(".add-cart").forEach(function (button) {
    button.onclick = function () {
        let card = button.closest(".product-card");
        let name = button.dataset.name;
        let price = Number(button.dataset.price);
        let image = card.querySelector("img").src;

        let found = cart.find(function (item) {
            return item.name == name;
        });

        if (found) {
            found.quantity++;
        } else {
            cart.push({
                name: name,
                price: price,
                image: image,
                quantity: 1
            });
        }

        updateCart();
        button.textContent = "Added!";
    };
});
;
updateCart();
// 3. SEARCH AND CATEGORY FILTER
function filterProducts() {
    let search = document.getElementById("search");
    let query = search ? search.value.toLowerCase() : "";
    let active = document.querySelector(".filter.active");
    let category = active ? active.dataset.category : "all";
    let visible = 0;

    document.querySelectorAll(".product-card").forEach(card => {
        let nameMatch = card.dataset.name.toLowerCase().includes(query);
        let categoryMatch = category == "all" ||
            card.dataset.category == category;

        card.hidden = !(nameMatch && categoryMatch);
        if (!card.hidden) visible++;
    });

    let message = document.getElementById("no-results");
    if (message) {
        if (visible > 0) {
            message.hidden = true;
        } else {
            message.hidden = false;
        }
    }
}

let searchBox = document.getElementById("search");
if (searchBox) {
    searchBox.oninput = filterProducts;
}
document.querySelectorAll(".filter").forEach(button => {
    button.onclick = function () {
        document.querySelectorAll(".filter").forEach(b =>
            b.classList.remove("active"));
        button.classList.add("active");
        filterProducts();
    };
});
// 4. SORT PRODUCTS
let sort = document.getElementById("sort");
let list = document.getElementById("product-list");

if (sort && list) {
    sort.onchange = function () {
        let cards = Array.from(list.children);

        cards.sort((a, b) => {
            if (sort.value == "low") return a.dataset.price - b.dataset.price;
            if (sort.value == "high") return b.dataset.price - a.dataset.price;
            if (sort.value == "az") return a.dataset.name.localeCompare(b.dataset.name);
            return 0;
        });

        cards.forEach(card => list.appendChild(card));
    };
}
// 5. CONTACT FORM VALIDATION
let form = document.getElementById("contact-form");

if (form) {
    form.onsubmit = function (event) {
        event.preventDefault();

        let name = document.getElementById("full-name").value.trim();
        let email = document.getElementById("email").value.trim();
        let phone = document.getElementById("phone").value.trim();
        let subject = document.getElementById("subject").value.trim();
        let message = document.getElementById("message").value.trim();
        let status = document.getElementById("form-status");

        if (!name || !email || !phone || !subject || !message)
            status.textContent = "Please fill in all fields.";
        else if (!email.includes("@") || !email.includes("."))
            status.textContent = "Enter a valid email.";
        else if (phone.length < 10)
            status.textContent = "Check your phone number.";
        else {
            status.textContent = "Thank you! Form validated.";
            form.reset();
        }
    };
}
// 6. DEMO CHECKOUT
let checkout = document.getElementById("checkout-btn");

if (checkout) {
    checkout.onclick = function () {
        let message = document.getElementById("checkout-message");
        if (cart.length > 0) {
            alert("Order Successful. ");
            message.textContent = "Order Succesful"
        }
        else {
            message.textContent = "Your Cart is Empty. "
        }
    };
}

// 7. WISHLIST
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

function updateWishlist() {
    let counter = document.getElementById("wishlist-count");
    if (counter) {
        counter.textContent = wishlist.length;
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    showWishlist();
}

function showWishlist() {
    let box = document.getElementById("wishlist-items");
    if (!box) return;

    box.innerHTML = "";
    wishlist.forEach((item, i) => {
        let card = document.createElement("article");
        card.className = "product-card";
        card.innerHTML = `
          <div class="product-image">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <h3>${item.name}</h3>
          <div class="product-bottom">
            <strong>₹${item.price}</strong>
          </div>
          <button class="btn move-cart">+ Move to Cart</button>
          <button class="wishlist-btn remove-wish">Remove</button>`;

        card.querySelector(".move-cart").onclick = function () {
            let found = cart.find(c => c.name == item.name);
            if (found) {
                found.quantity++;
            } else {
                cart.push({ name: item.name, price: item.price, image: item.image, quantity: 1 });
            }
            wishlist.splice(i, 1);
            updateCart();
            updateWishlist();
        };

        card.querySelector(".remove-wish").onclick = function () {
            wishlist.splice(i, 1);
            updateWishlist();
        };

        box.appendChild(card);
    });

    document.getElementById("empty-wishlist").hidden = wishlist.length > 0;
}

document.querySelectorAll(".wishlist-btn").forEach(function (button) {
    button.onclick = function () {
        let card = button.closest(".product-card");
        let name = card.dataset.name;
        let price = Number(card.dataset.price);
        let image = card.querySelector("img").src;

        let found = wishlist.find(function (item) {
            return item.name == name;
        });

        if (!found) {
            wishlist.push({
                name: name,
                price: price,
                image: image
            });
            updateWishlist();
        }
        button.textContent = "♥ In Wishlist";
    };
});

updateWishlist();

// 8. PRODUCT DETAILS POPUP
let modal = document.getElementById("details-modal");
let closeModal = document.getElementById("close-modal");

document.querySelectorAll(".view-details").forEach(function (button) {
    button.onclick = function () {
        let card = button.closest(".product-card");
        document.getElementById("modal-img").src = card.querySelector("img").src;
        document.getElementById("modal-category").textContent = card.dataset.category;
        document.getElementById("modal-name").textContent = card.dataset.name;
        document.getElementById("modal-desc").textContent = card.dataset.description;
        document.getElementById("modal-price").textContent = "₹" + card.dataset.price;
        modal.hidden = false;
    };
});

if (closeModal) {
    closeModal.onclick = function () {
        modal.hidden = true;
    };
}
