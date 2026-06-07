// Form submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const interested = document.getElementById('interested').value;
    const details = document.getElementById('details').value;
    
    console.log('Form submitted:', { fullname, email, interested, details });
    alert('Thank you! We will respond within 24 hours.');
    this.reset();
});

// Checkout form
document.getElementById('checkoutForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Demo mode: Replace with real Stripe integration');
});

// Select product function
function selectProduct(productName, price) {
    document.getElementById('checkoutPrice').textContent = '$' + price.toLocaleString();
    document.getElementById('checkoutModal').style.display = 'block';
    console.log('Product selected:', productName, 'Price:', price);
}

// Close checkout modal
function closeCheckout() {
    document.getElementById('checkoutModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('checkoutModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

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