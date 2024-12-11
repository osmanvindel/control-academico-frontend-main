const BASE_URL_ALUMNO = "https://control-academico.up.railway.app/api/v1/alumno";
const BASE_URL_ALUMNOS = "https://control-academico.up.railway.app/api/v1/alumnos";
const BASE_URL_GRADOS = "https://control-academico.up.railway.app/api/v1/grados";
const BASE_URL_PADRES = "https://control-academico.up.railway.app/api/v1/padres-familia";
const BASE_URL_MATRICULA = "https://control-academico.up.railway.app/api/v1/matricula";
const BASE_URL_MATRICULAS = "https://control-academico.up.railway.app/api/v1/matriculas";

let alumnoEditando = null;

document.addEventListener("DOMContentLoaded", function () {
    cargarAlumnos();
    cargarGradosYPadres();
    cargarMatriculas();
});
const formulario = document.getElementById('formulario-alumno');
formulario.addEventListener('submit', guardarAlumno);


async function cargarAlumnos() {
    try {
        const response = await axios.get(BASE_URL_ALUMNOS);
        const alumnos = response.data;

        const listaAlumnos = document.getElementById('alumnos-list');
        listaAlumnos.innerHTML = '';

        alumnos.forEach(alumno => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${alumno.id}</td>
    <td>${alumno.matricula.fecha}</td>
    <td>${alumno.persona.cedula}</td>
    <td contenteditable="true" class="editable" onblur="editarAlumno(${alumno.id}, 'nombre', this.innerText)">${alumno.persona.nombre}</td>
    <td contenteditable="true" class="editable" onblur="editarAlumno(${alumno.id}, 'apellido', this.innerText)">${alumno.persona.apellido}</td>
    <td contenteditable="true" class="editable" onblur="editarAlumno(${alumno.id}, 'correo', this.innerText)">${alumno.persona.correo}</td>
    <td contenteditable="true" class="editable" onblur="editarAlumno(${alumno.id}, 'telefono', this.innerText)">${alumno.persona.telefonos?.[0]?.numero || 'N/A'}</td>
    <td contenteditable="true" class="editable" onblur="editarAlumno(${alumno.id}, 'departamento', this.innerText)">${alumno.persona.direccion.departamento}</td>
    <td contenteditable="true" class="editable" onblur="editarAlumno(${alumno.id}, 'municipio', this.innerText)">${alumno.persona.direccion.municipio}</td>
    <td contenteditable="true" class="editable" onblur="editarAlumno(${alumno.id}, 'barrio', this.innerText)">${alumno.persona.direccion.barrioColonia}</td>
    <td contenteditable="true" class="editable" onblur="editarAlumno(${alumno.id}, 'referencia', this.innerText)">${alumno.persona.direccion.referencia}</td>
    <td>(${alumno.padreFamilia.persona.cedula}) ${alumno.padreFamilia.persona.nombre}</td>
    <td>${alumno.grado.codigo}</td>
    <td>
        <button class="btn-edit" onclick="editarAlumno(${alumno.id})">Actualizar</button>
        <button class="btn-delete" onclick="eliminarAlumno(${alumno.id})">Eliminar</button>
    </td>
            `;
            listaAlumnos.appendChild(row);
        });
    } catch (error) {
        alert('Error al cargar los alumnos: ' + error.message);
    }
}


async function cargarGradosYPadres() {
    try {

        const gradosResponse = await axios.get(BASE_URL_GRADOS);
        const grados = gradosResponse.data;
        const gradoSelect = document.getElementById('grado');
        grados.forEach(grado => {
            const option = document.createElement('option');
            option.value = grado.id;
            option.textContent = grado.nombre;
            gradoSelect.appendChild(option);
        });


        const padresResponse = await axios.get(BASE_URL_PADRES);
        const padres = padresResponse.data;
        const padreSelect = document.getElementById('padre-familia');
        padres.forEach(padreFamilia => {
            const option = document.createElement('option');
            option.value = padreFamilia.id;
            option.textContent = padreFamilia.persona.nombre;
            padreSelect.appendChild(option);
        });


        await cargarMatriculas();

    } catch (error) {
        alert('Error al cargar los grados, padres de familia y matrículas: ' + error.message);
    }
}


async function cargarMatriculas() {
    try {
        const matriculasResponse = await axios.get(BASE_URL_MATRICULAS);
        const matriculas = matriculasResponse.data;
        const matriculaSelect = document.getElementById('matricula');
        console.log(matriculas);
        matriculas.forEach(matricula => {
            //if (matricula.activo === 'activo') {
            const option = document.createElement('option');
            option.value = matricula.id;
            option.textContent = matricula.fecha + ` (L.${matricula.precio})`; //${matricula.precio}
            matriculaSelect.appendChild(option);
            //}
        });
    } catch (error) {
        alert('Error al cargar las matrículas: ' + error.message);
    }
}


async function guardarAlumno(event) {
    event.preventDefault();

    //alert("CLICK FORMULARO")

    const matriculaId = document.getElementById('matricula').value;
    const cedula = document.getElementById('cedula').value;
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const correo = document.getElementById('correo').value;
    const telefono = document.getElementById('telefono').value;
    const padreFamiliaId = document.getElementById('padre-familia').value;
    const gradoId = document.getElementById('grado').value;
    const departamento = document.getElementById('departamento').value;
    const munucipio = document.getElementById('municipio').value;
    const ciudad = document.getElementById('ciudad').value;
    const barrioColonia = document.getElementById('barrio').value;
    const referencia = document.getElementById('referencia').value;

    if (!cedula || !nombre || !apellido || !correo || !telefono || !gradoId || !padreFamiliaId || !matriculaId) {
        alert('Por favor complete todos los campos');
        return;
    }

    const alumnoData = {
        persona: {
            cedula: cedula,
            nombre: nombre,
            apellido: apellido,
            correo: correo,
            telefonos: [
                {
                    numero: telefono
                }
            ],
            direccion: {
                departamento: departamento,
                municipio: munucipio,
                ciudad: ciudad,
                barrioColonia: barrioColonia,
                referencia: referencia
            }
        },
        grado: {
            id: gradoId
        },
        padreFamilia: {
            id: padreFamiliaId
        },
        matricula: {
            id: matriculaId
        }
    };

    try {
        if (alumnoData) {
            await axios.post(`${BASE_URL_ALUMNO}`, alumnoData);
            alert('Alumno creado correctamente');
            document.getElementById('formulario-alumno').reset();
            cargarAlumnos();
        } else {
            alert('Error');
        }
    } catch (error) {
        alert('Error al guardar el alumno: ' + error.message);
    }
}


async function eliminarAlumno(id) {
    try {
        await axios.delete(`${BASE_URL_ALUMNO}/${id}`);
        alert('Alumno eliminado correctamente');
        cargarAlumnos();
    } catch (error) {
        alert('Error al eliminar el alumno: ' + error.message);
    }
}


async function editarAlumno(id, campo, nuevoValor) {
    const alumnoData = {};

    if (campo === 'nombre') {
        alumnoData.nombre = nuevoValor;
    }
    else if (campo === 'apellido') {
        alumnoData.apellido = nuevoValor;
    }
    else if (campo === 'correo') {
        alumnoData.correo = nuevoValor;
    }
    else if (campo === 'telefono') {
        alumnoData.telefonos = {
            numero: nuevoValor
        };
    } else if (campo === 'departamento') {
        //alumnoData.departamento = nuevoValor;
        alumnoData.direccion = {
            departamento: nuevoValor
        };
    }
    else if (campo === 'municipio') {
        alumnoData.direccion = alumnoData.direccion || {}; alumnoData.direccion.municipio = nuevoValor;

    } else if (campo === 'barrio') {
        alumnoData.direccion = alumnoData.direccion || {}; alumnoData.direccion.barrioColonia = nuevoValor;
    } else if (campo === 'referencia') {
        alumnoData.direccion = alumnoData.direccion || {}; alumnoData.direccion.referencia = nuevoValor;
    }


    console.log(JSON.stringify(alumnoData));

    try {
        const response = await axios.patch(`${BASE_URL_ALUMNO}/${id}`, alumnoData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        alert('Alumno actualizado correctamente');
    } catch (error) {
        alert('Error al actualizar el alumno: ' + error.message);
    }

}
