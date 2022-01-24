class Character{
    constructor(name, gender, height, weight, hairColor, homePlanet){
        this.name = name;
        this.gender = gender.charAt(0).toUpperCase() + gender.slice(1);
        this.height = height;
        this.weight = weight;
        this.hairColor = hairColor.charAt(0).toUpperCase() + hairColor.slice(1);
        this.homePlanet = homePlanet;
    }
}
export default Character;