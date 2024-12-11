// Cargar e insertar una seccion html repetitiva
function cargarComponente(pagina, contenedor) {
    fetch(pagina)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar ' + pagina);
            }
            return response.text();
        })
        .then(html => {
            document.getElementById(contenedor).innerHTML = html;
        })
        .catch(err => console.error('Error al cargar el HTML:', err));
}



