/**
 * Jin Minjae's Portfolio Website
 * JavaScript Interactivity & Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. Header Scroll Blur Effect
    // -------------------------------------------------------------------------
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // -------------------------------------------------------------------------
    // 2. Typing Rotating Words & Language Management
    // -------------------------------------------------------------------------
    const langBtns = document.querySelectorAll('.lang-btn');
    const typingTarget = document.getElementById('typing-target');
    let typingTimeout;
    let holdTimeout;
    
    const TYPING_SEGMENTS = {
        ko: ['에이전트 워크플로우', '출처 기반 RAG', 'AI 가속기'],
        en: ['Agentic Workflows', 'Grounded RAG', 'AI Accelerators']
    };

    const getTypingSegments = () => {
        const lang = document.documentElement.getAttribute('lang') || 'en';
        return TYPING_SEGMENTS[lang] || TYPING_SEGMENTS.en;
    };

    let segments = getTypingSegments();
    let segmentIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeEffect = () => {
        const currentSegment = segments[segmentIndex];
        
        if (isDeleting) {
            typingTarget.textContent = currentSegment.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                segmentIndex = (segmentIndex + 1) % segments.length;
                typingTimeout = setTimeout(typeEffect, 400);
            } else {
                typingTimeout = setTimeout(typeEffect, 35);
            }
        } else {
            typingTarget.textContent = currentSegment.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentSegment.length) {
                isDeleting = true;
                typingTimeout = setTimeout(typeEffect, 2000);
            } else {
                typingTimeout = setTimeout(typeEffect, 75);
            }
        }
    };

    const setLanguage = (lang) => {
        document.documentElement.setAttribute('lang', lang);
        localStorage.setItem('portfolio-lang', lang);
        
        langBtns.forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        clearTimeout(typingTimeout);
        clearTimeout(holdTimeout);
        typingTarget.textContent = '';
        segments = getTypingSegments();
        segmentIndex = 0;
        charIndex = 0;
        isDeleting = false;
        typeEffect();
    };

    const initLanguage = () => {
        const savedLang = localStorage.getItem('portfolio-lang') || 'en';
        document.documentElement.setAttribute('lang', savedLang);
        langBtns.forEach(btn => {
            if (btn.getAttribute('data-lang') === savedLang) {
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
        typingTimeout = setTimeout(typeEffect, 800);
    };

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedLang = btn.getAttribute('data-lang');
            if (document.documentElement.getAttribute('lang') !== selectedLang) {
                setLanguage(selectedLang);
            }
        });
    });

    initLanguage();

    // -------------------------------------------------------------------------
    // 3. Scroll Reveal Animations (Intersection Observer)
    // -------------------------------------------------------------------------
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach(element => element.classList.add('active'));
    }

    // -------------------------------------------------------------------------
    // 4. Navigation Active Section Highlighter
    // -------------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if ('IntersectionObserver' in window) {
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
            threshold: 0.4
        });

        sections.forEach(section => {
            navObserver.observe(section);
        });
    }

    // -------------------------------------------------------------------------
    // 5. Copy Email Utility & Toast Notification
    // -------------------------------------------------------------------------
    const copyEmailBtn = document.getElementById('btn-copy-email');
    const emailValue = document.getElementById('email-value')?.textContent || 'wlsalswo14@gmail.com';
    const toast = document.getElementById('toast');

    if (copyEmailBtn && toast) {
        copyEmailBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(emailValue)
                .then(() => {
                    const lang = document.documentElement.getAttribute('lang') || 'en';
                    toast.textContent = lang === 'ko' ? '이메일 주소가 복사되었습니다!' : 'Email copied to clipboard!';
                    toast.classList.add('show');
                    
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

    // -------------------------------------------------------------------------
    // 6. Interactive Mouse Glow Accent (Throttled with rAF)
    // -------------------------------------------------------------------------
    const orb1 = document.querySelector('.orb-1');
    const orb2 = document.querySelector('.orb-2');

    if (orb1 && orb2) {
        let mouseX = 0;
        let mouseY = 0;
        let isMoving = false;

        const updateOrbs = () => {
            const moveX = (mouseX / window.innerWidth - 0.5) * 40;
            const moveY = (mouseY / window.innerHeight - 0.5) * 40;
            
            orb1.style.transform = `translate(${moveX}px, ${moveY}px)`;
            orb2.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
            isMoving = false;
        };

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!isMoving) {
                isMoving = true;
                requestAnimationFrame(updateOrbs);
            }
        }, { passive: true });
    }
});\n