const BASE_URL_ASISTENCIA_LISTA = "https://control-academico.up.railway.app/api/v1/asistencias";
const BASE_URL_ASISTENCIA_CREA = "https://control-academico.up.railway.app/api/v1/asistencia";
const BASE_URL_ASIGNATURA_LISTA = "https://control-academico.up.railway.app/api/v1/asignaturas";
const BASE_URL_ALUMNO_LISTA = "https://control-academico.up.railway.app/api/v1/alumnos";
const BASE_URL_MAESTRO_LISTA = "https://control-academico.up.railway.app/api/v1/maestros";

async function cargarAsignaturas() {
    try {
        const response = await axios.get(BASE_URL_ASIGNATURA_LISTA);
        const asignaturas = response.data;
        const asignaturaSelect = document.getElementById('asignatura');
        asignaturaSelect.innerHTML = '';

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Seleccione una asignatura';
        asignaturaSelect.appendChild(defaultOption);

        asignaturas.forEach(asignatura => {
            const option = document.createElement('option');
            option.value = asignatura.id;
            option.textContent = asignatura.nombre;
            asignaturaSelect.appendChild(option);
        });

        if (asignaturas.length === 0) {
            alert('No se encontraron asignaturas.');
        }
    } catch (error) {
        alert('Error al cargar las asignaturas: ' + error.message);
    }
}

async function cargarAlumnos() {
    try {
        const response = await axios.get(BASE_URL_ALUMNO_LISTA);
        const alumnos = response.data;
        const alumnoSelect = document.getElementById('alumno-id');
        alumnoSelect.innerHTML = '';

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Seleccione un alumno';
        alumnoSelect.appendChild(defaultOption);

        alumnos.forEach(alumno => {
            const option = document.createElement('option');
            option.value = alumno.id;
            option.textContent = `${alumno.persona.nombre} ${alumno.persona.apellido}`;
            alumnoSelect.appendChild(option);
        });

        if (alumnos.length === 0) {
            alert('No se encontraron alumnos.');
        }
    } catch (error) {
        alert('Error al cargar los alumnos: ' + error.message);
    }
}

async function cargarMaestros() {
    try {
        const response = await axios.get(BASE_URL_MAESTRO_LISTA);
        const maestros = response.data;
        const maestroSelect = document.getElementById('maestro-id');
        maestroSelect.innerHTML = '';

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Seleccione un maestro';
        maestroSelect.appendChild(defaultOption);

        maestros.forEach(maestro => {
            const option = document.createElement('option');
            option.value = maestro.id;
            option.textContent = `${maestro.persona.nombre} ${maestro.persona.apellido} (${maestro.persona.cedula})`;
            maestroSelect.appendChild(option);
        });

        if (maestros.length === 0) {
            alert('No se encontraron maestros.');
        }
    } catch (error) {
        alert('Error al cargar los maestros: ' + error.message);
    }
}

async function cargarAsistencias() {
    try {
        const response = await axios.get(BASE_URL_ASISTENCIA_LISTA);
        const asistencias = response.data;
        const tablaAsistencias = document.getElementById('tabla-asistencias');
        tablaAsistencias.innerHTML = '';
        
        asistencias.forEach(asistencia => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${asistencia.id}</td>
                <td contenteditable="true" class="editable" onblur="actualizarAsistencia(${asistencia.id}, 'fecha', this.innerText)">${new Date(asistencia.fecha).toLocaleString()}</td>
                <td contenteditable="true" class="editable" onblur="actualizarAsistencia(${asistencia.id}, 'asignatura', this.innerText)">${asistencia.asignatura}</td>
                <td contenteditable="true" class="editable" onblur="actualizarAsistencia(${asistencia.id}, 'alumno', this.innerText)">${asistencia.alumno.persona.nombre} ${asistencia.alumno.persona.apellido}</td>
                <td contenteditable="true" class="editable" onblur="actualizarAsistencia(${asistencia.id}, 'maestro', this.innerText)">${asistencia.maestro.persona.nombre} ${asistencia.maestro.persona.apellido}</td>
                <td>
                    <button class="btn-eliminar" onclick="eliminarAsistencia(${asistencia.id})">Eliminar</button>
                </td>
            `;
            tablaAsistencias.appendChild(row);
        });
    } catch (error) {
        alert('Error al cargar las asistencias: ' + error.message);
    }
}

async function actualizarAsistencia(id, campo, nuevoValor) {
    const asistenciaData = {};

    if (campo === 'fecha') {
        asistenciaData.fecha = nuevoValor;
    } else if (campo === 'asignatura') {
        asistenciaData.asignatura = nuevoValor;
    } else if (campo === 'alumno') {
        
        asistenciaData.alumno = { nombre: nuevoValor };
    } else if (campo === 'maestro') {
       
        asistenciaData.maestro = { nombre: nuevoValor };
    }

    try {
        const response = await axios.patch(`${BASE_URL_ASISTENCIA_CREA}/${id}`, asistenciaData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        alert('Asistencia actualizada correctamente');
        cargarAsistencias(); 
    } catch (error) {
        alert('Error al actualizar la asistencia: ' + error.message);
    }
}

async function eliminarAsistencia(id) {
    try {
        await axios.delete(`${BASE_URL_ASISTENCIA_CREA}/${id}`);
        alert('Asistencia eliminada correctamente');
        cargarAsistencias(); 
    } catch (error) {
        alert('Error al eliminar la asistencia: ' + error.message);
    }
}

async function agregarAsistencia(event) {
    event.preventDefault();
    const form = document.getElementById('form-asistencia');
    const formData = new FormData(form);

    const asignaturaSelect = document.getElementById('asignatura');
    const asignaturaNombre = asignaturaSelect.options[asignaturaSelect.selectedIndex].textContent;

    const nuevaAsistencia = {
        fecha: formData.get('asistencia_fecha'),
        asignatura: asignaturaNombre,
        alumno: { id: formData.get('fk_alumno_id') },
        maestro: { id: formData.get('fk_maestro_id') }
    };

    try {
        await axios.post(BASE_URL_ASISTENCIA_CREA, nuevaAsistencia);
        alert('Asistencia registrada correctamente');
        cargarAsistencias();
        form.reset();
    } catch (error) {
        alert('Error al registrar la asistencia: ' + error.message);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    cargarAsignaturas();
    cargarAlumnos();
    cargarMaestros();
    cargarAsistencias();
});

const form = document.getElementById('form-asistencia');
form.addEventListener('submit', agregarAsistencia);
