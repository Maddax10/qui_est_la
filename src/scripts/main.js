import '../styles/style.scss'
const apiUrl = "http://localhost:3000/API"

const arrival = document.querySelector("#arrival");
const departure = document.querySelector("#departure");
const detail_visitors = document.querySelector("#detail_visitors");
const arrivalDepartureTab = document.querySelector("#arrivalDepartureTab");
const arrivalForm = document.querySelector("#arrivalForm");
const departureForm = document.querySelector("#departureForm");
const arrival_qrLink = document.querySelector("#arrival_qrLink");
const arrival_connexion_form = document.querySelector("#arrival_connexion_form");
//Permet de savoir quel onglet est actif et lequel ne l'est pas
//1ère case = onglet "Entrée", 
//2e case   = onglet "Sortie"
let tabsBool = [1, 0];

//=========================================================================================
//Event & Handles
//=========================================================================================

const handleClicks = (ev) => {
  const target = ev.target;

  if (target.id === "tabEntree" || target.id === "tabSortie") setActiveTab(target.id);
  if (target.id === "registerBtn") register(ev);
  if (target.id === "arrival_qrLink") showConnexionForm(ev);
  if (target.id === "formation" || target.id === "visite") switchListboxChoices(ev);
}

const handleSubmits = (ev) => {
  ev.preventDefault();

  if (ev.target.id === "arrivalForm") register(ev);
  if (ev.target.id === "departureForm") disconnect(ev);
  if (ev.target.id === "arrival_qrLink") showConnexionForm();
  if (ev.target.id === "arrival_connexion_form") connexion();

}

arrivalDepartureTab.addEventListener("click", handleClicks);
arrival.addEventListener("click", handleClicks);
departure.addEventListener("click", handleClicks);
arrival_qrLink.addEventListener("click", handleSubmits);
arrivalForm.addEventListener("submit", handleSubmits);
departureForm.addEventListener("submit", handleSubmits);
arrival_connexion_form.addEventListener("submit", handleSubmits);

//______________________________________________________________________________________________________

const connexion = async () => {
  console.log("connexion");
  //1) récupérer les infos via le formdata
  let formdataConnexion = new FormData(arrival_connexion_form);
  const datasConnexion = Object.fromEntries(formdataConnexion.entries());
  console.log(datasConnexion);

  const email_visitors = datasConnexion.email_visitors;

const motif_visitors = document.querySelector('input[name="motif_visitors"]:checked')?.value;  const detail_visitors = document.querySelector("#detail_visitors")?.value;

  if (!motif_visitors || !detail_visitors) {
    alert("Il manque le motif/le détail");
    return;
  }

  try {
    const checkRegister = await fetch(`${apiUrl}/visitors/${encodeURIComponent(email_visitors)}`);
    const checkConnected = await fetch(`${apiUrl}/visitors/connected/${encodeURIComponent(email_visitors)}`);

    const existingRegister = await checkRegister.json();
    const existingConnected = await checkConnected.json();
    console.log("existingRegister.registered", existingRegister.registered)

    if (!existingRegister.registered) {
      alert("Cet email n'est pas enregistré !");
      return;
    }
    else if (existingConnected.connected) {
      alert("Cet email est déja connecté !");
      return;
    }
    else {
      //Récupérer les infos dans la BD de la dernière ligne du visitor

      fetch(`${apiUrl}/visitors/${encodeURIComponent(email_visitors)}`)
        .then(response => response.json())
        .then(datas => {
          //supprimer les données inutiles
          let visitor = datas.visitor[0];
          delete visitor.id_visitors;
          delete visitor.arrival_visitors;
          delete visitor.departure_visitors;
          delete visitor.motif_visitors;
          delete visitor.detail_visitors;
          visitor.motif_visitors = motif_visitors;
          visitor.detail_visitors = detail_visitors;
          console.log(visitor);
          // créer le visitor
          fetch(`${apiUrl}/visitors`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(datas.visitor[0])
          })
            .then(response => response.json())
            .then(datas => {
              console.log(datas)
              if (!datas.error)
                alert('Vous êtes enregistré sur le site !')
              else
                alert('Erreur : ' + datas.error)
            });
        })

    }
  } catch (error) {
    alert("Erreur lors de la vérification de l'email.");
    return;
  }
}

const showConnexionForm = () => {
  arrival_connexion_form.classList.remove("hidden");
}

const switchListboxChoices = (ev) => {
  //reset the box choices
  detail_visitors.innerHTML = ``;
  if (ev.target.id === "visite") {
    //get trainers
    fetch(`${apiUrl}/personnels`)
      .then(response => response.json())
      .then(personnels => {
        console.log("personnels", personnels);
        //Pour chaque trainers dans datas, je les rajoute à la liste de choix
        personnels.forEach(personnel => {
          detail_visitors.innerHTML += `<option value=\"${personnel.name_personnels} ${personnel.firstname_personnels}\">${personnel.name_personnels} ${personnel.firstname_personnels}</option>`;
        });
      });
  }
  else if (ev.target.id === "formation") {
    fetch(`${apiUrl}/formations`)
      .then(response => response.json())
      .then(formations => {
        console.log("formations : ", formations);
        //Pour chaque trainers dans datas, je les rajoute à la liste de choix
        formations.forEach(formation => {
          detail_visitors.innerHTML += `<option value=\"${formation.nom_formation}\">${formation.nom_formation}</option>`;
        });
      });
  }
}

const register = async (ev) => {

  ev.preventDefault();
  //1) récupérer les infos via le formdata
  let formdata = new FormData(arrivalForm);
  const datas = Object.fromEntries(formdata.entries());
  console.log(datas);

  // Vérifier les champs
  for (const value of Object.values(datas)) {
    if (!value || value === "") {
      alert('Champ obligatoire vide !');
      return;
    }
  }

  // 2) Vérifier si l'utilisateur est déjà enregistré
  const email = datas.email_visitors;
  try {
    const checkResponse = await fetch(`${apiUrl}/visitors/${encodeURIComponent(email)}`);
    const existing = await checkResponse.json();
    console.log("existing.registered", existing.registered)
    // Supposons que l'API retourne un tableau des visiteurs actifs
    if (existing.registered === true) {
      alert("Cet email est déjà enregistré, connectez-vous !");
      return;
    }
  } catch (error) {
    alert("Erreur lors de la vérification de l'email.");
    return;
  }

  // 3) créer le visitor
  await fetch(`${apiUrl}/visitors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(datas)
  })
    .then(response => response.json())
    .then(datas => {
      console.log(datas)
      if (!datas.error)
        alert('Vous êtes enregistré sur le site !')
      else
        alert('Erreur : ' + datas.error)
    });
}

const disconnect = async (ev) => {
  //1) récupérer le mail de celui qui veut partir

  let formdata = new FormData(departureForm);
  const datas = Object.fromEntries(formdata.entries());
  console.log("email_disconnect", datas.email_visitors)
  // Vérifier que le datas.email_visitors n'est pas vide
  if (!datas.email_visitors || datas.email_visitors.trim() === "") {
    alert('Champ email vide!');
    return;
  }
  //2) faire la requête

  await fetch(`${apiUrl}/visitors/${datas.email_visitors}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(datas)
  })
    .then(response => response.json())
    .then(datas => {
      console.log(datas)
      //3) alerter l'utilisateur qu'il est déconnecté
      if (!datas.error)
        alert('Vous êtes sorti du site !')
      else
        alert('Erreur : ' + datas.error)
    });
}

const switchForm = () => {
  if (tabsBool[0]) {
    arrival.classList.remove("hidden");
    departure.classList.add("hidden");

  }
  else if (tabsBool[1]) {
    arrival.classList.add("hidden");
    departure.classList.remove("hidden");
  }
}

const setActiveTab = (activTab) => {
  switch (activTab) {
    case "tabEntree":
      tabsBool[0] = 1;
      tabsBool[1] = 0;
      break;

    default:
      tabsBool[0] = 0;
      tabsBool[1] = 1;
      break;
  }
  switchForm();
}

//Récupérer les routes possibles
fetch(apiUrl)
  .then(resp => resp.json())
  .then(routes => {
    console.log("routes", routes);
  })
  .catch(error => {
    console.log("error to fetch to API ", error);

  })
