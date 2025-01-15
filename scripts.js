// Initialize EmailJS
emailjs.init("YOUR_USER_ID");

// Cart Array to Store Items
let cart = [];

// Function to Add Items to Cart
function addToCart(pizzaName, sizeId, extrasId) {
    const sizeSelect = document.getElementById(sizeId);
    const extrasSelect = document.getElementById(extrasId);

    const size = sizeSelect.options[sizeSelect.selectedIndex].text;
    const sizePrice = parseFloat(sizeSelect.value);
    const extras = extrasSelect.options[extrasSelect.selectedIndex].text;
    const extrasPrice = parseFloat(extrasSelect.value);

    const totalPrice = sizePrice + extrasPrice;

    const item = {
        name: pizzaName,
        size: size,
        extras: extras,
        price: totalPrice,
    };

    cart.push(item);
    updateCart();
}

// Function to Update Cart Display
function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const totalElement = document.getElementById("total");

    // Clear Previous Items
    cartItems.innerHTML = "";

    // Add New Items
    let total = 0;
    cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - ${item.size} with ${item.extras} - $${item.price.toFixed(2)}`;
        
        // Add Remove Button
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.onclick = () => removeItem(index);
        li.appendChild(removeButton);

        cartItems.appendChild(li);
        total += item.price;
    });

    // Update Total
    totalElement.textContent = total.toFixed(2);

    // Update Cart Count
    document.querySelector(".cart-count").textContent = cart.length;
}

// Function to Remove Item from Cart
function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

// Function to Handle Order Submission
document.getElementById("order-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    if (cart.length === 0) {
        alert("Your cart is empty. Please add items before placing an order.");
        return;
    }

    // Prepare Order Details
    let orderDetails = "Order Details:\n";
    cart.forEach((item) => {
        orderDetails += `${item.name} - ${item.size} with ${item.extras} - $${item.price.toFixed(2)}\n`;
    });

    orderDetails += `\nTotal: $${document.getElementById("total").textContent}\n`;
    orderDetails += `\nCustomer Details:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nAddress: ${address}`;

    // Send Email using EmailJS
    emailjs
        .send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
            to_email: email,
            from_name: "Pizza Restaurant",
            message: orderDetails,
        })
        .then(
            function (response) {
                alert("Order placed successfully! Check your email for confirmation.");
                cart = [];
                updateCart();
                document.getElementById("order-form").reset();
            },
            function (error) {
                alert("Failed to place order. Please try again.");
                console.error("EmailJS Error:", error);
            }
        );
});