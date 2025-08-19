let products = [];
let wishlist = [];

if (sessionStorage.getItem("wishlist")) {
    wishlist = JSON.parse(sessionStorage.getItem("wishlist"));
}

fetch("https://fakestoreapi.com/products")
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        products = data;
        showProducts(products);
    });

function showProducts(list) {
    let container = document.getElementById("products");
    container.innerHTML = "";

    for (let i = 0; i < list.length; i++) {
        let p = list[i];

        let productDiv = document.createElement("div");
        productDiv.className = "product-card";

        productDiv.innerHTML =
            "<img src='" + p.image + "' alt='" + p.title + "' width='100'>" +
            "<h3>" + p.title + "</h3>" +
            "<p>Price: $" + p.price + "</p>" +
            "<button onclick='addToWishlist(" + p.id + ")'>Add to Wishlist</button>";

        container.appendChild(productDiv);
    }
}

function addToWishlist(id) {
    let product = null;

    for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            product = products[i];
            break;
        }
    }

    let alreadyInWishlist = false;
    for (let i = 0; i < wishlist.length; i++) {
        if (wishlist[i].id === id) {
            wishlist[i].quantity = wishlist[i].quantity + 1;
            alreadyInWishlist = true;
            break;
        }
    }

    if (!alreadyInWishlist && product) {
        product.quantity = 1;
        wishlist.push(product);
    }

    sessionStorage.setItem("wishlist", JSON.stringify(wishlist));
    showWishlist();
}

function showWishlist() {
    let container = document.getElementById("wishlist");
    container.innerHTML = "";

    let total = 0;

    for (let i = 0; i < wishlist.length; i++) {
        let p = wishlist[i];
        total = total + (p.price * p.quantity);

        let div = document.createElement("div");
        div.innerHTML =
            "<img src='" + p.image + "' alt='" + p.title + "' width='80'>" +
            "<h4>" + p.title + "</h4>" +
            "<p>$" + p.price + " x " + p.quantity + "</p>" +
            "<button onclick='increaseQuantity(" + p.id + ")'>+</button>" +
            "<button onclick='decreaseQuantity(" + p.id + ")'>-</button>" +
            "<button onclick='removeFromWishlist(" + p.id + ")'>Remove</button>";

        container.appendChild(div);
    }

    document.getElementById("totalPrice").textContent = "Total: $" + total.toFixed(2);
}

function increaseQuantity(id) {
    for (let i = 0; i < wishlist.length; i++) {
        if (wishlist[i].id === id) {
            wishlist[i].quantity = wishlist[i].quantity + 1;
            break;
        }
    }
    sessionStorage.setItem("wishlist", JSON.stringify(wishlist));
    showWishlist();
}

function decreaseQuantity(id) {
    for (let i = 0; i < wishlist.length; i++) {
        if (wishlist[i].id === id) {
            if (wishlist[i].quantity > 1) {
                wishlist[i].quantity = wishlist[i].quantity - 1;
            } else {
                wishlist.splice(i, 1);
            }
            break;
        }
    }
    sessionStorage.setItem("wishlist", JSON.stringify(wishlist));
    showWishlist();
}

function removeFromWishlist(id) {
    for (let i = 0; i < wishlist.length; i++) {
        if (wishlist[i].id === id) {
            wishlist.splice(i, 1);
            break;
        }
    }
    sessionStorage.setItem("wishlist", JSON.stringify(wishlist));
    showWishlist();
}

document.getElementById("priceFilter").addEventListener("change", function(e) {
    let sortedProducts = products.slice();

    if (e.target.value === "high") {
        sortedProducts.sort(function(a, b) {
            return b.price - a.price;
        });
    } else if (e.target.value === "low") {
        sortedProducts.sort(function(a, b) {
            return a.price - b.price;
        });
    }

    showProducts(sortedProducts);
});

document.getElementById("wishlistBtn").addEventListener("click", function() {
    document.getElementById("wishlistSection").scrollIntoView({ behavior: "smooth" });
});
showWishlist();
