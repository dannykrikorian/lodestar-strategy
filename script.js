// Initialize Stripe
const stripe = Stripe('pk_live_51TCxmJRcYXzE0FqUxLGEvy2M7rUjq2zgDvBPKiTH3yYgBHA0QRDF1fSw1exTyiMVyzYX8Lwq97meY22Z9EwFu5Ca00FOKJZgoO');
const elements = stripe.elements();
const cardElement = elements.create('card');
let currentPrice = 6500;
let currentProduct = 'Campaign Operating Plan';

// Mount card element when modal opens
function initCardElement() {
    if (!document.getElementById('card-element').querySelector('iframe')) {
        cardElement.mount('#card-element');
    }
}

// Handle card errors
cardElement.addEventListener('change', (event) => {
    const displayError = document.getElementById('card-errors');
    if (event.error) {
        displayError.textContent = event.error.message;
    } else {
        displayError.textContent = '';
    }
});

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

// Stripe checkout form
document.getElementById('checkoutForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const fullname = document.getElementById('checkoutName').value;
    const email = document.getElementById('checkoutEmail').value;
    const button = document.getElementById('stripeBtn');
    
    button.disabled = true;
    button.textContent = 'Processing...';
    
    try {
        // Create payment method
        const { paymentMethod, error } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                name: fullname,
                email: email,
            },
        });
        
        if (error) {
            document.getElementById('card-errors').textContent = error.message;
            button.disabled = false;
            button.textContent = 'COMPLETE SECURE PAYMENT';
            return;
        }
        
        // Send to your backend to create payment intent
        const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: currentPrice * 100,
                currency: 'usd',
                payment_method: paymentMethod.id,
                email: email,
                product: currentProduct,
            }),
        });
        
        const data = await response.json();
        
        if (data.error) {
            document.getElementById('card-errors').textContent = data.error;
            button.disabled = false;
            button.textContent = 'COMPLETE SECURE PAYMENT';
            return;
        }
        
        // Confirm payment
        const confirmResult = await stripe.confirmCardPayment(data.client_secret, {
            payment_method: paymentMethod.id,
        });
        
        if (confirmResult.error) {
            document.getElementById('card-errors').textContent = confirmResult.error.message;
            button.disabled = false;
            button.textContent = 'COMPLETE SECURE PAYMENT';
        } else {
            // Payment successful
            alert('Payment successful! Thank you for your purchase. Check your email for next steps.');
            closeCheckout();
            this.reset();
            button.disabled = false;
            button.textContent = 'COMPLETE SECURE PAYMENT';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('card-errors').textContent = 'An error occurred. Please try again.';
        button.disabled = false;
        button.textContent = 'COMPLETE SECURE PAYMENT';
    }
});

// Select product function
function selectProduct(productName, price) {
    currentProduct = productName;
    currentPrice = price;
    document.getElementById('checkoutPrice').textContent = '$' + price.toLocaleString();
    document.getElementById('checkoutModal').style.display = 'block';
    
    // Initialize card element when modal opens
    setTimeout(initCardElement, 100);
    
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