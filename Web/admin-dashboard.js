document.addEventListener("DOMContentLoaded", function () {
    const userList = document.getElementById("user-list");
    const addUserForm = document.getElementById("add-user-form");
    const logoutButton = document.getElementById("logout");

    // Verificar si el usuario está autenticado como admin
    const isAuthenticated = checkAdminAuthentication();
    if (!isAuthenticated) {
        window.location.href = "admin-login.html"; // Redirigir si no está autenticado
    }

    // Cargar la lista de usuarios
    loadUserList();

    // Agregar un nuevo usuario
    addUserForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("new-name").value;
        const email = document.getElementById("new-email").value;
        const password = document.getElementById("new-password").value;

        let users = JSON.parse(localStorage.getItem("users")) || [];

        // Verificar si el correo ya está registrado
        if (users.some(user => user.email === email)) {
            alert("Este correo ya está registrado.");
            return;
        }

        // Agregar el nuevo usuario (por defecto es un usuario regular)
        users.push({ name, email, password, role: "user" });
        localStorage.setItem("users", JSON.stringify(users));

        alert("Usuario agregado correctamente.");
        loadUserList(); // Recargar la lista
    });

    // Función para cargar la lista de usuarios
    function loadUserList() {
        userList.innerHTML = ""; // Limpiar la lista antes de cargarla

        let users = JSON.parse(localStorage.getItem("users")) || [];
        users.forEach((user, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${user.name}</strong> - ${user.email}
                <button onclick="editUser(${index})">Editar</button>
                <button onclick="deleteUser(${index})">Eliminar</button>
            `;
            userList.appendChild(li);
        });
    }

    // Función para editar un usuario
    window.editUser = function (index) {
        const users = JSON.parse(localStorage.getItem("users"));
        const user = users[index];

        const newName = prompt("Nuevo nombre:", user.name);
        const newEmail = prompt("Nuevo correo electrónico:", user.email);
        const newPassword = prompt("Nueva contraseña:", user.password);

        if (newName && newEmail && newPassword) {
            user.name = newName;
            user.email = newEmail;
            user.password = newPassword;
            localStorage.setItem("users", JSON.stringify(users));
            alert("Usuario actualizado correctamente.");
            loadUserList(); // Recargar la lista
        }
    };

    // Función para eliminar un usuario
    window.deleteUser = function (index) {
        const users = JSON.parse(localStorage.getItem("users"));
        users.splice(index, 1); // Eliminar el usuario por índice
        localStorage.setItem("users", JSON.stringify(users));
        alert("Usuario eliminado.");
        loadUserList(); // Recargar la lista
    };

    // Cerrar sesión
    logoutButton.addEventListener("click", function () {
        window.location.href = "admin-login.html"; // Redirigir al login
    });
});

// Función para verificar si el administrador está autenticado
function checkAdminAuthentication() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const email = localStorage.getItem("admin-email");
    const password = localStorage.getItem("admin-password");

    return users.some(user => user.email === email && user.password === password && user.role === "admin");
}
