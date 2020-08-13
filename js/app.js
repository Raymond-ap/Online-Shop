const banner = document.querySelector(".banner");
const heading1 = document.querySelector(".content h1");
const burgerIcons = document.querySelector(".burgerIcons");
const links = document.querySelector(".mobile-links");
const backToTop = document.querySelector(".backtoTop");

const banners = [
  {
    img: `url("../images/Optimized-lap.jpg")center/cover no-repeat`,
    des: `Powerfull laptops`,
  },
  {
    img: `url("../images/Optimized-daniel-romero-pxph3sxHRxE-unsplash.jpg")center/cover no-repeat`,
    des: `smart phones`,
  },
  {
    img: `url("../images/Optimized-outfit.jpg")center/cover no-repeat`,
    des: `Cool outfits`,
  },
  {
    img: `url("../images/Optimized-earpods.jpg")center/cover no-repeat`,
    des: `earpods`,
  },
];

const date = document.querySelector(".copy .date");
const cur = new Date().getFullYear();
date.innerHTML = cur;

// EVENT LISTENERS
burgerIcons.addEventListener("click", excute);

function excute() {
  links.classList.toggle("showlinks");
  burgerIcons.classList.toggle("icons");
}

window.addEventListener("scroll", () => {
  if (scrollY > 500) {
    backToTop.classList.add("showTop");
  } else if (scrollY < 500) {
    backToTop.classList.remove("showTop");
  }
});

setInterval(() => {
  const rand = Math.floor(Math.random() * banners.length);
  banner.style.background = banners[rand].img;
  heading1.textContent = banners[rand].des;
}, 4000);
