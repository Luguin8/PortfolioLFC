// ================= LÓGICA DE PORTFOLIO MODULARIZADA =================
// Este script controla el filtrado de proyectos, menú lateral, internacionalización y botones flotantes
// Espera a que los includes estén cargados antes de inicializar eventos

function waitForElements(selectors, callback) {
    const interval = setInterval(() => {
        const elements = selectors.map(sel => document.querySelector(sel));
        if (elements.every(Boolean)) {
            clearInterval(interval);
            callback(...elements);
        }
    }, 50);
}

document.addEventListener('DOMContentLoaded', () => {
    waitForElements([
        '#menuToggle', '#sidebar', '#langToggle', '.filter-btn', '.project-card', '#scrollTopBtn', '.whatsapp-btn'
    ], (
        menuToggle, sidebar, langToggle, filterBtn, projectCard, scrollTopBtn, whatsappBtn
    ) => {
        setupMenu(menuToggle, sidebar, langToggle);
        setupPortfolioFilters();
        setupFloatButtons(scrollTopBtn, whatsappBtn);
    });
});

// ================= MENÚ LATERAL =================
function setupMenu(menuToggle, sidebar, langToggle) {
    // Abre/cierra el menú lateral
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
    // Cierra el menú al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
    sidebar.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    // Cambio de idioma (opcional, si quieres mantenerlo aquí)
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            // Aquí puedes agregar lógica de cambio de idioma si lo necesitas
        });
    }
}

// ================= FILTRO DE PROYECTOS =================
function setupPortfolioFilters() {
    /**
     * Activa un filtro específico en la grid de proyectos
     * @param {string} filter - El filtro a activar ('all', 'onepage', 'institucional', 'personalizado')
     * Esta función:
     * 1. Actualiza la UI de los botones de filtro (activa/desactiva clases)
     * 2. Filtra las tarjetas de proyecto según la categoría seleccionada
     * 3. Muestra/oculta las tarjetas según corresponda
     */
    function activateFilter(filter) {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        // Actualiza los botones de filtro
        filterButtons.forEach(btn => {
            if (btn.getAttribute('data-filter') === filter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        // Filtra las tarjetas de proyecto
        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    // Asignar eventos a los botones de filtro
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            activateFilter(filter);
        });
    });
    // Activar filtro por parámetro de URL (ej: ?filter=onepage)
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    if (filterParam) {
        activateFilter(filterParam);
    } else {
        activateFilter('all');
    }
}

// ================= BOTONES FLOTANTES (Volver arriba y WhatsApp) =================
function setupFloatButtons(scrollTopBtn, whatsappBtn) {
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        // Mostrar los botones al hacer scroll
        if (window.pageYOffset > 100) {
            scrollTopBtn.classList.add('visible');
            whatsappBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
            whatsappBtn.classList.remove('visible');
        }
        // Limpiar el timeout anterior
        clearTimeout(scrollTimeout);
        // Ocultar los botones después de 2 segundos sin scroll
        scrollTimeout = setTimeout(() => {
            scrollTopBtn.classList.remove('visible');
            whatsappBtn.classList.remove('visible');
        }, 2000);
    });
    // Scroll suave al hacer click en volver arriba
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
} 