let currentView = localStorage.getItem("views");
const views = document.querySelector(".head");
const styleDOM = document.querySelector(".gridStyle");

if (currentView == null) {
  change("list");
} else {
  change(currentView);
}

views.addEventListener("click", (e) => {
  const id = e.target.dataset.id;
  change(id);
});

function change(mode) {
  if (mode === "grid") {
    styleDOM.href = "./css/grid.css";
  }
  if (mode === "list") {
    styleDOM.href = "./css/products.css";
  }

  localStorage.setItem("views", mode);
}

window.addEventListener("DOMContentLoaded", () => {
  const data = new DATA();
  const ui = new UI();

  data
    .display()
    .then((products) => {
      ui.displayAll(products);
    })
    .then((products) => {
      ui.cartBtn();
      ui.cartFunctionality();
    });
});
