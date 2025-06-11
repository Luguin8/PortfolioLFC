// ================= VARIABLES GLOBALES =================
let currentLanguage = 'es';
let isDeleting = false;
let currentCharIndex = 0;
let typingDelay = 200;
let erasingDelay = 100;
let newTextDelay = 2000;

// Textos para el efecto de escritura
const texts = [
    'Diseño Web Profesional',
    'Desarrollo de Aplicaciones',
    'Soluciones Digitales',
    'Marketing Digital'
];

// ================= INICIALIZACIÓN DE i18next =================
i18next
    .use(i18nextHttpBackend)
    .init({
        lng: 'es',
        fallbackLng: 'es',
        backend: {
            loadPath: '../locales/{{lng}}.json'
        }
    });

// ================= CAMBIO DE IDIOMA =================
function toggleLanguage() {
    currentLanguage = currentLanguage === 'es' ? 'en' : 'es';
    const newFlag = currentLanguage === 'es' ? 'ar' : 'us';
    // Actualizar el texto y la bandera
    const langText = document.querySelector('.lang-text');
    const flagIcon = document.querySelector('.flag-icon');
    if (langText && flagIcon) {
        langText.textContent = currentLanguage.toUpperCase();
        flagIcon.className = `flag-icon flag-${newFlag}`;
    }
    // Cambiar el idioma en i18next
    i18next.changeLanguage(currentLanguage, (err, t) => {
        if (err) return console.error('Error al cambiar el idioma:', err);
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = t(key);
        });
    });
}

// ================= TEXTO SEGÚN PÁGINA =================
function getTextByPage() {
    const path = window.location.pathname;
    if (path.includes('contacto.html')) {
        return ['Contáctanos', 'Get in Touch'];
    } else if (path.includes('portfolio.html')) {
        return ['Nuestro Portfolio', 'Our Portfolio'];
    } else if (path.includes('disenoweb.html')) {
        return ['Diseño Web', 'Web Design'];
    } else {
        return ['Desarrollo Web Profesional', 'Professional Web Development'];
    }
}

// ================= EFECTO DE ESCRITURA =================
function typeText() {
    const texts = getTextByPage();
    const currentText = texts[currentLanguage === 'es' ? 0 : 1];
    const typingTextElement = document.getElementById('typing-text');
    if (!typingTextElement) return;
    if (isDeleting) {
        typingTextElement.textContent = currentText.substring(0, currentCharIndex - 1);
        currentCharIndex--;
    } else {
        typingTextElement.textContent = currentText.substring(0, currentCharIndex + 1);
        currentCharIndex++;
    }
    if (!isDeleting && currentCharIndex === currentText.length) {
        isDeleting = true;
        setTimeout(typeText, newTextDelay);
        return;
    }
    if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        setTimeout(typeText, typingDelay);
        return;
    }
    setTimeout(typeText, isDeleting ? erasingDelay : typingDelay);
}

// ================= MENÚ LATERAL =================
function setupMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const langToggle = document.getElementById('langToggle');
    const flagIcon = langToggle ? langToggle.querySelector('.flag-icon') : null;
    const langText = langToggle ? langToggle.querySelector('.lang-text') : null;
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
        sidebar.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    if (langToggle && flagIcon && langText) {
        langToggle.addEventListener('click', () => {
            currentLanguage = currentLanguage === 'es' ? 'en' : 'es';
            if (currentLanguage === 'es') {
                flagIcon.classList.remove('flag-us');
                flagIcon.classList.add('flag-ar');
                langText.textContent = 'ES';
            } else {
                flagIcon.classList.remove('flag-ar');
                flagIcon.classList.add('flag-us');
                langText.textContent = 'EN';
            }
            currentCharIndex = 0;
            isDeleting = false;
            toggleLanguage();
        });
    }
}

// ================= ANIMACIONES DE SCROLL =================
function handleScrollAnimations() {
    const scrollImages = document.querySelectorAll('.scroll-image');
    const checkScroll = () => {
        scrollImages.forEach(image => {
            const imageTop = image.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (imageTop < windowHeight * 0.8) {
                image.classList.add('visible');
            }
        });
    };
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Verificar al cargar la página
}

// ================= BOTÓN VOLVER ARRIBA =================
function setupScrollTopButton() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            if (scrollTopBtn) scrollTopBtn.classList.add('visible');
            if (whatsappBtn) whatsappBtn.classList.add('visible');
        } else {
            if (scrollTopBtn) scrollTopBtn.classList.remove('visible');
            if (whatsappBtn) whatsappBtn.classList.remove('visible');
        }
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (scrollTopBtn) scrollTopBtn.classList.remove('visible');
            if (whatsappBtn) whatsappBtn.classList.remove('visible');
        }, 2000);
    });
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ================= EVENTOS PRINCIPALES =================
document.addEventListener('DOMContentLoaded', () => {
    // Esperar a que los includes estén cargados
    const waitForIncludes = setInterval(() => {
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const langToggle = document.getElementById('langToggle');
        const scrollTopBtn = document.getElementById('scrollTopBtn');
        const typingText = document.getElementById('typing-text');
        if (menuToggle && sidebar && langToggle && scrollTopBtn && typingText) {
            clearInterval(waitForIncludes);
            setupMenu();
            setupScrollTopButton();
            handleScrollAnimations();
            typeText();
        }
    }, 50);
}); 