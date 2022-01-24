import Character from "./character.js";
const textarea = document.getElementById('output');
const form = document.getElementById('form');

async function getApi2() {

    const charName = document.getElementById('input');
    const fullUri = 'https://www.swapi.tech/api/people/?name=' + charName.value;

    const character = await fetch(fullUri).then(res => res.json());
    const planet = await fetch(character.result[0].properties.homeworld).then(res => res.json());
    return { planet: planet,
            char: character }

}

form.addEventListener('submit', async (e) => {

    e.preventDefault();
    let char = await getApi2()
    printInfo(setCharInfo(char));
    

});

function setCharInfo(info){
    const result = info.char.result[0].properties;
    const name = result.name;
    const gender = result.gender;
    const weight = result.mass;
    const height = result.height;
    const hairColor = result.hair_color;
    const homePlanet = info.planet.result.properties.name;
    const char = new Character(name, gender, height, weight, hairColor, homePlanet);
    return char
}

function printInfo(char){
    textarea.innerHTML =
    `Name: ${char.name}
Gender: ${char.gender}
Height: ${char.height}cm
Weight: ${char.weight}kg
Hair color: ${char.hairColor}
Home planet: ${char.homePlanet}
`
}
