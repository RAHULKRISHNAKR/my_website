document.addEventListener('DOMContentLoaded', function() {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        convertToVerticalLayout();
        return;
    }

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

    // Remove any footer placeholder if it exists
    const existingFooterPlaceholder = document.querySelector('.footer-placeholder');
    if (existingFooterPlaceholder && existingFooterPlaceholder.parentNode) {
        existingFooterPlaceholder.parentNode.removeChild(existingFooterPlaceholder);
    }
    
    // Recalculate total width without footer placeholder
    horizontalContainer.style.width = `${totalWidth}px`;
    
    // Update scroll distance
    const updatedScrollDistance = totalWidth - window.innerWidth;
    document.body.style.height = `${window.innerHeight + updatedScrollDistance}px`;

    // Remove the footer completely
    const footer = document.querySelector('footer');
    if (footer && footer.parentNode) {
        footer.parentNode.removeChild(footer);
    }

    // Handle scroll event to translate the container horizontally
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const percentageScrolled = scrolled / maxScroll;

        // Apply horizontal translation with easing and enhanced smoothness
        const translateX = Math.min(percentageScrolled * updatedScrollDistance, updatedScrollDistance);
        const easeOutQuart = function(t) { return 1 - Math.pow(1 - t, 4); };
        const easeValue = easeOutQuart(percentageScrolled);
        
        // Apply transform with hardware acceleration and slight easing
        horizontalContainer.style.transform = `translate3d(-${translateX}px, 0, 0)`;

        // Update active section for visual effects with enhanced transitions
        const sectionIndex = Math.floor((translateX + (window.innerWidth / 2)) / window.innerWidth);
        sections.forEach((section, index) => {
            if (index === sectionIndex) {
                section.classList.add('section-visible');
                
                // Add staggered animation to section content children
                const sectionContent = section.querySelector('.section-content');
                if (sectionContent) {
                    // Calculate progressive translation based on scroll position within section
                    const sectionScrollProgress = (translateX - (index * window.innerWidth)) / window.innerWidth;
                    // Apply subtle movement based on scroll progress (parallax effect)
                    const moveAmount = 30 * (0.5 - sectionScrollProgress);
                    sectionContent.style.transform = `translate3d(${moveAmount}px, 0, 0)`;
                    
                    // Add animation delays to children for staggered effect
                    Array.from(sectionContent.children).forEach((child, i) => {
                        child.style.setProperty('--item-index', i);
                    });
                }
            } else {
                section.classList.remove('section-visible');
            }
        });
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
            document.body.style.overflow = '';
            
            if (placeholder && placeholder.parentNode) {
                placeholder.parentNode.removeChild(placeholder);
            }
            
            // Reset all section styles before converting to vertical
            sections.forEach(section => {
                section.style.width = '';
                section.style.height = '';
                section.style.minHeight = '';
                section.style.opacity = '';
                section.style.filter = '';
                section.style.transform = '';
                
                const sectionContent = section.querySelector('.section-content');
                if (sectionContent) {
                    sectionContent.style.transform = '';
                    sectionContent.style.opacity = '';
                }
            });

            // Apply mobile layout
            convertToVerticalLayout();
            return;
        }

        // Recalculate dimensions for desktop
        let newTotalWidth = 0;
        sections.forEach(section => {
            section.style.width = '100vw';
            newTotalWidth += section.offsetWidth;
        });
        
        // Account for footer placeholder
        newTotalWidth += window.innerWidth;
        
        horizontalContainer.style.width = `${newTotalWidth}px`;
        const newScrollDistance = newTotalWidth - window.innerWidth;
        const newBodyHeight = window.innerHeight + newScrollDistance;
        document.body.style.height = `${newBodyHeight}px`;
        placeholder.style.height = `${window.innerHeight}px`;

        // Update footer for new dimensions
        const footer = document.querySelector('footer');
        if (footer) {
            footer.style.position = 'fixed';
            footer.style.bottom = '0';
            footer.style.transform = 'translateY(100%)';
            footer.style.zIndex = '-1';
            footer.style.visibility = 'hidden';
            footer.style.opacity = '0';
            footer.style.transition = 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out';
        }

        // Trigger a scroll event to update the position
        window.dispatchEvent(new Event('scroll'));
    });

    // Initial scroll to top to ensure proper layout
    window.scrollTo(0, 0);
});

// Convert layout to vertical for mobile devices
function convertToVerticalLayout() {
    const horizontalWrapper = document.querySelector('.horizontal-wrapper');
    const horizontalContainer = document.querySelector('.horizontal-scroll-container');
    const sections = document.querySelectorAll('.horizontal-section');

    if (!horizontalWrapper || !horizontalContainer || !sections.length) return;

    // Make sure the wrapper doesn't have fixed positioning that would prevent scrolling
    horizontalWrapper.style.position = 'static';
    horizontalWrapper.style.height = 'auto';
    
    // Enable normal vertical flow
    horizontalContainer.style.display = 'block';
    horizontalContainer.style.width = '100%';
    horizontalContainer.style.transform = 'none';
    horizontalContainer.style.position = 'static';
    
    // Reset body height to auto to allow natural scrolling
    document.body.style.height = 'auto';
    document.body.style.overflow = 'auto';

    // Make all sections visible and properly sized for mobile
    sections.forEach(section => {
        section.style.width = '100%';
        section.style.height = 'auto';
        section.style.minHeight = '100vh';
        section.style.opacity = '1';
        section.style.filter = 'none';
        section.style.transform = 'none';
        section.classList.add('section-visible');
        
        // Make sure content is visible
        const sectionContent = section.querySelector('.section-content');
        if (sectionContent) {
            sectionContent.style.opacity = '1';
            sectionContent.style.transform = 'none';
        }
    });
}
