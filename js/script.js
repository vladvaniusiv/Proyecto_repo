//FORMULARIO
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
      Venezuela: ["Valencia", "Caracas"],
      México: ["Ciudad de México", "Cancún"],
      'Estados Unidos': ["Miami", "Nueva York", "San Francisco"]
    },
    asia: {
      Japon: ["Tokio", "Osaka", "Kyoto"],
      Tailandia: ["Bangkok", "Phuket"]
    },
    africa: {
      Egipto: ["El Cairo", "Alejandría"],
      Marruecos: ["Casablanca"]
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


  // TARJETAS
  const categories = ["playa", "hotel", "cafetería"];
  
  function generateCards() {
    const container = document.querySelector("#destinations .row.g-4");
    container.innerHTML = ""; // Limpiar tarjetas existentes
    let imageTotal=7;
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
                <div class="card rounded-5 border-0">
                  <div class="card-img-top">
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
      playa: { title: "Playa de Pinedo", description: "Una playa cercana al centro de València donde las mascotas pueden disfrutar del mar y la arena. Ofrece un entorno natural perfecto para paseos relajantes y momentos de diversión. La tranquilidad del lugar lo hace ideal para desconectar del bullicio urbano, mientras los animales corren libres.", location: "<a href='https://maps.app.goo.gl/CqApL9iM5hoUw5TD9' class='link text-decoration-none text-success'>Playa de Pinedo</a>" },
      hotel: { title: "Hotel Ilunion Aqua 4", description: "Un hotel moderno y cómodo que admite mascotas y cuenta con amplios parques cercanos. Sus habitaciones están diseñadas para la comodidad de todos, y el personal es atento con los huéspedes peludos, proporcionando camas y accesorios especiales para ellos.", location: "<a href='https://maps.app.goo.gl/29RSPtVkDP6HhxiZ9' class='link text-decoration-none text-success'>Carrer de Luis García-Berlanga Martí, 21</a>" },
      cafeteria: { title: "La Fábrica de Huellas", description: "Una cafetería con terraza acogedora donde las mascotas son bienvenidas mientras disfrutas de un brunch. Además de su menú variado, es un lugar conocido por su ambiente cálido, ideal para disfrutar del sol y pasar un rato relajado.", location: "<a href='https://maps.app.goo.gl/D98RjD2qADYfAY8f7' class='link text-decoration-none text-success'>C/ del Túria, 60</a>" },
    },
    {
      city: "Barcelona",
      playa: { title: "Playa de Llevant", description: "La Playa de Llevant cuenta con una zona especialmente habilitada para mascotas, rodeada de un paisaje urbano que combina mar y ciudad. Perfecta para disfrutar del Mediterráneo junto a tu compañero peludo en un entorno seguro y amigable.", location: "<a href='https://maps.app.goo.gl/VR9Hj211aCPyyXSBA' class='link text-decoration-none text-success'>Passeig Marítim del Bogatell</a>" },
      hotel: { title: "Hotel W Barcelona", description: "Un hotel lujoso frente al mar con un diseño espectacular y vistas panorámicas. Ofrece paquetes VIP para mascotas, que incluyen camas de alta calidad y golosinas personalizadas. Es el lugar ideal para disfrutar de Barcelona con comodidad.", location: "<a href='https://maps.app.goo.gl/QhGdYwV67HbmnPc78' class='link text-decoration-none text-success'>Plaça Rosa Del Vents 1, Final, Pg. de Joan de Borbó</a>" },
      cafeteria: { title: "Café Espai de Gats", description: "Un espacio especial donde puedes disfrutar de un café acompañado de tu mascota o conocer gatos adoptables. Este acogedor café también fomenta la conciencia sobre la adopción y proporciona un ambiente tranquilo para socializar.", location: "<a href='https://maps.app.goo.gl/mn6vooUUBGL9DxGz6' class='link text-decoration-none text-success'>Carrer de Terol, 29</a>" },
    },
    {
      city: "Madrid",
      playa: { title: "Madrid Río", description: "Un enorme parque junto al río Manzanares con caminos ideales para pasear con mascotas. Este espacio verde cuenta con áreas de juego, zonas arboladas, y vistas impresionantes del entorno urbano, perfecto para un día de relax con tu mascota.", location: "<a href='https://maps.app.goo.gl/y1HPfQQTXnUaFV6D7' class='link text-decoration-none text-success'>Av del Manzanares, 140</a>" },
      hotel: { title: "Hotel Only YOU Atocha", description: "Un hotel boutique pet-friendly con camas y snacks especiales para mascotas. Su ambiente elegante y su atención personalizada aseguran una experiencia única para humanos y animales.", location: "<a href='https://maps.app.goo.gl/jFdyFEoW1Ke9qHZs9' class='link text-decoration-none text-success'>P.º de la Infanta Isabel, 13</a>" },
      cafeteria: { title: "Café Federal", description: "Una cafetería con una amplia terraza perfecta para disfrutar con tu mascota en pleno centro. El menú ofrece opciones deliciosas, y el entorno tranquilo la convierte en un lugar ideal para descansar tras un paseo.", location: "<a href='https://maps.app.goo.gl/QdzMo6LWMHugnTQa7' class='link text-decoration-none text-success'>C/ de l'Ambaixador Vich, 15</a>" },
    },
    {
      city: "París",
      playa: { title: "Lac Daumesnil", description: "Un hermoso espacio natural con caminos alrededor del lago donde las mascotas son bienvenidas. Los alrededores están llenos de vegetación y áreas abiertas que ofrecen el lugar perfecto para paseos relajantes o picnics en compañía de tu amigo peludo.", location: "<a href='https://maps.app.goo.gl/dyLAycQzH16ywvWy6' class='link text-decoration-none text-success'>Rte de Ceinture du Lac Daumesnil</a>" },
      hotel: { title: "Le Bristol Paris", description: "Un hotel de lujo que ofrece un servicio VIP para mascotas, incluyendo camas, delicias y atención personalizada. Este icónico hotel en París es perfecto para quienes buscan lujo y hospitalidad de primera clase.", location: "<a href='https://maps.app.goo.gl/T56CUAXy9uvccben8' class='link text-decoration-none text-success'>112 Rue du Faubourg Saint-Honoré,</a>" },
      cafeteria: { title: "Seven Heaven", description: "Un café encantador en el centro de París con un menú especial para mascotas y cómodas terrazas. Aquí puedes disfrutar de un café gourmet mientras tu mascota es igualmente atendida con golosinas saludables.", location: "<a href='https://maps.app.goo.gl/8udTWWiUrLFRrkox9' class='link text-decoration-none text-success'>17 Rue de la Forge Royale</a>" },
    },
    {
      city: "Marsella",
      playa: { title: "Archipiélago de Frioul", description: "Increíbles playas en la Isla Friuli, ideales para quienes buscan un entorno tranquilo y natural donde disfrutar con sus mascotas. Sin restricciones aparentes, es un paraíso escondido donde puedes explorar y relajarte en aguas cristalinas. Accesible en barco desde el puerto viejo, el trayecto añade una experiencia única al paseo.", location: "<a href='https://maps.app.goo.gl/gA3PyeqB2GBZJAvJ9' class='link text-decoration-none text-success'>Îles du Frioul</a>" },
      hotel: { title: "Hotel NH Collection Marseille", description: "Un hotel céntrico que admite mascotas y ofrece servicios adaptados para ellas. Sus modernas instalaciones aseguran una estancia cómoda tanto para los dueños como para sus mascotas, con opciones como camas especiales y áreas para caminar cerca.", location: "<a href='https://maps.app.goo.gl/a7EhpgrqWEDdZhpf9' class='link text-decoration-none text-success'>37 Bd des Dames</a>" },
      cafeteria: { title: "L'Escalié", description: "Un restaurante pet-friendly con una terraza acogedora cerca de la parada del metro Notre-Dame du Mont. Su menú combina sabores locales y opciones modernas, mientras que el ambiente relajado es perfecto para compartir un momento agradable con tu mascota.", location: "<a href='https://maps.app.goo.gl/mL1YKQCrD8c5movw7' class='link text-decoration-none text-success'>80 Cours Julien</a>" },
    },
    {
      city: "Roma",
      playa: { title: "Association Baubeach Village", description: "Una playa perfecta para mascotas, equipada con duchas, sombra y espacios para correr. Este lugar es ideal para disfrutar de un día completo al aire libre, con servicios pensados tanto para los dueños como para sus amigos peludos.", location: "<a href='https://maps.app.goo.gl/9hjKgfwGo23CUmmW6' class='link text-decoration-none text-success'>Via di Praia a Mare</a>" },
      hotel: { title: "Hotel Cavalieri Waldorf Astoria", description: "Un hotel de lujo en Roma que ofrece camas, paseos y menús especiales para mascotas. Con vistas panorámicas de la ciudad, este alojamiento combina confort y exclusividad, brindando una experiencia única para todos.", location: "<a href='https://maps.app.goo.gl/CvEV8zdiyv7qnNJ59' class='link text-decoration-none text-success'>Via Alberto Cadlolo, 101</a>" },
      cafeteria: { title: "Fiuto Restaurant", description: "El primer restaurante de Italia donde los dueños y sus mascotas pueden sentarse en la misma mesa y degustar un menú ideado para ambos. Este concepto innovador es perfecto para compartir un momento inolvidable con tu compañero peludo.", location: "<a href='https://maps.app.goo.gl/a8fc8FVPX3EWMD9y7' class='link text-decoration-none text-success'>Via Flaminia, 498/500 - 502</a>" },
    },
    {
      city: "Venecia",
      playa: { title: "Paseos en los canales junto a la isla Lido", description: "Disfruta de un paseo tranquilo junto a tu mascota por las áreas menos concurridas del Lido. Este entorno sereno es ideal para explorar la belleza de Venecia en compañía de tu amigo peludo, lejos del bullicio turístico.", location: "<a href='https://maps.app.goo.gl/yZpbPHNkgsvH9UVj8' class='link text-decoration-none text-success'>Lido de Venecia</a>" },
      hotel: { title: "Hotel Ai Reali", description: "Un hotel lujoso que recibe a las mascotas con camas y cuidados especiales en pleno centro de Venecia. Su ubicación y atención al detalle aseguran una experiencia cómoda y memorable tanto para ti como para tu mascota.", location: "<a href='https://maps.app.goo.gl/tisgmt1kb48GmZ8o9' class='link text-decoration-none text-success'>Calle Seconda de la Fava, 5527</a>" },
      cafeteria: { title: "Café Torrefazione Cannaregio", description: "Una cafetería pet-friendly famosa por su café artesanal y un espacio cómodo para descansar. Aquí, las mascotas son bienvenidas mientras disfrutas de una bebida de alta calidad y el ambiente acogedor del lugar.", location: "<a href='https://maps.app.goo.gl/XqDiraeZfXAWfcjL8' class='link text-decoration-none text-success'>Fondamenta dei Ormesini, 2804</a>" },
    },
    {
      city: "Milán",
      playa: { title: "Parque Sempione", description: "El parque más famoso de Milán, ideal para pasear con tu mascota junto al lago y las amplias zonas verdes. Este icónico espacio es perfecto para disfrutar de un día soleado, con muchas áreas para correr y relajarse.", location: "<a href='https://maps.app.goo.gl/dgF1uckDFoaaqgE57' class='link text-decoration-none text-success'>20121 Milan, Metropolitan City of Milan</a>" },
      hotel: { title: "Hotel Principe di Savoia", description: "Un hotel de lujo que ofrece paquetes especiales y camas VIP para mascotas. Su diseño elegante y servicios exclusivos lo convierten en uno de los mejores lugares para alojarse con tu amigo peludo en la ciudad.", location: "<a href='https://maps.app.goo.gl/JBVZKTg1geWFBxmN8' class='link text-decoration-none text-success'>Piazza della Repubblica, 17</a>" },
      cafeteria: { title: "Café Panini Durini", description: "Una cadena de cafeterías pet-friendly perfecta para disfrutar de un desayuno o aperitivo con tu mascota. Su ambiente moderno y su variado menú lo convierten en un lugar imprescindible para los amantes del café y las mascotas.", location: "<a href='https://maps.app.goo.gl/ULdb1k6G4S5k44Tt8' class='link text-decoration-none text-success'>Via Durini, 26</a>" },
    },
    {
      city: "Berlín",
      playa: { title: "Lago Wannsee", description: "Un lugar tranquilo donde puedes pasear y nadar con tu mascota en una zona dedicada a los perros. Este entorno natural es perfecto para desconectar del bullicio urbano y disfrutar de la serenidad junto a tu compañero peludo.", location: "<a href='https://maps.app.goo.gl/XxRPcRYLRN7PFQm39' class='link text-decoration-none text-success'>Wannsee, Berlín</a>" },
      hotel: { title: "Hotel Michelberger", description: "Un hotel pet-friendly con un estilo único y acogedor que ofrece comodidad para ti y tu mascota. Con un diseño vanguardista y un personal amable, este lugar se destaca como un destino ideal en Berlín.", location: "<a href='https://maps.app.goo.gl/PpYTVdDUaJnsqe6M6' class='link text-decoration-none text-success'>Warschauer Str. 39-40</a>" },
      cafeteria: { title: "Fellfreunde Unser Hundecafe", description: "Un café especialmente diseñado para mascotas con snacks saludables y espacios al aire libre. Este lugar combina un ambiente relajado con un menú pensado para satisfacer tanto a humanos como a animales.", location: "<a href='https://maps.app.goo.gl/NiRVp1NeMoNvXzvv7' class='link text-decoration-none text-success'>Beuthstraße 41</a>" },
    },
    {
      city: "Múnich",
      playa: { title: "Englischer Garten", description: "Un extenso parque con ríos y lagos donde las mascotas pueden pasear y refrescarse en el agua. Este icónico parque es un oasis verde en la ciudad, ideal para explorar y disfrutar de un día al aire libre con tu mascota.", location: "<a href='https://maps.app.goo.gl/ntjsmNo17EdfDWN49' class='link text-decoration-none text-success'>Jardín Inglés de Múnich</a>" },
      hotel: { title: "Hotel Vier Jahreszeiten Kempinski", description: "Un hotel elegante que admite mascotas con atención especial y menús exclusivos para ellas. Con instalaciones de lujo y servicios personalizados, este alojamiento asegura una estancia inolvidable para todos.", location: "<a href='https://maps.app.goo.gl/HeHN7p8Las6rkhLR7' class='link text-decoration-none text-success'>Maximilianstraße 17</a>" },
      cafeteria: { title: "Café Katzentempel", description: "Una cafetería temática donde las mascotas son bienvenidas y se ofrecen snacks vegetarianos. Con un ambiente relajado y una decoración única, es el lugar perfecto para disfrutar de una pausa en compañía de tu amigo peludo.", location: "<a href='https://maps.app.goo.gl/W29q3nmH4BEDAkr2A' class='link text-decoration-none text-success'>Türkenstraße 29</a>" },
    },
    {
      city: "Valencia",//Venezuela
      playa: { title: "Playa La Rosa", description: "Un espacio verde amplio con senderos perfectos para pasear con tu mascota. Este lugar ofrece un ambiente tranquilo para disfrutar de la naturaleza y el mar, ideal para que tu mascota corra y explore.", location: "<a href='https://maps.app.goo.gl/Bupa3nJ3VPB8DWw27' class='link text-decoration-none text-success'>Puerto Cabello 2050, Carabobo</a>" },
      hotel: { title: "Hesperia WTC Valencia", description: "Un hotel pet-friendly que ofrece áreas para caminar con tu mascota y servicios dedicados. Con una ubicación estratégica y modernas instalaciones, este hotel asegura una estancia cómoda para ti y tu compañero peludo.", location: "<a href='https://maps.app.goo.gl/kTNi2SFk7uFgyN3L9' class='link text-decoration-none text-success'>Naguanagua, Av. 168 Salvador Feo La Cruz Este-Oeste</a>" },
      cafeteria: { title: "Nautilus Jardín Gourmet", description: "Un lugar acogedor con terraza donde podrás disfrutar de un buen café acompañado de tu mascota. Su ambiente relajado es ideal para compartir un momento especial mientras tu amigo peludo disfruta también de la compañía.", location: "<a href='https://maps.app.goo.gl/msZazrqcy6dD9LNZ6' class='link text-decoration-none text-success'>Calle 148, Valencia</a>" },
    },
    {
      city: "Caracas",
      playa: { title: "Parque Generalísimo Francisco de Miranda", description: "Un enorme parque con lagos y amplios espacios verdes ideales para pasear con tu mascota. Es un lugar perfecto para disfrutar de un paseo relajante en medio de la naturaleza sin alejarse mucho de la ciudad.", location: "<a href='https://maps.app.goo.gl/1pgdS8CB1LANdwtCA' class='link text-decoration-none text-success'>Avenida Francisco de Miranda</a>" },
      hotel: { title: "Hotel Renaissance Caracas La Castellana", description: "Este hotel de lujo es pet-friendly, ofreciendo modernas instalaciones y áreas cercanas para pasear a tu mascota. La comodidad y el estilo se combinan para asegurar una excelente estancia.", location: "<a href='https://maps.app.goo.gl/WQDfNykHci7edJZK9' class='link text-decoration-none text-success'>Ave Eugenio Mendoza, Con Calle Urdaneta</a>" },
      cafeteria: { title: "MANVÄ Natural Market", description: "Una cafetería con terrazas cómodas donde las mascotas son bien recibidas. Disfruta de un café en un ambiente tranquilo mientras tu mascota se relaja a tu lado.", location: "<a href='https://maps.app.goo.gl/BhunKXaZ4HY6Mc2F6' class='link text-decoration-none text-success'>planta baja, Calle Miranda edificio Elvira, Local 5 Chacao</a>" },
    },
    {
      city: "Ciudad de México",
      playa: { title: "Parque Naucalli", description: "Un icónico parque pet-friendly con áreas verdes, fuentes y zonas dedicadas a perros. Es el lugar ideal para pasear con tu mascota y disfrutar de un entorno natural y amplio.", location: "<a href='https://maps.app.goo.gl/DjkNssZrvGj5h66Z6' class='link text-decoration-none text-success'>Manzana 020, 53150 Naucalpan de Juárez</a>" },
      hotel: { title: "Hotel Stara Hamburgo", description: "Un hotel boutique que ofrece comodidades para mascotas como camas especiales y snacks. Es una opción perfecta para quienes buscan confort y calidad en un entorno pet-friendly.", location: "<a href='https://maps.app.goo.gl/66RQijpFvmh9R1kb9' class='link text-decoration-none text-success'>Hamburgo 32, Juárez, Cuauhtémoc</a>" },
      cafeteria: { title: "Moahu Café", description: "Una cafetería relajada y pet-friendly donde puedes leer acompañado de tu mascota. Su ambiente acogedor lo convierte en el lugar perfecto para disfrutar de un buen café.", location: "<a href='https://maps.app.goo.gl/RmCaoPA2wgPNgUGA8' class='link text-decoration-none text-success'>Museo 188-Loc C, San Pedro, San Pablo Tepetlapa, Coyoacán</a>" },
    },
    {
      city: "Cancún",
      playa: { title: "Playa Coral (Mirador II)", description: "Una playa oficialmente pet-friendly con acceso directo al mar Caribe para que tu mascota disfrute. Su entorno tranquilo y accesible es ideal para pasar el día junto al mar.", location: "<a href='https://maps.app.goo.gl/Ct6ZNPS8VGVBstxd8' class='link text-decoration-none text-success'>Punta Nizuc - Cancún 700</a>" },
      hotel: { title: "Hotel Imperial Laguna Faranda Cancún", description: "Un hotel especializado en recibir a mascotas, con áreas cercanas para jugar y caminar. El servicio amable y el entorno acogedor hacen de este hotel una excelente opción para ti y tu mascota.", location: "<a href='https://maps.app.goo.gl/HAVJ1E3aNRyxQ9JR7' class='link text-decoration-none text-success'>77510, Quetzal 17, Zona Hotelera</a>" },
      cafeteria: { title: "Onesto Café", description: "Una cafetería famosa en Cancún con un ambiente tranquilo y terrazas aptas para mascotas. El lugar ideal para disfrutar de un buen café mientras pasas un rato agradable con tu mascota.", location: "<a href='https://maps.app.goo.gl/CYXGKQJSSRknirA1A' class='link text-decoration-none text-success'>Av Carlos Nader 6</a>" },
    },
    {
      city: "Miami",
      playa: { title: "Haulover Beach Dog", description: "Una playa pet-friendly donde tu perro puede correr libremente en la arena y nadar en el océano. Con un entorno amplio y accesible, es perfecta para disfrutar de un día de sol junto a tu mascota.", location: "<a href='https://maps.app.goo.gl/34nEfdUuAL99isaFA' class='link text-decoration-none text-success'>10801 Collins Ave, Bal Harbour</a>" },
      hotel: { title: "Kimpton EPIC Hotel", description: "Un hotel de lujo que ofrece camas, platos y servicios VIP para mascotas. Con instalaciones modernas y un enfoque en el confort, es el lugar ideal para quienes viajan con sus amigos peludos.", location: "<a href='https://maps.app.goo.gl/jLisu5rDBzoW7jVAA' class='link text-decoration-none text-success'>270 Biscayne Blvd Way</a>" },
      cafeteria: { title: "Panther Coffee - Wynwood", description: "Una cafetería con terrazas al aire libre perfecta para disfrutar de un café junto a tu mascota. Su ambiente relajado y moderno lo convierte en un lugar ideal para compartir con tu compañero peludo.", location: "<a href='https://maps.app.goo.gl/KZARZvhLbXRAgduV9' class='link text-decoration-none text-success'>2390 NW 2nd Ave</a>" },
    },
    {
      city: "Nueva York",
      playa: { title: "Rockaway Beach", description: "Una playa famosa en Nueva York donde las mascotas pueden disfrutar del mar. Este destino ofrece un ambiente ideal para que tu mascota explore y se divierta.", location: "<a href='https://maps.app.goo.gl/hoRQQ1xU4ytczro37' class='link text-decoration-none text-success'>Rockaway Beach Boardwalk, Arverne</a>" },
      hotel: { title: "The William Vale", description: "Un hotel moderno en Brooklyn que consiente a las mascotas con camas especiales y amenidades personalizadas. Su diseño innovador y servicios exclusivos aseguran una estancia cómoda.", location: "<a href='https://maps.app.goo.gl/Ksuj49cnaphDc6sn9' class='link text-decoration-none text-success'>111 N 12th St, Brooklyn</a>" },
      cafeteria: { title: "Boris & Horton", description: "Un café icónico en Nueva York donde las mascotas son tan bienvenidas como los humanos. Un lugar perfecto para disfrutar de una bebida mientras compartes con tu amigo peludo.", location: "<a href='https://maps.app.goo.gl/wuhe5rWgeNWYzm7m8' class='link text-decoration-none text-success'>195 Avenue A</a>" },
    },
    {
      city: "San Francisco",
      playa: { title: "Playa de Crissy Field", description: "Un lugar emblemático con vistas al Golden Gate donde las mascotas pueden correr libremente junto al mar. Un destino ideal para un paseo relajante en uno de los lugares más icónicos de San Francisco.", location: "<a href='https://maps.app.goo.gl/xM3G5j1DK7mt7tSe8' class='link text-decoration-none text-success'>San Francisco, CA</a>" },
      hotel: { title: "Hotel Argonaut", description: "Un hotel boutique frente a la bahía que recibe a tus mascotas con comodidades y snacks especiales. Este hotel ofrece una ubicación perfecta para quienes desean explorar la ciudad con su compañero peludo.", location: "<a href='https://maps.app.goo.gl/262rqaujtEbtHSEp6' class='link text-decoration-none text-success'>495 Jefferson St</a>" },
      cafeteria: { title: "Andytown Coffee Roasters", description: "Un lugar ideal para tomar un café mientras tu mascota se relaja junto a ti en la terraza. Su ambiente relajado y su excelente café lo convierten en un lugar ideal para disfrutar con tu mascota.", location: "<a href='https://maps.app.goo.gl/B7VYm1MJY31zfM2C8' class='link text-decoration-none text-success'>Rooftop, Park Level, 181 Fremont St</a>" },
    },
    {
      city: "Tokio",
      playa: { title: "Playa de Kawasaki", description: "Una playa donde las mascotas son bienvenidas, con amplios espacios verdes y senderos para explorar. Este lugar es perfecto para disfrutar del aire libre con tu mascota en un entorno relajante.", location: "<a href='https://maps.app.goo.gl/dTbDrqizkRf1EQAH8' class='link text-decoration-none text-success'>58-1 Higashiogishima, Kawasaki Ward</a>" },
      hotel: { title: "Hotel Kimpton Shinjuku Tokyo", description: "Un hotel de lujo que ofrece servicios exclusivos para mascotas, como camas y menús especiales. Su diseño elegante y atención al detalle lo convierten en un lugar perfecto para quienes viajan con su mascota.", location: "<a href='https://maps.app.goo.gl/okeq8sT3aySd99an7' class='link text-decoration-none text-success'>3 Chome-4-7 Nishishinjuku, Shinjuku City</a>" },
      cafeteria: { title: "Deco`s Dog Cafe countryside Sabo", description: "Una cafetería temática pet-friendly donde las mascotas son el centro de atención. Disfruta de un ambiente único mientras compartes un delicioso café con tu mascota.", location: "<a href='https://maps.app.goo.gl/Xry3GKX4uPWdT26X8' class='link text-decoration-none text-success'>Japón, 〒145-0071 Tokyo, Ota City, Denenchofu, 2 Chome−62−1</a>" },
    },
    {
      city: "Osaka",
      playa: { title: "Shioashiya Beach", description: "Una playa con amplias áreas ideales para disfrutar de un paseo con tu mascota. El ambiente relajado de este lugar es perfecto para disfrutar del día junto al mar.", location: "<a href='https://maps.app.goo.gl/coi8ZXm7s1bu6JCv8' class='link text-decoration-none text-success'>Minamihamacho, 659-0037</a>" },
      hotel: { title: "Hotel Monterey La Soeur Osaka", description: "Un hotel acogedor que acepta mascotas y está bien ubicado para caminatas. Con modernas instalaciones y un ambiente relajado, es perfecto para estancias cómodas.", location: "<a href='https://maps.app.goo.gl/gL7z8r4SuMvCf4s97' class='link text-decoration-none text-success'>2 Chome-2-22 Shiromi, Chuo Ward</a>" },
      cafeteria: { title: "Dog Tail Café", description: "Un café relajado donde puedes llevar a tu mascota y disfrutar de deliciosas bebidas. Este lugar ofrece un ambiente amigable tanto para humanos como para sus compañeros peludos.", location: "<a href='https://maps.app.goo.gl/7YSSsvLVDWTQ7qfP7' class='link text-decoration-none text-success'>2 Chome-4-6 Dotonbori, Chuo Ward</a>" },
    },
    {
      city: "Kyoto",
      playa: { title: "Río Kamo", description: "Un río icónico rodeado de senderos peatonales, perfecto para pasear con tu mascota mientras disfrutas de vistas urbanas y naturales. Un lugar tranquilo para relajarte con tu amigo peludo.", location: "<a href='https://maps.app.goo.gl/GBdAYnn3b6kaSgfa7' class='link text-decoration-none text-success'>Kioto, Prefectura de Kioto</a>" },
      hotel: { title: "Suiran, a Luxury Collection Hotel", description: "Un hotel exclusivo que acepta mascotas y ofrece jardines para pasear. Con su ambiente lujoso y servicios excepcionales, es una opción perfecta para los viajeros que buscan calidad y confort.", location: "<a href='https://maps.app.goo.gl/9RUMGfW49ygYWx93A' class='link text-decoration-none text-success'>〒616-8385 Kyoto, Ukyo Ward, Sagatenryuji Susukinobabacho</a>" },
      cafeteria: { title: "Ninna Café", description: "Una cafetería rústica con hermosas vistas y terrazas donde las mascotas son bienvenidas. El lugar perfecto para disfrutar de una bebida mientras compartes un momento con tu compañero peludo.", location: "<a href='https://maps.app.goo.gl/VoY9wMcqxpAjwubw8' class='link text-decoration-none text-success'>Poligono Industrial el Manar, 1A</a>" },
    },
    {
      city: "Bangkok",
      playa: { title: "Río Chao Phraya", description: "En las áreas abiertas y los paseos junto al río, como Asiatique o Iconsiam, puedes disfrutar de una experiencia relajante con tu mascota, explorando paisajes y disfrutando de una caminata tranquila junto al agua. Este entorno es perfecto para pasar un buen rato con tu amigo de cuatro patas, lejos del bullicio de la ciudad.", location: "<a href='https://maps.app.goo.gl/TC6XUxhTq8LUfTyo6' class='link text-decoration-none text-success'>Río Chao Phraya, Bangkok</a>" },
      hotel: { title: "The Peninsula Bangkok", description: "Un lujoso hotel con un enfoque en la comodidad de las mascotas, ofreciendo camas especiales y snacks para consentir a tu compañero. Además, las instalaciones incluyen un programa pet-friendly que garantiza que tanto tú como tu mascota tengan una estadía memorable. La ubicación es excelente, con vistas al río y el entorno perfecto para explorar juntos.", location: "<a href='https://maps.app.goo.gl/Eoh6WvLjB7Spzv5P6' class='link text-decoration-none text-success'>333 Charoen Nakhon Rd, Khlong Ton Sai, Khlong San</a>" },
      cafeteria: { title: "Dog In Town Café", description: "Una cafetería única en Bangkok donde las mascotas son las protagonistas. Aquí, puedes disfrutar de un café mientras observas a tu mascota jugar libremente en un ambiente relajado. El lugar está diseñado para que tanto los dueños como las mascotas se sientan cómodos, con un área especial para los peludos. Ideal para socializar con otros amantes de los animales.", location: "<a href='https://maps.app.goo.gl/AdUqcdXHen1b8LD2A' class='link text-decoration-none text-success'>11/4 7 Phahonyothin Rd, Phaya Thai</a>" },
    },
    {
      city: "Phuket",
      playa: { title: "Ao Yon Beach", description: "Una playa tranquila en Phuket, menos concurrida y perfecta para pasear con tu mascota. El ambiente relajado y la brisa marina te invitarán a disfrutar de largos paseos con tu compañero de cuatro patas. Las aguas claras y la arena suave hacen que sea un lugar ideal para pasar el día con tu mascota, permitiéndote relajarte mientras ellos exploran los alrededores en un entorno natural y pacífico.", location: "<a href='https://maps.app.goo.gl/PE4XNQJZT7YdGmMS6' class='link text-decoration-none text-success'>5/13 Soi Ao-Yon Khaokhad, Tambon Wichit, Amphoe Mueang Phuket</a>" },
      hotel: { title: "The Slate Phuket", description: "Un resort pet-friendly que ofrece espacios abiertos y cómodos jardines donde tu mascota podrá disfrutar de la naturaleza mientras tú descansas. Además de las comodidades especiales para mascotas, el lugar cuenta con un ambiente tranquilo y relajante, ideal para vacacionar con tu amigo peludo. Las instalaciones son perfectas para explorar juntos y el resort se encarga de brindarte una experiencia lujosa y accesible para todos los miembros de la familia, humanos y animales.", location: "<a href='https://maps.app.goo.gl/6GHP8cdUikyPjYJDA' class='link text-decoration-none text-success'>116 Sakhu, Thalang District</a>" },
      cafeteria: { title: "Neko Cat Cafe", description: "Una cafetería rústica y encantadora en Phuket, donde no solo podrás disfrutar de tu café, sino también relajarte mientras tu mascota se acomoda en el área al aire libre. Este lugar acogedor está diseñado para que tanto los dueños como los animales se sientan cómodos, ofreciendo un espacio tranquilo y pet-friendly. Perfecto para pasar un rato agradable con tu mascota, lejos del ruido y el estrés de la ciudad.", location: "<a href='https://maps.app.goo.gl/bUiBiWeBzPeUFjYLA' class='link text-decoration-none text-success'>39, 57 Soi Saiyuan, Rawai</a>" },
    },
    {
      city: "El Cairo",
      playa: { title: "Río Nilo (Corniche)", description: "Las orillas del Río Nilo, especialmente a lo largo del Corniche, ofrecen un espacio ideal para pasear con tu mascota. Aquí, puedes disfrutar de las vistas panorámicas al río mientras caminas a tu ritmo, con el sonido del agua y el aire fresco de la ciudad. Es un lugar perfecto para relajarte y desconectar, mientras tu mascota explora a su manera en un ambiente tranquilo y pintoresco, lejos del ajetreo de la vida cotidiana.", location: "<a href='https://maps.app.goo.gl/WD5YYmcFTnkXSC7x8' class='link text-decoration-none text-success'>National Bank of Egypt</a>" },
      hotel: { title: "Four Seasons Hotel Cairo at Nile Plaza", description: "Este lujoso hotel con vistas impresionantes al Río Nilo es un paraíso tanto para los humanos como para sus mascotas. El Four Seasons ofrece un entorno exclusivo donde tu mascota puede sentirse tan consentida como tú, con servicios especiales como camas y espacios amplios. La ubicación es ideal para explorar la ciudad, con el lujo y la comodidad que caracteriza a este prestigioso hotel, sin que falten detalles para los amigos peludos.", location: "<a href='https://maps.app.goo.gl/A3UQRvC7whTLvYTu5' class='link text-decoration-none text-success'>1089 CORNICHE EL NIL, Qasr El Nil</a>" },
      cafeteria: { title: "Ovio Maadi", description: "Un restaurante de cocina europea contemporánea que permite que tu mascota te acompañe mientras disfrutas de una comida deliciosa. Ovio Maadi ofrece un ambiente tranquilo y elegante, con un espacio cómodo donde puedes compartir tu comida y momentos con tu mascota. El lugar es perfecto para quienes desean disfrutar de la gastronomía en un entorno relajado, mientras su compañero peludo disfruta de un espacio agradable y amigable.", location: "<a href='https://maps.app.goo.gl/WAyX3fbSPxHPc3be8' class='link text-decoration-none text-success'>11 Street 18, Maadi as Sarayat Al Gharbeyah</a>" },
    },
    {
      city: "Alejandría",
      playa: { title: "Stanley Beach", description: "Stanley Beach es un lugar icónico en Alejandría donde las mascotas pueden disfrutar de la brisa marina y de largos paseos por la orilla. Si prefieres un ambiente más tranquilo, puedes caminar por las zonas menos concurridas, donde tu mascota podrá disfrutar del espacio abierto. La playa es perfecta para disfrutar del mar y el sol, mientras exploras la costa mediterránea en un ambiente relajado y libre de multitudes.", location: "<a href='https://maps.app.goo.gl/aGEhcENF1ZAZKF5D6' class='link text-decoration-none text-success'>Alejandría</a>" },
      hotel: { title: "Helnan Palestine Hotel", description: "Este hotel junto al mar, en el corazón de Alejandría, es una excelente opción para los dueños de mascotas. Ofrece hermosos jardines y espacios verdes donde tu mascota puede jugar y disfrutar del aire libre. El Helnan Palestine Hotel es conocido por su trato exclusivo hacia las mascotas, con todas las comodidades necesarias para una estancia cómoda y placentera.", location: "<a href='https://maps.app.goo.gl/vDpwSKzoZpL4G9FVA' class='link text-decoration-none text-success'>Montazah Park, El Saa Square, Al Mandarah Bahri, Qesm Al Montazah</a>" },
      cafeteria: { title: "Délices Patisserie", description: "Délices Patisserie es una cafetería clásica en Alejandría que combina la tradición francesa con un toque local, ideal para disfrutar con tu mascota en la terraza al aire libre. El ambiente es acogedor, con un servicio amable y una selección de pasteles y cafés deliciosos. Aquí, tanto tú como tu mascota pueden relajarse y disfrutar del tiempo juntos en un entorno tranquilo, alejado del bullicio de la ciudad.", location: "<a href='https://maps.app.goo.gl/dVmsPTgscZn2qK3N9' class='link text-decoration-none text-success'>Raml Station, 46 Saad Zaghloul, Al Mesallah Sharq, Al Attarin</a>" },
    },
    {
      city: "Casablanca",
      playa: { title: "Ain Diab Beach", description: "Una de las playas más populares de Casablanca, Ain Diab es perfecta para pasear con tu mascota en la mañana o al atardecer, cuando el lugar está menos concurrido. La playa ofrece un ambiente relajante donde las mascotas pueden disfrutar del mar mientras tú paseas por la arena o simplemente te relajas observando las vistas. También es una buena opción para aquellos que desean disfrutar de un espacio más tranquilo para escapar del ajetreo de la ciudad.", location: "<a href='https://maps.app.goo.gl/urjYRMNvsU2S6frr7' class='link text-decoration-none text-success'>Casablanca</a>" },
      hotel: { title: "Hyatt Regency Casablanca", description: "Ubicado en el corazón de la ciudad, el Hyatt Regency Casablanca ofrece un servicio excelente para los viajeros con mascotas. El hotel cuenta con instalaciones pet-friendly, lo que asegura que tu mascota disfrute tanto como tú de la estadía. Además de sus lujosas habitaciones, ofrece servicios exclusivos para mascotas, como áreas de recreo y descanso, para que tu compañero peludo también se sienta bienvenido y cómodo en todo momento.", location: "<a href='https://maps.app.goo.gl/4xH8a2F8whH6vn6AA' class='link text-decoration-none text-success'>Pl. des Nations Unies</a>" },
      cafeteria: { title: "Café Bianca", description: "Café Bianca es un café moderno y acogedor en Casablanca, con un ambiente relajado y áreas al aire libre aptas para mascotas. Es el lugar ideal para tomar un buen café y disfrutar de un rato agradable con tu mascota. En este café, puedes relajarte mientras tu compañero peludo disfruta de un espacio cómodo para descansar. El ambiente tranquilo y la atención al detalle hacen de este café una excelente opción para un día en compañía de tu mascota.", location: "<a href='https://maps.app.goo.gl/ZT8RGtTWY6Fk9TrE8' class='link text-decoration-none text-success'>Av. Habib Sinaceur</a>" },
    },
    {
      city: "Sídney",
      playa: { title: "Sirius Cove Reserve", description: "Una de las playas más relajantes de Sídney, Sirius Cove es pet-friendly y permite que los perros corran sin correa en áreas designadas. Además, el agua clara y las amplias áreas verdes ofrecen el lugar perfecto para pasar un buen rato con tu mascota, disfrutando de la naturaleza y el paisaje costero. Es una excelente opción para los amantes de los perros que buscan pasar tiempo de calidad con sus mascotas en un entorno tranquilo y natural.", location: "<a href='https://maps.app.goo.gl/2zJfeb7iHQxV5xuV8' class='link text-decoration-none text-success'>Sirius Cove Rd, Mosman</a>" },
      hotel: { title: "QT Sydney", description: "QT Sydney es un hotel moderno y pet-friendly, conocido por su estilo único y su enfoque hacia la comodidad de las mascotas. Ofrece amenities especiales para que tu mascota también disfrute de su estancia, desde camas hasta golosinas. La ubicación céntrica y el ambiente relajado del hotel lo convierten en un excelente lugar para alojarte, sabiendo que tu compañero peludo recibirá la misma atención y cuidado que tú.", location: "<a href='https://maps.app.goo.gl/vRDf3CvP4qWVwiym9' class='link text-decoration-none text-success'>49 Market St</a>" },
      cafeteria: { title: "The Grounds of Alexandria", description: "Una famosa cafetería con jardines hermosos y espacios pet-friendly en Sídney, The Grounds of Alexandria es el lugar perfecto para disfrutar de una bebida mientras tu mascota se relaja en la zona exterior. Con su atmósfera acogedora y su ambiente relajado, este lugar se ha convertido en un punto de encuentro para los amantes de los animales. Los jardines y el espacio abierto proporcionan un entorno ideal para socializar y relajarse con tu compañero peludo.", location: "<a href='https://maps.app.goo.gl/a4SDtuNfqAAYbSA27' class='link text-decoration-none text-success'>7a/2 Huntley St, Alexandria</a>" },
    },
    {
      city: "Melbourne",
      playa: { title: "Dog Friendly Beach - Brighton", description: "Dog Friendly Beach en Brighton es una playa especialmente designada para perros, donde tus mascotas pueden correr y nadar sin correa en áreas exclusivas. Esta playa de Melbourne se ha convertido en un destino muy popular para los amantes de los perros, quienes pueden disfrutar del ambiente relajado mientras sus mascotas juegan libremente en la arena o el agua. Con un entorno espacioso y natural, es el lugar perfecto para pasar el día con tu compañero peludo.", location: "<a href='https://maps.app.goo.gl/xSV6EWZ7Zu32pWY19' class='link text-decoration-none text-success'>Sandown St, Brighton</a>" },
      hotel: { title: "Ovolo South Yarra", description: "Ovolo South Yarra es un elegante hotel de diseño en Melbourne que ofrece servicios especiales para mascotas. El hotel es pet-friendly y proporciona una variedad de comodidades para tus compañeros peludos, incluyendo camas cómodas y golosinas. Con una ubicación conveniente en el vibrante distrito de South Yarra, es una opción ideal para quienes buscan una estancia cómoda y moderna, sabiendo que su mascota también será bien atendida y cuidada.", location: "<a href='https://maps.app.goo.gl/iuPcAfnPuBL1Q6ZJ9' class='link text-decoration-none text-success'>234 Toorak Rd, South Yarra</a>" },
      cafeteria: { title: "Doghouse Dog Cafe", description: "Doghouse Dog Cafe es una cafetería exclusiva para dueños de mascotas en Melbourne, donde tanto los perros como sus dueños pueden disfrutar de deliciosos snacks y golosinas. El ambiente amigable con las mascotas hace que este café sea el lugar perfecto para relajarse con tu compañero peludo. Ofrecen una variedad de productos para perros y un ambiente cómodo, creando una experiencia divertida y única para todos los amantes de los animales.", location: "<a href='https://maps.app.goo.gl/ujBzw9j7htjdWAr36' class='link text-decoration-none text-success'>195 Johnston St, Collingwood</a>" },
    },
    {
      city: "Auckland",
      playa: { title: "Takapuna Beach", description: "Takapuna Beach es una de las playas más populares de Auckland, perfecta para pasear con tu mascota. Esta amplia playa ofrece zonas donde los perros son bienvenidos y pueden disfrutar del agua en áreas designadas. Es un lugar ideal para disfrutar de vistas panorámicas mientras tu mascota corre y juega en la arena. La playa es tranquila, ideal para los que buscan escapar del ajetreo de la ciudad y disfrutar de un día relajante junto a su mascota.", location: "<a href='https://maps.app.goo.gl/GVKqPZgjCrNaixYr7' class='link text-decoration-none text-success'>Región de Auckland</a>" },
      hotel: { title: "SkyCity Hotel Auckland", description: "SkyCity Hotel Auckland es un hotel céntrico que ofrece una estancia cómoda para las mascotas y sus dueños. Con servicios dedicados a las necesidades de las mascotas, el hotel proporciona camas y golosinas, así como amplias áreas para que tu compañero peludo también disfrute de su estadía. La ubicación del hotel permite acceder fácilmente a diversas atracciones de la ciudad, haciendo que sea un lugar ideal tanto para los humanos como para los animales.", location: "<a href='https://maps.app.goo.gl/ZZDLKaQuBjNHyBgJ7' class='link text-decoration-none text-success'>72 Victoria Street West</a>" },
      cafeteria: { title: "Dear Jervois", description: "Dear Jervois es una popular cafetería en Auckland con una encantadora terraza al aire libre ideal para disfrutar de un café mientras tu mascota se relaja. Con un ambiente acogedor y un menú delicioso, este café se ha convertido en un lugar favorito para los dueños de mascotas. Aquí, tanto tú como tu mascota pueden disfrutar de un espacio cómodo y tranquilo mientras disfrutan de una bebida o un refrigerio.", location: "<a href='https://maps.app.goo.gl/QxdxGAekaskLkFFP6' class='link text-decoration-none text-success'>234 Jervois Road, Herne Bay</a>" },
    },
    {
      city: "Wellington",
      playa: { title: "Lyall Bay Beach", description: "Lyall Bay Beach es una playa popular en Wellington, especialmente conocida por ser pet-friendly. Los perros pueden correr y jugar libremente en la arena o en el agua. La playa ofrece un entorno natural y relajante, ideal para pasar tiempo con tu mascota en un ambiente tranquilo. Además, su cercanía con el centro de la ciudad la convierte en una excelente opción para aquellos que desean escapar del bullicio urbano y disfrutar de la belleza costera con su compañero peludo.", location: "<a href='https://maps.app.goo.gl/i2uDAEjXf1moaWeEA' class='link text-decoration-none text-success'>28 Lyall Parade, Lyall Bay</a>" },
      hotel: { title: "QT Wellington", description: "QT Wellington es un hotel de diseño artístico que acepta mascotas y ofrece comodidades especiales para tus compañeros peludos. Con su enfoque único hacia el diseño y la comodidad, el hotel proporciona un ambiente relajado tanto para los dueños como para las mascotas. Las instalaciones pet-friendly aseguran que tu mascota tenga una estancia agradable mientras tú disfrutas de la estética y la comodidad que ofrece este hotel de lujo.", location: "<a href='https://maps.app.goo.gl/6vxHphM9aABDL4cq5' class='link text-decoration-none text-success'>90 Cable Street, Te Aro</a>" },
      cafeteria: { title: "Beach Babylon", description: "Beach Babylon es un café junto al mar en Wellington, con una hermosa terraza donde las mascotas son bienvenidas. Este lugar es perfecto para disfrutar de una bebida mientras tu mascota disfruta del ambiente relajado y la vista al mar. El ambiente amigable con los animales y la ubicación junto a la playa hacen de Beach Babylon un lugar ideal para pasar una tarde tranquila con tu compañero peludo.", location: "<a href='https://maps.app.goo.gl/fQd1iKNKo3fCqD4c6' class='link text-decoration-none text-success'>Ground Floor/232 Oriental Parade, Oriental Bay</a>" },
    }
  ];

  const container = document.querySelector(".dynamic-content"); // Contenedor donde añadir el HTML
  let globalSectionCounter = 0; // Contador global para las secciones
  let imageTotal = 7; // Total de imágenes por categoría
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
        <div class="destination-content col-md-6">
          <h2 class="text-center">${sectionData.title}</h2>
          <p>${sectionData.description}</p>
          <p>Ubicación: ${sectionData.location}</p>
        </div>
        <div class="destination-img col-md-6">
          <img src="${imageUrl}" class="img-fluid rounded w-100 h-100 object-fit-cover" alt="${sectionData.title}">
        </div>
      </div>
    `;
  }
});