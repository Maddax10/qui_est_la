import '../styles/style.scss'

const arrivalSection = document.querySelector("#arrival");
const departureSection = document.querySelector("#departure");
const tabEntree = document.querySelector("#tabEntree");
const tabSortie = document.querySelector("#tabSortie");

//Permet de savoir quel onglet est actif et lequel ne l'est pas
//1ère case = onglet "Entrée", 
//2e case   = onglet "Sortie"
let tabsBool = [1, 0];

tabEntree.addEventListener("click", ev => handleClicks(ev));
tabSortie.addEventListener("click", ev => handleClicks(ev));

const handleClicks = (ev) => {
  const target = ev.target;
  console.log("click");
  console.log(target.id === "tabEntree");
  if (target.id === "tabEntree" || target.id === "tabSortie") setActiveTab(target.id);
}


const switchForm = () => {
  if (tabsBool[0]) {
    arrivalSection.style.display = "grid";
    departureSection.style.display = "none";

    console.log("entreeForm.style.display",arrivalSection.style.display);
    
  }
  else if(tabsBool[1]){
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
  console.log("activForm", tabsBool);
  switchForm();
}