// Fix navbar functionality and other script issues

document.addEventListener('DOMContentLoaded', function() {
    // Simple cursor tracking (disabled advanced effects that might break layout)
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    // Disable custom cursor effects for now
    if (cursor) cursor.style.display = 'none';
    if (cursorFollower) cursorFollower.style.display = 'none';
    
    // Ensure hamburger menu works properly
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            console.log('Hamburger clicked'); // Debugging
        });
        
        // Close mobile menu when clicking a link
        const navItems = document.querySelectorAll('.nav-links a');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                navLinks.classList.remove('active');
            });
        });
    }
    
    // Setup footer animations
    const footer = document.querySelector('footer');
    if (footer) {
        const footerElements = footer.querySelectorAll('.footer-content > *');
        footerElements.forEach((el, index) => {
            el.style.setProperty('--footer-index', index);
        });
        
        // Create a MutationObserver to watch for style changes
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.attributeName === 'style') {
                    const transformValue = footer.style.transform;
                    // If footer becomes visible, add class for animations
                    if (transformValue === 'translateY(0%)') {
                        footer.classList.add('visible');
                    } else {
                        footer.classList.remove('visible');
                    }
                }
            });
        });
        
        // Start observing the footer for style changes
        observer.observe(footer, { attributes: true });
    }
    
    // Fix project slideshow functionality
    initializeSlideshow();
});

// Enhanced and fixed slideshow functionality
function initializeSlideshow() {
    const slides = document.querySelectorAll('.project-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!slides.length) return;
    
    let currentSlideIndex = 0;
    
    // Force display and styling for all slides first
    slides.forEach(slide => {
        // Ensure images are loaded properly
        const img = slide.querySelector('img');
        if (img) {
            img.onerror = function() {
                this.src = 'assets/placeholder.jpg'; // Fallback image
                console.log('Image failed to load:', this.alt);
            };
        }
        
        // Reset any inline styles
        slide.style.cssText = '';
        slide.classList.remove('active');
    });
    
    // Show first slide by default
    showSlide(0);
    
    // Add click event to navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            changeSlide(-1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            changeSlide(1);
        });
    }
    
    // Add click events to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            currentSlideIndex = index;
            showSlide(currentSlideIndex);
        });
    });
    
    function showSlide(index) {
        // Validate index is within bounds
        if (index < 0 || index >= slides.length) return;
        
        // Hide all slides
        slides.forEach(slide => {
            slide.style.display = 'none';
            slide.classList.remove('active');
        });
        
        // Remove active class from all indicators
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Show the current slide with display flex and add active class
        slides[index].style.display = 'flex';
        slides[index].classList.add('active');
        
        // Add active class to current indicator if it exists
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
        
        console.log("Showing slide", index + 1, "of", slides.length);
    }
    
    function changeSlide(direction) {
        currentSlideIndex += direction;
        
        // Handle wrapping
        if (currentSlideIndex >= slides.length) {
            currentSlideIndex = 0;
        } else if (currentSlideIndex < 0) {
            currentSlideIndex = slides.length - 1;
        }
        
        showSlide(currentSlideIndex);
    }
    
    // Optional: Auto-slide every 7 seconds
    setInterval(() => changeSlide(1), 7000);
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            changeSlide(-1);
        } else if (e.key === 'ArrowRight') {
            changeSlide(1);
        }
    });
}

// Fix skill bars animation
document.addEventListener('DOMContentLoaded', function() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const skillValue = bar.getAttribute('data-skill');
        bar.style.width = skillValue + '%';
    });
});

// GitHub Repositories - Simple fetch with error handling
document.addEventListener('DOMContentLoaded', function() {
    const repoList = document.getElementById('github-repo-list');
    if (!repoList) return;

    fetch('https://api.github.com/users/RAHULKRISHNAKR/repos?sort=updated&per_page=100')
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        })
        .then(repos => {
            if (!Array.isArray(repos) || repos.length === 0) {
                repoList.innerHTML = '<p>No repositories found.</p>';
                return;
            }
            
            repoList.innerHTML = '';
            repos.forEach(repo => {
                const desc = repo.description ? 
                    (repo.description.length > 60 ? 
                        repo.description.slice(0, 60) + '...' : 
                        repo.description) : 
                    'No description.';
                
                const card = document.createElement('div');
                card.className = 'github-repo-card';
                card.innerHTML = `
                    <h3 title="${repo.name}">${repo.name}</h3>
                    <p title="${repo.description || ''}">${desc}</p>
                    <div class="repo-links">
                        <a href="${repo.html_url}" target="_blank" rel="noopener">Repo</a>
                        ${repo.homepage ? 
                            `<a href="${repo.homepage}" target="_blank" rel="noopener">Live</a>` : 
                            ''}
                    </div>
                `;
                repoList.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching repositories:', error);
            repoList.innerHTML = '<p>Unable to load repositories.</p>';
        });
});

// Enhance horizontal scrolling with visibility and parallax effects
document.addEventListener('DOMContentLoaded', function () {
  const sections = document.querySelectorAll('.horizontal-section');
  const scrollContainer = document.querySelector('.horizontal-scroll-container');

  if (!sections.length || !scrollContainer) return;

  // Update section visibility on scroll
  function updateSectionVisibility() {
    const scrollLeft = scrollContainer.scrollLeft;
    const viewportWidth = window.innerWidth;

    sections.forEach((section, index) => {
      const sectionLeft = index * viewportWidth;
      const sectionRight = sectionLeft + viewportWidth;

      if (scrollLeft >= sectionLeft && scrollLeft < sectionRight) {
        section.classList.add('section-visible');
      } else {
        section.classList.remove('section-visible');
      }
    });
  }

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        const targetIndex = Array.from(sections).indexOf(targetSection);
        scrollContainer.scrollTo({
          left: targetIndex * window.innerWidth,
          behavior: 'smooth',
        });
      }
    });
  });

  // Add scroll event listener
  scrollContainer.addEventListener('scroll', updateSectionVisibility);

  // Initialize visibility on page load
  updateSectionVisibility();
});