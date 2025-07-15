import '../styles/style.scss'
const apiUrl = "http://localhost:3000"

const arrivalSection = document.querySelector("#arrival");
const departureSection = document.querySelector("#departure");
const listboxRegister = document.querySelector("#listboxRegister");

let currentUserId = 0;

//Permet de savoir quel onglet est actif et lequel ne l'est pas
//1ère case = onglet "Entrée", 
//2e case   = onglet "Sortie"
let tabsBool = [1, 0];

document.addEventListener("click", ev => handleClicks(ev));

const handleClicks = (ev) => {
  const target = ev.target;

  if (target.id === "tabEntree" || target.id === "tabSortie") setActiveTab(target.id);
  if (target.id === "registerBtn") register(ev);
  if (target.id === "formation" || target.id === "visite") switchListboxChoices(ev);
}

const switchListboxChoices = (ev) => {
  //reset the box choices
  listboxRegister.innerHTML = `<option value="null"></option>`;
  if (ev.target.id === "visite") {
    //get trainers
    fetch(`${apiUrl}/user`)
      .then(response => response.json())
      .then(datas => {
        console.log(datas);
        //Pour chaque trainers dans datas, je les rajoute à la liste de choix
        datas.forEach(user => {
          listboxRegister.innerHTML += `<option value=\"${user.id_user}\">${user.name_user} ${user.firstname_user}</option>`;
        });
      });
  }
  else if (ev.target.id === "formation") {
    fetch(`${apiUrl}/formations`)
      .then(response => response.json())
      .then(datas => {
        console.log(datas);
        //Pour chaque trainers dans datas, je les rajoute à la liste de choix
        datas.forEach(formation => {
          listboxRegister.innerHTML += `<option value=\"${formation.id_formation}\">${formation.nom_formation}</option>`;
        });
      });
  }
}

const register = async (ev) => {

  //====================================================
  //pas fini, POUR UNE VISITE SEULEMENT
  //====================================================

  ev.preventDefault();
  const name_user = document.querySelector("#registerName").value;
  const firstname_user = document.querySelector("#registerFirstname").value;
  const email_user = document.querySelector("#registerEmail").value;

  const user = {
    "name_user": name_user,
    "firstname_user": firstname_user,
    "email_user": email_user,
  }
  //1) créer l'utilisateur
  await fetch(`${apiUrl}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(response => response.json())
    .then(data => {
      currentUserId = data.id;
    });
  //2) créer la visite
  //seulement si on visite quelqu'un, à modifier
  const idVisitor = currentUserId;
  const idVisited = listboxRegister.value;
  //visite ou formation
  const type = document.querySelector('input[name="choix"]:checked')?.value;

  if (type === "visite") {
    const idLocalVisit = await fetch(apiUrl + "/formations/" )

    console.log("idVisitor", idVisitor);
    console.log("idVisited", idVisited);
    console.log("type", type);
    console.log("new Date()", new Date());

    const visit = {
      "id_user_visits": idVisitor,
      "type_visits": type,
      "detail_visits": idVisited,
      "arrival_visits": new Date(),
      "id_local_visits": idLocalVisit
    }
    //3) Créer le visit_log
  }
}

const switchForm = () => {
  if (tabsBool[0]) {
    arrivalSection.style.display = "grid";
    departureSection.style.display = "none";

  }
  else if (tabsBool[1]) {
    departureSection.style.display = "grid";
    arrivalSection.style.display = "none";
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
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.log("error to fetch to API ", error);

  })
