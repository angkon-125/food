document.addEventListener('DOMContentLoaded', () => {
    // Sticky Navbar
    const navbar = document.querySelector('.navbar');
    const stickyOffset = navbar.offsetTop;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset >= stickyOffset) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.navbar .menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Reservation form validation
    const reservationForm = document.querySelector('.sing-up');
    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputs = reservationForm.querySelectorAll('input');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                input.style.borderColor = 'red';
            } else {
                input.style.borderColor = '#ddd';
            }
        });

        if (isValid) {
            alert('Reservation submitted successfully!');
            reservationForm.reset();
        } else {
            alert('Please fill in all fields.');
        }
    });

    // Image gallery carousel
    const galleryImages = document.querySelectorAll('.gallery img');
    let currentImageIndex = 0;

    function showNextImage() {
        galleryImages.forEach((img, index) => {
            img.style.opacity = index === currentImageIndex ? '1' : '0.3';
            img.style.transform = index === currentImageIndex ? 'scale(1)' : 'scale(0.8)';
        });
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    }

    if (galleryImages.length > 0) {
        setInterval(showNextImage, 3000);
        showNextImage();
    }

    // Mobile menu toggle
    const menu = document.querySelector('.navbar .menu');
    const menuToggle = document.createElement('div');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '☰';
    document.querySelector('.navbar').prepend(menuToggle);

    menuToggle.addEventListener('click', () => {
        menu.classList.toggle('active');
        menuToggle.innerHTML = menu.classList.contains('active') ? '×' : '☰';
    });

    // Section reveal animation
    const sections = document.querySelectorAll('.main-section, .main-section2, .main-section3, .main-section4, .main-section5, .main-section6');
    
    const revealSection = () => {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (sectionTop < windowHeight * 0.8) {
                section.classList.add('revealed');
            }
        });
    };

    window.addEventListener('scroll', revealSection);
    revealSection(); // Initial check

    // Menu item hover effects
    const menuItems = document.querySelectorAll('.menu-items > div');
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-10px)';
            item.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0)';
            item.style.boxShadow = 'none';
        });
    });

    // Order button loading state and cart functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const orderButtons = document.querySelectorAll('.order-btn, .order-btn2');
    orderButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const buttonText = button.textContent;
            button.textContent = 'Adding...';
            button.disabled = true;

            setTimeout(() => {
                button.textContent = buttonText;
                button.disabled = false;
                
                const menuItem = e.target.closest('.menu-items > div');
                const itemName = menuItem ? menuItem.querySelector('h3').textContent : 'General Order';
                
                cart.push({ name: itemName, price: 10.99 }); // Example price
                localStorage.setItem('cart', JSON.stringify(cart));
                
                alert(`${itemName} added to cart! Total items: ${cart.length}`);
            }, 1000);
        });
    });
});