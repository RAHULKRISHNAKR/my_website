document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on mobile - provide better threshold for small devices
    const isMobile = window.innerWidth <= 991;
    
    // Disable horizontal scroll on mobile completely - switch to vertical scrolling
    if (isMobile) {
        convertToVerticalLayout();
        return;
    }
    
    // Only initialize horizontal scroll on screens larger than mobile
    const horizontalWrapper = document.querySelector('.horizontal-wrapper');
    const horizontalContainer = document.querySelector('.horizontal-scroll-container');
    const sections = document.querySelectorAll('.horizontal-section');
    
    if (!horizontalWrapper || !horizontalContainer || !sections.length) return;
    
    // Calculate total width of all sections
    let totalWidth = 0;
    sections.forEach(section => {
        section.style.width = '100vw';
        totalWidth += section.offsetWidth;
    });
    
    // Set container width to total of all sections
    horizontalContainer.style.width = `${totalWidth}px`;
    
    // Set height of wrapper to match the viewport
    horizontalWrapper.style.height = '100vh';
    
    // Calculate scroll distance needed
    const scrollDistance = totalWidth - window.innerWidth;
    
    // Set body height to allow for scrolling
    const bodyHeight = window.innerHeight + scrollDistance;
    document.body.style.height = `${bodyHeight}px`;
    
    // Add fixed positioning to the wrapper to keep it in viewport while scrolling
    horizontalWrapper.style.position = 'fixed';
    horizontalWrapper.style.top = '0';
    horizontalWrapper.style.left = '0';
    horizontalWrapper.style.width = '100%';
    
    // Create a placeholder for the fixed position compensation
    const placeholder = document.createElement('div');
    placeholder.style.height = `${window.innerHeight}px`;
    placeholder.style.width = '100%';
    placeholder.style.position = 'relative';
    placeholder.style.zIndex = '-1';
    
    // Insert placeholder at the beginning of the body
    document.body.insertBefore(placeholder, document.body.firstChild);
    
    // Move the footer outside of the wrapper if it exists
    const footer = document.querySelector('footer');
    if (footer) {
        document.body.appendChild(footer);
        footer.style.position = 'relative';
        footer.style.zIndex = '10';
        footer.style.marginTop = `${scrollDistance}px`;
    }
    
    // Handle scroll event to translate the container horizontally
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const maxScroll = bodyHeight - window.innerHeight;
        const percentageScrolled = scrolled / maxScroll;
        
        // Apply horizontal translation
        const translateX = percentageScrolled * scrollDistance;
        horizontalContainer.style.transform = `translateX(-${translateX}px)`;
        
        // Update active section for visual effects
        const sectionIndex = Math.floor((translateX + (window.innerWidth / 2)) / window.innerWidth);
        sections.forEach((section, index) => {
            if (index === sectionIndex) {
                section.classList.add('section-visible');
            } else {
                section.classList.remove('section-visible');
            }
        });
        
        // REMOVE THIS LINE to keep background fixed:
        // document.body.style.backgroundPositionX = -(scrolled * 0.1) + 'px';
    });
    
    // Update on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            // Reset all styles and switch to mobile view
            horizontalWrapper.style.position = '';
            horizontalWrapper.style.height = '';
            horizontalContainer.style.width = '';
            horizontalContainer.style.transform = '';
            document.body.style.height = '';
            if (placeholder && placeholder.parentNode) {
                placeholder.parentNode.removeChild(placeholder);
            }
            if (footer) {
                footer.style.marginTop = '';
            }
            
            sections.forEach(section => {
                section.style.width = '';
            });
            
            return;
        }
        
        // Recalculate dimensions for desktop
        let newTotalWidth = 0;
        sections.forEach(section => {
            section.style.width = '100vw';
            newTotalWidth += section.offsetWidth;
        });
        
        horizontalContainer.style.width = `${newTotalWidth}px`;
        const newScrollDistance = newTotalWidth - window.innerWidth;
        const newBodyHeight = window.innerHeight + newScrollDistance;
        document.body.style.height = `${newBodyHeight}px`;
        placeholder.style.height = `${window.innerHeight}px`;
        
        if (footer) {
            footer.style.marginTop = `${newScrollDistance}px`;
        }
        
        // Trigger a scroll event to update the position
        window.dispatchEvent(new Event('scroll'));
    });
    
    // Initial scroll to top to ensure proper layout
    window.scrollTo(0, 0);
});

// New function to convert layout to vertical for mobile
function convertToVerticalLayout() {
    const horizontalWrapper = document.querySelector('.horizontal-wrapper');
    const horizontalContainer = document.querySelector('.horizontal-scroll-container');
    const sections = document.querySelectorAll('.horizontal-section');
    
    if (!horizontalWrapper || !horizontalContainer || !sections.length) return;
    
    // Reset fixed positioning
    horizontalWrapper.style.position = 'static';
    horizontalWrapper.style.height = 'auto';
    horizontalContainer.style.display = 'block';
    horizontalContainer.style.width = '100%';
    horizontalContainer.style.transform = 'none';
    
    // Make each section display vertically
    sections.forEach(section => {
        section.style.width = '100%';
        section.style.height = 'auto';
        section.style.minHeight = '100vh';
        section.classList.add('section-visible'); // Show all sections
    });
    
    // Fix any footer positioning issues
    const footer = document.querySelector('footer');
    if (footer) {
        footer.style.position = 'static';
        footer.style.marginTop = '0';
    }
}
