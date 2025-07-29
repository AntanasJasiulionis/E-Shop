///////////////////////////////////////////////////////////
// PRODUCT PAGE SLIDER

const productContainer = document.querySelector(".product-pictures-slider");
const productPictures = document.querySelectorAll(".picture-slider-item");
const buttonNext = document.querySelector(".btn-product-next");
const buttonPrev = document.querySelector(".btn-product-prev");
const pictureDots = document.querySelectorAll(".picture-slider-picture");
let pictureIndex = 0;

// NEXT PICTURE

buttonNext.addEventListener("click", function () {
  pictureIndex++;
  if (pictureIndex === productPictures.length) {
    pictureIndex = 0;
  }
  show();
});

// PREVIOUS PICTURE

buttonPrev.addEventListener("click", function () {
  pictureIndex--;
  if (pictureIndex === -1) {
    pictureIndex = productPictures.length - 1;
  }
  show();
});

//CLICK ON PICTURE DOT

pictureDots.forEach((dot, index) =>
  dot.addEventListener("click", function () {
    pictureIndex = index;
    show();
  })
);

function show() {
  productContainer.scrollLeft =
    productPictures[pictureIndex].clientWidth * pictureIndex;
  pictureDots.forEach((dot) =>
    dot.classList.remove("picture-slider-picture-active")
  );
  pictureDots[pictureIndex].classList.add("picture-slider-picture-active");
}
