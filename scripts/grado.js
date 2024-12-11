const BASE_URL_GRADO = "https://control-academico.up.railway.app/api/v1/grado";
const BASE_URL_GRADOS = "https://control-academico.up.railway.app/api/v1/grados";

let gradoId = null;  

async function registrarGrado(event) {
    event.preventDefault();

    const codigo = document.getElementById('codigo').value;
    const nombre = document.getElementById('nombre').value;
    const capacidad = parseInt(document.getElementById('capacidad').value, 10);
    const descripcion = document.getElementById('descripcion').value;

    if (!codigo || !nombre || !capacidad || !descripcion) {
        alert('Por favor, complete todos los campos');
        return;
    }

    const gradoData = {
        codigo: codigo,
        nombre: nombre,
        capacidad: capacidad,
        descripcion: descripcion
    };

    try {
        let response;
     
        if (gradoId === null) {
            response = await axios.post(BASE_URL_GRADO, gradoData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            alert('Grado registrado correctamente');
        } else {
            const grados = await obtenerGrados();
            const existeCodigo = grados.some(grado => grado.codigo === codigo && grado.id !== gradoId);

            if (existeCodigo) {
                alert('Error: Ya existe un grado con este código, prueba otro.');
                return; 
            }

            response = await axios.patch(`${BASE_URL_GRADO}/${gradoId}`, gradoData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            alert('Grado actualizado correctamente');
        }

        document.getElementById('form-grado').reset();
        obtenerGrados();
        gradoId = null; 
        document.querySelector('.btn-submit').textContent = 'Registrar Grado'; 

    } catch (error) {
        alert('Error al procesar el grado: ' + (error.response ? error.response.data : error.message));
    }
}


async function obtenerGrados() {
    try {
        const response = await axios.get(BASE_URL_GRADOS);
        const grados = response.data;

        const listaGrados = document.getElementById('grados-list');
        listaGrados.innerHTML = '';  

        grados.forEach(grado => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${grado.id}</td>
                <td contenteditable="true" class="editable" onblur="actualizarGrado(${grado.id}, 'codigo', this.innerText)">${grado.codigo}</td>
                <td contenteditable="true" class="editable" onblur="actualizarGrado(${grado.id}, 'nombre', this.innerText)">${grado.nombre}</td>
                <td contenteditable="true" class="editable" onblur="actualizarGrado(${grado.id}, 'capacidad', this.innerText)">${grado.capacidad}</td>
                <td contenteditable="true" class="editable" onblur="actualizarGrado(${grado.id}, 'descripcion', this.innerText)">${grado.descripcion}</td>
                <td>
                    <button class="btn-delete" onclick="eliminarGrado(${grado.id})">Eliminar</button>
                </td>
            `;
            listaGrados.appendChild(row);
        });
    } catch (error) {
        alert('Error al cargar los grados: ' + error.message);
    }
}

async function eliminarGrado(id) {
    try {
        const response = await axios.delete(`${BASE_URL_GRADO}/${id}`);
        if (response.status === 200) {
            alert('Grado eliminado correctamente');
            obtenerGrados(); 
        }
    } catch (error) {
        alert('Error al eliminar el grado: ' + error.message);
    }
}

async function actualizarGrado(id, campo, nuevoValor) {
    const gradoData = {};

    if (campo === 'codigo') {
        gradoData.codigo = nuevoValor;
    } else if (campo === 'nombre') {
        gradoData.nombre = nuevoValor;
    } else if (campo === 'capacidad') {
        gradoData.capacidad = parseInt(nuevoValor, 10);
    } else if (campo === 'descripcion') {
        gradoData.descripcion = nuevoValor;
    }

    try {
        const response = await axios.patch(`${BASE_URL_GRADO}/${id}`, gradoData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        alert('Grado actualizado correctamente');
    } catch (error) {
        alert('Error al actualizar el grado: ' + error.message);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    obtenerGrados(); 
    document.getElementById('form-grado').addEventListener('submit', registrarGrado);
});
