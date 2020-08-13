const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: "itmprwcnaab8",
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: "5TCJ8q-V_ht8MaOj6cESuwnalBssRRrqHbsYq5eIxwQ",
});

const opencart = document.querySelector(".cartBox > div");
const closecart = document.querySelector(".close-cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cart = document.querySelector(".cart");

// variables
const latestContainer = document.querySelector(".latest");
const featuredContainer = document.querySelector(".featured");
const allProducts = document.querySelector(".products-container-wrapper");
const cartNumber = [...document.querySelectorAll(".cartNumber")];
const totalPrice = [...document.querySelectorAll(".t-price")];
const cartWrapper = document.querySelector(".cart-items-wrap");
const clearCartDOM = document.querySelector(".clear-cart button");
const searchContainer = document.querySelector(".search-result ul");
const searchBar = document.querySelector(".search");
const subContainers = [...document.querySelectorAll(".sub-products")];

// imges
let imgArr = [];
// buttoms
let DOMButtons = [];
// cartArr
let cartArr = [];

// products names
let productsName = [];

//  DATA
class DATA {
  async display() {
    try {
      let contentful = await client.getEntries({
        content_type: "products",
      });

      const result = await fetch("./products.json");
      const data = await result.json();

      let product = contentful.items;
      product = product.map((item) => {
        const id = item.sys.id;
        const title = item.fields.name;
        const description = item.fields.description;
        const price = item.fields.price;
        const image = item.fields.image.fields.file.url;
        return { id, title, description, price, image };
      });
      return product;
    } catch (error) {
      console.log(error);
    }
  }
}

//  UI
class UI {
  showLatest(products) {
    let result = "";
    let newArr = products.slice(0, 5);
    newArr.forEach((product) => {
      result += `<div class="sub-products" data-id=${product.id}>
              <div class="product-bg">
                <img src=${product.image} alt=${product.title} />
              </div>
              <div class="info">
                <h6 class="product-title">${product.title}</h6>
                <h6 class="product-price">$<span>${product.price}.00</span></h6>
              </div>
              <div class="btn">
                <button class="addToCart" data-id=${product.id}>add to cart</button>
              </div>
            </div>`;
    });
    latestContainer.insertAdjacentHTML("afterbegin", result);
  }
  showFeatured(products) {
    let result = "";
    let newArr = products.slice(5, 10);
    newArr.forEach((product) => {
      result += `<div class="sub-products" data-id=${product.id}>
              <div class="product-bg">
                <img src=${product.image} alt=${product.title} />
              </div>
              <div class="info">
                <h6 class="product-title">${product.title}</h6>
                <h6 class="product-price">$<span>${product.price}.00</span></h6>
              </div>
              <div class="btn">
                <button class="addToCart" data-id=${product.id}>add to cart</button>
              </div>
            </div>`;
    });
    featuredContainer.insertAdjacentHTML("afterbegin", result);
  }
  displayAll(products) {
    let result = "";
    products.forEach((product) => {
      result += `
          <div class="sub-pro-wrapper" data-id=${product.id}>
            <div class="pro-img">
              <img src=${product.image} alt=${product.title} />
            </div>
            <div class="prod-des">
              <h5>${product.title}</h5>
              <p>
                ${product.description}
              </p>
            </div>
            <div class="pro-btns">
              <p class="price">${product.price}.00</p>
              <div class="btn">
                <button class="addToCart" data-id=${product.id}>add to cart</button>
              </div>
            </div>
          </div>`;
    });
    allProducts.insertAdjacentHTML("afterbegin", result);
  }
  cartBtn() {
    const cartButtons = [...document.querySelectorAll(".addToCart")];
    DOMButtons = cartButtons;
    DOMButtons.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cartArr.find((item) => item.id === id);
      if (inCart) {
        button.innerText = "In Cart";
        button.style.pointerEvents = "none";
      }
      button.addEventListener("click", (e) => {
        e.target.innerText = "In Cart";
        e.target.style.pointerEvents = "none";

        // get product
        let cartItems = {
          ...Storage.getProduct(id),
          amount: 1,
        };

        // add to cartArr
        cartArr = [...cartArr, cartItems];

        // save cartArr to local sorage
        Storage.savecart(cartArr);

        // set cart values
        this.setCartValues(cartArr);

        // add cart item
        this.addToCart(cartItems);

        // show cart
        this.openCart();
      });
    });
  }
  addToCart(item) {
    let result = "";
    result += `<div class="cart-wrapper">
                <div class="product-wrap">
                  <div class="pro-info">
                    <img src=${item.image} alt=${item.title} />
                    <div>
                      <h5>${item.title}</h5>
                      <h5>${item.price}.00</h5>
                      <p class="remove-cart" data-id=${item.id}>remove</p>
                    </div>
                  </div>
                </div>
                <div class="quantity">
                  <i class="fas fa-plus" data-id=${item.id}></i>
                  <p>1</p>
                  <i class="fas fa-minus" data-id=${item.id}></i>
                </div>
                </div>`;
    cartWrapper.insertAdjacentHTML("afterbegin", result);
  }
  cartFunctionality() {
    //clear cart
    clearCartDOM.addEventListener("click", () => {
      this.clearCart();
    });

    cartWrapper.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-cart")) {
        let remove = e.target;
        let id = remove.dataset.id;
        cartWrapper.removeChild(
          remove.parentElement.parentElement.parentElement.parentElement
        );
        this.removeCartItem(id);
      } else if (e.target.classList.contains("fa-plus")) {
        let addAmount = e.target;
        let id = addAmount.dataset.id;
        let tempItem = cartArr.find((item) => item.id === id);
        tempItem.amount = tempItem.amount + 1;
        Storage.savecart(cartArr);
        this.setCartValues(cartArr);
        addAmount.nextElementSibling.innerHTML = tempItem.amount;
      } else if (e.target.classList.contains("fa-minus")) {
        let lowerAmount = e.target;
        let id = lowerAmount.dataset.id;
        let tempItem = cartArr.find((item) => item.id === id);
        tempItem.amount = tempItem.amount - 1;
        if (tempItem.amount > 0) {
          Storage.savecart(cartArr);
          this.setCartValues(cartArr);
          lowerAmount.previousElementSibling.innerText = tempItem.amount;
        } else {
          cartWrapper.removeChild(lowerAmount.parentElement.parentElement);
          this.removeCartItem(id);
        }
      }
    });
  }
  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map((cartItem) => {
      tempTotal += cartItem.price * cartItem.amount;
      itemsTotal += cartItem.amount;
    });
    totalPrice.forEach((price) => {
      price.innerHTML = `$${parseFloat(tempTotal.toFixed(2))}`;
    });
    cartNumber.forEach((num) => {
      num.innerHTML = itemsTotal;
    });
  }
  openCart() {
    cartOverlay.classList.add("show-overlay");
    cart.classList.add("show-cart");
  }
  closeCart() {
    cartOverlay.classList.remove("show-overlay");
    cart.classList.remove("show-cart");
  }
  showCart(cart) {
    cart.forEach((item) => this.addToCart(item));
  }
  init() {
    cartArr = Storage.getCart();
    this.setCartValues(cartArr);
    this.showCart(cartArr);
  }
  removeCartItem(id) {
    cartArr = cartArr.filter((item) => item.id !== id);
    this.setCartValues(cartArr);
    Storage.savecart(cartArr);
    let button = this.getSingleButton(id);
    button.style.pointerEvents = "initial";
    button.innerHTML = "add to cart";
  }
  getSingleButton(id) {
    return DOMButtons.find((btn) => btn.dataset.id === id);
  }
  clearCart() {
    let cartItems = cartArr.map((item) => item.id);
    cartItems.forEach((id) => this.removeCartItem(id));
    while (cartWrapper.children.length > 0) {
      cartWrapper.removeChild(cartWrapper.children[0]);
    }
    this.closeCart();
  }
  getNames(product) {
    product = product.forEach((item) => {
      productsName = [...productsName, item.title];
    });
    this.searchItems(productsName);
  }
  searchItems(names) {
    let namesArr = [];
    searchBar.addEventListener("input", (e) => {
      if (e.target.value) {
        namesArr = names.filter((arr) =>
          arr.toLocaleLowerCase().includes(e.target.value)
        );
        namesArr = names.map((arr) => `<li>${arr}</li>`);
      }
      // this.displaySearchResult(namesArr);
    });
  }
  displaySearchResult(arr) {
    const html = !arr.length ? "" : arr.join("");
    searchContainer.innerHTML = html;
  }
}

//  STORAGE
class Storage {
  static saveAllProducts(product) {
    localStorage.setItem("Products", JSON.stringify(product));
  }
  static getProduct(id) {
    let product = JSON.parse(localStorage.getItem("Products"));
    return product.find((pro) => pro.id === id);
  }
  static savecart(cart) {
    localStorage.setItem("CartArr", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("CartArr")
      ? JSON.parse(localStorage.getItem("CartArr"))
      : [];
  }
}

// EVENT LISTENERS
window.addEventListener("DOMContentLoaded", () => {
  const data = new DATA();
  const ui = new UI();
  ui.init();

  data
    .display()
    .then((products) => {
      ui.showLatest(products);
      Storage.saveAllProducts(products);
      ui.showFeatured(products);
      ui.getNames(products);
    })
    .then((products) => {
      ui.cartBtn();
      ui.cartFunctionality();
    });
});

closecart.addEventListener("click", () => {
  cartOverlay.classList.remove("show-overlay");
  cart.classList.remove("show-cart");
});

opencart.addEventListener("click", () => {
  cartOverlay.classList.add("show-overlay");
  cart.classList.add("show-cart");
});
