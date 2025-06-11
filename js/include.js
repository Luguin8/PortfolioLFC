// Script para incluir componentes HTML en páginas planas
// Busca todos los elementos con el atributo data-include y reemplaza su contenido por el HTML del archivo indicado

document.addEventListener('DOMContentLoaded', () => {
    const includeElements = document.querySelectorAll('[data-include]');
    includeElements.forEach(async (el) => {
        const file = el.getAttribute('data-include');
        try {
            const resp = await fetch(file);
            if (resp.ok) {
                const html = await resp.text();
                el.insertAdjacentHTML('beforeend', html);
            } else {
                el.innerHTML = '<!-- No se pudo cargar ' + file + ' -->';
            }
        } catch (e) {
            el.innerHTML = '<!-- Error al cargar ' + file + ' -->';
        }
    });
}); 