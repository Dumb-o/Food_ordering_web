$(document).ready(function () {
  // Initialize cart with error handling for localStorage
  let cart;
  try {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
  } catch (e) {
    console.error("Error parsing cart data from localStorage:", e);
    cart = [];
  }

  // Function to save cart to localStorage
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Function to update the cart badge count
  function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    $('.badge').text(totalItems);
  }

  // Reusable function to render cart items
  function renderCartItems(targetElement, cart) {
    const tbody = targetElement.find('tbody');
    tbody.empty(); // Clear existing rows

    if (cart.length === 0) {
      tbody.html('<tr><td colspan="7">Your cart is empty.</td></tr>');
      return;
    }

    let totalPrice = 0;

    // Loop through the cart items and add them to the table
    cart.forEach((item, index) => {
      const row = `
        <tr>
          <td>${index + 1}</td>
          <td><img src="${item.image}" alt="${item.name}" class="img-responsive" style="width: 50px;"></td>
          <td>${item.name}</td>
          <td>$${item.price.toFixed(2)}</td>
          <td>${item.quantity}</td>
          <td>$${(item.price * item.quantity).toFixed(2)}</td>
          <td><a href="#" class="btn-delete" data-index="${index}" aria-label="Delete item">&times;</a></td>
        </tr>
      `;
      tbody.append(row);
      totalPrice += item.price * item.quantity;
    });

    // Update the total price row
    const totalRow = `
      <tr>
        <th colspan="5">Total</th>
        <th>$${totalPrice.toFixed(2)}</th>
        <th></th>
      </tr>
    `;
    tbody.append(totalRow);
  }

  // Function to update the cart content in the UI
  function updateCartContent() {
    renderCartItems($('#cart-content .cart-table'), cart);
  }

  // Function to display cart data in the order table
  function displayCartData() {
    renderCartItems($('.tbl-full'), cart);
  }

  // Handle "Add to Cart" button click
  $('.food-menu-box form').on('submit', function (e) {
    e.preventDefault(); // Prevent form submission
    const form = $(this);
    const foodName = form.find('h4').text();
    const foodPrice = parseFloat(form.find('.food-price').text().replace('$', ''));
    const foodImage = form.find('.food-menu-img img').attr('src');
    const foodQuantity = parseInt(form.find('input[type="number"]').val());

    // Validate quantity
    if (isNaN(foodQuantity) || foodQuantity <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    // Check if the item already exists in the cart
    const existingItem = cart.find(item => item.name === foodName);
    if (existingItem) {
      existingItem.quantity += foodQuantity; // Update quantity
    } else {
      // Add new item to the cart
      cart.push({
        name: foodName,
        price: foodPrice,
        image: foodImage,
        quantity: foodQuantity
      });
    }

    // Update the cart badge and content
    saveCart();
    updateCartBadge();
    updateCartContent();
  });

  // Handle delete item from cart
  $(document).on('click', '.btn-delete', function (e) {
    e.preventDefault();
    const index = $(this).data('index');
    cart.splice(index, 1); // Remove the item from the cart
    saveCart();
    updateCartBadge();
    updateCartContent();
    displayCartData(); // Refresh the order table
  });

  // Toggle cart visibility
  $('#shopping-cart').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    $('#cart-content').toggle(); // Toggle cart visibility
  });

  // Hide cart when clicking outside
  $(document).on('click', function (e) {
    if (!$(e.target).closest('#shopping-cart, #cart-content').length && $('#cart-content').is(':visible')) {
      $('#cart-content').hide();
    }
  });

  // Initialize cart badge and display cart data on page load
  updateCartBadge();
  updateCartContent();
  displayCartData();
});