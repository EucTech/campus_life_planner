// Render the Components Dynamically
document.addEventListener("DOMContentLoaded", async () => {
  const components = document.querySelectorAll("Component");
  for (const comp of components) {
    const src = comp.getAttribute("src");
    const res = await fetch(src);
    const html = await res.text();
    comp.outerHTML = html;
  }
});

// A function that handles the navigation tabs
function NavTabs() {
  const allNavLinks = document.querySelectorAll(".nav-link");
  const allPages = document.querySelectorAll(".page");

  allNavLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = link.dataset.page;

      // Update active nav link
      allNavLinks.forEach((link) => link.classList.remove("active"));
      link.classList.add("active");

      // Show active page
      allPages.forEach((page) => page.classList.remove("active"));
      document.getElementById(page)?.classList.add("active");
    });
  });
}

// Function that will toggle NavBar in mobile view
const toggleNavBar = () => {
  const toggleButton = document.querySelector(".fa-bars");
  const navBar = document.querySelector(".tabs");

  toggleButton.addEventListener("click", () => {
    navBar.classList.toggle("show");
  });
};

// Initialize the app
function init() {
  NavTabs();
  toggleNavBar();
}

// When the DOM Is ready start the app
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
