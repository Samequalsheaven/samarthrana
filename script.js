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
    setupAudioPlayer(); // Audio player
    setupDecoShapes(); // Decorative shapes
    
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

    // Instagram post URL
    const instagramPostUrl = 'https://www.instagram.com/p/DNRVew2Tebm/';
    
    const instagramMediaUrl = `https://www.instagram.com/p/DNRVew2Tebm/media/?size=l`;
    
    let attemptCount = 0;
    const fallbacks = [
        profileImg.src,   // Current source (try first)
        'assets/images/Consistency.jpg' // Local fallback (updated path)
    ];
    
    profileImg.onerror = () => {
        attemptCount++;
        if (attemptCount < fallbacks.length) {
            console.warn(`Image source ${attemptCount} failed. Trying fallback ${attemptCount + 1}.`);
            profileImg.src = fallbacks[attemptCount];
        } else {
            // All sources failed, show placeholder
            console.error('All image sources failed to load.');
            profileImg.style.display = 'none';
            if (!profileImg.parentElement.querySelector('.placeholder-avatar')) {
                const placeholder = document.createElement('div');
                placeholder.className = 'placeholder-avatar';
                placeholder.textContent = 'SR';
                profileImg.parentElement.appendChild(placeholder);
            }
        }
    };
    
    // Add crossOrigin attribute to handle CORS if needed
    profileImg.crossOrigin = 'anonymous';
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
                <img src="assets/images/placeholder-fineart-1.jpg" alt="Graphite Portrait Study">
            </div>
            <div class="gallery-item">
                <img src="assets/images/placeholder-fineart-2.jpg" alt="Digital Shading Study">
            </div>
            <div class="gallery-item">
                <img src="assets/images/placeholder-fineart-3.jpg" alt="Hyperrealistic Eye Detail">
            </div>
            <div class="gallery-item">
                <img src="assets/images/placeholder-fineart-4.jpg" alt="Charcoal Figure Drawing">
            </div>
        </div>
        <p style="margin-top: 1rem; color: var(--red-400);">**Note:** Update image paths in assets/images with your actual artwork.</p>
    `;
};

// --- B. Video Editing Projects Content ---
const getVideoEditingContent = () => {
    const instagramEmbedCode = `
        <div class="video-embed-container" style="max-width: 400px; margin: 0 auto;">
            <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&mute=1" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>
        </div>
        <p class="text-center" style="margin-top: 1rem;">This is a placeholder video. You can embed your **Instagram Reels** directly here using their embed code, or link out to YouTube/Vimeo.</p>
        <p class="text-center"><a href="https://www.instagram.com/your_reel_page" target="_blank" class="btn btn-outline" style="margin-top: 1rem;">Visit My Instagram Reels Page &rarr;</a></p>
    `;

    return `
        <h4 class="text-accent">Dynamic Short-Form Content</h4>
        <p>Showcasing editing, motion tracking, and sound design skills for social and commercial campaigns.</p>
        ${instagramEmbedCode}
    `;
};

// --- C. General Content Resolver ---
const getSubpageContent = (id) => {
    switch (id) {
        case 'fine-arts':
            return getFineArtsContent();
        case 'video-editing':
            return getVideoEditingContent();
        case 'colored-works':
            return '<h4>Vibrant Digital Illustrations</h4><p>Details on color palettes, mood, and digital mediums used for this set of works will go here. You can use the same modal-gallery grid here!</p>';
        case 'product-design':
            return '<h4>Industrial Design Case Study: Project X</h4><p>Detailed breakdown of concept ideation, CAD development, material selection, and DFM principles. Include renderings here.</p>';
        case 'motion-graphics':
            return '<h4>VFX & Animation Breakdown</h4><p>This area will feature embedded YouTube/Vimeo links showing the final motion pieces, along with a text breakdown of the software and effects used.</p>';
        default:
            return '<p>Content not found. Please check the project ID.</p>';
    }
};

/* ------------------------------------------------------------
   3. Modal/Pop-up Logic
------------------------------------------------------------ */
// Global navigation function
window.navigateToMain = () => {
    const detailPages = document.getElementById('detail-pages');
    const mainContent = document.querySelector('body > *:not(#detail-pages):not(script)');
    
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
    if (window.history && window.history.pushState) {
        window.history.pushState({ page: 'main' }, '', window.location.pathname);
    }
};

const setupModalLogic = () => {
    const viewButtons = document.querySelectorAll('.view-button');
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
        if (window.history && window.history.pushState) {
            window.history.pushState({ page: cardId }, '', `#${cardId}`);
        }
    };

    // Make entire card clickable
    workCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking on a link
            if (e.target.tagName === 'A') return;
            const cardId = card.dataset.cardId;
            navigateToDetailPage(cardId);
        });
    });

    viewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const card = button.closest('.work-card');
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
            navigateToMain();
        }
    });
};

/* ------------------------------------------------------------
   4. Tab Switching Logic
------------------------------------------------------------ */
let scene, camera, renderer, controls, model, container;
const ACCENT_COLOR_1 = 0xD8005A; // Vivid Magenta
const ACCENT_COLOR_2 = 0xEF90BE; // Radiant Pink
let is3DInitialized = false;

const init3D = () => {
    if (is3DInitialized) return;
    container = document.getElementById('canvas-container');
    if (!container || !window.WebGLRenderingContext) {
        document.getElementById('canvas-fallback').style.display = 'block';
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
        color: 0x3B1B1B, // Dark Ruby
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
            const newColor = currentColor === 0x3B1B1B ? ACCENT_COLOR_1 : 0x3B1B1B;
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
    if (container) {
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
            
            // Special handling for the 3D tab: only initialize Three.js when needed
            if (targetTabId === '3d-models' && !is3DInitialized) {
                init3D();
            }
        });
    });
    
    // Initialize 3D on page load if the 3D tab is the active one (default)
    if (document.querySelector('.tab-button.active')?.dataset.tab === '3d-models') {
        init3D();
    }
};

/* ------------------------------------------------------------
   5. Dynamic Text Animation (Word Switching with Smooth Transitions)
------------------------------------------------------------ */
const setupTextAnimation = () => {
    const headline = document.querySelector('.animated-text');
    if (!headline) return;

    const words = headline.dataset.animatedWords.split(',');
    const targetElements = headline.querySelectorAll('.word-switcher');
    let wordIndex = 0;

    const switchWord = () => {
        if (!targetElements || targetElements.length === 0) return;

        // Animate all word switchers
        targetElements.forEach((element, index) => {
            if (index === targetElements.length - 1) {
                // Last word switcher cycles through words
                wordIndex = (wordIndex + 1) % words.length;
                const nextWord = words[wordIndex].trim();
                
                // Fade out, change text, fade in
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

    // Start switching after initial animation completes
    setTimeout(() => {
        setInterval(switchWord, 4000);
    }, 2000);
    
    // Add letter-by-letter animation to section headers
    animateSectionHeaders();
};

/* ------------------------------------------------------------
   5b. Letter-by-Letter Animation for Headers (Scroll-triggered)
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
   6. Scroll Reveal (Entrance Animations with Enhanced Effects)
------------------------------------------------------------ */
const setupScrollReveal = () => {
    const setupObserver = (selector, className, delay = 0, options = {}) => {
        const elements = document.querySelectorAll(selector);
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add(className);
                        // Add additional animation effects
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

    // Apply reveal to work cards (staggered entrance)
    setupObserver('.work-card:nth-child(1)', 'visible-reveal', 0);
    setupObserver('.work-card:nth-child(2)', 'visible-reveal', 150);
    setupObserver('.work-card:nth-child(3)', 'visible-reveal', 300);
    setupObserver('.work-card:nth-child(4)', 'visible-reveal', 450);
    setupObserver('.work-card:nth-child(5)', 'visible-reveal', 600);
    
    // Apply reveal to process steps with slide-in effect
    setupObserver('.process-steps li', 'visible-reveal', 100, {
        onReveal: (element) => {
            element.style.transition = 'all 0.5s ease-out';
        }
    });
    
    // Animate section headers on scroll
    setupObserver('.section-header', 'visible-reveal', 0, {
        threshold: 0.3,
        onReveal: (element) => {
            const h2 = element.querySelector('h2');
            const line = element.querySelector('.line');
            if (h2) {
                h2.style.animation = 'slideInFromLeft 0.8s ease-out forwards';
            }
            if (line) {
                setTimeout(() => {
                    line.style.animation = 'lineExpand 1s ease-out forwards';
                }, 500);
            }
        }
    });
    
    // Animate about section elements
    setupObserver('.about-text h2', 'visible-reveal', 0);
    setupObserver('.about-text .lead', 'visible-reveal', 200);
    setupObserver('.about-text p', 'visible-reveal', 400);
    setupObserver('.social-links a', 'visible-reveal', 600, {
        onReveal: (element) => {
            element.style.transition = 'all 0.3s ease';
        }
    });
    
    // Animate contact form elements
    setupObserver('.contact-methods', 'visible-reveal', 0);
    setupObserver('.contact-form', 'visible-reveal', 300);
    
    // Animate Instagram showcase section
    setupObserver('#instagram-showcase', 'visible-reveal', 0);
};

/* ------------------------------------------------------------
   6c. Instagram Embed Setup (Scroll-triggered)
------------------------------------------------------------ */
const setupInstagramEmbed = () => {
    // No longer needed as we are using a video preview
};

/* ------------------------------------------------------------
   6b. Signature Animation (Scroll-triggered)
------------------------------------------------------------ */
const setupSignatureAnimation = () => {
    const signatureSection = document.getElementById('signature');
    const signatureSvg = document.getElementById('signature-svg');
    const signatureUnderline = document.querySelector('.signature-underline');

    if (!signatureSection || !signatureSvg) {
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';

                // Add class to trigger animation
                signatureSvg.classList.add('animate');

                // Animate underline after the path animation
                setTimeout(() => {
                    signatureUnderline.classList.add('animate');
                }, 2000); // Delay should match the animation duration
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5,
    });

    observer.observe(signatureSection);
};

/* ------------------------------------------------------------
   7. Video Control & Mouse Trail
------------------------------------------------------------ */
const setupVideoControl = () => {
    const video = document.getElementById('hero-video');
    const videoBtn = document.getElementById('video-toggle');

    if (!video || !videoBtn) {
        console.warn('Video or video button not found');
        return;
    }

    // Set initial volume (0.7 = 70% volume) - will be applied when unmuted
    let volumeSet = false;
    const setVolume = () => {
        if (!volumeSet && video.volume !== undefined) {
            video.volume = 0.7;
            volumeSet = true;
        }
    };

    // Track if audio has been enabled by user
    let audioEnabled = false;

    // Enable audio on first user interaction (required by browser autoplay policies)
    const enableAudio = () => {
        if (!audioEnabled) {
            video.muted = false;
            setVolume();
            audioEnabled = true;
            console.log('Audio enabled');
        }
    };

    // Update button text based on video state
    const updateButtonText = () => {
        if (video.paused) {
            videoBtn.textContent = "Play Video";
            videoBtn.setAttribute('aria-label', 'Play background video');
        } else {
            videoBtn.textContent = "Pause Video";
            videoBtn.setAttribute('aria-label', 'Pause background video');
        }
    };

    // Set initial button text
    updateButtonText();

    // Handle play/pause toggle
    videoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Enable audio on first click
        enableAudio();
        
        try {
            if (video.paused) {
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            console.log('Video playing');
                            updateButtonText();
                        })
                        .catch(error => {
                            console.error('Error playing video:', error);
                            // Try again with audio enabled
                            video.muted = false;
                            video.play()
                                .then(() => {
                                    updateButtonText();
                                })
                                .catch(err => {
                                    console.error('Error after unmuting:', err);
                                    alert('Unable to play video. Please check your browser settings.');
                                });
                        });
                } else {
                    updateButtonText();
                }
            } else {
                video.pause();
                console.log('Video paused');
                updateButtonText();
            }
        } catch (error) {
            console.error('Error toggling video:', error);
        }
    });

    // Enable audio on any user interaction (click anywhere on page)
    // This is required by browser autoplay policies - audio can only play after user interaction
    const enableAudioOnInteraction = () => {
        enableAudio();
    };

    // Listen for user interactions to enable audio (once: true auto-removes after first call)
    document.addEventListener('click', enableAudioOnInteraction, { once: true });
    document.addEventListener('touchstart', enableAudioOnInteraction, { once: true });
    document.addEventListener('keydown', enableAudioOnInteraction, { once: true });

    // Update button text when video state changes
    video.addEventListener('play', () => {
        updateButtonText();
        enableAudio(); // Ensure audio is enabled when playing
    });
    video.addEventListener('pause', updateButtonText);
    video.addEventListener('ended', updateButtonText);

    // Set volume when video metadata is loaded
    video.addEventListener('loadedmetadata', () => {
        setVolume();
    });
};

/* ------------------------------------------------------------
   Hero Carousel Setup (Optional visual enhancement)
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

/* Audio Player Setup */
const setupAudioPlayer = () => {
    const musicToggle = document.getElementById('music-toggle');
    const audioPlayer = document.getElementById('audio-player');
    const audioElement = document.getElementById('audio-element');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    const closeBtn = document.getElementById('close-player');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const playerHeader = document.querySelector('.audio-player-header');

    // Set audio source to Akai audio file
    audioElement.src = 'assets/audio/Akai.m4a';

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    let repeatMode = 0; // 0 = no repeat, 1 = repeat all, 2 = repeat one

    // Toggle player visibility
    musicToggle.addEventListener('click', () => {
        audioPlayer.style.display = audioPlayer.style.display === 'none' ? 'block' : 'none';
    });

    // Close player
    closeBtn.addEventListener('click', () => {
        audioPlayer.style.display = 'none';
    });

    // Play button
    playBtn.addEventListener('click', () => {
        audioElement.play();
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'flex';
    });

    // Pause button
    pauseBtn.addEventListener('click', () => {
        audioElement.pause();
        pauseBtn.style.display = 'none';
        playBtn.style.display = 'flex';
    });

    // Repeat button
    repeatBtn.addEventListener('click', () => {
        repeatMode = (repeatMode + 1) % 3;
        if (repeatMode === 0) {
            repeatBtn.style.color = 'rgba(0, 217, 255, 0.6)';
            repeatBtn.style.background = 'rgba(0, 217, 255, 0.2)';
            repeatBtn.title = 'Repeat: Off';
        } else if (repeatMode === 1) {
            repeatBtn.style.color = '#00D9FF';
            repeatBtn.style.background = 'rgba(0, 217, 255, 0.4)';
            repeatBtn.title = 'Repeat: All';
        } else {
            repeatBtn.style.color = '#FF1744';
            repeatBtn.style.background = 'rgba(255, 23, 68, 0.3)';
            repeatBtn.title = 'Repeat: One';
        }
    });

    // Handle song end for repeat
    audioElement.addEventListener('ended', () => {
        if (repeatMode === 1) {
            // Repeat all - restart the song
            audioElement.currentTime = 0;
            audioElement.play();
        } else if (repeatMode === 2) {
            // Repeat one - restart immediately
            audioElement.currentTime = 0;
            audioElement.play();
        }
    });

    // Update progress bar
    audioElement.addEventListener('timeupdate', () => {
        if (audioElement.duration) {
            const percent = (audioElement.currentTime / audioElement.duration) * 100;
            progressBar.style.width = percent + '%';
            currentTimeEl.textContent = formatTime(audioElement.currentTime);
        }
    });

    // Set duration
    audioElement.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audioElement.duration);
    });

    // Seek functionality - click anywhere on progress bar to jump to that time
    const progressContainer = document.querySelector('.audio-progress');
    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        const newTime = percentage * audioElement.duration;
        audioElement.currentTime = newTime;
    });

    // Draggable functionality
    playerHeader.addEventListener('mousedown', (e) => {
        isDragging = true;
        const rect = audioPlayer.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            audioPlayer.style.left = (e.clientX - offsetX) + 'px';
            audioPlayer.style.top = (e.clientY - offsetY) + 'px';
            audioPlayer.style.right = 'auto';
            audioPlayer.style.bottom = 'auto';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Resizable functionality
    const resizeHandle = document.getElementById('resize-handle');
    let isResizing = false;
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;

    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = audioPlayer.offsetWidth;
        startHeight = audioPlayer.offsetHeight;
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (isResizing) {
            const newWidth = startWidth + (e.clientX - startX);
            const newHeight = startHeight + (e.clientY - startY);

            if (newWidth >= 280) audioPlayer.style.width = newWidth + 'px';
            audioPlayer.style.height = newHeight + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isResizing = false;
    });

    // Format time helper
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
};

/* Decorative Shapes & Lines Setup */
const setupDecoShapes = () => {
    const container = document.getElementById('deco-shapes-container');
    if (!container) return;

    // Generate random circles
    for (let i = 0; i < 6; i++) {
        const circle = document.createElement('div');
        circle.className = 'deco-shape deco-circle';
        const size = Math.random() * 80 + 40;
        circle.style.width = size + 'px';
        circle.style.height = size + 'px';
        circle.style.left = Math.random() * 100 + '%';
        circle.style.top = Math.random() * 100 + '%';
        circle.style.borderColor = Math.random() > 0.5 ? '#00FFFF' : '#FF1744';
        circle.style.animationDelay = (i * 0.5) + 's';
        container.appendChild(circle);
    }

    // Generate random squares
    for (let i = 0; i < 4; i++) {
        const square = document.createElement('div');
        square.className = 'deco-shape deco-square';
        const size = Math.random() * 60 + 30;
        square.style.width = size + 'px';
        square.style.height = size + 'px';
        square.style.left = Math.random() * 100 + '%';
        square.style.top = Math.random() * 100 + '%';
        square.style.borderColor = Math.random() > 0.5 ? '#00FFFF' : '#FF1744';
        square.style.animationDelay = (i * 0.7) + 's';
        container.appendChild(square);
    }

    // Generate dotted lines
    for (let i = 0; i < 5; i++) {
        const line = document.createElement('div');
        line.className = 'deco-shape deco-line-dotted';
        if (Math.random() > 0.5) {
            line.classList.add('deco-line-h');
            line.style.width = Math.random() * 40 + 20 + '%';
        } else {
            line.classList.add('deco-line-v');
            line.style.height = Math.random() * 40 + 20 + '%';
        }
        line.style.left = Math.random() * 80 + '%';
        line.style.top = Math.random() * 80 + '%';
        line.style.borderTopColor = Math.random() > 0.5 ? '#00FFFF' : '#FF1744';
        container.appendChild(line);
    }
};;