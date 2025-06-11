// ================= LÓGICA DE CONTACTO MODULARIZADA =================
// Este script controla el formulario de contacto, menú lateral, internacionalización y botones flotantes
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
        '#menuToggle', '#sidebar', '#langToggle', '#scrollTopBtn', '.whatsapp-btn', '#cotizacionForm'
    ], (
        menuToggle, sidebar, langToggle, scrollTopBtn, whatsappBtn, cotizacionForm
    ) => {
        setupMenu(menuToggle, sidebar, langToggle);
        setupFloatButtons(scrollTopBtn, whatsappBtn);
        setupContactForm(cotizacionForm);
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

// ================= FORMULARIO DE CONTACTO (EmailJS + SweetAlert2) =================
function setupContactForm(cotizacionForm) {
    if (!cotizacionForm) return;
    // Inicializa EmailJS (solo una vez)
    if (typeof emailjs !== 'undefined' && emailjs.init) {
        emailjs.init("tcOIxotaJY-MKtz65");
    }
    cotizacionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Deshabilita el botón y muestra estado de envío
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        // Obtiene los elementos del formulario
        const nombreInput = this.querySelector('#nombre');
        const emailInput = this.querySelector('#email');
        const telefonoInput = this.querySelector('#telefono');
        const tipoPaginaInput = this.querySelector('#tipoPagina');
        const mensajeInput = this.querySelector('#mensaje');
        // Construye el objeto con los datos del formulario
        const templateParams = {
            title: 'Nueva Solicitud de Cotización',
            from_name: nombreInput?.value?.trim() || '',
            from_email: emailInput?.value?.trim() || '',
            phone: telefonoInput?.value?.trim() || '',
            page_type: tipoPaginaInput?.value || '',
            message: mensajeInput?.value?.trim() || ''
        };
        // Envía el email usando EmailJS
        emailjs.send(
            "service_nfm63na", // ID del servicio
            "template_34kv1dn", // ID del template
            templateParams
        )
        .then((response) => {
            // Notifica éxito al usuario
            Swal.fire({
                title: '¡Enviado!',
                text: 'Tu solicitud de cotización ha sido enviada correctamente.',
                icon: 'success',
                confirmButtonColor: '#6621b0'
            });
            // Limpia el formulario
            this.reset();
        })
        .catch((error) => {
            // Notifica error al usuario
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al enviar tu solicitud. Por favor, intenta nuevamente.',
                icon: 'error',
                confirmButtonColor: '#6621b0'
            });
        })
        .finally(() => {
            // Restaura el botón
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        });
    });
} 