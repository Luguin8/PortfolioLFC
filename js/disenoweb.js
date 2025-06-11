// ================= LÓGICA DEL MODAL QUIZ Y MENÚ DESPLEGABLE =================
// Este script controla la apertura, navegación y resultado del quiz de recomendación de sitio web
// y asegura que el menú lateral funcione correctamente con includes dinámicos

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

// Inicialización principal

document.addEventListener('DOMContentLoaded', () => {
    // Esperar a que el menú y quiz estén en el DOM
    waitForElements([
        '#menuToggle', '#sidebar', '#langToggle', '#openQuiz', '#quizModal', '.quiz-close', '.quiz-step', '.progress-bar', '.current-step'
    ], (
        menuToggle, sidebar, langToggle, openQuizBtn, quizModal, closeBtn, quizStep, progressBar, stepIndicator
    ) => {
        setupMenu(menuToggle, sidebar, langToggle);
        setupQuizModal(openQuizBtn, quizModal, closeBtn, progressBar, stepIndicator);
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

// ================= LÓGICA DEL MODAL QUIZ =================
function setupQuizModal(openQuizBtn, quizModal, closeBtn, progressBar, stepIndicator) {
    if (!openQuizBtn || !quizModal || !closeBtn || !progressBar || !stepIndicator) return;
    const steps = quizModal.querySelectorAll('.quiz-step');
    let currentStep = 0;
    // Guardar las respuestas del usuario
    let answers = [null, null, null];

    // Abrir el modal
    openQuizBtn.addEventListener('click', () => {
        quizModal.style.display = 'block';
        showStep(0);
        // Limpiar respuestas anteriores
        answers = [null, null, null];
        // Limpiar selección de radios
        steps.forEach(step => {
            const radios = step.querySelectorAll('input[type="radio"]');
            radios.forEach(radio => radio.checked = false);
        });
    });
    // Cerrar el modal
    closeBtn.addEventListener('click', () => {
        quizModal.style.display = 'none';
    });
    // Cerrar al hacer click fuera del modal
    window.addEventListener('click', (e) => {
        if (e.target === quizModal) {
            quizModal.style.display = 'none';
        }
    });
    // Navegación entre pasos y guardado de respuestas
    steps.forEach((step, idx) => {
        const radios = step.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
            radio.addEventListener('change', () => {
                // Guardar la respuesta seleccionada para este paso
                answers[idx] = parseInt(radio.value);
                // Si es la última pregunta, mostrar el resultado
                if (idx === steps.length - 2) {
                    showResult();
                } else {
                    showStep(idx + 1);
                }
            });
        });
    });
    // Mostrar el paso actual
    function showStep(idx) {
        steps.forEach((step, i) => {
            step.style.display = i === idx ? 'block' : 'none';
        });
        currentStep = idx;
        // Actualizar el indicador de paso (no contar el paso de resultado)
        stepIndicator.textContent = (idx + 1).toString();
        progressBar.style.width = ((idx + 1) / (steps.length - 1)) * 100 + '%';
    }
    // Mostrar el resultado basado en la suma de respuestas
    function showResult() {
        // Sumar los valores seleccionados
        const total = answers.reduce((acc, val) => acc + (val || 0), 0);
        // Seleccionar el contenedor de resultado
        const resultContent = quizModal.querySelector('.result-content');
        let resultHtml = '';
        // Lógica de resultado según el total de puntos
        if (total >= 3 && total <= 4) {
            // Resultado: One Page
            resultHtml = `
                <h4>Recomendación: <span style="color: var(--accent-color)">One Page</span></h4>
                <p>Te recomendamos un <b>sitio One Page</b>: ideal para mostrar toda la información esencial de tu negocio en una sola página, con navegación fluida y diseño moderno.</p>
            `;
        } else if (total >= 5 && total <= 6) {
            // Resultado: Institucional
            resultHtml = `
                <h4>Recomendación: <span style="color: var(--accent-color)">Institucional</span></h4>
                <p>Te recomendamos un <b>sitio Institucional</b>: perfecto para empresas u organizaciones que necesitan varias secciones, blog, panel de administración y funcionalidades avanzadas.</p>
            `;
        } else if (total >= 7 && total <= 9) {
            // Resultado: Personalizado
            resultHtml = `
                <h4>Recomendación: <span style="color: var(--accent-color)">Personalizado</span></h4>
                <p>Te recomendamos un <b>sitio Personalizado</b>: una solución a medida, escalable y con funcionalidades exclusivas según tus necesidades y objetivos.</p>
            `;
        } else {
            // Si no se respondieron todas las preguntas
            resultHtml = `<p>Por favor, responde todas las preguntas para ver tu recomendación.</p>`;
        }
        // Mostrar solo el paso de resultado
        steps.forEach((step, i) => {
            step.style.display = i === steps.length - 1 ? 'block' : 'none';
        });
        // Actualizar el indicador de paso y barra de progreso al final
        stepIndicator.textContent = (steps.length - 1).toString();
        progressBar.style.width = '100%';
        resultContent.innerHTML = resultHtml;
    }
} 