const products = [
    {
        id: 1,
        name: "Latte",
        icon: "☕️",
        description: "Espresso dengan susu lembut dan creamy.",
        prices: { Small: 20000, Medium: 25000, Large: 29000 }
    },
    {
        id: 2,
        name: "Cappuccino",
        icon: "☕️",
        description: "Perpaduan espresso, susu, dan foam yang lembut.",
        prices: { Small: 23000, Medium: 28000, Large: 30000 }
    },
    {
        id: 3,
        name: "Americano",
        icon: "🫘",
        description: "Espresso dengan air yang ringan dan menyegarkan.",
        prices: { Small: 18000, Medium: 23000, Large: 27000 }
    },
    {
        id: 4,
        name: "Mocha",
        icon: "🥤",
        description: "Espresso, cokelat, dan susu dalam satu sajian.",
        prices: { Small: 25000, Medium: 28000, Large: 32000 }
    },
    {
        id: 5,
        name: "Matcha Latte",
        icon: "🍵",
        description: "Matcha dengan susu creamy dan rasa yang lembut.",
        prices: { Small: 25000, Medium: 28000, Large: 32000 }
    },
    {
        id: 6,
        name: "Chocolate",
        icon: "🍫",
        description: "Cokelat hangat yang manis, creamy, dan comforting.",
        prices: { Small: 22000, Medium: 26000, Large: 31000 }
    }
];

let cart = [];
const rupiah = value => "Rp" + value.toLocaleString("id-ID");

function renderMenu() {
    const menuGrid = document.getElementById("menuGrid");

    menuGrid.innerHTML = products.map(product => `
        <article class="menu-card">
            <div class="menu-img">${product.icon}</div>
            
            <h3>${product.name}</h3>
            <div class="price" id="price-${product.id}">
                ${rupiah(product.prices.Medium)}
            </div>
            
            <p class="description">${product.description}</p>
            
            <div class="option-title">UKURAN</div>
            <div class="size-options">
                ${Object.keys(product.prices).map(size => `
                    <div>
                        <input 
                            type="radio"
                            id="p${product.id}-${size}"
                            name="size-${product.id}"
                            value="${size}"
                            ${size === "Medium" ? "checked" : ""}
                            onchange="updatePrice(${product.id})"
                        >
                        <label for="p${product.id}-${size}">${size}</label>
                    </div>
                `).join("")}
            </div>
            
            <div class="option-title">JUMLAH</div>
            <div class="quantity">
                <button onclick="changeQty(${product.id}, -1)">-</button>
                <span class="qty-value" id="qty-${product.id}">1</span>
                <button onclick="changeQty(${product.id}, 1)">+</button>
            </div>
            
            <button class="add-btn" onclick="addToCart(${product.id})">
                + Tambah Pesanan
            </button>
        </article>
    `).join("");
}

function getSelectedSize(id) {
    const selected = document.querySelector(`input[name="size-${id}"]:checked`);
    return selected ? selected.value : "Medium";
}

function updatePrice(id) {
    const product = products.find(item => item.id === id);
    const size = getSelectedSize(id);
    document.getElementById(`price-${id}`).textContent = 
        rupiah(product.prices[size]);
}

function changeQty(id, amount) {
    const qtyElement = document.getElementById(`qty-${id}`);
    let qty = Number(qtyElement.textContent);
    qty += amount;

    if (qty < 1) qty = 1;
    if (qty > 20) qty = 20;

    qtyElement.textContent = qty;
}

function addToCart(id) {
    const product = products.find(item => item.id === id);
    const size = getSelectedSize(id);
    const qty = Number(document.getElementById(`qty-${id}`).textContent);

    const existing = cart.find(
        item => item.id === id && item.size === size
    );

    if (existing)  {
        existing.qty += qty;
    } else {
        cart.push({
            id: id,
            name: product.name,
            size: size,
            price: product.prices[size],
            qty: qty
        });
    }

    renderCart();
    showToast(`${product.name} berhasil ditambah`);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

function renderCart() {
    const cartItems = document.getElementById("cartItems");
    const totalPrice = document.getElementById("totalPrice");
    const cartCount = document.getElementById("cartCount");
    const checkoutBtn = document.getElementById("checkoutBtn");

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <h3>Keranjang masih kosong</h3>
                <p>Pilih minuman favoritmu!</p>
            </div>
        `;

        totalPrice.textContent = "Rp0";
        cartCount.textContent = "0";
        checkoutBtn.disabled = true;
        return;
    }

    let total = 0;
    let count = 0;

    cartItems.innerHTML = cart.map((item, index) => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        count += item.qty;

        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <strong>${item.name}</strong>
                    <small>${item.size} x ${item.qty} . ${rupiah(item.price)}</small>
                </div>
                
                <strong>${rupiah(subtotal)}</strong>
                
                <button class="remove-btn" onclick="removeFromCart(${index})">x</button>
            </div>
        `;
    }).join("");

    totalPrice.textContent = rupiah(total);
    cartCount.textContent = count;
    checkoutBtn.disabled = false;
}

function checkout() {
    if (cart.length === 0) return;

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );

    showToast(`Pesanan berhasil dibuat! Total ${rupiah(total)}`);

    cart = [];
    renderCart();

    setTimeout(() => {
        window.scrollTo({
            top: document.getElementById("home").offsetTop - 70, behavior: "smooth"
        });
    }, 1500);
}

function showToast(message) {
    const toast = document.getElementById("toast");

    toast.textContent =message;
    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function scrollToCart() {
    document.getElementById("cart").scrollIntoView({
        behavior: "smooth"
    });
}

renderMenu();
renderCart();