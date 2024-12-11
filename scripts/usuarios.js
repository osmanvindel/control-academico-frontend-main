const BASE_URL_USUARIO_CREAR = "https://control-academico.up.railway.app/api/v1/usuario";
const BASE_URL_USUARIO_LISTA = "https://control-academico.up.railway.app/api/v1/usuarios";  
const BASE_URL_ROL_CREAR = "https://control-academico.up.railway.app/api/v1/rol";
const BASE_URL_ROL_LISTA = "https://control-academico.up.railway.app/api/v1/roles";

function toggleSection(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.remove('section-hidden');
        } else {
            section.classList.add('section-hidden');
        }
    });
}

async function cargarRoles() {
    try {
        const response = await axios.get(BASE_URL_ROL_LISTA);
        const roles = response.data;
        const rolSelect = document.getElementById('rol_id');
        rolSelect.innerHTML = '';  

        roles.forEach(rol => {
            const option = document.createElement('option');
            option.value = rol.id;
            option.textContent = rol.nombre;  
            rolSelect.appendChild(option);
        });

        if (roles.length === 0) {
            alert('No se encontraron roles en el sistema. Asegúrate de crear al menos un rol.');
        }
    } catch (error) {
        alert('Error al cargar los roles: ' + error.message);
    }
}

async function obtenerUsuarios() {
    try {
        const response = await axios.get(BASE_URL_USUARIO_LISTA);
        const usuarios = response.data;

        const listaUsuarios = document.getElementById('usuarios-lista').querySelector('tbody');
        listaUsuarios.innerHTML = '';  

        if (usuarios.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="4">No hay usuarios registrados.</td>`;  
            listaUsuarios.appendChild(row);
            return;
        }

        usuarios.forEach(usuario => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td contenteditable="true" onblur="actualizarUsuario(${usuario.id}, 'nombre', this.innerText)">${usuario.nombre}</td>
                <td contenteditable="true" onblur="actualizarUsuario(${usuario.id}, 'correo', this.innerText)">${usuario.correo}</td>
                <td contenteditable="true" onblur="actualizarUsuario(${usuario.id}, 'rol', this.innerText)">${usuario.rol.nombre}</td>
                <td>
                    <button class="btn-delete" onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
                </td>
            `;
            listaUsuarios.appendChild(row);
        });
    } catch (error) {
        alert('Error al cargar los usuarios: ' + error.message);
    }
}

async function registrarUsuario(event) {
    event.preventDefault();

    const nombre_usuario = document.getElementById('nombre_usuario').value;
    const correo = document.getElementById('correo').value;
    const rol_id = document.getElementById('rol_id').value;
    const password = document.getElementById('password').value; 

    if (!nombre_usuario || !correo || !rol_id || !password) {
        alert('Por favor, complete todos los campos');
        return;
    }

    const usuarioData = {
        nombre_usuario: nombre_usuario,
        correo: correo,
        password: password,
        fechaCreacion: new Date().toISOString(),
        rol: { id: rol_id }
    };

    try {
        const response = await axios.post(BASE_URL_USUARIO_CREAR, usuarioData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        alert('Usuario registrado correctamente');
        obtenerUsuarios(); 
    } catch (error) {
        alert('Error al registrar el usuario: ' + (error.response ? error.response.data : error.message));
    }
}

async function registrarRol(event) {
    event.preventDefault();

    const nombre_rol = document.getElementById('nombre_rol').value;

    if (!nombre_rol) {
        alert('Por favor, complete todos los campos');
        return;
    }

    const rolData = {
        nombre: nombre_rol
    };

    try {
        const response = await axios.post(BASE_URL_ROL_CREAR, rolData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        alert('Rol registrado correctamente');
        obtenerRoles();  
    } catch (error) {
        if (error.response) {
            console.error('Detalles del error:', error.response.data);
            alert('Error al registrar el rol: ' + JSON.stringify(error.response.data, null, 2));
        } else {
            alert('Error desconocido: ' + error.message);
        }
    }
}

async function obtenerRoles() {
    try {
        const response = await axios.get(BASE_URL_ROL_LISTA);
        const roles = response.data;

        const listaRoles = document.getElementById('roles-lista').querySelector('tbody');
        listaRoles.innerHTML = '';  

        if (roles.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="4">No hay roles registrados.</td>`;  
            listaRoles.appendChild(row);
            return;
        }

        roles.forEach(rol => {
            const operaciones = rol.operaciones && rol.operaciones.length > 0 ? rol.operaciones.join(', ') : 'No hay operaciones';

            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td contenteditable="true" onblur="actualizarRol(${rol.id}, 'nombre', this.innerText)">${rol.id}</td>  <!-- ID del rol -->
                <td contenteditable="true" onblur="actualizarRol(${rol.id}, 'nombre', this.innerText)">${rol.nombre}</td>
                <td>${operaciones}</td> <!-- Mostrar las operaciones si existen -->
                <td>
                    <button class="btn-delete" onclick="eliminarRol(${rol.id})">Eliminar</button>
                </td>
            `;
            listaRoles.appendChild(row);
        });
    } catch (error) {
        alert('Error al cargar los roles: ' + error.message);
    }
}

async function actualizarUsuario(id, campo, nuevoValor) {
    const usuarioData = {};

    if (campo === 'nombre') {
        usuarioData.nombre = nuevoValor;
    } else if (campo === 'correo') {
        usuarioData.correo = nuevoValor;
    } else if (campo === 'rol') {
        usuarioData.rol = { nombre: nuevoValor }; 
    }

    try {
        const response = await axios.patch(`${BASE_URL_USUARIO_CREAR}/${id}`, usuarioData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        alert('Usuario actualizado correctamente');
        obtenerUsuarios(); 
    } catch (error) {
        alert('Error al actualizar el usuario: ' + error.message);
    }
}


async function eliminarUsuario(id) {
    try {
        const response = await axios.delete(`${BASE_URL_USUARIO_CREAR}/${id}`);
        alert('Usuario eliminado correctamente');
        obtenerUsuarios(); 
    } catch (error) {
        alert('Error al eliminar el usuario: ' + error.message);
    }
}


async function actualizarRol(id, campo, nuevoValor) {
    const rolData = {};

    if (campo === 'nombre') {
        rolData.nombre = nuevoValor;
    }

    try {
        const response = await axios.patch(`${BASE_URL_ROL_CREAR}/${id}`, rolData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        alert('Rol actualizado correctamente');
        obtenerRoles(); 
    } catch (error) {
        alert('Error al actualizar el rol: ' + error.message);
    }
}


async function eliminarRol(id) {
    try {
        const response = await axios.delete(`${BASE_URL_ROL_CREAR}/${id}`);
        alert('Rol eliminado correctamente');
        obtenerRoles(); 
    } catch (error) {
        alert('Error al eliminar el rol: ' + error.message);
    }
}


cargarRoles();
obtenerUsuarios();
obtenerRoles();
