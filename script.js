document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. ENVELOPE OPENING & REVEAL SYSTEM
       ========================================================================== */
    const openBtn = document.getElementById('open-btn');
    const envelope = document.querySelector('.envelope');
    const envelopeOverlay = document.getElementById('envelope-overlay');
    const mainContent = document.getElementById('main-content');
    const musicBtn = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');

    openBtn.addEventListener('click', () => {
        // Step A: Open envelope flap
        envelope.classList.add('flap-open');

        // Step B: Slide out the wedding card inside after flap is open
        setTimeout(() => {
            envelope.classList.add('card-slide-up');
        }, 600);

        // Step C: Fade out envelope overlay, reveal website, start music
        setTimeout(() => {
            // Unlock scroll
            document.body.classList.remove('locked');
            // Un-hide main webpage elements
            mainContent.classList.remove('hidden-content');
            // Fade-out entire preloader screen
            envelopeOverlay.classList.add('hide-envelope');
            // Reveal floating music toggler
            musicBtn.classList.remove('hidden');
            
            // Try autoplay music (browsers need user gesture, clicking "Open" counts as one)
            playAudio();
            
            // Trigger animation for elements inside viewport immediately
            triggerScrollReveal();
        }, 1400);
    });


    /* ==========================================================================
       2. BACKGROUND MUSIC CONTROLS
       ========================================================================== */
    let isPlaying = false;

    // Handle music toggle button click
    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    });

    function playAudio() {
        bgMusic.play()
            .then(() => {
                isPlaying = true;
                musicBtn.classList.add('playing');
            })
            .catch((error) => {
                console.log('Audio autoplay prevented by browser permissions:', error);
                isPlaying = false;
                musicBtn.classList.remove('playing');
            });
    }

    function pauseAudio() {
        bgMusic.pause();
        isPlaying = false;
        musicBtn.classList.remove('playing');
    }


    /* ==========================================================================
       3. WEDDING COUNTDOWN TIMER
       ========================================================================== */
    // Target Nikkah Date: August 27, 2026, 11:00:00 AM IST (UTC +5:30)
    const targetDate = new Date('2026-08-27T11:00:00+05:30').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            // If date is passed
            document.getElementById('days').innerText = '00';
            document.getElementById('hours').innerText = '00';
            document.getElementById('minutes').innerText = '00';
            document.getElementById('seconds').innerText = '00';
            
            const subtitle = document.querySelector('.countdown-subtitle');
            if (subtitle) {
                subtitle.innerText = 'The Ceremony has commenced! Blessings on the Couple.';
            }
            return;
        }

        // Calculations
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Render values with padded leading zeros
        document.getElementById('days').innerText = String(days).padStart(2, '0');
        document.getElementById('hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
        document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
    }

    // Run countdown update immediately and set it on interval
    updateCountdown();
    setInterval(updateCountdown, 1000);


    /* ==========================================================================
       4. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.fade-in-element');

    function triggerScrollReveal() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target); // Stop observing once animate is done
                    }
                });
            }, {
                threshold: 0.1, // Trigger when 10% of element is in view
                rootMargin: '0px 0px -50px 0px' // Adjust trigger offset slightly offset
            });

            revealElements.forEach((el) => observer.observe(el));
        } else {
            // Fallback for older browsers
            revealElements.forEach((el) => el.classList.add('visible'));
        }
    }

});
