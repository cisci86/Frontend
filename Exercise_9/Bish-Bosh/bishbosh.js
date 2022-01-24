const number = document.getElementById('number'); //fäletet man lägger till antalet nummer i
const bosh = document.getElementById('bosh'); // bosh värdet
const bish = document.getElementById('bish'); //bish värdet

const table = document.getElementById('table'); //elementet som tabellen skapas i
const button = document.getElementById('send'); //knappen för att skapa tabellen
const warning = document.getElementById('warning') //p tagen som varningstexten kommer upp i om man fyllt i negativa tal

function myFunction() {
    let row = table.insertRow(-1);
    let a = 0
    let j = 0 /* Används för att få tabellen rätt */
    for (let i = 1; i <= number.value; i++) {
        if (j % 5 == 0) {
            row = table.insertRow(-1); //Lägger till en ny tabell rad var efter fem columner
            a = 0; //sätter a till 0 så att cell fördelningen blir rätt
        }
        if (i % bish.value == 0 && i % bosh.value == 0) {
            let newText = document.createTextNode('Bish-Bosh');
            row.insertCell(a).appendChild(newText);
            a++;
        }
        else if (i % bosh.value == 0) {
            let newText = document.createTextNode('Bosh');
            row.insertCell(a).appendChild(newText);
            a++;
        }
        else if (i % bish.value == 0) {
            let newText = document.createTextNode('Bish');
            row.insertCell(a).appendChild(newText);
            a++;
        }
        else {
            let newText = document.createTextNode(i);
            row.insertCell(a).appendChild(newText)
            a++;
        }
        j++;
    }
}


button.addEventListener('click', function () {
    table.innerHTML = '';
    if (number.value < 0 || bish.value < 0 || bosh.value < 0) {
        warning.classList.remove('d-none'); //tyckte det var snyggare med en text under inputen ist för en alert ruta
        warning.innerText = 'Använd enbart possitiva tal!';
        return;

    }
    else {
        warning.classList.add('d-none');
    }
    myFunction();
}); 