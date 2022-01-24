const itemToAdd = document.getElementById('input'); //Det som ska läggas till i listan
const form = document.getElementById('inputForm')//Själva formuläret
const btn = document.getElementById('add'); // Knappen för att lägga till
const listPrint = document.getElementById('list') //Listan som visar sakerna
const varning = document.getElementById('varning'); //elementet som visar en varning om man inte har något i input
const btnMark = document.getElementById('mark'); // Markera alla knappen
const btnUnmark = document.getElementById('unmark') // Anmarkera alla knappen
const btnSave = document.getElementById('save'); //Spara knappen
const saveText = document.getElementById('saveText'); //Texten som hör ihop med spara knappen
const btnRemove = document.getElementById('remove'); //Kanppen för att ta bort en sparad lista
const textRemove = document.getElementById('removeText'); //Texten som hör ihop med remove knappen

//Ladda in en tidigare lista om det finns någon
function loadSavedList() {

    const loadedList = localStorage.getItem('SavedList');
    if (loadedList !== null) {
        const parsedList = JSON.parse(loadedList);
        parsedList.forEach(element => {
            const input = element.text;
            const checked = element.isChecked;
            console.log(input);
            printList(input, checked);
        })
    }
}
//laddar in en sparad lista när fönstret laddas om det finns någon
window.addEventListener('load', () => {
    loadSavedList();
    showElementsIfListExists();
})
    
//Vad som händer om man klickar på lägga till knappen
form.addEventListener('submit', (e) => {
    e.preventDefault();
    printList(itemToAdd.value);
    showElementsIfListExists();

})


function printList(input, checked) {  //Lägger till i listan och en en eventhandler om man klickar på listelementet
    if (checked == undefined) {
        if (!checkIfInputIsEmpty()) {
            return;
        }
    }
    const addElement = document.createElement('li');
    addElement.innerText = input;
    addElement.classList.add('list-group-item', 'col-6', 'offset-3')

    if (checked) {
        addElement.classList.add('list-group-item', 'text-decoration-line-through', 'bg-body')
    }
    addElement.addEventListener('click', function () {
        if (addElement.classList.contains('text-decoration-line-through')) {
            addElement.classList.remove('text-decoration-line-through', 'bg-body');
        }
        else {
            addElement.classList.add('text-decoration-line-through');
            addElement.classList.add('bg-body', 'list-group-item')
        }
    })
    listPrint.appendChild(addElement);
    const remove = document.createElement('i'); //Lägger till ett ikon object men ikonen X i
    remove.classList.add('fas', 'fa-times');
    remove.addEventListener('click', function (e) { //Lägger till en eventhandler om man klickar på Xet
        addElement.remove();
        showElementsIfListExists();
    })
    addElement.appendChild(remove)
    itemToAdd.value = '';
}

//Kollar så att man har input i input rutan och retunerar en bool
function checkIfInputIsEmpty() {
    if (itemToAdd.value === '') {
        varning.classList.remove('d-none')
        return false;
    }
    else {
        varning.classList.add('d-none')
        return true;
    }
}
//Visar enbart vissa element om det finns något i listan
function showElementsIfListExists() { 
    const list = document.querySelectorAll('li');
    if (list.length !== 0) {
        btnMark.classList.remove('d-none');
        btnUnmark.classList.remove('d-none')
        btnSave.classList.remove('d-none');
        saveText.classList.remove('d-none');
    }
    else {
        btnMark.classList.add('d-none');
        btnUnmark.classList.add('d-none');
        btnSave.classList.add('d-none');
        saveText.classList.add('d-none');
    }
}

btnMark.addEventListener('click', () => { //Markerar eller avmarkerar alla saker i listan om man trcker på knappen
    const list = document.querySelectorAll('li');
    list.forEach(element => {
            element.classList.add('text-decoration-line-through', 'bg-body', 'list-group-item');
        })
})
    
// Unmarkar alla saker i lisan om man trycker på avmarkera alla knappen
btnUnmark.addEventListener('click', () => {
    const list = document.querySelectorAll('li');
    list.forEach(element => {
        element.classList.remove('text-decoration-line-through', 'bg-body');
    })
})

function SavedList(text, isChecked) {
    this.text = text;
    this.isChecked = isChecked;
}

//Koden för spara listan knappen
btnSave.addEventListener('click', function (e) {
    const list = Array.from(document.querySelectorAll('li')).map(e => new SavedList(e.innerText, e.classList.contains('bg-body')));
    console.log(list);
    let json = JSON.stringify(list);
    localStorage.setItem('SavedList', json);
    ShowRemovebtn();
})

//Kod för att när ta bort sparad listan knappen ska synas
function ShowRemovebtn() {
    if (localStorage.getItem('SavedList') !== null) {
        btnRemove.classList.remove('d-none');
        textRemove.classList.remove('d-none');
    }
}

//Koden för ta bort den sparade listan knappen
btnRemove.addEventListener('click', () => {
    localStorage.clear();
    btnRemove.classList.add('d-none');
    textRemove.classList.add('d-none');
})