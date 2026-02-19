const API_URL = 'http://localhost:5000';

document.addEventListener('DOMContentLoaded', () => {
    // Sticky Navbar logic
    const navbar = document.querySelector('.navbar');
    const stickyOffset = navbar.offsetTop;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset >= stickyOffset) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Initialize Cart
    let cart = [];
    const cartModal = document.getElementById('cart-modal');
    const cartToggle = document.getElementById('cart-toggle');
    const closeModal = document.querySelector('.close-modal');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    const cartCount = document.getElementById('cart-count');

    // Fetch Menu
    const menuContainer = document.getElementById('menu-container');
    const fetchMenu = async () => {
        try {
            const response = await fetch(`${API_URL}/menu`);
            const menu = await response.json();
            renderMenu(menu);
        } catch (err) {
            console.error('Error fetching menu:', err);
            menuContainer.innerHTML = '<p class="error">Failed to load menu. Please try again later.</p>';
        }
    };

    const renderMenu = (items) => {
        menuContainer.innerHTML = '';
        items.forEach(item => {
            const div = document.createElement('div');
            div.innerHTML = `
                <img class="iron" src="img/${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>${item.description}<br><strong>$${item.price.toFixed(2)}</strong></p>
                <button class="order-btn2" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">Order Now</button>
            `;
            menuContainer.appendChild(div);
        });

        // Add event listeners to new buttons
        document.querySelectorAll('.order-btn2').forEach(btn => {
            btn.addEventListener('click', () => addToCart(btn.dataset));
        });
    };

    // Cart Logic
    const addToCart = async (item) => {
        try {
            const response = await fetch(`${API_URL}/cart`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: item.name, price: parseFloat(item.price), date: new Date().toISOString() })
            });
            const data = await response.json();
            cart = data.cart;
            updateCartUI();
            alert(`${item.name} added to cart!`);
        } catch (err) {
            console.error('Error adding to cart:', err);
        }
    };

    const updateCartUI = () => {
        cartCount.textContent = cart.length;
        cartItemsContainer.innerHTML = '';
        let total = 0;
        cart.forEach((item, index) => {
            total += item.price;
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <span>${item.name}</span>
                <span>$${item.price.toFixed(2)}</span>
            `;
            cartItemsContainer.appendChild(div);
        });
        cartTotalAmount.textContent = total.toFixed(2);
    };

    // Modal Toggling
    cartToggle.addEventListener('click', () => {
        cartModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === cartModal) cartModal.style.display = 'none';
    });

    // Checkout
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) return alert('Your cart is empty!');
        alert('Thank you for your order! This is a demo checkout.');
        cart = [];
        updateCartUI();
        cartModal.style.display = 'none';
    });

    // Reservation Form
    const resForm = document.getElementById('reservation-form');
    resForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(resForm);
        const resData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`${API_URL}/reservation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(resData)
            });
            if (response.ok) {
                alert('Table booked successfully!');
                resForm.reset();
            }
        } catch (err) {
            console.error('Error booking table:', err);
        }
    });

    // Initial LOAD
    fetchMenu();
    // Sync cart on load
    fetch(`${API_URL}/cart`).then(res => res.json()).then(data => {
        cart = data;
        updateCartUI();
    }).catch(console.error);
});
