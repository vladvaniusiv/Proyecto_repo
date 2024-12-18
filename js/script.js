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
  const categories = ["playa", "hotel", "cafetería"];
  
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
      playa: { title: "Playa de Pinedo", description: "LUna playa cercana al centro de <b>València</b> donde las mascotas pueden disfrutar del mar y la arena.", location: "<a href='https://maps.app.goo.gl/CqApL9iM5hoUw5TD9' class='link'>Playa de Pinedo</a>" },
      hotel: { title: "Hotel Ilunion Aqua 4", description: "Un hotel moderno y cómodo que admite mascotas y cuenta con amplios parques cercanos.", location: "<a href='https://maps.app.goo.gl/29RSPtVkDP6HhxiZ9' class='link'>Carrer de Luis García-Berlanga Martí, 21/a>" },
      cafeteria: { title: "La Fábrica de Huellas", description: "Una cafetería con terraza acogedora donde las mascotas son bienvenidas mientras disfrutas de un brunch.", location: "<a href='https://maps.app.goo.gl/D98RjD2qADYfAY8f7' class='link'>C/ del Túria, 60</a>" },
    },
    {
      city: "Barcelona",
      playa: { title: "Playa de Llevant", description: "La Playa de Llevant en Barcelona cuenta con una zona especialmente habilitada para mascotas. Perfecta para disfrutar del mar Mediterráneo junto a tu compañero peludo.", location: "<a href='https://maps.app.goo.gl/VR9Hj211aCPyyXSBA' class='link'>Passeig Marítim del Bogatell</a>" },
      hotel: { title: "Hotel W Barcelona", description: "Un hotel lujoso frente al mar que ofrece paquetes VIP para mascotas.", location: "<a href='https://maps.app.goo.gl/QhGdYwV67HbmnPc78' class='link'>Plaça Rosa Del Vents 1, Final, Pg. de Joan de Borbó</a>" },
      cafeteria: { title: "Café Espai de Gats", description: "Un espacio especial donde puedes disfrutar de un café acompañado de tu mascota o conocer gatos adoptables.", location: "<a href='https://maps.app.goo.gl/mn6vooUUBGL9DxGz6' class='link'>Carrer de Terol, 29</a>" },
    },
    {
      city: "Madrid",
      playa: { title: "Madrid Río", description: "Un enorme parque junto al río Manzanares con caminos ideales para pasear con mascotas.", location: "<a href='https://maps.app.goo.gl/y1HPfQQTXnUaFV6D7' class='link'>Av del Manzanares, 140</a>" },
      hotel: { title: "Hotel Only YOU Atocha", description: "Un hotel boutique pet-friendly con camas y snacks especiales para mascotas.", location: "<a href='https://maps.app.goo.gl/jFdyFEoW1Ke9qHZs9' class='link'>P.º de la Infanta Isabel, 13</a>" },
      cafeteria: { title: "Café Federal", description: "Una cafetería con una amplia terraza perfecta para disfrutar con tu mascota en pleno centro.", location: "<a href='https://maps.app.goo.gl/QdzMo6LWMHugnTQa7' class='link'>C/ de l'Ambaixador Vich, 15</a>" },
    },
    {
      city: "París",
      playa: { title: "Lac Daumesnil", description: "Un hermoso espacio natural con caminos alrededor del lago donde las mascotas son bienvenidas.", location: "<a href='https://maps.app.goo.gl/dyLAycQzH16ywvWy6' class='link'>Rte de Ceinture du Lac Daumesnil</a>" },
      hotel: { title: "Le Bristol Paris", description: "Un hotel de lujo en París que ofrece un servicio VIP para mascotas, incluyendo camas y delicias.", location: "<a href='https://maps.app.goo.gl/T56CUAXy9uvccben8' class='link'>112 Rue du Faubourg Saint-Honoré,</a>" },
      cafeteria: { title: "Seven Heaven", description: "Un café encantador en el centro de París con un menú especial para mascotas y cómodas terrazas.", location: "<a href='https://maps.app.goo.gl/8udTWWiUrLFRrkox9' class='link'>17 Rue de la Forge Royale</a>" },
    },
    {
      city: "Marsella",
      playa: { title: "Archipiélago de Frioul", description: "Increíbles playas de la Isla Friuli donde ningún cartel especifica prohibición. Para ir a las islas tendrás que tomar el barco lanzadera desde el puerto viejo y en 20 minutos estás allí", location: "<a href='https://maps.app.goo.gl/gA3PyeqB2GBZJAvJ9' class='link'>Îles du Frioul</a>" },
      hotel: { title: "Hotel NH Collection Marseille", description: "Un hotel céntrico que admite mascotas y ofrece servicios adaptados para ellas.", location: "<a href='https://maps.app.goo.gl/a7EhpgrqWEDdZhpf9' class='link'>37 Bd des Dames</a>" },
      cafeteria: { title: "L'Escalié", description: "Un restaurante pet-friendly con una terraza acogedora cerca de la parada del metro Notre-Dame du Mont.", location: "<a href='https://maps.app.goo.gl/mL1YKQCrD8c5movw7' class='link'>80 Cours Julien</a>" },
    },
    {//FALTA A PARTIR DE AQUI
      city: "Roma",
      playa: { title: "Playa Bau Beach", description: "Una playa perfecta para mascotas, equipada con duchas, sombra y espacios para correr.", location: "<a href='' class='link'>ubi</a>" },
      hotel: { title: "Hotel Cavalieri Waldorf Astoria", description: "Un hotel de lujo en Roma que ofrece camas, paseos y menús especiales para mascotas.", location: "<a href='' class='link'>ubi</a>" },
      cafeteria: { title: "Café Pet Lovers Roma", description: "Una cafetería única que ofrece opciones gourmet tanto para humanos como para mascotas.", location: "<a href='' class='link'>ubi</a>" },
    },
    {
      city: "Venecia",
      playa: { title: "Paseos en los canales junto a la isla Lido", description: "Disfruta de un paseo tranquilo junto a tu mascota por las áreas menos concurridas del Lido.", location: "<a href='' class='link'>ubi</a>" },
      hotel: { title: "Hotel Ai Reali", description: "Un hotel lujoso que recibe a las mascotas con camas y cuidados especiales en pleno centro de Venecia.", location: "<a href='' class='link'>ubi</a>" },
      cafeteria: { title: "Café Torrefazione Cannaregio", description: "Una cafetería pet-friendly famosa por su café artesanal y un espacio cómodo para descansar.", location: "<a href='' class='link'>ubi</a>" },
    },
    {
      city: "Milán",
      playa: { title: "Parque Sempione", description: "El parque más famoso de Milán, ideal para pasear con tu mascota junto al lago y zonas verdes.", location: "<a href='' class='link'>ubi</a>" },
      hotel: { title: "Hotel Principe di Savoia", description: "Un hotel de lujo que ofrece paquetes especiales y camas VIP para mascotas.", location: "<a href='' class='link'>ubi</a>" },
      cafeteria: { title: "Café Panini Durini", description: "Una cadena de cafeterías pet-friendly perfecta para disfrutar de un desayuno o aperitivo con tu mascota.", location: "<a href='' class='link'>ubi</a>" },
    },
    {
      city: "Berlín",
      playa: { title: "Lago Wannsee", description: "Un lugar tranquilo donde puedes pasear y nadar con tu mascota en una zona dedicada a los perros.", location: "<a href='' class='link'>ubi</a>" },
      hotel: { title: "Hotel Michelberger", description: "Un hotel pet-friendly con un estilo único y acogedor que ofrece comodidad para ti y tu mascota.", location: "<a href='' class='link'>ubi</a>" },
      cafeteria: { title: "Café Hundehaus", description: "Un café especialmente diseñado para mascotas con snacks saludables y espacios al aire libre.", location: "<a href='' class='link'>ubi</a>" },
    },
    {
      city: "Múnich",
      playa: { title: "Englischer Garten", description: "Un extenso parque con ríos y lagos donde las mascotas pueden pasear y refrescarse en el agua.", location: "<a href='' class='link'>ubi</a>" },
      hotel: { title: "Hotel Vier Jahreszeiten Kempinski", description: "Un hotel elegante que admite mascotas con atención especial y menús exclusivos para ellas.", location: "<a href='' class='link'>ubi</a>" },
      cafeteria: { title: "Café Katzentempel", description: "Una cafetería temática donde las mascotas son bienvenidas y se ofrecen snacks vegetarianos.", location: "<a href='' class='link'>ubi</a>" },
    },
    {
      city: "Valencia",
      playa: { title: "Parque Fernando Peñalver", description: "Un espacio verde amplio con senderos perfectos para pasear con tu mascota.", location: "<a href='' class='link'>ubi</a>" },
      hotel: { title: "Hesperia WTC Valencia", description: "Un hotel pet-friendly con áreas para caminar con tu mascota y servicios dedicados.", location: "<a href='' class='link'>ubi</a>" },
      cafeteria: { title: "Café Kaldi", description: "Un lugar acogedor con terraza para disfrutar de un buen café acompañado de tu mascota.", location: "<a href='' class='link'>ubi</a>" },
    },
    {
      city: "Caracas",
      playa: { title: "Parque del Este", description: "Un enorme parque con lagos y amplios espacios verdes ideales para pasear con tu mascota.", location: "<a href='' class='link'>ubi</a>" },
      hotel: { title: "Hotel Renaissance Caracas La Castellana", description: "Un hotel pet-friendly con instalaciones modernas y áreas cercanas para pasear a tu mascota.", location: "<a href='' class='link'>ubi</a>" },
      cafeteria: { title: "Café Arabica", description: "Una cafetería con terrazas cómodas donde las mascotas son bien recibidas mientras disfrutas de un buen café.", location: "<a href='' class='link'>ubi</a>" },
    },
    {
      city: "Mérida",
      playa: { title: "La Culata", description: "Un parque montañoso con vistas espectaculares y senderos ideales para pasear con mascotas.", location: "<a href='' class='link'>ubi</a>" },
      hotel: { title: "Hotel Belensate", description: "Un hotel acogedor con amplios jardines donde tu mascota puede pasear libremente.", location: "<a href='' class='link'>ubi</a>" },
      cafeteria: { title: "Café Venecia", description: "Un lugar rústico y encantador donde las mascotas son bienvenidas en su terraza al aire libre.", location: "<a href='' class='link'>ubi</a>" },
    },
    {
      city: "Ciudad de México",
      playa: { title: "Condesa", description: "Un icónico parque pet-friendly con áreas verdes, fuentes y zonas dedicadas a perros.", location: "<a href='' class='link'>ubi</a>" },
      hotel: { title: "Hotel Stara Hamburgo", description: "Un hotel boutique que ofrece comodidades para mascotas como camas especiales y snacks.", location: "<a href='' class='link'>ubi</a>" },
      cafeteria: { title: "Café El Péndulo", description: "Una librería-cafetería con un ambiente relajado y pet-friendly donde puedes leer acompañado de tu mascota.", location: "<a href='' class='link'>ubi</a>" },
    },
    {
      city: "Cancún",
      playa: { title: "Playa Coral (Mirador II)", description: "Una playa oficialmente pet-friendly con acceso directo al mar Caribe para que tu mascota disfrute.", location: "<a href='' class='link'>ubi</a>" },
      hotel: { title: "DogFriendly Hotel Imperial Laguna Cancún", description: "Un hotel especializado en recibir a mascotas con áreas cercanas para jugar y caminar.", location: "<a href='' class='link'>ubi</a>" },
      cafeteria: { title: "Café Nader", description: "Una cafetería famosa en Cancún con un ambiente tranquilo y terrazas aptas para mascotas.", location: "<a href='' class='link'>ubi</a>" },
    },
    {
      city: "Miami",
      playa: { title: "Haulover Beach Dog Park", description: "Una playa pet-friendly donde tu perro puede correr libremente en la arena y nadar en el océano.", location: "<a href='' class='link'>ubi</a>" },
      hotel: { title: "Kimpton EPIC Hotel", description: "Un hotel de lujo que ofrece camas, platos y servicios VIP para mascotas.", location: "<a href='' class='link'>ubi</a>" },
      cafeteria: { title: "Panther Coffee", description: "Una cafetería con terrazas al aire libre perfecta para disfrutar un café junto a tu mascota.", location: "<a href='' class='link'>ubi</a>" },
    },
    {
      city: "Nueva York",
      playa: { title: "Playa de Rockaway", description: "Una playa famosa en Nueva York donde las mascotas pueden disfrutar del mar.", location: "<a href='' class='link'>ubi</a>" },
      hotel: { title: "The William Vale", description: "Un hotel moderno en Brooklyn que consiente a las mascotas con camas especiales y amenidades personalizadas.", location: "<a href='' class='link'>ubi</a>" },
      cafeteria: { title: "Boris & Horton", description: "Un café icónico en Nueva York donde las mascotas son tan bienvenidas como los humanos.", location: "<a href='' class='link'>ubi</a>" },
    },
    {
      city: "San Francisco",
      playa: { title: "Playa de Crissy Field", description: "Un lugar emblemático con vistas al Golden Gate donde las mascotas pueden correr libremente junto al mar.", location: "<a href='' class='link'>ubi</a>" },
      hotel: { title: "Hotel Argonaut", description: "Un hotel boutique frente a la bahía que recibe a tus mascotas con comodidades y snacks especiales.", location: "<a href='' class='link'>ubi</a>" },
      cafeteria: { title: "Café Dogpatch Boulders", description: "Un lugar ideal para tomar un café mientras tu mascota se relaja junto a ti en la terraza.", location: "<a href='' class='link'>ubi</a>" },
    },
    {
      city: "Tokio",
      playa: { title: "Río Tama", description: "Un lugar popular para pasear y relajarse junto al agua, donde las mascotas son bienvenidas. Hay amplios espacios verdes y senderos para explorar.", location: "<a href='' class='link'>ubi</a>" },
      hotel: { title: "Hotel Kimpton Shinjuku Tokyo", description: "Un hotel de lujo que ofrece servicios exclusivos para mascotas, como camas y menús especiales.", location: "<a href='' class='link'>ubi</a>" },
      cafeteria: { title: "Deco’s Dog Café", description: "Una cafetería temática pet-friendly donde las mascotas son el centro de atención.", location: "<a href='' class='link'>ubi</a>" },
    },
    {
      city: "Osaka",
      playa: { title: "Río Yodogawa", description: "Un río con extensas áreas verdes ideales para disfrutar de un paseo con tu mascota, especialmente en las orillas del parque Yodogawa Kasen.", location: "<a href='' class='link'>ubi</a>" },
      hotel: { title: "Hotel Monterey La Soeur Osaka", description: "Un hotel acogedor que acepta mascotas y está bien ubicado para caminatas.", location: "<a href='' class='link'>ubi</a>" },
      cafeteria: { title: "Dog Tail Café", description: "Un café relajado donde puedes llevar a tu mascota y disfrutar de deliciosas bebidas.", location: "<a href='' class='link'>ubi</a>" },
    },
    {
      city: "Kyoto",
      playa: { title: "Río Kamo", description: "Un río icónico de Kyoto, rodeado de senderos peatonales donde puedes pasear con tu mascota mientras disfrutas de las vistas urbanas y naturales.", location: "<a href='' class='link'>ubi</a>" },
      hotel: { title: "Suiran, a Luxury Collection Hotel", description: "Un hotel exclusivo que acepta mascotas en habitaciones seleccionadas y ofrece jardines para pasear.", location: "<a href='' class='link'>ubi</a>" },
      cafeteria: { title: "Ninna Café", description: "Una cafetería rústica con vistas hermosas y terrazas donde las mascotas son bienvenidas.", location: "<a href='' class='link'>ubi</a>" },
    },
    {
      city: "Bangkok",
      playa: { title: "Río Chao Phraya", description: "En sus áreas abiertas y paseos junto al río, como Asiatique o Iconsiam, puedes disfrutar de un rato agradable con tu mascota en un ambiente relajado.", location: "<a href='' class='link'>ubi</a>" },
      hotel: { title: "The Peninsula Bangkok", description: "Un hotel de lujo con programas pet-friendly que incluyen camas y snacks especiales.", location: "<a href='' class='link'>ubi</a>" },
      cafeteria: { title: "Dog In Town Café", description: "Una cafetería única donde las mascotas pueden jugar libremente mientras disfrutas de un café.", location: "<a href='' class='link'>ubi</a>" },
    },
    {
      city: "Phuket",
      playa: { title: "Ao Yon Beach", description: "Una playa tranquila y menos concurrida en Phuket, ideal para pasear con tu mascota mientras disfrutas de la brisa marina.", location: "<a href='' class='link'>ubi</a>" },
      hotel: { title: "The Slate Phuket", description: "Un resort pet-friendly con amplios jardines y comodidades especiales para mascotas.", location: "<a href='' class='link'>ubi</a>" },
      cafeteria: { title: "Bake Dog Café", description: "Una cafetería rústica con área al aire libre donde tu mascota puede relajarse.", location: "<a href='' class='link'>ubi</a>" },
    },
    {
      city: "El Cairo",
      playa: { title: "Río Nilo (Corniche)", description: "Las áreas a lo largo del Corniche del Nilo son perfectas para caminar con tu mascota mientras disfrutas de las vistas al río.", location: "<a href='' class='link'>ubi</a>" },
      hotel: { title: "Four Seasons Hotel Cairo at Nile Plaza", description: "Un hotel de lujo que acepta mascotas y ofrece vistas panorámicas al río Nilo.", location: "<a href='' class='link'>ubi</a>" },
      cafeteria: { title: "Garden Promenade Café", description: "Una cafetería al aire libre donde tu mascota es bienvenida mientras disfrutas del ambiente tranquilo.", location: "<a href='' class='link'>ubi</a>" },
    },
    {
      city: "Alejandría",
      playa: { title: "Stanley Beach", description: "Una playa icónica en Alejandría donde puedes caminar con tu mascota en las áreas menos concurridas y disfrutar del Mediterráneo.", location: "<a href='' class='link'>ubi</a>" },
      hotel: { title: "Helnan Palestine Hotel", description: "Un hotel junto al mar que recibe a mascotas y ofrece áreas verdes para jugar.", location: "<a href='' class='link'>ubi</a>" },
      cafeteria: { title: "Délices Patisserie", description: "Un café clásico con terraza donde puedes disfrutar con tu mascota.", location: "<a href='' class='link'>ubi</a>" },
    },
    {
      city: "Marrakech",
      playa: { title: "Lalla Takerkoust", description: "Un lago ubicado a las afueras de Marrakech, ideal para excursiones de un día con tu mascota, rodeado de naturaleza y tranquilidad.", location: "<a href='' class='link'>ubi</a>" },
      hotel: { title: "Es Saadi Marrakech Resort", description: "Un lujoso hotel con jardines extensos y alojamiento pet-friendly.", location: "<a href='' class='link'>ubi</a>" },
      cafeteria: { title: "Café des Épices", description: "Un café bohemio en la medina con terraza abierta donde las mascotas son bienvenidas.", location: "<a href='' class='link'>ubi</a>" },
    },
    {
      city: "Casablanca",
      playa: { title: "Ain Diab Beach", description: "Una playa popular en Casablanca donde puedes pasear con tu mascota temprano en la mañana o en áreas tranquilas.", location: "<a href='' class='link'>ubi</a>" },
      hotel: { title: "Hyatt Regency Casablanca", description: "Un hotel céntrico que ofrece servicios exclusivos para mascotas.", location: "<a href='' class='link'>ubi</a>" },
      cafeteria: { title: "Café Bianca", description: "Un café moderno con área al aire libre apta para mascotas.", location: "<a href='' class='link'>ubi</a>" },
    },
    {
      city: "Sídney",
      playa: { title: "Sirius Cove Reserve", description: "Una playa pet-friendly donde los perros pueden correr sin correa en áreas específicas y disfrutar del agua.", location: "<a href='' class='link'>ubi</a>" },
      hotel: { title: "QT Sydney", description: "Un hotel moderno y pet-friendly que ofrece comodidades especiales para mascotas.", location: "<a href='' class='link'>ubi</a>" },
      cafeteria: { title: "The Grounds of Alexandria", description: "Una famosa cafetería con jardines y áreas pet-friendly.", location: "<a href='' class='link'>ubi</a>" },
    },
    {
      city: "Melbourne",
      playa: { title: "Brighton Dog Beach", description: "Una playa designada para perros en Melbourne donde las mascotas pueden correr y nadar libremente.", location: "<a href='' class='link'>ubi</a>" },
      hotel: { title: "Ovolo South Yarra", description: "Un hotel de diseño que recibe mascotas con amenidades especiales.", location: "<a href='' class='link'>ubi</a>" },
      cafeteria: { title: "Dog House Café", description: "Una cafetería exclusiva para dueños de mascotas con snacks y golosinas para perros.", location: "<a href='' class='link'>ubi</a>" },
    },
    {
      city: "Auckland",
      playa: { title: "Takapuna Beach", description: "Una playa amplia donde las mascotas son bienvenidas y pueden disfrutar del agua en ciertas áreas.", location: "<a href='' class='link'>ubi</a>" },
      hotel: { title: "SkyCity Hotel Auckland", description: "Un hotel céntrico pet-friendly con servicios dedicados para mascotas.", location: "<a href='' class='link'>ubi</a>" },
      cafeteria: { title: "Dear Jervois", description: "Una cafetería popular con terraza al aire libre ideal para mascotas.", location: "<a href='' class='link'>ubi</a>" },
    },
    {
      city: "Wellington",
      playa: { title: "Lyall Bay Beach", description: "Una playa pet-friendly en Wellington donde los perros pueden correr y jugar en la arena o el agua.", location: "<a href='' class='link'>ubi</a>" },
      hotel: { title: "QT Wellington", description: "Un hotel artístico que recibe mascotas y ofrece comodidades especiales.", location: "<a href='' class='link'>ubi</a>" },
      cafeteria: { title: "Beach Babylon", description: "Un café junto al mar donde las mascotas son bienvenidas en la terraza.", location: "<a href='' class='link'>ubi</a>" },
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
          <p>Ubicación: ${sectionData.location}</p>
        </div>
        <div class="col-md-6" style="height: 400px; overflow: hidden;">
          <img src="${imageUrl}" class="img-fluid rounded w-100 h-100 object-fit-cover" alt="${sectionData.title}">
        </div>
      </div>
    `;
  }
});