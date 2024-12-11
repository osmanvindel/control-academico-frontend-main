const BASE_URL_LISTA = "https://tu-api.com/api/v1/periodos"; 
const BASE_URL_CREAR = "https://tu-api.com/api/v1/periodo"; 

let periodoEditando = null; 


async function cargarPeriodos() {
    try {
        const response = await axios.get(BASE_URL_LISTA);
        const periodos = response.data;

        const tbody = document.getElementById('tabla-periodos').querySelector('tbody');
        tbody.innerHTML = ''; 

        periodos.forEach(periodo => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${periodo.id}</td>
                <td contenteditable="true" class="editable" onblur="actualizarPeriodo(${periodo.id}, 'codigo', this.innerText)">${periodo.codigo}</td>
                <td contenteditable="true" class="editable" onblur="actualizarPeriodo(${periodo.id}, 'fecha_inicio', this.innerText)">${periodo.fecha_inicio}</td>
                <td contenteditable="true" class="editable" onblur="actualizarPeriodo(${periodo.id}, 'fecha_fin', this.innerText)">${periodo.fecha_fin}</td>
                <td>${periodo.abierto ? 'Sí' : 'No'}</td>
                <td>
                    <button class="btn-edit" onclick="editarPeriodo(${periodo.id})">Editar</button>
                    <button class="btn-delete" onclick="eliminarPeriodo(${periodo.id})">Eliminar</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        alert('Error al cargar los periodos: ' + error.message);
    }
}


async function registrarPeriodo(event) {
    event.preventDefault(); 

    const codigo = document.getElementById('codigo').value;
    const fechaInicio = document.getElementById('fecha-inicio').value;
    const fechaFin = document.getElementById('fecha-fin').value;
    const abierto = document.getElementById('activo').value;  
    
    if (!codigo || !fechaInicio || !fechaFin || abierto === '') {
        alert('Por favor, complete todos los campos');
        return;
    }

  
    const periodoData = {
        codigo: codigo,
        fechaInicio: fechaInicio,  
        fechaFin: fechaFin,  
        abierto: parseInt(abierto) === 1  
    };

    try {
        if (periodoEditando) {
            
            const response = await axios.put(`${BASE_URL_CREAR}/${periodoEditando.id}`, periodoData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            alert('Periodo actualizado correctamente');
            periodoEditando = null;  
            document.getElementById('form-periodo').reset();  
        } else {
         
            const response = await axios.post(BASE_URL_CREAR, periodoData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            alert('Periodo registrado correctamente');
        }

        cargarPeriodos();  
    } catch (error) {
        alert('Error al procesar el periodo: ' + error.message);
    }
}


async function editarPeriodo(id) {
    try {
        const response = await axios.get(`${BASE_URL_CREAR}/${id}`);
        const periodo = response.data;

      
        document.getElementById('codigo').value = periodo.codigo;
        document.getElementById('fecha-inicio').value = periodo.fechaInicio;  
        document.getElementById('fecha-fin').value = periodo.fechaFin; 
        document.getElementById('activo').value = periodo.abierto ? '1' : '0';  

        periodoEditando = periodo; 

        
        document.getElementById('btn-registrar').disabled = true;

        alert('Periodo encontrado para editar');
    } catch (error) {
        alert('Error al obtener el periodo para editar: ' + error.message);
    }
}


async function eliminarPeriodo(id) {
    const confirmacion = confirm('¿Estás seguro de eliminar este periodo?');

    if (confirmacion) {
        try {
            const response = await axios.delete(`${BASE_URL_CREAR}/${id}`);
            alert('Periodo eliminado correctamente');
            cargarPeriodos(); 
        } catch (error) {
            alert('Error al eliminar el periodo: ' + error.message);
        }
    }
}


function habilitarRegistrar() {
    document.getElementById('btn-registrar').disabled = false;
}


document.addEventListener("DOMContentLoaded", function () {
    cargarPeriodos();  

    document.getElementById('form-periodo').addEventListener('submit', registrarPeriodo);

    
    document.getElementById('btn-registrar').addEventListener('click', habilitarRegistrar);
});
