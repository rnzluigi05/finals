/*
 Manages Scroll Animations.
 */

export function initUIInteractions() {
    // Select DOM Elements
    const sections = document.querySelectorAll('section, div[id="home"]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const reveals = document.querySelectorAll('.reveal');

    // Setup Scroll Event Listener
    window.addEventListener('scroll', () => {
        highlightActiveMenuItem(sections, navLinks);
        toggleScrollTopButton(scrollTopBtn);
        handleScrollReveal(reveals);
    });

    // Initial Call (To show elements visible on page load)
    handleScrollReveal(reveals);

    // Setup Button Click
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', scrollToTop);
    }
}

/*
  Highlights the navbar link corresponding to the current section.
 */
function highlightActiveMenuItem(sections, navLinks) {
    let currentSectionId = '';

    // Find which section is currently in view
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 150) {
            currentSectionId = section.getAttribute('id');
        }
    });

    // Update active class on nav links
    navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(currentSectionId)) {
            link.classList.add('active');
        }
    });
}

/*
  Shows or hides the "Scroll to Top" button based on scroll depth.
 */
function toggleScrollTopButton(button) {
    if (!button) return;

    // Show button if scrolled down more than 300px
    if (window.scrollY > 300) {
        button.style.display = 'flex';
    } else {
        button.style.display = 'none';
    }
}

/*
 Adds 'active' class to elements when they scroll into viewport.
 */
function handleScrollReveal(reveals) {
    const windowHeight = window.innerHeight;
    const revealPoint = 150; 

    reveals.forEach((reveal) => {
        const elementTop = reveal.getBoundingClientRect().top;

        if (elementTop < windowHeight - revealPoint) {
            reveal.classList.add('active');
        }
    });
}

/*
  Smoothly scrolls the window to the very top.
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
}