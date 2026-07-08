/**
 * Jin Minjae's Portfolio Website
 * JavaScript Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Header Scroll Effect
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once in case page is refreshed while scrolled

    // 2. Typing Effect for Hero Subtitle
    const typingTarget = document.getElementById('typing-target');
    typingTarget.textContent = ''; // Clear static HTML placeholder text
    const segments = ['Grounded RAG', ', Decoupled Systems', ', AI Accelerators'];
    let segmentIndex = 0;
    let charIndex = 0;

    const typeEffect = () => {
        if (segmentIndex < segments.length) {
            const currentSegment = segments[segmentIndex];
            
            if (charIndex < currentSegment.length) {
                // Type next character
                typingTarget.textContent += currentSegment.charAt(charIndex);
                charIndex++;
                setTimeout(typeEffect, 65); // Speed of typing letters (1.5x faster, ~65ms)
            } else {
                // Segment completed, pause shortly before next segment
                segmentIndex++;
                charIndex = 0;
                setTimeout(typeEffect, 300); // Pause between items (1.5x faster, ~300ms)
            }
        } else {
            // All segments completed, pause before clearing
            setTimeout(() => {
                // Clear all at once
                typingTarget.textContent = '';
                segmentIndex = 0;
                charIndex = 0;
                // Wait before starting the cycle again
                setTimeout(typeEffect, 800);
            }, 3900); // Hold full text for 3.9 seconds (1.3x longer)
        }
    };

    // Start typing effect after initial fade-in animations finish
    setTimeout(typeEffect, 1000);

    // 3. Scroll Reveal (Intersection Observer)
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Once it is revealed, we don't need to observe it anymore
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: '0px 0px -50px 0px' // Offset trigger point slightly
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // 4. Navigation Menu Active Link Highlighter on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.5 // Trigger when section is 50% in view
    });

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // 5. Copy Email Utility
    const copyEmailBtn = document.getElementById('btn-copy-email');
    const emailValue = document.getElementById('email-value').textContent;
    const toast = document.getElementById('toast');

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(emailValue)
                .then(() => {
                    // Show toast notification
                    toast.classList.add('show');
                    
                    // Change button text temporarily
                    const originalText = copyEmailBtn.textContent;
                    copyEmailBtn.textContent = 'Copied!';
                    copyEmailBtn.style.background = 'var(--color-cyan)';
                    copyEmailBtn.style.color = 'var(--bg-darkest)';
                    copyEmailBtn.style.borderColor = 'var(--color-cyan)';

                    setTimeout(() => {
                        toast.classList.remove('show');
                        copyEmailBtn.textContent = originalText;
                        copyEmailBtn.style.background = '';
                        copyEmailBtn.style.color = '';
                        copyEmailBtn.style.borderColor = '';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                });
        });
    }

    // 6. Interactive Mouse Glow Accent (Futuristic feel)
    const orb1 = document.querySelector('.orb-1');
    const orb2 = document.querySelector('.orb-2');

    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Softly move the background glowing orbs in response to mouse movement
        if (orb1 && orb2) {
            // Target coordinates calculated as a fraction of window width/height
            const moveX = (mouseX / window.innerWidth - 0.5) * 40; // max 20px displacement
            const moveY = (mouseY / window.innerHeight - 0.5) * 40;
            
            orb1.style.transform = `translate(${moveX}px, ${moveY}px)`;
            orb2.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
        }
    });
});
