const BASE_URL_GRADO = 'https://control-academico.up.railway.app/api/v1/grados';  
const BASE_URL_ASIGNATURA_CREAR = 'https://control-academico.up.railway.app/api/v1/asignatura';  
const BASE_URL_ASIGNATURA_LISTA = 'https://control-academico.up.railway.app/api/v1/asignaturas'; 

let asignaturaEditando = null; 

async function cargarGrados() {
    try {
        const response = await axios.get(BASE_URL_GRADO);
        const grados = response.data;
        const gradoSelect = document.getElementById('activo');

        gradoSelect.innerHTML = '<option value="">Seleccione un grado</option>'; 
        grados.forEach(grado => {
            const option = document.createElement('option');
            option.value = grado.id; 
            option.textContent = grado.nombre;  
            gradoSelect.appendChild(option);
        });

        if (grados.length === 0) {
            alert('No se encontraron grados en el sistema. Asegúrate de crear al menos un grado.');
        }
    } catch (error) {
        alert('Error al cargar los grados: ' + error.message);
    }
}

async function registrarAsignatura(event) {
    event.preventDefault();  

    const codigo = document.getElementById('codigo').value;
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const grado_id = parseInt(document.getElementById('activo').value, 10);

    if (!codigo || !nombre || !descripcion || !grado_id) {
        alert('Por favor, complete todos los campos');
        return;
    }

    const asignaturaData = {
        codigo: codigo,
        nombre: nombre,
        descripcion: descripcion,
        grado: {
            id: grado_id
        } 
    };

    try {
        const response = await axios.post(BASE_URL_ASIGNATURA_CREAR, asignaturaData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        alert('Asignatura registrada correctamente');
        obtenerAsignaturas(); 
    } catch (error) {
        if (error.response) {
            alert('Error al registrar la asignatura: ' + error.response.data.message);
        } else {
            alert('Error al registrar la asignatura: ' + error.message);
        }
    }
}

async function obtenerAsignaturas() {
    try {
        const response = await axios.get(BASE_URL_ASIGNATURA_LISTA);
        const asignaturas = response.data;

        const tabla = document.querySelector('.tabla-registros tbody');
        tabla.innerHTML = ''; 

        if (asignaturas.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="6">No hay asignaturas registradas.</td>`;
            tabla.appendChild(row);
            return;
        }

        asignaturas.forEach(asignatura => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${asignatura.id}</td>
                <td contenteditable="true" class="editable" onblur="actualizarAsignatura(${asignatura.id}, 'codigo', this.innerText)">${asignatura.codigo}</td>
                <td contenteditable="true" class="editable" onblur="actualizarAsignatura(${asignatura.id}, 'nombre', this.innerText)">${asignatura.nombre}</td>
                <td contenteditable="true" class="editable" onblur="actualizarAsignatura(${asignatura.id}, 'descripcion', this.innerText)">${asignatura.descripcion}</td>
                <td>${asignatura.grado.nombre || 'Desconocido'}</td>
                <td>
                    <button class="btn-delete" onclick="eliminarAsignatura(${asignatura.id})">Eliminar</button>
                </td>
            `;
            tabla.appendChild(row);
        });
    } catch (error) {
        alert('Error al obtener las asignaturas: ' + error.message);
    }
}

async function actualizarAsignatura(id, campo, nuevoValor) {
    const asignaturaData = {};

    
    if (campo === 'codigo') {
        asignaturaData.codigo = nuevoValor;
    } else if (campo === 'nombre') {
        asignaturaData.nombre = nuevoValor;
    } else if (campo === 'descripcion') {
        asignaturaData.descripcion = nuevoValor;
    }

    try {
        const response = await axios.patch(`${BASE_URL_ASIGNATURA_CREAR}/${id}`, asignaturaData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        alert('Asignatura actualizada correctamente');
        obtenerAsignaturas();  
    } catch (error) {
        alert('Error al actualizar la asignatura: ' + error.message);
    }
}

async function eliminarAsignatura(id) {
    try {
        await axios.delete(`${BASE_URL_ASIGNATURA_CREAR}/${id}`);
        alert('Asignatura eliminada correctamente');
        obtenerAsignaturas(); 
    } catch (error) {
        alert('Error al eliminar la asignatura: ' + error.message);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    cargarGrados();  
    obtenerAsignaturas(); 
    const formulario = document.querySelector('form');
    formulario.addEventListener('submit', registrarAsignatura);  
});  
