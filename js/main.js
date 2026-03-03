document.addEventListener('DOMContentLoaded', function () {
    initSwiper();
});

window.addEventListener('load', function() {
    if (window.reviewsSwiper) {
        window.reviewsSwiper.update();
    }
    
    const header = document.querySelector('.header');
    if (header) {
        document.body.style.paddingTop = header.offsetHeight + 'px';
    }
    
    const reviewsSection = document.querySelector('.reviews');
    if (reviewsSection) {
        if (reviewsSection.offsetHeight < 300) {
            reviewsSection.style.minHeight = '400px';
        }
    }
});

function initSwiper() {
    const swiperElement = document.querySelector('.reviews-slider');
    if (!swiperElement) return;
    
    window.reviewsSwiper = new Swiper('.reviews-slider', {
        loop: true,
        slidesPerView: 'auto',
        spaceBetween: 10,
        centeredSlides: true,
        slideToClickedSlide: true,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        freeMode: {
            enabled: false,
        },
        breakpoints: {
            320: {
                slidesPerView: 'auto',
                spaceBetween: 10,
            },
            768: {
                slidesPerView: 'auto',
                spaceBetween: 15,
            },
            1024: {
                slidesPerView: 'auto',
                spaceBetween: 20,
                navigation: {
                    nextEl: '.reviews-prev',
                    prevEl: '.reviews-next',
                },
            }
        },
        navigation: window.innerWidth > 768 ? {
            nextEl: '.reviews-prev',
            prevEl: '.reviews-next',
        } : false,
        on: {
            init: function() {},
            resize: function() {
                this.update();
            }
        }
    });
    
    setTimeout(() => {
        if (window.reviewsSwiper) {
            window.reviewsSwiper.update();
        }
    }, 500);
}

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    if (header) {
        document.body.style.paddingTop = header.offsetHeight + 'px';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    const mobileButton = document.querySelector('.header__mobile-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    const contactModal = document.getElementById('contactModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const backToSiteBtn = document.getElementById('backToSiteBtn');
    const sections = {
        'home': document.querySelector('.hero'),
        'quiz': document.querySelector('.quiz-types'),
        'reviews': document.querySelector('.reviews')
    };
    const navLinks = document.querySelectorAll('.header__link[href^="#"]');
    const mobileNavLinks = document.querySelectorAll('.mobile-menu__item[href^="#"]');
    const mobileContactBtn = document.querySelector('.mobile-menu__contact-btn');
    const desktopContactBtn = document.querySelector('.header__btn[href="#contact"]');
    const allLinks = [...navLinks, ...mobileNavLinks];
    
    function openContactModal(e) {
        if (e) {
            e.preventDefault();
        }
        
        document.querySelector('.main').style.display = 'none';
        document.querySelector('.content-container').style.display = 'none';
        document.querySelector('.footer').style.display = 'none';
        
        if (contactModal) {
            contactModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
        
        document.getElementById('contactForm').classList.add('active');
        document.getElementById('contactSuccess').classList.remove('active');
        
        resetForm();
    }
    
    function closeContactModal() {
        if (contactModal) {
            contactModal.style.display = 'none';
        }
        document.querySelector('.main').style.display = 'block';
        document.querySelector('.content-container').style.display = 'block';
        document.querySelector('.footer').style.display = 'block';
        document.body.style.overflow = '';
    }
    
    if (desktopContactBtn) {
        desktopContactBtn.addEventListener('click', openContactModal);
    }
    
    if (mobileContactBtn) {
        mobileContactBtn.addEventListener('click', openContactModal);
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeContactModal);
    }
    
    if (backToSiteBtn) {
        backToSiteBtn.addEventListener('click', closeContactModal);
    }
    
    const overlay = document.querySelector('.contact-modal__overlay');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeContactModal();
            }
        });
    }
    
    if (mobileButton && mobileMenu) {
        mobileButton.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        document.addEventListener('click', function(e) {
            if (!mobileButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        mobileMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    if (!sections.home || !sections.quiz || !sections.reviews) {
        return;
    }
    
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = sections[targetId];
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                updateActiveLink(targetId);
            }
        });
    });
    
    function updateActiveLinkOnScroll() {
        const scrollPosition = window.scrollY;
        const headerHeight = header.offsetHeight;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        if (scrollPosition + windowHeight >= documentHeight - 50) {
            updateActiveLink('reviews');
            return;
        }
        
        for (const [id, section] of Object.entries(sections)) {
            if (section) {
                const sectionTop = section.offsetTop - headerHeight - 50;
                const sectionBottom = sectionTop + section.offsetHeight + 100;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    updateActiveLink(id);
                    break;
                }
            }
        }
    }
    
    function updateActiveLink(activeId) {
        allLinks.forEach(link => {
            const linkId = link.getAttribute('href').substring(1);
            if (linkId === activeId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                updateActiveLinkOnScroll();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
    
    setTimeout(() => {
        updateActiveLinkOnScroll();
    }, 100);
    
    window.addEventListener('resize', () => {
        if (header) {
            document.body.style.paddingTop = header.offsetHeight + 'px';
        }
        setTimeout(() => {
            updateActiveLinkOnScroll();
        }, 50);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const comment = document.getElementById('comment');
    const fileBtn = document.getElementById('fileBtn');
    const fileInput = document.getElementById('fileInput');
    const fileError = document.querySelector('.contact-form__file-error');
    const submitBtn = document.getElementById('submitFormBtn');
    const options = document.querySelectorAll('.contact-form__option');
    const contactForm = document.getElementById('contactForm');
    const contactSuccess = document.getElementById('contactSuccess');
    
    if (fileBtn && fileInput) {
        fileBtn.addEventListener('click', function() {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                fileBtn.classList.remove('error');
                if (fileError) fileError.classList.remove('show');
            }
        });
    }
    
    options.forEach(option => {
        option.addEventListener('click', function() {
            options.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            let hasError = false;
            
            const fields = [
                { el: firstName, name: 'Имя' },
                { el: lastName, name: 'Фамилия' },
                { el: comment, name: 'Комментарий' }
            ];
            
            fields.forEach(field => {
                const fieldEl = field.el;
                const fieldWrapper = fieldEl?.closest('.contact-form__field');
                
                if (fieldEl && !fieldEl.value.trim()) {
                    if (fieldWrapper) fieldWrapper.classList.add('error');
                    fieldEl.classList.add('error');
                    hasError = true;
                } else if (fieldEl) {
                    if (fieldWrapper) fieldWrapper.classList.remove('error');
                    fieldEl.classList.remove('error');
                }
            });
            
            if (fileInput && (!fileInput.files || fileInput.files.length === 0)) {
                fileBtn.classList.add('error');
                if (fileError) fileError.classList.add('show');
                hasError = true;
            } else {
                fileBtn.classList.remove('error');
                if (fileError) fileError.classList.remove('show');
            }
            
            const hasSelectedOption = Array.from(options).some(opt => opt.classList.contains('active'));
            if (!hasSelectedOption) {
                alert('Пожалуйста, выберите один из вариантов');
                hasError = true;
            }
            
            if (!hasError) {
                contactForm.classList.remove('active');
                contactSuccess.classList.add('active');
            }
        });
    }
    
    [firstName, lastName, comment].forEach(field => {
        if (field) {
            field.addEventListener('input', function() {
                const wrapper = this.closest('.contact-form__field');
                if (wrapper) wrapper.classList.remove('error');
                this.classList.remove('error');
            });
        }
    });
});

function resetForm() {
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const comment = document.getElementById('comment');
    const fileInput = document.getElementById('fileInput');
    const fileBtn = document.getElementById('fileBtn');
    const fileError = document.querySelector('.contact-form__file-error');
    const options = document.querySelectorAll('.contact-form__option');
    
    if (firstName) firstName.value = '';
    if (lastName) lastName.value = '';
    if (comment) comment.value = '';
    if (fileInput) fileInput.value = '';
    
    document.querySelectorAll('.contact-form__field').forEach(field => {
        field.classList.remove('error');
    });
    
    document.querySelectorAll('.contact-form__input').forEach(input => {
        input.classList.remove('error');
    });
    
    if (fileBtn) fileBtn.classList.remove('error');
    if (fileError) fileError.classList.remove('show');
    
    options.forEach(opt => opt.classList.remove('active'));
}

window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        const header = document.querySelector('.header');
        if (header) {
            document.body.style.paddingTop = header.offsetHeight + 'px';
        }
        if (window.reviewsSwiper) {
            window.reviewsSwiper.update();
        }
    }, 100);
});
