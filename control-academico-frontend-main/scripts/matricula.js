const BASE_URL_MATRICULA = "https://control-academico.up.railway.app/api/v1/matricula";  
const BASE_URL_MATRICULAS = "https://control-academico.up.railway.app/api/v1/matriculas"; 

let matriculaEditando = null; 

async function crearMatricula(event) {
    event.preventDefault(); 

    const fecha = document.getElementById('fecha').value;
    const precio = parseFloat(document.getElementById('precio').value);
    const comentarios = document.getElementById('comentarios').value;

    if (!fecha || !precio || !comentarios) {
        alert('Por favor, complete todos los campos');
        return;
    }

    const fechaFormateada = fecha; 

    const matriculaData = {
        fecha: fechaFormateada,
        precio: precio,
        comentarios: comentarios,
        abierta: 1  
    };

    try {
        if (matriculaEditando) {
            const response = await axios.put(`${BASE_URL_MATRICULA}/${matriculaEditando.id}`, matriculaData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            alert('Matrícula actualizada correctamente');
            matriculaEditando = null; 
            document.getElementById('form-matricula').reset();
            document.getElementById('cancelar-edicion').style.display = 'none';
        } else {
            const response = await axios.post(BASE_URL_MATRICULA, matriculaData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            alert('Matrícula registrada correctamente');
        }

        obtenerMatriculas(); 
    } catch (error) {
        if (error.response && error.response.data) {
            alert('Error al procesar la matrícula: ' + error.response.data);
        } else {
            alert('Error al procesar la matrícula: ' + error.message);
        }
    }
}

async function obtenerMatriculas() {
    try {
        const response = await axios.get(BASE_URL_MATRICULAS);
        const matriculas = response.data;

        const listaMatriculas = document.getElementById('matriculas-list');
        listaMatriculas.innerHTML = ''; 

        matriculas.forEach(matricula => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${matricula.id}</td>
                <td contenteditable="true" class="editable" onblur="actualizarMatricula(${matricula.id}, 'fecha', this.innerText)">${matricula.fecha}</td>
                <td contenteditable="true" class="editable" onblur="actualizarMatricula(${matricula.id}, 'precio', this.innerText)">${matricula.precio}</td>
                <td contenteditable="true" class="editable" onblur="actualizarMatricula(${matricula.id}, 'comentarios', this.innerText)">${matricula.comentarios}</td>
                <td>
                  <button class="btn-delete" onclick="eliminarMatricula(${matricula.id})">Eliminar</button>
                </td>
            `;
            listaMatriculas.appendChild(row);
        });
    } catch (error) {
        alert('Error al cargar las matrículas: ' + error.message);
    }
}

async function actualizarMatricula(id, campo, nuevoValor) {
    const matriculaData = {};

    
    if (campo === 'fecha') {
        matriculaData.fecha = nuevoValor;
    } else if (campo === 'precio') {
        matriculaData.precio = parseFloat(nuevoValor);  
    } else if (campo === 'comentarios') {
        matriculaData.comentarios = nuevoValor;
    }

    try {
        
        const response = await axios.patch(`${BASE_URL_MATRICULA}/${id}`, matriculaData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        alert('Matrícula actualizada correctamente');
        obtenerMatriculas();  
    } catch (error) {
        alert('Error al actualizar la matrícula: ' + error.message);
    }
}

async function eliminarMatricula(id) {
    try {
        const response = await axios.delete(`${BASE_URL_MATRICULA}/${id}`); 

        if (response.status === 200) {
            alert('Matrícula eliminada correctamente');
            obtenerMatriculas(); 
        } else {
            alert('Hubo un problema al intentar eliminar la matrícula.');
        }
    } catch (error) {
        alert('Error al eliminar la matrícula: ' + error.message);
    }
}

async function editarMatricula(id) {
    try {
        const response = await axios.get(`${BASE_URL_MATRICULA}/${id}`);
        const matricula = response.data;

        document.getElementById('fecha').value = matricula.fecha;
        document.getElementById('precio').value = matricula.precio;
        document.getElementById('comentarios').value = matricula.comentarios;

        document.getElementById('cancelar-edicion').style.display = 'inline-block';

        matriculaEditando = matricula;

        alert('Matrícula encontrada para editar');
    } catch (error) {
        alert('Error al obtener la matrícula para editar: ' + error.message);
    }
}

function cancelarEdicion() {
    document.getElementById('form-matricula').reset();
    matriculaEditando = null;
    document.getElementById('cancelar-edicion').style.display = 'none';
}

document.addEventListener("DOMContentLoaded", function () {
    obtenerMatriculas(); 
});
