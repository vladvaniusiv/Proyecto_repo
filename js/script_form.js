document.addEventListener('DOMContentLoaded', () => {
  const whatsappSwitch = document.getElementById('whatsappSwitch');
  const telefono = document.getElementById('telefono');
  const forms = document.querySelectorAll('.needs-validation');
  const addPetBtn = document.getElementById('addPetBtn');
  const resetButton = document.getElementById('resetFormBtn');
  const confirmationModal = document.getElementById('confirmationModal');
  let petCounter = 1; // Contador para los campos de mascotas

  // Campos obligatorios y sus asteriscos iniciales
  const requiredFields = [
    { field: document.getElementById('nombre'), asterisk: document.getElementById('asterisco-nombre') },
    { field: document.getElementById('email'), asterisk: document.getElementById('asterisco-email') },
    { field: telefono, asterisk: document.getElementById('asterisco-telefono') },
    { field: document.getElementById('nombreMascota'), asterisk: document.getElementById('asterisco-nombreMascota') },
    { field: document.getElementById('tipoMascota'), asterisk: document.getElementById('asterisco-tipoMascota') }
  ];

  // Hacer que el teléfono sea obligatorio si el switch está activo
  whatsappSwitch.addEventListener('change', () => {
    if (whatsappSwitch.checked) {
      telefono.setAttribute('required', 'required');
      document.getElementById('asterisco-telefono').style.display = 'inline';
    } else {
      telefono.removeAttribute('required');
      document.getElementById('asterisco-telefono').style.display = 'none';
    }
  });

  // Ocultar el asterisco si un campo obligatorio se rellena
  const attachInputListener = (field, asterisk) => {
    field.addEventListener('input', () => {
      if (field.value.trim() !== "") {
        asterisk.style.display = 'none';
      } else {
        asterisk.style.display = 'inline';
      }
    });
  };

  requiredFields.forEach(({ field, asterisk }) => {
    attachInputListener(field, asterisk);
  });

  // Función para limpiar el formulario
  const resetForm = (form) => {
    form.reset(); // Reinicia todos los valores
    form.classList.remove('was-validated'); // Quita la validación visual
    // Restablece los asteriscos visibles
    document.querySelectorAll('.text-danger').forEach(asterisk => {
      asterisk.style.display = asterisk.id === 'asterisco-telefono' ? 'none' : 'inline';
    });
  };

  // Limpiar el formulario al presionar el botón de limpiar
  resetButton.addEventListener('click', () => {
    const form = resetButton.closest('form');
    resetForm(form);
  });

  // Validación Bootstrap personalizada
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        event.preventDefault();

        // Muestra el modal de confirmación
        const modalInstance = new bootstrap.Modal(confirmationModal);
        modalInstance.show();

        // Limpia el formulario después de mostrar el modal
        modalInstance._element.addEventListener('hidden.bs.modal', () => {
          resetForm(form);
        });
      }
      form.classList.add('was-validated');
    });
  });

  // Lógica para añadir otra mascota
  addPetBtn.addEventListener('click', () => {
    const currentCounter = petCounter++;
    const petFields = `
      <div class="col-md-6 form-floating">
          <input type="text" class="form-control" id="nombreMascota${currentCounter}" placeholder="Nombre de la Mascota" required>
          <label for="nombreMascota${currentCounter}">Nombre de la Mascota <span class="text-danger" id="asterisco-nombreMascota${currentCounter}">*</span></label>
          <div class="invalid-feedback">
          Por favor ingresa el nombre de tu mascota.
          </div>
      </div>

      <div class="col-md-6">
          <label for="tipoMascota${currentCounter}">Tipo de Mascota <span class="text-danger" id="asterisco-tipoMascota${currentCounter}">*</span></label>
          <select class="form-select" id="tipoMascota${currentCounter}" required>
          <option selected disabled value="">Selecciona el tipo de mascota</option>
          <option value="Perro">Perro</option>
          <option value="Gato">Gato</option>
          <option value="Otro">Otro</option>
          </select>
          <div class="invalid-feedback">
          Por favor selecciona el tipo de tu mascota.
          </div>
      </div>

      <div class="col-md-6 form-floating">
          <input type="text" class="form-control" id="raza${currentCounter}" placeholder="Raza">
          <label for="raza${currentCounter}">Raza</label>
      </div>

      <div class="col-md-6 form-floating">
          <input type="number" class="form-control" id="edad${currentCounter}" placeholder="Edad" min="0">
          <label for="edad${currentCounter}">Edad</label>
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

    // Agregar lógica para ocultar asteriscos en los nuevos campos
    const newRequiredFields = [
      { field: container.querySelector(`#nombreMascota${currentCounter}`), asterisk: container.querySelector(`#asterisco-nombreMascota${currentCounter}`) },
      { field: container.querySelector(`#tipoMascota${currentCounter}`), asterisk: container.querySelector(`#asterisco-tipoMascota${currentCounter}`) }
    ];

    newRequiredFields.forEach(({ field, asterisk }) => {
      attachInputListener(field, asterisk);
    });
  });
});