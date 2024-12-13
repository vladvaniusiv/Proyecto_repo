document.addEventListener('DOMContentLoaded', () => {
    const whatsappSwitch = document.getElementById('whatsappSwitch');
    const telefono = document.getElementById('telefono');

    // Hacer que el teléfono sea obligatorio si el switch está activo
    whatsappSwitch.addEventListener('change', () => {
        if (whatsappSwitch.checked) {
            telefono.setAttribute('required', 'required');
        } else {
            telefono.removeAttribute('required');
        }
    });

    // Validación Bootstrap personalizada
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });

    // Lógica para añadir otra mascota
    const addPetBtn = document.getElementById('addPetBtn');
    addPetBtn.addEventListener('click', () => {
        const petFields = `
        <div class="col-md-6 form-floating">
            <input type="text" class="form-control" id="nombreMascota" placeholder="Nombre de la Mascota" required>
            <label for="nombreMascota">Nombre de la Mascota</label>
            <div class="invalid-feedback">
              Por favor ingresa el nombre de tu mascota.
            </div>
        </div>
    
        <div class="col-md-6">
            <select class="form-select" id="tipoMascota" required>
              <option selected disabled value="">Tipo de Mascota</option>
              <option value="Perro">Perro</option>
              <option value="Gato">Gato</option>
              <option value="Otro">Otro</option>
            </select>
            <div class="invalid-feedback">
              Por favor selecciona el tipo de tu mascota.
            </div>
        </div>
    
        <div class="col-md-6 form-floating mb-3">
            <input type="text" class="form-control" id="raza" placeholder="Raza">
            <label for="raza">Raza</label>
        </div>
    
        <div class="col-md-6 form-floating mb-3">
            <input type="number" class="form-control" id="edad" placeholder="Edad" min="0">
            <label for="edad">Edad</label>
        </div>
        
        <div class="col-12 mb-3">
            <button type="button" class="btn btn-danger removePetBtn">Eliminar</button>
        </div>`;

        const container = document.createElement('div');
        container.classList.add('row', 'g-3');
        container.innerHTML = petFields;
        addPetBtn.insertAdjacentElement('beforebegin', container);

        // Agregar evento de eliminación para la nueva mascota
        const removePetBtn = container.querySelector('.removePetBtn');
        removePetBtn.addEventListener('click', () => {
            container.remove();
        });
    });
});