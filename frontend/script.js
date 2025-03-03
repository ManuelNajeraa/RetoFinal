document.addEventListener("DOMContentLoaded", function () {
    const registrationForm = document.getElementById("registration-form");

    if (registrationForm) {
        registrationForm.addEventListener("submit", function (event) {
            event.preventDefault(); 

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            let users = JSON.parse(localStorage.getItem("users")) || [];

            // Verificar si el usuario ya existe
            if (users.some(user => user.email === email)) {
                showMessage("Este correo ya está registrado.", "error");
                return;
            }

            // Determinar el rol del usuario
            let role = email.endsWith("@admin.com") ? "admin" : "user";

            // Agregar el usuario
            users.push({ name, email, password, role });
            localStorage.setItem("users", JSON.stringify(users));

            showMessage(`Usuario registrado como ${role}`, "success");
            registrationForm.reset();
        });
    }

    // Redirección a las páginas de inicio de sesión
    document.getElementById("admin-login").addEventListener("click", function () {
        window.location.href = "src/Web/admin-login.html";
    });

    document.getElementById("user-login").addEventListener("click", function () {
        window.location.href = "src/Web/user-login.html";
    });
});

// Función para mostrar mensajes en pantalla
function showMessage(message, type) {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}
