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

    // 2. Language Selection Logic
    const langBtns = document.querySelectorAll('.lang-btn');
    const typingTarget = document.getElementById('typing-target');
    let typingTimeout;
    let holdTimeout;
    
    const getTypingSegments = () => {
        const lang = document.documentElement.getAttribute('lang') || 'en';
        if (lang === 'ko') {
            return ['출처 기반 RAG', '디커플링 시스템', 'AI 가속기'];
        }
        return ['Grounded RAG', 'Decoupled Systems', 'AI Accelerators'];
    };

    let segments = getTypingSegments();
    let segmentIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeEffect = () => {
        const currentSegment = segments[segmentIndex];
        
        if (isDeleting) {
            // Remove a character
            typingTarget.textContent = currentSegment.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                segmentIndex = (segmentIndex + 1) % segments.length;
                typingTimeout = setTimeout(typeEffect, 500); // Pause before next word
            } else {
                typingTimeout = setTimeout(typeEffect, 30); // Deleting speed
            }
        } else {
            // Add a character
            typingTarget.textContent = currentSegment.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentSegment.length) {
                isDeleting = true;
                typingTimeout = setTimeout(typeEffect, 2000); // Hold full word before deleting
            } else {
                typingTimeout = setTimeout(typeEffect, 65); // Typing speed
            }
        }
    };

    // Initialize language
    const initLanguage = () => {
        const lang = localStorage.getItem('portfolio-lang') || 'en';
        document.documentElement.setAttribute('lang', lang);
        langBtns.forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        segments = getTypingSegments();
        segmentIndex = 0;
        charIndex = 0;
        isDeleting = false;
        typingTarget.textContent = '';
        typingTimeout = setTimeout(typeEffect, 1000); // 1s delay on initial load
    };

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedLang = btn.getAttribute('data-lang');
            if (document.documentElement.getAttribute('lang') !== selectedLang) {
                document.documentElement.setAttribute('lang', selectedLang);
                localStorage.setItem('portfolio-lang', selectedLang);
                
                langBtns.forEach(b => {
                    if (b.getAttribute('data-lang') === selectedLang) {
                        b.classList.add('active');
                    } else {
                        b.classList.remove('active');
                    }
                });
                
                // Cancel existing timeouts and restart typing
                clearTimeout(typingTimeout);
                clearTimeout(holdTimeout);
                typingTarget.textContent = '';
                segments = getTypingSegments();
                segmentIndex = 0;
                charIndex = 0;
                isDeleting = false;
                typeEffect();
            }
        });
    });

    initLanguage();

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
                    const lang = document.documentElement.getAttribute('lang') || 'en';
                    // Show toast notification
                    toast.textContent = lang === 'ko' ? '이메일 주소가 복사되었습니다!' : 'Email copied to clipboard!';
                    toast.classList.add('show');
                    
                    // Change button text temporarily
                    const originalText = copyEmailBtn.textContent;
                    copyEmailBtn.textContent = lang === 'ko' ? '복사됨!' : 'Copied!';
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
