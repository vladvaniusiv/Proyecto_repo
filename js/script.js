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
      playa: { title: "Playa de Pinedo", description: "LUna playa cercana al centro de València donde las mascotas pueden disfrutar del mar y la arena.", img: "img/playa1.jpg" },
      hotel: { title: "Hotel Ilunion Aqua 4", description: "Un hotel moderno y cómodo que admite mascotas y cuenta con amplios parques cercanos.", img: "img/hotel1.jpg" },
      cafeteria: { title: "Café Dulce de Leche", description: "Una cafetería con terraza acogedora donde las mascotas son bienvenidas mientras disfrutas de un brunch.", img: "img/cafetería1.jpg" },
    },
    {
      city: "Barcelona",
      playa: { title: "Playa de Llevant", description: "La Playa de Llevant en Barcelona cuenta con una zona especialmente habilitada para mascotas. Perfecta para disfrutar del mar Mediterráneo junto a tu compañero peludo.", img: "img/playa2.jpg" },
      hotel: { title: "Hotel W Barcelona", description: "Un hotel lujoso frente al mar que ofrece paquetes VIP para mascotas.", img: "img/hotel2.jpg" },
      cafeteria: { title: "Café Espai de Gats", description: "Un espacio especial donde puedes disfrutar de un café acompañado de tu mascota o conocer gatos adoptables.", img: "img/cafetería2.jpg" },
    },
    {
      city: "Madrid",
      playa: { title: "Madrid Río", description: "Un enorme parque junto al río Manzanares con caminos ideales para pasear con mascotas.", img: "img/playa3.jpg" },
      hotel: { title: "Hotel Only YOU Atocha", description: "Un hotel boutique pet-friendly con camas y snacks especiales para mascotas.", img: "img/hotel3.jpg" },
      cafeteria: { title: "Café Federal", description: "Una cafetería con una amplia terraza perfecta para disfrutar con tu mascota en pleno centro.", img: "img/cafetería3.jpg" },
    },
    {
      city: "París",
      playa: { title: "Bosque de Vincennes - Lago Daumesnil", description: "Un hermoso espacio natural con caminos alrededor del lago donde las mascotas son bienvenidas.", img: "img/playa4.jpg" },
      hotel: { title: "Hotel Le Bristol", description: "Un hotel de lujo en París que ofrece un servicio VIP para mascotas, incluyendo camas y delicias.", img: "img/hotel4.jpg" },
      cafeteria: { title: "Café Pattes Douces", description: "Un café encantador en el centro de París con un menú especial para mascotas y cómodas terrazas.", img: "img/cafetería4.jpg" },
    },
    {
      city: "Marsella",
      playa: { title: "Playa Prado Nord", description: "Una playa pet-friendly con zonas tranquilas para pasear con mascotas junto al Mediterráneo.", img: "img/playa1.jpg" },
      hotel: { title: "Hotel NH Collection Marseille", description: "Un hotel céntrico que admite mascotas y ofrece servicios adaptados para ellas.", img: "img/hotel1.jpg" },
      cafeteria: { title: "Café L’Écomotive", description: "Un café ecológico y pet-friendly con una terraza acogedora cerca de la estación Saint-Charles.", img: "img/cafetería1.jpg" },
    },
    {
      city: "Roma",
      playa: { title: "Playa Bau Beach", description: "Una playa perfecta para mascotas, equipada con duchas, sombra y espacios para correr.", img: "img/playa5.jpg" },
      hotel: { title: "Hotel Cavalieri Waldorf Astoria", description: "Un hotel de lujo en Roma que ofrece camas, paseos y menús especiales para mascotas.", img: "img/playa5.jpg" },
      cafeteria: { title: "Café Pet Lovers Roma", description: "Una cafetería única que ofrece opciones gourmet tanto para humanos como para mascotas.", img: "img/playa5.jpg" },
    },
    {
      city: "Venecia",
      playa: { title: "Paseos en los canales junto a la isla Lido", description: "Disfruta de un paseo tranquilo junto a tu mascota por las áreas menos concurridas del Lido.", img: "img/playa5.jpg" },
      hotel: { title: "Hotel Ai Reali", description: "Un hotel lujoso que recibe a las mascotas con camas y cuidados especiales en pleno centro de Venecia.", img: "img/playa5.jpg" },
      cafeteria: { title: "Café Torrefazione Cannaregio", description: "Una cafetería pet-friendly famosa por su café artesanal y un espacio cómodo para descansar.", img: "img/playa5.jpg" },
    },
    {
      city: "Milán",
      playa: { title: "Parque Sempione", description: "El parque más famoso de Milán, ideal para pasear con tu mascota junto al lago y zonas verdes.", img: "img/playa5.jpg" },
      hotel: { title: "Hotel Principe di Savoia", description: "Un hotel de lujo que ofrece paquetes especiales y camas VIP para mascotas.", img: "img/playa5.jpg" },
      cafeteria: { title: "Café Panini Durini", description: "Una cadena de cafeterías pet-friendly perfecta para disfrutar de un desayuno o aperitivo con tu mascota.", img: "img/playa5.jpg" },
    },
    {
      city: "Berlín",
      playa: { title: "Lago Wannsee", description: "Un lugar tranquilo donde puedes pasear y nadar con tu mascota en una zona dedicada a los perros.", img: "img/playa6.jpg" },
      hotel: { title: "Hotel Michelberger", description: "Un hotel pet-friendly con un estilo único y acogedor que ofrece comodidad para ti y tu mascota.", img: "img/playa6.jpg" },
      cafeteria: { title: "Café Hundehaus", description: "Un café especialmente diseñado para mascotas con snacks saludables y espacios al aire libre.", img: "img/playa6.jpg" },
    },
    {
      city: "Múnich",
      playa: { title: "Englischer Garten", description: "Un extenso parque con ríos y lagos donde las mascotas pueden pasear y refrescarse en el agua.", img: "img/playa7.jpg" },
      hotel: { title: "Hotel Vier Jahreszeiten Kempinski", description: "Un hotel elegante que admite mascotas con atención especial y menús exclusivos para ellas.", img: "img/playa7.jpg" },
      cafeteria: { title: "Café Katzentempel", description: "Una cafetería temática donde las mascotas son bienvenidas y se ofrecen snacks vegetarianos.", img: "img/playa7.jpg" },
    },
    {
      city: "Valencia",
      playa: { title: "Parque Fernando Peñalver", description: "Un espacio verde amplio con senderos perfectos para pasear con tu mascota.", img: "img/playa2.jpg" },
      hotel: { title: "Hesperia WTC Valencia", description: "Un hotel pet-friendly con áreas para caminar con tu mascota y servicios dedicados.", img: "img/playa2.jpg" },
      cafeteria: { title: "Café Kaldi", description: "Un lugar acogedor con terraza para disfrutar de un buen café acompañado de tu mascota.", img: "img/playa2.jpg" },
    },
    {
      city: "Caracas",
      playa: { title: "Parque del Este", description: "Un enorme parque con lagos y amplios espacios verdes ideales para pasear con tu mascota.", img: "img/playa2.jpg" },
      hotel: { title: "Hotel Renaissance Caracas La Castellana", description: "Un hotel pet-friendly con instalaciones modernas y áreas cercanas para pasear a tu mascota.", img: "img/playa2.jpg" },
      cafeteria: { title: "Café Arabica", description: "Una cafetería con terrazas cómodas donde las mascotas son bien recibidas mientras disfrutas de un buen café.", img: "img/playa2.jpg" },
    },
    {
      city: "Mérida",
      playa: { title: "La Culata", description: "Un parque montañoso con vistas espectaculares y senderos ideales para pasear con mascotas.", img: "img/playa2.jpg" },
      hotel: { title: "Hotel Belensate", description: "Un hotel acogedor con amplios jardines donde tu mascota puede pasear libremente.", img: "img/playa2.jpg" },
      cafeteria: { title: "Café Venecia", description: "Un lugar rústico y encantador donde las mascotas son bienvenidas en su terraza al aire libre.", img: "img/playa2.jpg" },
    },
    {
      city: "Ciudad de México",
      playa: { title: "Condesa", description: "Un icónico parque pet-friendly con áreas verdes, fuentes y zonas dedicadas a perros.", img: "img/playa2.jpg" },
      hotel: { title: "Hotel Stara Hamburgo", description: "Un hotel boutique que ofrece comodidades para mascotas como camas especiales y snacks.", img: "img/playa2.jpg" },
      cafeteria: { title: "Café El Péndulo", description: "Una librería-cafetería con un ambiente relajado y pet-friendly donde puedes leer acompañado de tu mascota.", img: "img/playa2.jpg" },
    },
    {
      city: "Cancún",
      playa: { title: "Playa Coral (Mirador II)", description: "Una playa oficialmente pet-friendly con acceso directo al mar Caribe para que tu mascota disfrute.", img: "img/playa2.jpg" },
      hotel: { title: "DogFriendly Hotel Imperial Laguna Cancún", description: "Un hotel especializado en recibir a mascotas con áreas cercanas para jugar y caminar.", img: "img/playa2.jpg" },
      cafeteria: { title: "Café Nader", description: "Una cafetería famosa en Cancún con un ambiente tranquilo y terrazas aptas para mascotas.", img: "img/playa2.jpg" },
    },
    {
      city: "Miami",
      playa: { title: "Haulover Beach Dog Park", description: "Una playa pet-friendly donde tu perro puede correr libremente en la arena y nadar en el océano.", img: "img/playa2.jpg" },
      hotel: { title: "Kimpton EPIC Hotel", description: "Un hotel de lujo que ofrece camas, platos y servicios VIP para mascotas.", img: "img/playa2.jpg" },
      cafeteria: { title: "Panther Coffee", description: "Una cafetería con terrazas al aire libre perfecta para disfrutar un café junto a tu mascota.", img: "img/playa2.jpg" },
    },
    {
      city: "Nueva York",
      playa: { title: "Playa de Rockaway", description: "Una playa famosa en Nueva York donde las mascotas pueden disfrutar del mar.", img: "img/playa9.jpg" },
      hotel: { title: "The William Vale", description: "Un hotel moderno en Brooklyn que consiente a las mascotas con camas especiales y amenidades personalizadas.", img: "img/playa9.jpg" },
      cafeteria: { title: "Boris & Horton", description: "Un café icónico en Nueva York donde las mascotas son tan bienvenidas como los humanos.", img: "img/playa9.jpg" },
    },
    {
      city: "San Francisco",
      playa: { title: "Playa de Crissy Field", description: "Un lugar emblemático con vistas al Golden Gate donde las mascotas pueden correr libremente junto al mar.", img: "img/playa9.jpg" },
      hotel: { title: "Hotel Argonaut", description: "Un hotel boutique frente a la bahía que recibe a tus mascotas con comodidades y snacks especiales.", img: "img/playa9.jpg" },
      cafeteria: { title: "Café Dogpatch Boulders", description: "Un lugar ideal para tomar un café mientras tu mascota se relaja junto a ti en la terraza.", img: "img/playa9.jpg" },
    },
    {//FALTA A PARTIR DE AQUI
      city: "Tokio",
      playa: { title: "Playa Delfines", description: "La Playa Delfines es perfecta para disfrutar del mar con tu mascota.", img: "img/playa10.jpg" },
      hotel: { title: "Hotel Pet-Friendly Cancún", description: "Disfruta de un hotel cómodo con tu mascota a orillas del mar.", img: "img/playa10.jpg" },
      cafeteria: { title: "Café Playa Pet", description: "Un café ideal para disfrutar con tu mascota mientras ves el mar.", img: "img/playa10.jpg" },
    },
    {
      city: "Osaka",
      playa: { title: "Playa St Kilda", description: "La famosa playa de St Kilda...", img: "img/playa1.jpg" },
      hotel: { title: "Hotel Pet Haven", description: "Un alojamiento que mima...", img: "img/playa1.jpg" },
      cafeteria: { title: "Cafetería Bean & Bone", description: "Cafés deliciosos...", img: "img/playa1.jpg" },
    },
    {
      city: "Kyoto",
      playa: { title: "Playa St Kilda", description: "La famosa playa de St Kilda...", img: "img/playa1.jpg" },
      hotel: { title: "Hotel Pet Haven", description: "Un alojamiento que mima...", img: "img/playa1.jpg" },
      cafeteria: { title: "Cafetería Bean & Bone", description: "Cafés deliciosos...", img: "img/playa1.jpg" },
    },
    {
      city: "Bangkok",
      playa: { title: "Playa St Kilda", description: "La famosa playa de St Kilda...", img: "img/playa1.jpg" },
      hotel: { title: "Hotel Pet Haven", description: "Un alojamiento que mima...", img: "img/playa1.jpg" },
      cafeteria: { title: "Cafetería Bean & Bone", description: "Cafés deliciosos...", img: "img/playa1.jpg" },
    },
    {
      city: "Phuket",
      playa: { title: "Playa St Kilda", description: "La famosa playa de St Kilda...", img: "img/playa1.jpg" },
      hotel: { title: "Hotel Pet Haven", description: "Un alojamiento que mima...", img: "img/playa1.jpg" },
      cafeteria: { title: "Cafetería Bean & Bone", description: "Cafés deliciosos...", img: "img/playa1.jpg" },
    },
    {
      city: "El Cairo",
      playa: { title: "Playa St Kilda", description: "La famosa playa de St Kilda...", img: "img/playa1.jpg" },
      hotel: { title: "Hotel Pet Haven", description: "Un alojamiento que mima...", img: "img/playa1.jpg" },
      cafeteria: { title: "Cafetería Bean & Bone", description: "Cafés deliciosos...", img: "img/playa1.jpg" },
    },
    {
      city: "Alejandría",
      playa: { title: "Playa St Kilda", description: "La famosa playa de St Kilda...", img: "img/playa1.jpg" },
      hotel: { title: "Hotel Pet Haven", description: "Un alojamiento que mima...", img: "img/playa1.jpg" },
      cafeteria: { title: "Cafetería Bean & Bone", description: "Cafés deliciosos...", img: "img/playa1.jpg" },
    },
    {
      city: "Marrakech",
      playa: { title: "Playa St Kilda", description: "La famosa playa de St Kilda...", img: "img/playa1.jpg" },
      hotel: { title: "Hotel Pet Haven", description: "Un alojamiento que mima...", img: "img/playa1.jpg" },
      cafeteria: { title: "Cafetería Bean & Bone", description: "Cafés deliciosos...", img: "img/playa1.jpg" },
    },
    {
      city: "Casablanca",
      playa: { title: "Playa St Kilda", description: "La famosa playa de St Kilda...", img: "img/playa1.jpg" },
      hotel: { title: "Hotel Pet Haven", description: "Un alojamiento que mima...", img: "img/playa1.jpg" },
      cafeteria: { title: "Cafetería Bean & Bone", description: "Cafés deliciosos...", img: "img/playa1.jpg" },
    },
    {
      city: "Sídney",
      playa: { title: "Playa St Kilda", description: "La famosa playa de St Kilda...", img: "img/playa1.jpg" },
      hotel: { title: "Hotel Pet Haven", description: "Un alojamiento que mima...", img: "img/playa1.jpg" },
      cafeteria: { title: "Cafetería Bean & Bone", description: "Cafés deliciosos...", img: "img/playa1.jpg" },
    },
    {
      city: "Melbourne",
      playa: { title: "Playa St Kilda", description: "La famosa playa de St Kilda...", img: "img/playa1.jpg" },
      hotel: { title: "Hotel Pet Haven", description: "Un alojamiento que mima...", img: "img/playa1.jpg" },
      cafeteria: { title: "Cafetería Bean & Bone", description: "Cafés deliciosos...", img: "img/playa1.jpg" },
    },
    {
      city: "Auckland",
      playa: { title: "Playa St Kilda", description: "La famosa playa de St Kilda...", img: "img/playa1.jpg" },
      hotel: { title: "Hotel Pet Haven", description: "Un alojamiento que mima...", img: "img/playa1.jpg" },
      cafeteria: { title: "Cafetería Bean & Bone", description: "Cafés deliciosos...", img: "img/playa1.jpg" },
    },
    {
      city: "Wellington",
      playa: { title: "Playa St Kilda", description: "La famosa playa de St Kilda...", img: "img/playa1.jpg" },
      hotel: { title: "Hotel Pet Haven", description: "Un alojamiento que mima...", img: "img/playa1.jpg" },
      cafeteria: { title: "Cafetería Bean & Bone", description: "Cafés deliciosos...", img: "img/playa1.jpg" },
    }
  ];

  const container = document.querySelector(".dynamic-content"); // Contenedor donde añadir el HTML
  let globalSectionCounter = 0; // Contador global para las secciones
  let imageTotal = 4; // Total de imágenes por categoría
  let imageNumber = 1; // Inicialización del número de imagen global

  destinations.forEach((destino) => {
    const cityHTML = `
      <section class="container mt-5">
        <h1 class="text-center mb-5">Descubre ${destino.city} con tu Mascota</h1>

        <!-- Playa -->
        ${generateSectionHTML(destino.playa, destino.city, "playa", ++globalSectionCounter, imageNumber)}
        <!-- Hotel -->
        ${generateSectionHTML(destino.hotel, destino.city, "hotel", ++globalSectionCounter, imageNumber)}
        <!-- Cafetería -->
        ${generateSectionHTML(destino.cafeteria, destino.city, "cafetería", ++globalSectionCounter, imageNumber++)}
      </section>
    `;
    container.innerHTML += cityHTML;
    // Reiniciar el número de imagen si se supera el total
    if (imageNumber > imageTotal) {
      imageNumber = 1;
    }
  });

  // Función para generar HTML de cada sección
  function generateSectionHTML(sectionData, city, category, index, imageNumber) {
    const isReverse = index % 2 === 0 ? "flex-row-reverse" : ""; // Aplica flex-row-reverse si el índice global es par
    const sectionId = `${city}-${category}`;
    const imageUrl = `img/${category}${imageNumber}.jpg`; // Generamos la URL dinámica de la imagen

    return `
      <div class="row mb-4 align-items-center ${isReverse}" id="${sectionId}">
        <div class="col-md-6">
          <h2 class="text-center">${sectionData.title}</h2>
          <p>${sectionData.description}</p>
        </div>
        <div class="col-md-6" style="height: 400px; overflow: hidden;">
          <img src="${imageUrl}" class="img-fluid rounded w-100 h-100 object-fit-cover" alt="${sectionData.title}">
        </div>
      </div>
    `;
  }
});