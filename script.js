document.addEventListener("DOMContentLoaded", function() {
    const formulario = document.getElementById("formularioPaciente");
    const tablaPacientesBody = document.getElementById("tablaPacientes");

    const contadorLeve = document.getElementById("contadorLeve");
    const contadorModerado = document.getElementById("contadorModerado");
    const contadorUrgente = document.getElementById("contadorUrgente");
    const contadorCritico = document.getElementById("contadorCritico");

    let pacientesRegistrados = [];

    function actualizarContadores() {
        let cLeve = 0;
        let cModerado = 0;
        let cUrgente = 0;
        let cCritico = 0;

        pacientesRegistrados.forEach(paciente => {
            switch (paciente.gravedad) {
                case "leve":
                    cLeve++;
                    break;
                case "moderado":
                    cModerado++;
                    break;
                case "urgente":
                    cUrgente++;
                    break;
                case "critico":
                    cCritico++;
                    break;
            }
        });

        contadorLeve.textContent = cLeve;
        contadorModerado.textContent = cModerado;
        contadorUrgente.textContent = cUrgente;
        contadorCritico.textContent = cCritico;
    }

    function obtenerPrioridadGravedad(gravedad) {
        switch (gravedad) {
            case "critico":
                return 1;
            case "urgente":
                return 2;
            case "moderado":
                return 3;
            case "leve":
                return 4;
            default:
                return 5;
        }
    }

    function renderizarTabla() {
        pacientesRegistrados.sort((a, b) => {
            return obtenerPrioridadGravedad(a.gravedad) - obtenerPrioridadGravedad(b.gravedad);
        });

        tablaPacientesBody.innerHTML = "";

        const columnLabels = [
            "Nombre", "Edad", "Género", "Documento", "Síntomas",
            "Gravedad", "Tratamiento", "Medicamentos", "Exámenes", "Acción"
        ];

        pacientesRegistrados.forEach((paciente, index) => {
            const fila = document.createElement("tr");

            fila.className = `triaje-${paciente.gravedad}`;

            const examenesString = paciente.examenes.length > 0 ? paciente.examenes.join(", ") : "N/A";

            const datosPaciente = [
                paciente.nombre,
                paciente.edad,
                paciente.genero,
                paciente.documento,
                paciente.sintomas,
                paciente.gravedad.toUpperCase(),
                paciente.tratamiento,
                paciente.medicamentos,
                examenesString,
                `<button class="btn btn-danger btn-sm" data-index="${index}">Eliminar</button>`
            ];

            datosPaciente.forEach((dato, i) => {
                const td = document.createElement("td");
                td.setAttribute("data-label", columnLabels[i]);
                td.innerHTML = dato;
                fila.appendChild(td);
            });

            tablaPacientesBody.appendChild(fila);
        });

        actualizarContadores();
    }

    formulario.addEventListener("submit", function (e) {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const edad = parseInt(document.getElementById("edad").value);
        const genero = document.getElementById("genero").value;
        const documento = document.getElementById("documento").value.trim();
        const sintomas = document.getElementById("sintomas").value.trim();
        const gravedad = document.getElementById("gravedad").value;
        const tratamiento = document.getElementById("tratamiento").value.trim();
        const medicamentos = document.getElementById("medicamentos").value.trim();

        const selectExamenes = document.getElementById("examenes");
        const examenesSeleccionados = Array.from(selectExamenes.selectedOptions).map(option => option.value);

        if (!nombre || edad <= 0 || !documento || !sintomas || !tratamiento || !medicamentos) {
            alert("Por favor, completa todos los campos obligatorios correctamente.");
            return;
        }

        if (documento.length < 5) {
            alert("El documento debe tener al menos 5 caracteres.");
            return;
        }

        const nuevoPaciente = {
            nombre,
            edad,
            genero,
            documento,
            sintomas,
            gravedad,
            tratamiento,
            medicamentos,
            examenes: examenesSeleccionados
        };

        pacientesRegistrados.push(nuevoPaciente);
        renderizarTabla();

        this.reset();
    });

    tablaPacientesBody.addEventListener("click", function(e) {
        if (e.target.tagName === 'BUTTON' && e.target.classList.contains('btn-danger')) {
            const indexAEliminar = e.target.dataset.index;
            pacientesRegistrados.splice(indexAEliminar, 1);
            renderizarTabla();
        }
    });

    actualizarContadores();
});