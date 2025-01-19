// Custom Cursor
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', e => {
    cursor.setAttribute('style', `top: ${e.pageY}px; left: ${e.pageX}px;`);
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
// Change nav background color on scroll
window.addEventListener('scroll', function () {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
      nav.style.backgroundColor = '#ff4c3b'; // Change to darker color when scrolled
    } else {
      nav.style.backgroundColor = '#ff6f61'; // Original vibrant color
    }
  });
  const logo = document.querySelector('.logo');
  let hoverTimer;
  
  logo.addEventListener('mouseenter', () => {
      document.addEventListener('mousemove', escapeText);
      // Set a timer to hide the logo after 3 seconds of hovering
      hoverTimer = setTimeout(() => {
          logo.style.opacity = '0'; // Make the logo disappear
      }, 3000); // 3000 milliseconds = 3 seconds
  });
  
  logo.addEventListener('mouseleave', () => {
      logo.style.transform = 'translate(0, 0)'; // Reset position
      logo.style.opacity = '1'; // Reset opacity
      clearTimeout(hoverTimer); // Clear the timer when leaving
      document.removeEventListener('mousemove', escapeText);
  });
  
  function escapeText(e) {
      const rect = logo.getBoundingClientRect();
      const logoCenterX = rect.left + rect.width / 2;
      const logoCenterY = rect.top + rect.height / 2;
      const deltaX = e.clientX - logoCenterX;
      const deltaY = e.clientY - logoCenterY;
  
      // Move the logo away from the cursor with larger distances
      const moveX = deltaX > 0 ? -10 : 10; // Larger left or right movement
      const moveY = deltaY > 0 ? -10 : 10; // Larger up or down movement
      logo.style.transform = `translate(${moveX}px, ${moveY}px)`;
  }
// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links li');

hamburger.addEventListener('click', () => {
    // Toggle Navigation
    navLinks.classList.toggle('active');
    
    // Animate Hamburger
    hamburger.classList.toggle('active');
    
    // Animate Links
    navLinksItems.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
});

// Close mobile menu when clicking a link
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Add animation for hamburger menu
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes navLinkFade {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .hamburger.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }

    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }

    .hamburger.active span:nth-child(3) {
        transform: rotate(-45deg) translate(5px, -5px);
    }
`;
document.head.appendChild(styleSheet);