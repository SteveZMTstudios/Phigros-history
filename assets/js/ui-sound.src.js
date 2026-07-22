(function() {
    const sounds = {
        cancel: new Audio('assets/sound/ui/cancel.wav'),
        click: new Audio('assets/sound/ui/click.wav'),
        scroll: new Audio('assets/sound/ui/scroll.wav'),
        start: new Audio('assets/sound/ui/start.wav'),
        switch: new Audio('assets/sound/ui/switch.wav')
    };

    let isSoundEnabled = localStorage.getItem('ui_sound_enabled') !== 'false';

    function playSound(name) {
        if (!isSoundEnabled || !sounds[name]) return;
        
        // Clone for overlapping sounds
        const sound = sounds[name].cloneNode();
        sound.volume = 0.5; // Set a default volume
        sound.play().catch(e => console.warn('Sound play blocked:', e));
    }

    // Export to window for main.js to use
    window.playUISound = playSound;

    function toggleSound() {
        isSoundEnabled = !isSoundEnabled;
        localStorage.setItem('ui_sound_enabled', isSoundEnabled);
        updateSoundButtons();
        playSound('click');
    }

    function updateSoundButtons() {
        const icon = isSoundEnabled ? 'volume_up' : 'volume_off';
        document.querySelectorAll('.sound-toggle-btn .material-icons').forEach(el => {
            el.textContent = icon;
        });
    }

    // Initialize buttons and listeners
    document.addEventListener('DOMContentLoaded', () => {
        updateSoundButtons();

        // 2. Sound tip logic (First visit only)
        if (!localStorage.getItem('sound_tip_shown')) {
            const tip = document.getElementById('sound-tip');
            if (tip) {
                setTimeout(() => {
                    tip.style.opacity = '1';
                }, 1500); 
            }
        }

        const hideSoundTip = () => {
            const tip = document.getElementById('sound-tip');
            if (tip && tip.style.opacity === '1') {
                tip.style.opacity = '0';
                localStorage.setItem('sound_tip_shown', 'true');
            }
        };

        // 0. Toggle button logic
        document.body.addEventListener('click', (e) => {
            const toggleBtn = e.target.closest('.sound-toggle-btn');
            if (toggleBtn) {
                e.stopPropagation();
                toggleSound();
                hideSoundTip();
            }
        });

        // 1. Click sounds (using capture phase to handle stopPropagation)
        document.addEventListener('click', (e) => {
            const target = e.target.closest('button, a, .version-card, .major-version-btn, #start-screen');
            if (!target) {
                // Empty space click
                if (e.target.classList.contains('screen') || e.target.classList.contains('background-overlay') || e.target.classList.contains('content-container') || e.target.id === 'version-list') {
                    playSound('cancel');
                }
                return;
            }

            // High priority: Toggle button
            if (target.classList.contains('sound-toggle-btn')) return;

            // Hide tip if entering main screen
            if (target.id === 'start-screen') {
                hideSoundTip();
            }

            // 1. Cancel sounds: back-btn, close-btn, close-announcement
            if (target.id === 'back-btn' || 
                target.classList.contains('close-btn-desktop') || 
                target.classList.contains('close-btn-mobile') ||
                target.id === 'close-announcement') {
                playSound('cancel');
                return;
            }

            // 2. Switch sound: major version list switch
            if (target.classList.contains('major-version-btn')) {
                playSound('switch');
                return;
            }

            // 4. Start sound: Download buttons inside detail panel
            if (target.classList.contains('phigros-btn') && target.closest('#download-list')) {
                const href = target.getAttribute('href') || '';
                // If it's a help link (contains 'doc/' or 'github'), play 'click' instead of 'start'
                if (href.includes('doc/') || href.includes('github.com')) {
                    playSound('click');
                } else {
                    playSound('start');
                }
                return;
            }

            // 5. Click sound: Version card, hyperlinks, other buttons, and start screen
            if (target.classList.contains('version-card') || 
                target.tagName === 'A' || 
                target.tagName === 'BUTTON' || 
                target.id === 'info-btn' || 
                target.id === 'language-btn' ||
                target.id === 'start-language-btn' ||
                target.id === 'start-screen' ||
                target.id === 'version-search') {
                playSound('click');
                return;
            }
        }, true); // Use capture phase!

        // 6. Search box focus sound
        document.addEventListener('focusin', (e) => {
            if (e.target.id === 'version-search') {
                playSound('click');
            }
        });

        // 3. Scroll sound
        let lastScrollTime = 0;
        const scrollThreshold = 100; // ms between ticks
        
        window.addEventListener('wheel', (e) => {
            // Only play if there's actual scrolling happening
            if (Math.abs(e.deltaY) < 5) return;
            
            const now = Date.now();
            if (now - lastScrollTime > scrollThreshold) {
                playSound('scroll');
                lastScrollTime = now;
            }
        }, { passive: true });
    });

    // Handle screen transitions (if any specific sounds needed, but clicking handles it for now)
})();
