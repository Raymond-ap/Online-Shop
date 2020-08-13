const sortContainer = document.querySelector("select");
const allProductsWrap = document.querySelector(".products-container-wrapper");

let proNames = [];
let filterArr = [];
let allProductsArr = [];

class getNames {
  getProducts(product) {
    product.forEach((names) => {
      proNames = [...proNames, names.title];
      allProductsArr = [...allProductsArr, names];
    });
    this.getDataID();
  }
  // get data id
  getDataID() {
    sortContainer.addEventListener("click", (e) => {
      const id = e.target.value;
      this.check(id);
    });
  }
  check(id) {
    let newArr = [];
    if (id === "new") {
      allProductsArr = allProductsArr.sort();
      this.showItem(allProductsArr);
    }
    if (id === "old") {
      allProductsArr = allProductsArr.reverse();
      this.showItem(allProductsArr);
    } else if (id === "high") {
      allProductsArr.filter((items) => {
        if (items.price > 100) {
          newArr = [...newArr, items];
          this.showItem(newArr);
        }
      });
    } else if (id === "low") {
      allProductsArr.filter((items) => {
        if (items.price < 100) {
          newArr = [...newArr, items];
          this.showItem(newArr);
        }
      });
    } else if (id === "accendind") {
      allProductsArr.sort();
      this.showItem(allProductsArr);
    } else if (id === "decending") {
      allProductsArr.reverse();
      this.showItem(allProductsArr);
    }
  }
  // displayNew(arr) {
  //   arr.forEach((item) => this.showItem(item));
  // }
  showItem(products) {
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
    allProductsWrap.innerHTML = "";
    allProductsWrap.insertAdjacentHTML("afterbegin", result);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const data = new DATA();
  const get = new getNames();
  const ui = new UI();

  data
    .display()
    .then((products) => {
      get.getProducts(products);
    })
    .then((products) => {});
});
