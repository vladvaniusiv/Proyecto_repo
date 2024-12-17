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


//FILTRO
document.addEventListener("DOMContentLoaded", function () {
  const filterContinent = document.getElementById('filter-continent');
  const filterCountry = document.getElementById('filter-country');
  const filterCity = document.getElementById('filter-city');
  const filterType = document.getElementById('filter-type');
  let cards; // Declarar cards globalmente

  // Datos jerárquicos: continentes, países y ciudades
  const data = {
    europa: {
      España: ["València", "Barcelona", "Madrid"],
      Francia: ["París", "Marsella"],
      Italia: ["Roma", "Venecia", "Milán"],
      Alemania: ["Berlín", "Múnich"]
    },
    america: {
      Venezuela: ["Valencia", "Caracas", "Mérida"],
      México: ["Ciudad de México", "Cancún"],
      'Estados Unidos': ["Miami", "Nueva York", "San Francisco"]
    },
    asia: {
      Japon: ["Tokio", "Osaka", "Kyoto"],
      Tailandia: ["Bangkok", "Phuket"]
    },
    africa: {
      Egipto: ["El Cairo", "Alejandría"],
      Marruecos: ["Marrakech", "Casablanca"]
    },
    oceania: {
      Australia: ["Sídney", "Melbourne"],
      'Nueva Zelanda': ["Auckland", "Wellington"]
    }
  };

  // Actualizar selectores dinámicamente
  function updateOptions(selectElement, options, includeAll = true) {
    selectElement.innerHTML = "";
    if (includeAll) selectElement.innerHTML += `<option value="all">Todos</option>`;
    options.forEach(option => {
      selectElement.innerHTML += `<option value="${option}">${option}</option>`;
    });
    selectElement.disabled = options.length === 0;
  }

  function updateCountries() {
    const continent = filterContinent.value;
    if (continent === "all") {
      updateOptions(filterCountry, []);
      updateOptions(filterCity, []);
    } else {
      const countries = Object.keys(data[continent]);
      updateOptions(filterCountry, countries);
      updateOptions(filterCity, []);
    }
    filterCards();
  }

  function updateCities() {
    const continent = filterContinent.value;
    const country = filterCountry.value;
    if (country === "all") {
      updateOptions(filterCity, []);
    } else {
      const cities = data[continent][country];
      updateOptions(filterCity, cities);
    }
    filterCards();
  }

  function filterCards() {
    const continent = filterContinent.value;
    const country = filterCountry.value;
    const city = filterCity.value;
    const type = filterType.value;

    // Seleccionar tarjetas dinámicamente después de generarlas
    cards = document.querySelectorAll('[data-continent]');

    cards.forEach(card => {
      const cardContinent = card.getAttribute('data-continent');
      const cardCountry = card.getAttribute('data-country');
      const cardCity = card.getAttribute('data-city');
      const cardType = card.getAttribute('data-type');

      if (
        (continent === "all" || cardContinent === continent) &&
        (country === "all" || cardCountry === country) &&
        (city === "all" || cardCity === city) &&
        (type === "all" || cardType === type)
      ) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Generar tarjetas dinámicamente
  const categories = ["playa", "hotel", "cafetería", "museo"];
  
  function generateCards() {
    const container = document.querySelector("#destinations .row.g-4");
    container.innerHTML = ""; // Limpiar tarjetas existentes
    let imageTotal=4;
    let imageNumber = 1;  // Comenzamos con la imagen1 para la primera ciudad
  
    Object.entries(data).forEach(([continent, countries]) => {
      Object.entries(countries).forEach(([country, cities]) => {
        cities.forEach(city => {
          // Para cada ciudad, generar tarjetas para todas las categorías con la misma imagen
          categories.forEach((category) => {
            const cardHTML = `
              <div class="col-md-4" 
                  data-continent="${continent}" 
                  data-country="${country}" 
                  data-city="${city}" 
                  data-type="${category}">
                <div class="card">
                  <div class="card-img-top" style="height: 250px; overflow: hidden;">
                    <a href="destinations.html#${city}-${category}"><img src="img/${category}${imageNumber}.jpg" 
                        class="w-100 h-100 object-fit-cover" 
                        alt="${city} - ${category} ${imageNumber}"></a>
                  </div>
                  <div class="card-body">
                    <h5 class="card-title">${capitalize(category)} en ${city}</h5>
                    <p class="card-text">Explora ${category} <b><i>pet-friendly</i></b> en ${city}, ${country} con tu mascota.</p>
                  </div>
                </div>
              </div>
            `;
            container.innerHTML += cardHTML; // Agregar tarjeta al contenedor
            // Después de generar las tarjetas de una ciudad, incrementamos la imagen
            imageNumber++;
      
            // Si hemos usado la imagen 4, volvemos a la imagen 1
            if (imageNumber > imageTotal) {
              imageNumber = 1;
            }
            });
          });
        });
      });
  


    filterCards(); // Filtrar después de generar las tarjetas
  }

  function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  // Ejecutar generación de tarjetas al cargar el DOM
  generateCards();

  // Escuchar cambios en los selectores
  filterContinent.addEventListener('change', updateCountries);
  filterCountry.addEventListener('change', updateCities);
  filterCity.addEventListener('change', filterCards);
  filterType.addEventListener('change', filterCards);
});



//DESTINATIONS
document.addEventListener("DOMContentLoaded", () => {
  const destinations = [
    {
      city: "València",
      playa: { title: "Playa Malvarrosa", description: "La playa más emblemática de València.", img: "img/playa2.jpg" },
      hotel: { title: "Hotel Relax", description: "Un hotel pet-friendly para una estancia tranquila.", img: "img/playa2.jpg" },
      cafeteria: { title: "Café Pet Friendly", description: "Café especializado en mascotas, junto a la playa.", img: "img/playa2.jpg" },
      museo: { title: "Museo de Arte Moderno", description: "Museo donde tu mascota también puede disfrutar del arte.", img: "img/playa2.jpg" },
    },
    {
      city: "Barcelona",
      playa: { title: "Playa de Llevant", description: "La Playa de Llevant en Barcelona cuenta con una zona especialmente habilitada para mascotas. Perfecta para disfrutar del mar Mediterráneo junto a tu compañero peludo.", img: "img/playa2.jpg" },
      hotel: { title: "Hotel Pet Paradise", description: "Un hotel pet-friendly para una estancia tranquila.", img: "img/playa2.jpg" },
      cafeteria: { title: "Cafetería Patitas Café", description: "Café especializado en mascotas, junto a la playa.", img: "img/playa2.jpg" },
      museo: { title: "Museo de Arte Moderno", description: "Museo donde tu mascota también puede disfrutar del arte.", img: "img/playa2.jpg" },
    },
    {
      city: "Madrid",
      playa: { title: "Playa Canina de Pinedo", description: "La Playa Canina de Pinedo es perfecta para disfrutar con tu mascota.", img: "img/playa8.jpg" },
      hotel: { title: "Hotel Pet-Friendly Madrid", description: "Un hotel dedicado a las mascotas con todos los servicios necesarios.", img: "img/playa8.jpg" },
      cafeteria: { title: "Cafetería Pet Lovers", description: "Disfruta de una bebida mientras tu mascota se relaja en nuestra terraza.", img: "img/playa8.jpg" },
      museo: { title: "Museo del Prado", description: "Un lugar perfecto para un paseo artístico con tu mascota.", img: "img/playa8.jpg" },
    },
    {
      city: "París",
      playa: { title: "Playa de la Costa Azul", description: "Disfruta del sol y la arena en la famosa costa francesa.", img: "img/playa3.jpg" },
      hotel: { title: "Hotel Le Chien", description: "Un hotel lujoso donde las mascotas son bienvenidas.", img: "img/playa3.jpg" },
      cafeteria: { title: "Café Pattes", description: "El café más acogedor para mascotas en París.", img: "img/playa3.jpg" },
      museo: { title: "Museo del Louvre", description: "Descubre arte mundial mientras paseas con tu mascota.", img: "img/playa3.jpg" },
    },
    {
      city: "Marsella",
      playa: { title: "Playa de Prado", description: "Disfruta de un día soleado con tu mascota en la Playa de Prado.", img: "img/playa4.jpg" },
      hotel: { title: "Hotel Marsella Pet", description: "Un hotel pet-friendly con amplias áreas para mascotas.", img: "img/playa4.jpg" },
      cafeteria: { title: "Café Canino", description: "Un lugar único para disfrutar de un café junto a tu amigo peludo.", img: "img/playa4.jpg" },
      museo: { title: "Museo al Aire Libre", description: "Descubre el arte mientras paseas con tu mascota.", img: "img/playa4.jpg" },
    },
    {
      city: "Roma",
      playa: { title: "Playa Ostia", description: "La mejor playa cerca de Roma, ideal para pasar el día con tu mascota.", img: "img/playa5.jpg" },
      hotel: { title: "Hotel Roma Pet", description: "Un hotel de lujo para ti y tu mascota en el corazón de Roma.", img: "img/playa5.jpg" },
      cafeteria: { title: "Café Roma Pets", description: "Cafés gourmet y pet-friendly para ti y tu mascota.", img: "img/playa5.jpg" },
      museo: { title: "Museo del Vaticano", description: "Un paseo por la historia junto a tu compañero peludo.", img: "img/playa5.jpg" },
    },
    {
      city: "Berlín",
      playa: { title: "Playa de Wannsee", description: "Una playa tranquila y relajante para disfrutar con tu mascota.", img: "img/playa6.jpg" },
      hotel: { title: "Hotel Berlin Pets", description: "El hotel ideal para una estancia confortable con tu mascota.", img: "img/playa6.jpg" },
      cafeteria: { title: "Café Pet Friendly", description: "Café acogedor donde tu mascota es siempre bienvenida.", img: "img/playa6.jpg" },
      museo: { title: "Museo Pergamon", description: "Descubre el arte de la antigua Roma mientras paseas con tu mascota.", img: "img/playa6.jpg" },
    },
    {
      city: "Múnich",
      playa: { title: "Playa de Starnberg", description: "Un hermoso lugar junto al lago para disfrutar del sol con tu mascota.", img: "img/playa7.jpg" },
      hotel: { title: "Hotel Múnich Pet", description: "Un hotel pet-friendly con amplias instalaciones para mascotas.", img: "img/playa7.jpg" },
      cafeteria: { title: "Café Perro Feliz", description: "Un café cálido y acogedor para disfrutar con tu mascota.", img: "img/playa7.jpg" },
      museo: { title: "Museo de Historia Natural", description: "Explora la historia natural mientras paseas con tu amigo peludo.", img: "img/playa7.jpg" },
    },
    {
      city: "Nueva York",
      playa: { title: "Playa de Rockaway", description: "Una playa famosa en Nueva York donde las mascotas pueden disfrutar del mar.", img: "img/playa9.jpg" },
      hotel: { title: "Hotel Pet Friendly NY", description: "Un hotel para ti y tu mascota con cómodas instalaciones.", img: "img/playa9.jpg" },
      cafeteria: { title: "Café Dog’s Paradise", description: "Un café donde tu mascota es bienvenida con snacks especiales.", img: "img/playa9.jpg" },
      museo: { title: "Museo Metropolitano de Arte", description: "Un paseo por arte mundial mientras disfrutas de tu compañía peluda.", img: "img/playa9.jpg" },
    },
    {
      city: "Cancún",
      playa: { title: "Playa Delfines", description: "La Playa Delfines es perfecta para disfrutar del mar con tu mascota.", img: "img/playa10.jpg" },
      hotel: { title: "Hotel Pet-Friendly Cancún", description: "Disfruta de un hotel cómodo con tu mascota a orillas del mar.", img: "img/playa10.jpg" },
      cafeteria: { title: "Café Playa Pet", description: "Un café ideal para disfrutar con tu mascota mientras ves el mar.", img: "img/playa10.jpg" },
      museo: { title: "Museo Maya de Cancún", description: "Descubre la cultura maya mientras paseas con tu mascota.", img: "img/playa10.jpg" },
    },
    {
      city: "Melbourne",
      playa: { title: "Playa St Kilda", description: "La famosa playa de St Kilda...", img: "img/playa1.jpg" },
      hotel: { title: "Hotel Pet Haven", description: "Un alojamiento que mima...", img: "img/playa1.jpg" },
      cafeteria: { title: "Cafetería Bean & Bone", description: "Cafés deliciosos...", img: "img/playa1.jpg" },
      museo: { title: "Jardines Botánicos Reales", description: "Un espacio cultural...", img: "img/playa1.jpg" },
    },
  ];

  const container = document.querySelector(".dynamic-content"); // Contenedor donde añadir el HTML

  destinations.forEach((destino) => {
    let sectionCounter = 0; // Reinicia el contador para cada ciudad

    const cityHTML = `
      <section class="container mt-5">
        <h1 class="text-center mb-5">Descubre ${destino.city} con tu Mascota</h1>

        <!-- Playa -->
        ${generateSectionHTML(destino.playa, destino.city, "playa", ++sectionCounter)}
        <!-- Hotel -->
        ${generateSectionHTML(destino.hotel, destino.city, "hotel", ++sectionCounter)}
        <!-- Cafetería -->
        ${generateSectionHTML(destino.cafeteria, destino.city, "cafetería", ++sectionCounter)}
        <!-- Museo -->
        ${generateSectionHTML(destino.museo, destino.city, "museo", ++sectionCounter)}
      </section>
    `;
    container.innerHTML += cityHTML;
  });

  // Función para generar HTML de cada sección
  function generateSectionHTML(sectionData, city, category, index) {
    const isReverse = index % 2 === 0 ? "flex-row-reverse" : ""; // Aplica flex-row-reverse si es par
    const sectionId = `${city}-${category}`;
    return `
      <div class="row mb-4 align-items-center ${isReverse}" id="${sectionId}">
        <div class="col-md-6">
          <h2 class="text-center">${sectionData.title}</h2>
          <p>${sectionData.description}</p>
        </div>
        <div class="col-md-6" style="height: 400px; overflow: hidden;">
          <img src="${sectionData.img}" class="img-fluid rounded w-100 h-100 object-fit-cover" alt="${sectionData.title}">
        </div>
      </div>
    `;
  }
});