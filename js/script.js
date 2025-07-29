//////DEBOUNCE FUNCTION
//Only fire event when finishing input
function debounce(callback, delay = 1000) {
  let timeout;
  return (...values) => {
    clearInterval(timeout);
    timeout = setTimeout(() => {
      callback(...values);
    }, delay);
  };
}

//////THROTTLE FUNCTION
//Fire event with delay between
function throttle(callback, delay = 1000) {
  let wait = false;
  let waitingValues;
  const timeout = () => {
    if (waitingValues == null) {
      wait = false;
    } else {
      callback(...waitingValues);
      waitingValues = null;
      setTimeout(timeout, delay);
    }
  };
  return (...values) => {
    if (wait) {
      waitingValues = values;
      return;
    }
    callback(...values);
    wait = true;
    setTimeout(timeout, delay);
  };
}

///////////////////////////////////////////////////////////
// SCROLL HEADER AND SCREEN RESIZE FUNCTIONALITY

const headerEl = document.querySelector(".header");
const wdigetScrollTop = document.querySelector(".widget-scroll-top");
const html = document.documentElement.classList;
const body = document.body.classList;
const searchForm = document.querySelector(".search-box input");
const searchFormMobile = document.querySelector(".search-box-widget input");
let lastScroll = 0;

function showHeader() {
  const currentScroll = window.scrollY;
  if (currentScroll > headerEl.clientHeight) {
    !body.contains("sticky") && body.add("sticky");
    if (currentScroll >= headerEl.clientHeight * 3) {
      //If scrolling down – remove header
      if (currentScroll > lastScroll && !body.contains("scroll-down")) {
        body.remove("scroll-up");
        body.add("scroll-down");
        removeMobileNav();
      }
      //If scrolling up – show header
      if (currentScroll < lastScroll && !body.contains("scroll-up")) {
        body.remove("scroll-down");
        body.add("scroll-up");
      }
    } else {
      body.contains("scroll-up") && body.remove("scroll-up");
      !body.contains("scroll-down") && body.add("scroll-down");
      removeMobileNav();
    }
  } else {
    body.contains("scroll-down") && body.remove("scroll-down");
    body.contains("sticky") && body.remove("sticky");
  }
  lastScroll = currentScroll;
}

function showWidgetToTop() {
  const currentScroll = window.scrollY;
  if (currentScroll >= 1000) {
    wdigetScrollTop.classList.contains("hidden") &&
      wdigetScrollTop.classList.remove("hidden");
  } else {
    !wdigetScrollTop.classList.contains("hidden") &&
      wdigetScrollTop.classList.add("hidden");
  }
}

const stickyHeader = throttle(() => {
  window.removeEventListener("scroll", showHeader);
  window.removeEventListener("scroll", showWidgetToTop);
  if (window.innerWidth <= 832) {
    searchForm.value = "";
    !wdigetScrollTop.classList.contains("hidden") &&
      wdigetScrollTop.classList.add("hidden");
    window.addEventListener("scroll", showHeader);
  } else {
    searchFormMobile.value = "";
    if (
      window.scrollY >= 1000 &&
      wdigetScrollTop.classList.contains("hidden")
    ) {
      wdigetScrollTop.classList.remove("hidden");
    }
    body.contains("scroll-up") && body.remove("scroll-up");
    body.contains("scroll-down") && body.remove("scroll-down");
    body.contains("sticky") && body.remove("sticky");
    window.addEventListener("scroll", showWidgetToTop);
  }
}, 250);

const removeAnimationStopper = debounce(() => {
  body.contains("resize-animation-stopper") &&
    body.remove("resize-animation-stopper");
}, 150);

function animationStopper() {
  !body.contains("resize-animation-stopper") &&
    body.add("resize-animation-stopper");
  removeAnimationStopper();
}

stickyHeader();
window.addEventListener("resize", function () {
  stickyHeader();
  animationStopper();
});

///////////////////////////////////////////////////////////
// SMOTH SCROLLING ANIMATION

const allLinks = document.querySelectorAll("a:link");

allLinks.forEach((link) =>
  link.addEventListener("click", function (event) {
    const href = link.getAttribute("href");
    href.startsWith("#") && event.preventDefault();
    // Scroll back to top
    if (href === "#") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    // Scroll to section
    if (href !== "#" && href.startsWith("#")) {
      const sectionEl = document.querySelector(href);
      if (href.includes("#search")) {
        sectionEl.scrollIntoView({ behavior: "smooth", block: "center" });
        sectionEl.querySelector("input").focus({ preventScroll: true });
      } else {
        sectionEl.scrollIntoView({ behavior: "smooth" });
      }
    }
    // Close mobile navigation
    if (link.classList.contains("nav-link")) {
      removeMobileNav();
    }
  })
);

///////////////////////////////////////////////////////////
// SLIDER ANIMATION

const sliderContainer = document.querySelector(".hero-slider");
const slider = document.querySelectorAll(".slider-item");
const prevBtn = document.querySelector(".slider-prev");
const nextBtn = document.querySelector(".slider-next");
const dots = document.querySelectorAll(".slider-dot");
let sliderIndex = 0;

// NEXT SLIDE
nextBtn.addEventListener("click", function () {
  sliderIndex++;
  if (sliderIndex === slider.length) {
    sliderIndex = 0;
  }
  slide();
});

// PREVIOUS SLIDE
prevBtn.addEventListener("click", function () {
  sliderIndex--;
  if (sliderIndex === -1) {
    sliderIndex = slider.length - 1;
  }
  slide();
});

// CLICK ON DOT
dots.forEach((dot, index) =>
  dot.addEventListener("click", function () {
    sliderIndex = index;
    slide();
  })
);

function slide() {
  sliderContainer.scrollLeft = slider[sliderIndex].clientWidth * sliderIndex;
  dots.forEach((dot) => dot.classList.remove("slider-dot--active"));
  dots[sliderIndex].classList.add("slider-dot--active");
}

// DRAG SLIDER
// Desktop
let startX;
sliderContainer.addEventListener("mousedown", function (event) {
  startX = event.clientX;
});

sliderContainer.addEventListener("mouseup", function (event) {
  const deltaX = event.clientX - startX;
  if (deltaX < -100) {
    nextBtn.click();
  }
  if (deltaX > 100) {
    prevBtn.click();
  }
});
// Phones
sliderContainer.addEventListener("touchstart", function (event) {
  startX = event.changedTouches[0].clientX;
});
sliderContainer.addEventListener("touchend", function (event) {
  const deltaX = event.changedTouches[0].clientX - startX;
  if (deltaX < -100) {
    nextBtn.click();
  }
  if (deltaX > 100) {
    prevBtn.click();
  }
});

/* SLIDE AUTOMATICALLY */
// let autoSlide = setInterval(() => {
//   nextBtn.click();
// }, 3000);

/* STOP SLIDE ON HOVER */
// sliderContainer.addEventListener("mouseover", function () {
//   clearInterval(autoSlide);
// });

// sliderContainer.addEventListener("mouseout", function () {
//   autoSlide = setInterval(() => {
//     nextBtn.click();
//   }, 3000);
// });

///////////////////////////////////////////////////////////
// RANGE SLIDER FUNCTIONALITY

const rangeSliders = document.querySelectorAll(".range-input");
const inputBoxes = document.querySelectorAll(".filter-box");

// INPUT BOX
inputBoxes.forEach((box) => {
  box.addEventListener("focusout", function () {
    switch (box.id) {
      case "price-min":
        updateInputBox(box, "price", "min");
        break;
      case "price-max":
        updateInputBox(box, "price", "max");
        break;
      case "height-min":
        updateInputBox(box, "height", "min");
        break;
      case "height-max":
        updateInputBox(box, "height", "max");
        break;
      case "width-min":
        updateInputBox(box, "width", "min");
        break;
      case "width-max":
        updateInputBox(box, "width", "max");
        break;
      case "length-min":
        updateInputBox(box, "length", "min");
        break;
      case "length-max":
        updateInputBox(box, "length", "max");
        break;
      default:
        break;
    }
  });
});

function updateInputBox(box, id, name) {
  let value = parseInt(box.value);
  const parent = document.querySelector(`#${id}-range-slider`);
  const minSlider = parent.querySelector("input[name=range-min]");
  const maxSlider = parent.querySelector("input[name=range-max]");
  const progress = parent.querySelector(".slider-progress");
  const minValue = parseInt(minSlider.value);
  const maxValue = parseInt(maxSlider.value);

  if (name === "min") {
    if (value < 0 || !value) {
      value = 0;
    }
    if (value > maxValue - 50) {
      value = maxValue - 50;
    }
    minSlider.value = value;
    progress.style.left = (value / parseInt(minSlider.max)) * 100 + "%";
  }
  if (name === "max") {
    if (value < minValue + 50 || !value) {
      value = minValue + 50;
    }
    if (value > parseInt(maxSlider.max)) {
      value = parseInt(maxSlider.max);
    }
    maxSlider.value = value;
    progress.style.right = 100 - (value / parseInt(maxSlider.max)) * 100 + "%";
  }
  box.value = value;
}

// RANGE SLIDER
rangeSliders.forEach((rangeSlider) => {
  rangeSlider.addEventListener("input", function () {
    const parent = rangeSlider.parentNode;
    let min;
    let max;
    switch (rangeSlider.parentNode.id) {
      case "price-range-slider":
        [min, max] = rangeSlide(rangeSlider, parent);
        updateRange(min, max, "price");
        break;
      case "height-range-slider":
        [min, max] = rangeSlide(rangeSlider, parent);
        updateRange(min, max, "height");
        break;
      case "width-range-slider":
        [min, max] = rangeSlide(rangeSlider, parent);
        updateRange(min, max, "width");
        break;
      case "length-range-slider":
        [min, max] = rangeSlide(rangeSlider, parent);
        updateRange(min, max, "length");
        break;
      default:
        break;
    }
  });
});

function rangeSlide(rangeSlider, parent) {
  const minSlider = parent.querySelector("input[name=range-min]");
  const maxSlider = parent.querySelector("input[name=range-max]");
  const progress = parent.querySelector(".slider-progress");

  let minValue = parseInt(minSlider.value);
  let maxValue = parseInt(maxSlider.value);

  if (maxValue - minValue < 50) {
    if (rangeSlider.name === minSlider.name) {
      minValue = maxValue - 50;
    }
    if (rangeSlider.name === maxSlider.name) {
      maxValue = minValue + 50;
    }
  }
  minSlider.value = minValue;
  maxSlider.value = maxValue;
  //RESPONSIVE PROGRESS BAR
  progress.style.left = (minValue / parseInt(minSlider.max)) * 100 + "%";
  progress.style.right = 100 - (maxValue / parseInt(maxSlider.max)) * 100 + "%";
  return [minValue, maxValue];
}

function updateRange(min, max, id) {
  const minPriceBox = document.querySelector(`#${id}-min`);
  const maxPriceBox = document.querySelector(`#${id}-max`);
  minPriceBox.value = min;
  maxPriceBox.value = max;
}

///////////////////////////////////////////////////////////
// ACCORDION FUNCTIONALITY

const accordionItem = document.querySelectorAll(".accordion-item");
const accordionIcons = document.querySelectorAll(".accordion-icon");
const boxContainer = document.querySelectorAll(".accordion-text-container");

accordionIcons.forEach((icon, index) =>
  icon.addEventListener("click", function (event) {
    const boxText = accordionItem[index].querySelector(".accordion-text");
    if (accordionItem[index].classList.contains("accordion--open")) {
      accordionItem[index].classList.remove("accordion--open");
      boxContainer[index].style.height = "0";
    } else {
      accordionItem.forEach((item) => item.classList.remove("accordion--open"));
      boxContainer.forEach((box) => (box.style.height = "0"));
      accordionItem[index].classList.add("accordion--open");
      boxContainer[index].style.height = boxText.clientHeight + "px";
    }
  })
);

///////////////////////////////////////////////////////////
// SEARCH FUNCTIONALITY

const searchBoxResult = document.querySelector(".search-box-result");
const [searchHeader, searchFooter] =
  document.querySelectorAll(".btn-mobile-search");
const searchWidget = document.querySelector(".search-box-widget");
const searchBtn = searchWidget.querySelectorAll("button");

searchBoxResult.addEventListener("mousedown", function (event) {
  event.preventDefault();
});

searchHeader.addEventListener("click", toggleSearchWidget);
searchFooter.addEventListener("click", toggleSearchWidget);
searchBtn.forEach((button) =>
  button.addEventListener("click", removeSearchWidget)
);

function toggleSearchWidget() {
  body.toggle("search-widget--open");
}

function removeSearchWidget() {
  body.contains("search-widget--open") && body.remove("search-widget--open");
}

///////////////////////////////////////////////////////////
// CART FUNCTIONALITY

const [btnCartOpen, btnCartFooter] =
  document.querySelectorAll(".shopping-cart");
const cartWidget = document.querySelector(".cart-widget");
const btnWidgetClose = cartWidget.querySelector(".btn-widget--close");
const btnPay = cartWidget.querySelector(".btn--card");

btnCartOpen.addEventListener("click", toggleCartWidget);
btnCartFooter.addEventListener("click", toggleCartWidget);
btnWidgetClose.addEventListener("click", removeCartWidget);
btnPay.addEventListener("click", removeCartWidget);

function toggleCartWidget() {
  body.toggle("cart-widget--open");
}

function removeCartWidget() {
  body.contains("cart-widget--open") && body.remove("cart-widget--open");
}

///////////////////////////////////////////////////////////
// ACCOUNT WIDGET FUNCTIONALITY

const accountWidget = document.querySelector(".account-widget");
const [btnAccount, btnAccoundFooter] =
  document.querySelectorAll(".btn-account");
const btnAccountClose = accountWidget.querySelector(".btn-widget--close");

const [signEye, registerEye] = accountWidget.querySelectorAll(".eye");
const [signPassword, registerPassword] = accountWidget.querySelectorAll(
  ".account-widget form input[name=password]"
);
const [signUser, registerUser] = accountWidget.querySelectorAll(
  ".account-widget form input[name=username]"
);

btnAccount.addEventListener("click", toggleAccountWidget);
btnAccoundFooter.addEventListener("click", toggleAccountWidget);
btnAccountClose.addEventListener("click", toggleAccountWidget);

function toggleAccountWidget() {
  body.toggle("account-widget--open");
  body.contains("account-widget--open") && removeAccountInputs();
}

function removeAccountWidget() {
  body.contains("account-widget--open") && body.remove("account-widget--open");
}

///////////////////////////////////////////////////////////
// PRIVATE POLICY WIDGET FUNCTIONALITY

// const privatePolicyWidget = document.querySelector(".private-policy--widget");
// const btnPrivatePolicyClose =
//   privatePolicyWidget.querySelector(".btn-widget--close");
// const btnPrivatePolicy = document.querySelector(".btn-private-policy");

// btnPrivatePolicy.addEventListener("click", togglePrivatePolicy);
// btnPrivatePolicyClose.addEventListener("click", togglePrivatePolicy);

// function togglePrivatePolicy() {
//   body.toggle("private-rules--open");
// }

// function removePrivatePolicy() {
//   body.contains("private-rules--open") && body.remove("private-rules--open");
// }

///////////////////////////////////////////////////////////
// BUY RULES WIDGET FUNCTIONALITY

// const buyRulesWidget = document.querySelector(".buy-rules--widget");
// const btnBuyRules = document.querySelector(".btn-buy-rules");
// const btnBuyRulesClose = buyRulesWidget.querySelector(".btn-widget--close");

// btnBuyRules.addEventListener("click", toggleBuyRules);
// btnBuyRulesClose.addEventListener("click", toggleBuyRules);

// function toggleBuyRules() {
//   body.toggle("buy-rules--open");
// }

// function removeBuyRules() {
//   body.contains("buy-rules--open") && body.remove("buy-rules--open");
// }

///////////////////////////////////////////////////////////
// FILTER WIDGET FUNCTIONALITY

const btnFilterOpenEl = document.querySelector(".btn-filter-widget--open");
const filterWidget = document.querySelector(".products-filter");
const btnFilterCloseEl = filterWidget.querySelector(".btn-widget--close");
const btnClearFilter = filterWidget.querySelector("input[name=clear]");
const btnFilter = filterWidget.querySelector("input[name=filter]");

document.body.addEventListener("click", function (event) {
  //Close Filter widget when clicked outside of it
  if (
    !filterWidget.contains(event.target) &&
    !btnFilterOpenEl.contains(event.target)
  ) {
    removeFilterWidget();
  }
  //Close Search widget when clicked outside of it
  if (
    !searchWidget.contains(event.target) &&
    !searchHeader.contains(event.target) &&
    !searchFooter.contains(event.target)
  ) {
    removeSearchWidget();
  }
  //Close Cart widget when clicked outside of it
  if (
    !cartWidget.contains(event.target) &&
    !btnCartOpen.contains(event.target) &&
    !btnCartFooter.contains(event.target)
  ) {
    removeCartWidget();
  }
  //Close Account widget when clicked outside of it
  if (
    !accountWidget.contains(event.target) &&
    !btnAccount.contains(event.target) &&
    !btnAccoundFooter.contains(event.target)
  ) {
    removeAccountWidget();
  }
  //Close Private Policy widget when clicked outside of it
  // if (
  //   !privatePolicyWidget.contains(event.target) &&
  //   !btnPrivatePolicy.contains(event.target)
  // ) {
  //   removePrivatePolicy();
  // }
  //Close Buy Rules widget when clicked outside of it
  // if (
  //   !buyRulesWidget.contains(event.target) &&
  //   !btnBuyRules.contains(event.target)
  // ) {
  //   removeBuyRules();
  // }
});
btnFilterOpenEl.addEventListener("click", toggleFilterWidget);
btnFilterCloseEl.addEventListener("click", removeFilterWidget);
btnClearFilter.addEventListener("click", removeFilterWidget);
btnFilter.addEventListener("click", removeFilterWidget);

function toggleFilterWidget() {
  body.toggle("filter-widget--open");
}

function removeFilterWidget() {
  body.contains("filter-widget--open") && body.remove("filter-widget--open");
}
///////////////////////////////////////////////////////////
// SIGN IN, REGISTER FORMS FUNCTIONALITY

const linkRegister = accountWidget.querySelector(".link-register");
const btnSignBack = accountWidget.querySelector(".btn-sign-back");

linkRegister.addEventListener("click", toggleNavRegister);
btnSignBack.addEventListener("click", toggleNavRegister);

signEye.addEventListener("mousedown", function (event) {
  event.preventDefault();
});

registerEye.addEventListener("mousedown", function (event) {
  event.preventDefault();
});

signEye.addEventListener("click", () => {
  toggleOpenEye(signPassword);
});

registerEye.addEventListener("click", () => {
  toggleOpenEye(registerPassword);
});

function toggleNavRegister() {
  accountWidget.classList.toggle("nav-register");
  accountWidget.classList.contains("nav-register") && removeUserInput(),
    removePasswordInput(),
    removeOpenEye(signPassword),
    removeOpenEye(registerPassword);
}

function toggleOpenEye(input) {
  input.classList.toggle("open-eye");
  if (input.classList.contains("open-eye")) {
    input.type = "text";
  } else {
    input.type = "password";
  }
}

function removeOpenEye(input) {
  input.classList.contains("open-eye") &&
    (input.classList.remove("open-eye"), (input.type = "password"));
}

function removeUserInput() {
  signUser.value = "";
  signPassword.value = "";
}

function removePasswordInput() {
  registerUser.value = "";
  registerPassword.value = "";
}

function removeAccountInputs() {
  accountWidget.classList.contains("nav-register") &&
    accountWidget.classList.remove("nav-register");
  removeOpenEye(signPassword);
  removeOpenEye(registerPassword);
  removeUserInput();
  removePasswordInput();
}

///////////////////////////////////////////////////////////
// MOBILE NAV FUNCTIONALITY
const btnMobileNavOpen = document.querySelector(".btn-mobile-nav");
const mobileNav = document.querySelector(".side-nav");

btnMobileNavOpen.addEventListener("click", toggleMobileNav);
document.body.addEventListener("click", function (event) {
  if (
    !mobileNav.contains(event.target) &&
    !btnMobileNavOpen.contains(event.target)
  ) {
    removeMobileNav();
  }
});

function toggleMobileNav() {
  body.toggle("open-nav");
}

function removeMobileNav() {
  body.contains("open-nav") && body.remove("open-nav");
}

///////////////////////////////////////////////////////////
// CTA FUNCTIONALITY

const textBox = document.querySelector(".cta-form textarea");

textBox.addEventListener("input", function () {
  console.log(textBox.scrollHeight);
  textBox.style.height = "auto";
  textBox.style.height = textBox.scrollHeight + "px";
});

/* TEST */
const inputMin = document.querySelector("#price-min");
const inputMax = document.querySelector("#price-max");
const form = document.querySelector("#filter-form");
const discount = document.querySelector("#discount-checkbox");
const newCheckbox = document.querySelector("#new-checkbox");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log(inputMin.value);
  console.log(inputMax.value);
  console.log(`SU NUOLAIDA: ${discount.checked}`);
  console.log(`NAUJIENA: ${newCheckbox.checked}`);
  console.log("SUBMITED");
});

const cta = document.querySelector(".cta-form");

cta.addEventListener("submit", function (e) {
  e.preventDefault();
  const text = cta.querySelector("textarea").value;
  console.log(text);
  text === "" || text === undefined
    ? console.log("tuscia")
    : console.log("netusica");
});
