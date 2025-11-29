// Import Three.js libraries from reliable CDN
import * as THREE from 'https://esm.sh/three@0.156.0';
import { OrbitControls } from 'https://esm.sh/three@0.156.0/examples/jsm/controls/OrbitControls.js';

/* ------------------------------------------------------------
   1. Dynamic Initialization (Runs when the page is loaded)
------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
    setupModalLogic();
    setupTabLogic();
    setupTextAnimation();
    setupScrollReveal();
    setupVideoControl();
    setupMouseTrail();
    setupSignatureAnimation();
    setupProfileImage();
    setupInstagramEmbed();
    setupHeroCarousel(); // Enhanced hero with carousel
    setupProximityAnimations(); // New proximity effects
    
    // Handle direct navigation to hash URL
    if (window.location.hash) {
        const cardId = window.location.hash.substring(1);
        const targetPage = document.getElementById(`detail-${cardId}`);
        if (targetPage) {
            setTimeout(() => {
                const detailPages = document.getElementById('detail-pages');
                document.body.classList.add('detail-page-active');
                detailPages.classList.add('active');
                document.querySelectorAll('.detail-page').forEach(page => {
                    page.classList.remove('active');
                });
                targetPage.classList.add('active');
            }, 100);
        }
    }
});

/* ------------------------------------------------------------
   1b. Profile Image Setup (Google Photos Integration)
------------------------------------------------------------ */
const setupProfileImage = () => {
    const profileImg = document.getElementById('profile-picture');
    if (!profileImg) return;
    
    // Using placeholder for demo
    profileImg.onerror = () => {
         console.warn('Image failed to load, keeping placeholder');
    };
};

/* ------------------------------------------------------------
   2. Subpage Content (The Project Details)
------------------------------------------------------------ */

// --- A. Fine Arts Gallery Content ---
const getFineArtsContent = () => {
    return `
        <h4 class="text-accent">Hyperrealism and Shading Studies</h4>
        <p>This gallery showcases my mastery of light, shadow, and texture across various mediums, from graphite to digital painting.</p>
        
        <div class="modal-gallery">
            <div class="gallery-item">
                <img src="https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&w=800&q=80" alt="Graphite Portrait Study">
            </div>
            <div class="gallery-item">
                <img src="https://images.unsplash.com/photo-1515405295579-ba7f9f92f413?auto=format&fit=crop&w=800&q=80" alt="Digital Shading Study">
            </div>
            <div class="gallery-item">
                <img src="https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=800&q=80" alt="Hyperrealistic Eye Detail">
            </div>
            <div class="gallery-item">
                <img src="https://images.unsplash.com/photo-1582201942988-13e60e4556ee?auto=format&fit=crop&w=800&q=80" alt="Charcoal Figure Drawing">
            </div>
        </div>
    `;
};

// --- B. Video Editing Projects Content ---
const getVideoEditingContent = () => {
    return `
        <h4 class="text-accent">Dynamic Short-Form Content</h4>
        <p>Showcasing editing, motion tracking, and sound design skills for social and commercial campaigns.</p>
        <div style="background: rgba(0,0,0,0.5); padding: 2rem; text-align: center; border-radius: 8px; margin-top: 1rem;">
            <p>Video Embeds would appear here.</p>
        </div>
    `;
};

/* ------------------------------------------------------------
   3. Modal/Pop-up Logic
------------------------------------------------------------ */
// Global navigation function
window.navigateToMain = () => {
    const detailPages = document.getElementById('detail-pages');
    
    // Hide all detail pages
    document.querySelectorAll('.detail-page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show main content
    detailPages.classList.remove('active');
    document.body.classList.remove('detail-page-active');
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update URL without page reload
    try {
        if (window.history && window.history.pushState) {
            window.history.pushState({ page: 'main' }, '', window.location.pathname);
        }
    } catch (e) {
        console.warn('History API not supported in this environment', e);
    }
};

const setupModalLogic = () => {
    const workCards = document.querySelectorAll('.work-card');
    const detailPages = document.getElementById('detail-pages');

    const navigateToDetailPage = (cardId) => {
        // Hide main content
        document.body.classList.add('detail-page-active');
        
        // Show detail pages container
        detailPages.classList.add('active');
        
        // Hide all detail pages first
        document.querySelectorAll('.detail-page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show the specific detail page
        const targetPage = document.getElementById(`detail-${cardId}`);
        if (targetPage) {
            setTimeout(() => {
                targetPage.classList.add('active');
                // Scroll to top of detail page
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 50);
        }
        
        // Update URL
        try {
            if (window.history && window.history.pushState) {
                window.history.pushState({ page: cardId }, '', `#${cardId}`);
            }
        } catch (e) {
            console.warn('History API not supported in this environment', e);
        }
    };

    workCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const cardId = card.dataset.cardId;
            navigateToDetailPage(cardId);
        });
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', (e) => {
        if (window.location.hash) {
            const cardId = window.location.hash.substring(1);
            const targetPage = document.getElementById(`detail-${cardId}`);
            if (targetPage) {
                navigateToDetailPage(cardId);
            }
        } else {
            window.navigateToMain();
        }
    });
};

/* ------------------------------------------------------------
   4. Tab Switching Logic
------------------------------------------------------------ */
let scene, camera, renderer, controls, model, container;
const ACCENT_COLOR_1 = 0x0EA5E9; // Vivid Sky Blue
const ACCENT_COLOR_2 = 0x38BDF8; // Light Cyan
let is3DInitialized = false;

const init3D = () => {
    if (is3DInitialized) return;
    container = document.getElementById('canvas-container');
    if (!container || !window.WebGLRenderingContext) {
        const fallback = document.getElementById('canvas-fallback');
        if(fallback) fallback.style.display = 'block';
        return;
    }

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(ACCENT_COLOR_1, 3);
    spotLight.position.set(5, 5, 5);
    scene.add(spotLight);
    
    const rimLight = new THREE.PointLight(ACCENT_COLOR_2, 1.5);
    rimLight.position.set(-5, 2, -5);
    scene.add(rimLight);

    // Placeholder Geometric Shape (Torus Knot)
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0x1E293B, // Slate 800
        roughness: 0.2,
        metalness: 0.9,
    });
    model = new THREE.Mesh(geometry, material);
    scene.add(model);

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;

    // Interaction: Click to change material color
    renderer.domElement.addEventListener('click', () => {
        if (model && model.material) {
            const currentColor = model.material.color.getHex();
            const newColor = currentColor === 0x1E293B ? ACCENT_COLOR_1 : 0x1E293B;
            model.material.color.setHex(newColor);
        }
    });

    const animate = () => {
        requestAnimationFrame(animate);
        if (model) {
            model.rotation.y += 0.005;
        }
        controls.update();
        renderer.render(scene, camera);
    };

    animate();
    is3DInitialized = true;
    window.addEventListener('resize', onWindowResize);
};

const onWindowResize = () => {
    if (container && renderer && camera) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
};

const setupTabLogic = () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTabId = button.dataset.tab;

            // Deactivate all
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Activate clicked button and target content
            button.classList.add('active');
            document.getElementById(targetTabId).classList.add('active');
            
            // Special handling for the 3D tab
            if (targetTabId === '3d-models') {
                if (!is3DInitialized) {
                    init3D();
                } else {
                    setTimeout(onWindowResize, 100); // Recalculate size
                }
            }
        });
    });
    
    // Initialize 3D on page load if the 3D tab is the active one (default)
    if (document.querySelector('.tab-button.active')?.dataset.tab === '3d-models') {
        init3D();
    }
};

/* ------------------------------------------------------------
   5. Dynamic Text Animation
------------------------------------------------------------ */
const setupTextAnimation = () => {
    const headline = document.querySelector('.animated-text');
    if (!headline) return;

    const words = headline.dataset.animatedWords.split(',');
    const targetElements = headline.querySelectorAll('.word-switcher');
    let wordIndex = 0;

    const switchWord = () => {
        if (!targetElements || targetElements.length === 0) return;

        targetElements.forEach((element, index) => {
            if (index === targetElements.length - 1) {
                wordIndex = (wordIndex + 1) % words.length;
                const nextWord = words[wordIndex].trim();
                
                element.style.opacity = '0';
                element.style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    element.textContent = nextWord;
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 300);
            }
        });
    };

    setTimeout(() => {
        setInterval(switchWord, 4000);
    }, 2000);
    
    animateSectionHeaders();
};

/* ------------------------------------------------------------
   5b. Letter-by-Letter Animation for Headers
------------------------------------------------------------ */
const animateSectionHeaders = () => {
    const headers = document.querySelectorAll('.section-header h2');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                animateHeaderLetters(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    headers.forEach(header => {
        observer.observe(header);
    });
};

const animateHeaderLetters = (header) => {
    const text = header.textContent.trim();
    header.textContent = '';
    header.style.opacity = '1';
    header.style.transform = 'none';
    
    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(20px) rotateX(90deg)';
        header.appendChild(span);
        
        setTimeout(() => {
            span.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            span.style.opacity = '1';
            span.style.transform = 'translateY(0) rotateX(0deg)';
        }, index * 50);
    });
};

/* ------------------------------------------------------------
   6. Scroll Reveal
------------------------------------------------------------ */
const setupScrollReveal = () => {
    const setupObserver = (selector, className, delay = 0, options = {}) => {
        const elements = document.querySelectorAll(selector);
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add(className);
                        if (options.onReveal) {
                            options.onReveal(entry.target);
                        }
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: options.threshold || 0.2,
            rootMargin: options.rootMargin || '0px'
        });

        elements.forEach((el, index) => {
            el.classList.add('hidden-reveal');
            observer.observe(el);
        });
    };

    setupObserver('.work-card:nth-child(1)', 'visible-reveal', 0);
    setupObserver('.work-card:nth-child(2)', 'visible-reveal', 150);
    setupObserver('.work-card:nth-child(3)', 'visible-reveal', 300);
    setupObserver('.work-card:nth-child(4)', 'visible-reveal', 450);
    setupObserver('.work-card:nth-child(5)', 'visible-reveal', 600);
    
    setupObserver('.process-steps li', 'visible-reveal', 100, {
        onReveal: (element) => {
            element.style.transition = 'all 0.5s ease-out';
        }
    });
    
    setupObserver('.section-header', 'visible-reveal', 0, {
        threshold: 0.3,
        onReveal: (element) => {
            const h2 = element.querySelector('h2');
            const line = element.querySelector('.line');
            if (h2) h2.style.animation = 'slideInFromLeft 0.8s ease-out forwards';
            if (line) setTimeout(() => { line.style.animation = 'lineExpand 1s ease-out forwards'; }, 500);
        }
    });
    
    setupObserver('.about-text h2', 'visible-reveal', 0);
    setupObserver('.about-text .lead', 'visible-reveal', 200);
    setupObserver('.about-text p', 'visible-reveal', 400);
    setupObserver('.social-links a', 'visible-reveal', 600, {
        onReveal: (element) => {
            element.style.transition = 'all 0.3s ease';
        }
    });
    
    setupObserver('.contact-methods', 'visible-reveal', 0);
    setupObserver('.contact-form', 'visible-reveal', 300);
    setupObserver('#instagram-showcase', 'visible-reveal', 0);
};

/* ------------------------------------------------------------
   6c. Instagram Embed Setup
------------------------------------------------------------ */
const setupInstagramEmbed = () => {
    const instagramContainer = document.getElementById('instagram-embed-container');
    if (!instagramContainer) return;

    let embedLoaded = false;
    const loadInstagramEmbed = () => {
        if (embedLoaded) return;
        embedLoaded = true;

        const checkInstagramScript = setInterval(() => {
            if (window.instgrm) {
                clearInterval(checkInstagramScript);
                window.instgrm.Embeds.process();
            }
        }, 100);
        setTimeout(() => clearInterval(checkInstagramScript), 5000);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !embedLoaded) {
                loadInstagramEmbed();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3, rootMargin: '100px' });

    observer.observe(instagramContainer);
};

/* ------------------------------------------------------------
   6b. Signature Animation
------------------------------------------------------------ */
const setupSignatureAnimation = () => {
    const signatureContainer = document.querySelector('.signature-container');
    const signatureText = document.getElementById('signature-text');
    const signatureUnderline = document.querySelector('.signature-underline');
    
    if (!signatureContainer || !signatureText) return;

    const animateSignatureLetters = () => {
        const text = signatureText.textContent.trim();
        const letterCount = text.length;
        signatureText.innerHTML = '';
        
        const letters = text.split('');
        letters.forEach((char, index) => {
            const span = document.createElement('span');
            span.className = 'signature-letter';
            if (char === ' ') {
                span.className += ' space';
                span.innerHTML = '\u00A0';
            } else {
                span.textContent = char;
            }
            signatureText.appendChild(span);
            
            setTimeout(() => {
                span.classList.add('animate');
            }, 200 + (index * 80)); 
        });
        
        return letterCount;
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                signatureContainer.classList.add('visible');
                
                setTimeout(() => {
                    signatureText.classList.add('visible');
                    setTimeout(() => {
                        const letterCount = animateSignatureLetters();
                        const totalLetterDelay = 200 + (letterCount * 80);
                        setTimeout(() => {
                            signatureUnderline.classList.add('animate');
                            signatureUnderline.style.animation = 'underlineDraw 1.5s ease-out forwards';
                        }, totalLetterDelay + 300);
                    }, 300);
                }, 200);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3, rootMargin: '0px 0px -100px 0px' });

    const signatureSection = document.getElementById('signature');
    if (signatureSection) observer.observe(signatureSection);
};

/* ------------------------------------------------------------
   7. Video Control & Mouse Trail
------------------------------------------------------------ */
const setupVideoControl = () => {
    const video = document.getElementById('hero-video');
    const videoBtn = document.getElementById('video-toggle');

    if (!video || !videoBtn) return;

    let volumeSet = false;
    const setVolume = () => {
        if (!volumeSet && video.volume !== undefined) {
            video.volume = 0.7;
            volumeSet = true;
        }
    };
    
    const updateButtonText = () => {
        if (video.paused) {
            videoBtn.textContent = "Play Video";
            videoBtn.setAttribute('aria-label', 'Play background video');
        } else {
            videoBtn.textContent = "Pause Video";
            videoBtn.setAttribute('aria-label', 'Pause background video');
        }
    };

    updateButtonText();

    videoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        video.muted = false; // Enable audio on user interaction
        
        if (video.paused) {
            video.play().catch(e => console.log(e));
        } else {
            video.pause();
        }
        updateButtonText();
    });

    video.addEventListener('play', updateButtonText);
    video.addEventListener('pause', updateButtonText);
};

/* ------------------------------------------------------------
   Hero Carousel Setup
------------------------------------------------------------ */
const setupHeroCarousel = () => {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;

    let currentSlide = 0;
    const slideInterval = 5000;

    const nextSlide = () => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    };

    setInterval(nextSlide, slideInterval);
};

const setupMouseTrail = () => {
    const container = document.getElementById('mouse-trail-container');
    if (!container || window.innerWidth < 768) return;

    const createDot = (x, y) => {
        const dot = document.createElement('div');
        dot.className = 'trail-dot';
        dot.style.left = `${x}px`;
        dot.style.top = `${y}px`;
        container.appendChild(dot);

        setTimeout(() => {
            dot.style.opacity = '0';
            dot.style.transform = 'scale(0.5)';
            setTimeout(() => dot.remove(), 500);
        }, 100);
    };

    document.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.6) {
            createDot(e.clientX, e.clientY);
        }
    });
};

/* ------------------------------------------------------------
   8. Proximity Animations (New)
------------------------------------------------------------ */
const setupProximityAnimations = () => {
    // 1. Magnetic Buttons
    const magneticElements = document.querySelectorAll('.btn, .nav-links a, .logo');
    
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Move the element slightly towards the mouse (20% of distance)
            el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            el.style.transition = 'transform 0.1s ease-out';
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
            el.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
    });

    // 2. Card Spotlight / Proximity Glow
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
};