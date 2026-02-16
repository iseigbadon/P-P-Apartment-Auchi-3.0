// ========================
// MODAL FUNCTIONS
// ========================

function openSearchModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        // Auto-focus input if it exists
        const input = modal.querySelector('.modal-input, .modal-date-input');
        if (input) setTimeout(() => input.focus(), 100);
    }
}

function closeSearchModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

function setLocation(location) {
    document.getElementById('whereInput').value = location;
    document.querySelector('.where-field .field-value').textContent = location;
    closeSearchModal('whereModal');
}

function setDates() {
    const checkinPicker = document.getElementById('checkinDatePicker');
    const checkoutPicker = document.getElementById('checkoutDatePicker');
    
    if (checkinPicker.value && checkoutPicker.value) {
        const checkinDate = new Date(checkinPicker.value);
        const checkoutDate = new Date(checkoutPicker.value);
        const checkinFormatted = checkinDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const checkoutFormatted = checkoutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        document.getElementById('checkinInput').value = checkinPicker.value;
        document.getElementById('checkoutInput').value = checkoutPicker.value;
        document.querySelector('.when-field .field-value').textContent = `${checkinFormatted} - ${checkoutFormatted}`;
        closeSearchModal('whenModal');
    }
}

let adultsCount = 1;
let childrenCount = 0;

function increaseGuests(type) {
    if (type === 'adults') {
        adultsCount++;
    } else if (type === 'children') {
        childrenCount++;
    }
    updateGuestCountDisplay();
}

function decreaseGuests(type) {
    if (type === 'adults' && adultsCount > 1) {
        adultsCount--;
    } else if (type === 'children' && childrenCount > 0) {
        childrenCount--;
    }
    updateGuestCountDisplay();
}

function updateGuestCountDisplay() {
    document.getElementById('adultsCount').textContent = adultsCount;
    document.getElementById('childrenCount').textContent = childrenCount;
}

function setGuestCount() {
    const total = adultsCount + childrenCount;
    const guestText = total === 1 ? '1 guest' : `${total} guests`;
    document.getElementById('guestsInput').value = guestText;
    document.querySelector('.who-field .field-value').textContent = guestText;
    closeSearchModal('whoModal');
}

// ========================
// PAGE LOAD INITIALIZATION
// ========================

document.addEventListener('DOMContentLoaded', function() {
    const luxePopup = document.getElementById('luxePopup');
    
    // ========================
    // SEARCH FIELD MODALS
    // ========================
    
    const whereBtn = document.getElementById('whereBtn');
    const whenBtn = document.getElementById('whenBtn');
    const whoBtn = document.getElementById('whoBtn');
    const searchBtn = document.getElementById('searchBtn');

    // Where button - opens modal
    if (whereBtn) {
        whereBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openSearchModal('whereModal');
        });
    }

    // When button - opens modal
    if (whenBtn) {
        whenBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openSearchModal('whenModal');
        });
    }

    // Who button - opens modal
    if (whoBtn) {
        whoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openSearchModal('whoModal');
        });
    }

    // Search button functionality
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const where = document.getElementById('whereInput').value;
            const checkin = document.getElementById('checkinInput').value;
            const checkout = document.getElementById('checkoutInput').value;
            const guests = document.getElementById('guestsInput').value;
            
            console.log('Search:', { where, checkin, checkout, guests });
            // Add actual search/filter functionality here
            alert(`Searching for:\n${where}\nCheck-in: ${checkin || 'Not set'}\nCheck-out: ${checkout || 'Not set'}\nGuests: ${guests || 'Not set'}`);
        });

        // Tooltip hover functionality
        const tooltipSearch = document.querySelector('.tooltip-search');
        if (tooltipSearch) {
            searchBtn.addEventListener('mouseenter', function() {
                tooltipSearch.classList.add('active');
            });
            
            searchBtn.addEventListener('mouseleave', function() {
                tooltipSearch.classList.remove('active');
            });
        }
    }

    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when a link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    // Heart button functionality
    document.querySelectorAll('.card-heart').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isLiked = btn.getAttribute('data-liked') === 'true';
            if (isLiked) {
                btn.textContent = '♡';
                btn.style.color = 'inherit';
                btn.setAttribute('data-liked', 'false');
            } else {
                btn.textContent = '♥';
                btn.style.color = 'var(--gold-primary)';
                btn.setAttribute('data-liked', 'true');
            }
        });
    });

    // Experience form submission
    const experienceForm = document.getElementById('experienceForm');
    const experiencesGrid = document.getElementById('experiencesGrid');
    const guestName = document.getElementById('guestName');
    const guestText = document.getElementById('guestText');
    const guestImage = document.getElementById('guestImage');

    // Load existing experiences from localStorage
    loadExperiences();

    if (experienceForm) {
        experienceForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = guestName.value.trim() || 'Guest';
            const text = guestText.value.trim();
            const imageInput = guestImage.files[0];

            if (!text) {
                alert('Please share your experience');
                return;
            }

            const experience = {
                id: Date.now(),
                name: name,
                text: text,
                image: null,
                date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
            };

            // Handle image upload
            if (imageInput) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    experience.image = e.target.result;
                    saveAndDisplay(experience);
                };
                reader.readAsDataURL(imageInput);
            } else {
                saveAndDisplay(experience);
            }
        });
    }

    function saveAndDisplay(experience) {
        // Get existing experiences from localStorage
        let experiences = JSON.parse(localStorage.getItem('experiences')) || [];
        experiences.unshift(experience);
        
        // Keep only last 20 experiences
        if (experiences.length > 20) {
            experiences = experiences.slice(0, 20);
        }
        
        // Save to localStorage
        localStorage.setItem('experiences', JSON.stringify(experiences));

        // Clear form
        experienceForm.reset();

        // Reload experiences
        loadExperiences();

        // Show success message
        alert('Thank you for sharing! Your experience has been posted.');
    }

    function loadExperiences() {
        const experiences = JSON.parse(localStorage.getItem('experiences')) || [];

        if (experiencesGrid) {
            experiencesGrid.innerHTML = '';

            if (experiences.length === 0) {
                experiencesGrid.innerHTML = '<div style="text-align: center; color: var(--gray-text); grid-column: 1/-1; padding: 2rem;">No experiences yet. Be the first to share your stay!</div>';
                return;
            }

            experiences.forEach(exp => {
                const card = document.createElement('div');
                card.className = 'experience-card';
                
                let imageHTML = '';
                if (exp.image) {
                    imageHTML = `<img src="${exp.image}" alt="Experience" class="experience-image">`;
                }

                card.innerHTML = `
                    ${imageHTML}
                    <div class="experience-name">${escapeHtml(exp.name)}</div>
                    <div class="experience-text">${escapeHtml(exp.text)}</div>
                    <small>${exp.date}</small>
                `;

                experiencesGrid.appendChild(card);
            });
        }
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                const offset = 80; // Account for sticky header
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe apartment cards
    document.querySelectorAll('.apartment-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});
