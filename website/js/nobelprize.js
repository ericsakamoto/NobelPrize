
const NOBELPRIZEAPIURL = "http://api.nobelprize.org/2.0/nobelPrize/phy/"
const NOBELPRIZELAUREATEAPIURL = "http://api.nobelprize.org/2.0/laureate/"

const main = document.getElementById("main");


function showVal(newVal){
  document.getElementById("year").innerHTML=newVal;
}

async function callAPI(year) {
  
  
  var modal = document.getElementById("loading");
  var span = document.getElementsByClassName("close")[0];
  modal.style.display = "block";
  await getLaureates(NOBELPRIZEAPIURL,year);
}

async function loadVal() {
  defaultyear = document.getElementById("yearRange").value;
  document.getElementById("year").innerHTML=defaultyear;
  await getLaureates(NOBELPRIZEAPIURL,defaultyear);  
}

async function getLaureates(url,year) {

  const resp = await fetch(url + "/" + year) ;
  const respData = await resp.json();

  //console.log(respData);
  
  await showLaureates(respData);
}

async function showLaureates(prize) {

  var modal = document.getElementById("loading");
  // clear main
  main.innerHTML = "";

  const awardYear = prize[0].awardYear;

  const nobelprizelyear = document.createElement("h1");
  nobelprizelyear.classList.add("prize-year");
  nobelprizelyear.innerHTML = `${awardYear}`;
  main.appendChild(nobelprizelyear);

  const cards = document.createElement("div");
  cards.classList.add("cards");

  if (typeof prize[0].laureates !== 'undefined') {
    prize[0].laureates.forEach(async (laureate) => {
      await getLaureate(laureate.id,awardYear,cards);
    });
  } else {
    showEmptyCard(cards);
  }

  main.appendChild(cards);
  modal.style.display = "none";
}

async function getLaureate(id,awardYear,cards) {

    const resp = await fetch(NOBELPRIZELAUREATEAPIURL + "/" + id) ;
    const respData = await resp.json();
  
    //console.log(respData);
    
    showLaureate(respData,cards,id,awardYear);
}

function showLaureate(laureate,cards,id,awardYear) {
  console.log(laureate);

  let birth = laureate[0].birth.date;
  let death = 'death' in laureate[0] ? laureate[0].death.date : "";
  let motivation = laureate[0].nobelPrizes[0].motivation.en;
  let affiliation = 'affiliations' in laureate[0].nobelPrizes[0] ? laureate[0].nobelPrizes[0].affiliations[0].name.en : "";
  let country = affiliation != "" ? laureate[0].nobelPrizes[0].affiliations[0].country.en : "";

  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
    <a href="#"><img class="card-img" src="img/physicsnobelprize-${awardYear}-${id}.png" alt="/"></a>
    <div class="card-body">
      <div class="card-title">
        ${laureate[0].knownName.en}
    </div>
    <p class="card-motivation">${motivation}</p>
  `;

  const cardbirth = document.createElement("p");
  cardbirth.classList.add("card-birth");
  cardbirth.innerHTML = `
    <span style="font-size: 15px; color: black; margin-right: 5px;">
      <i class="fas fa-star"></i>
    </span>
    ${birth}
  `;
  card.appendChild(cardbirth);

  const carddeath = document.createElement("p");
  carddeath.classList.add("card-death");
  carddeath.innerHTML = `
    <span style="font-size: 15px; color: black; margin-right: 5px;">
      <i class="fas fa-cross"></i>
    </span>
    ${death}
  `;
  death != "" ? card.appendChild(carddeath) : "";

  const cardaffiliation = document.createElement("p");
  cardaffiliation.classList.add("card-affiliation");
  cardaffiliation.innerHTML = `
    ${affiliation}
  `;
  affiliation != "" ? card.appendChild(cardaffiliation) : "";

  const cardcountry = document.createElement("p");
  cardcountry.classList.add("card-country");
  cardcountry.innerHTML = `
    ${country}
  `;
  country != "" ? card.appendChild(cardcountry) : "";

  cards.appendChild(card);
}

function showEmptyCard(cards) {
  //console.log(laureate);

  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
    <div class="card-body">
      <div class="card-message">
        No Nobel Prize was awarded this year.
    </div>
  </div>
  `;

  cards.appendChild(card);
}