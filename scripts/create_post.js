//BOOKS
function jsonBooks(json) {
    console.log('JSON ricevuto');
    // Svuotiamo la libreria
    const library = document.getElementById('results');
    library.innerHTML = '';
    // Leggi il numero di risultati
    let num_results = json.num_found;
    // Mostriamone al massimo 10
    if (num_results > 10)
        num_results = 10;
    // Processa ciascun risultato
    for (let i = 0; i < num_results; i++) {
        // Leggi il documento
        const doc = json.docs[i]
            // Leggiamo info
        const title = doc.title;
        // Controlliamo ISBN
        if (!doc.isbn) {
            console.log('ISBN mancante, salto');
            continue;
        }
        const isbn = doc.isbn[0];
        // Costruiamo l'URL della copertina
        const cover_url = 'http://covers.openlibrary.org/b/isbn/' + isbn + '-M.jpg';
        // Creiamo il div che conterrà immagine e didascalia
        const book = document.createElement('div');
        book.classList.add('book');
        // Creiamo l'immagine
        const img = document.createElement('img');
        img.src = cover_url;
        // Creiamo la didascalia
        const caption = document.createElement('span');
        caption.textContent = title;
        // Aggiungiamo immagine e didascalia al div
        book.appendChild(img);
        book.appendChild(caption);
        // Aggiungiamo il div alla libreria
        library.appendChild(book);

    }
}

// SPOTIFY
function jsonSpotify(json) {
    console.log("json ricevuto");
    if (!json.tracks.items.length) {noResults(); return;}
    
    const container = document.getElementById('results');
    container.innerHTML = '';
    container.className = 'spotify';

    for (let track in json.tracks.items) {
        const card = document.createElement('div');
        card.dataset.id = json.tracks.items[track].id;
        card.classList.add('track');
        const img = document.createElement('img');
        img.src = json.tracks.items[track].album.images[0].url;
        card.appendChild(img);
        const info = document.createElement('div');
        info.classList.add('info');
        const name = document.createElement('div');
        name.classList.add('name');
        name.textContent = json.tracks.items[track].name;
        info.appendChild(name);
        const author = document.createElement('div');
        author.classList.add('author');
        author.textContent = json.tracks.items[track].artists[0].name;
        info.appendChild(author);
        card.appendChild(info);
        card.addEventListener('click', selectSpotify);
        container.appendChild(card);
        }
}

function selectSpotify(event) {
    const track = event.currentTarget;
    const modal = document.getElementById('title_modal');
    modal.querySelector('textarea').value = "";
    modal.classList.remove('hidden');
    setTimeout(function(){modal.classList.remove('invisible');}, 3);
    noScroll();

    contentObj.id = track.dataset.id;

    const iframe = document.createElement('iframe');
    iframe.src = "https://open.spotify.com/embed/track/"+contentObj.id;
    iframe.frameBorder = 0;
    iframe.setAttribute('allowtransparency', 'true');
    iframe.allow = "encrypted-media";
    iframe.classList = "track_iframe";
    const placeholder = document.getElementById('modal_preview');
    placeholder.innerHTML = '';
    placeholder.appendChild(iframe);
}

// OPENLIBRARY
function jsonbook(json, type) {
    const container = document.getElementById('results');
    container.innerHTML = '';
    container.className = type;
    const columns = [];
    for (let i = 0; i < 3; i+=2) {
        let div = document.createElement('div');
        container.appendChild(div);
        for (let j = 0; j < 2; j++) {
            columns[i+j] = document.createElement('div');
            div.appendChild(columns[i+j]);
        }
    }
    columnHeights = [0, 0, 0, 0];
    for (let item in json) {
        const img = document.createElement('img');
        img.dataset.id = json[item].id;
        img.src = json[item].preview;
        img.classList.add('invisible');
        colIndexMin = columnHeights.indexOf(Math.min(...columnHeights));
        columns[colIndexMin].appendChild(img);
        columnHeights[colIndexMin] += 300 * json[item].height / json[item].width;  
        img.onload = function(){img.classList.remove('invisible');};
        img.addEventListener('click', selectImage);
    }
}

function selectImage(event) {
    const modal = document.getElementById('title_modal');
    //modal.querySelector('textarea').value = "";
    modal.classList.remove('hidden');
    setTimeout(function(){modal.classList.remove('invisible');}, 3);
    noScroll();

    const img = document.createElement('img');
    img.src = event.currentTarget.src;
    contentObj.id = event.currentTarget.dataset.id;
    const placeholder = document.getElementById('modal_preview');
    placeholder.innerHTML = '';
    placeholder.appendChild(img);
}

// NOSCROLL 
function noScroll() {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', scrollbarWidth+"px");
    document.body.classList.add('om');
}


// CERCA
function noResults() {
    // Definisce il comportamento nel caso in cui non ci siano contenuti da mostrare
    const container = document.getElementById('results');
    container.innerHTML = '';
    const nores = document.createElement('div');
    nores.className = "loading";
    nores.textContent = "Nessun risultato.";
    container.appendChild(nores);
}

function search(event)
{
    // Leggo il tipo e il contenuto da cercare e mando tutto alla pagina PHP
    contentObj = {};
    const form_data = new FormData(document.querySelector("#newpost form"));
    contentObj.type = form_data.get('type');
    // Mando le specifiche della richiesta alla pagina PHP, che prepara la richiesta e la inoltra
    fetch("do_search_content.php?type="+contentObj.type+"&q="+encodeURIComponent(form_data.get('search'))).then(searchResponse).then(searchJson);
    document.getElementById('searchbox').blur();

    // Mostro i risultati ottenuti
    const container = document.getElementById('results');
    container.innerHTML = '';
    const loading = document.createElement('img');
    loading.src = "./assets/loading.svg";
    loading.className = "loading";
    container.appendChild(loading);

    // Evito che la pagina venga ricaricata
    event.preventDefault();
}

function searchResponse(response)
{
    console.log(response);
    return response.json();
}

function searchJson(json)
{
    console.log(json);
    console.log(json.length);

    if (!json.length && contentObj.type != 'spotify' && contentObj.type != 'books') { noResults(); return; }

    switch (contentObj.type) {

        
        
        case 'spotify': jsonSpotify(json); break;
        
        case 'books': jsonBooks(json); break;
    }
}


// MODALE

function closeModal(event) {
    console.log('chiudo');
    const modal = document.getElementById('title_modal');
    modal.classList.add('invisible');
    setTimeout(function(){ 
        modal.classList.add('hidden'); 
        modal.classList.remove('flip');
        document.getElementById('dispatch_result_fail').classList.add('hidden', 'invisible');
        document.getElementById('dispatch_result_success').classList.add('hidden', 'invisible');
        //document.getElementById('title_form').classList.remove('hidden', 'invisible');
        for (let svg of modal.querySelectorAll('svg')) svg.classList.remove('animated');
        modal.querySelector("#modal_preview").innerHTML = '';
    }, 300);
    document.body.classList.remove('om');
}

function createNewPost(event)
{
    // Preparo i dati da mandare al server e invio la richiesta con POST
    const formData = new FormData(document.querySelector("#title_modal form"));
    formData.append('type', contentObj.type);
    formData.append('id', contentObj.id);
    fetch("post_dispatcher.php", {method: 'post', body: formData}).then(dispatchResponse, dispatchError);

    event.preventDefault();
}

function dispatchResponse(response) {
    // Aggiungi animazione e controlla il risultato della richiesta
    document.getElementById('title_modal').classList.add('flip');

    if(!response.ok) {
        dispatchError();
        return null;
    }
    console.log(response);
    return response.json().then(databaseResponse); 
}

function dispatchError(error) { 
    const result = document.getElementById('dispatch_result_fail');
    result.classList.remove('hidden');
    setTimeout(function(){ result.classList.remove('invisible'); }, 3);
    result.querySelector('svg').classList.add('animated');
}

function databaseResponse(json) {
    if (!json.ok) {
        dispatchError();
        return null;
    }
    
    const result = document.getElementById('dispatch_result_success');
    result.classList.remove('hidden');
    setTimeout(function(){ result.classList.remove('invisible'); }, 3);
    result.querySelector('svg').classList.add('animated');
}

function customStopPropagation(event) {
    event.stopPropagation();
}

// INIT

let contentObj = {}; 
let columnHeights;
document.querySelector("#newpost form").addEventListener("submit", search);

document.querySelector("#think").addEventListener("click", selectText);
document.getElementById('close_modal').addEventListener('click', closeModal);
document.getElementById('modal_newpost_fail').addEventListener('click', closeModal);
document.getElementById('modal_newpost_success').addEventListener('click', closeModal);
document.getElementById('title_modal').addEventListener('click', closeModal);
document.querySelector('#title_modal .window').addEventListener('click', customStopPropagation);
document.querySelector("#title_modal form").addEventListener("submit", createNewPost);

// Aggiungo Event Listener ai radio button (per selezionare il tipo di contenuto da pubblicare)
for (let r of document.querySelectorAll('#newpost input[type=radio]')) r.addEventListener('click', changeType);
let currentSelection = null;

function changeType(event) {
    // Cambio le classi degli oggetti deselezionati
    for (let v of document.querySelectorAll("header .visible")) v.classList.remove('visible');
    for (let s of document.querySelectorAll("header .selected")) s.classList.remove('selected');
    const searchBox = document.querySelector("#newpost input[type=text]");
    searchBox.disabled = true;
    // Se clicco su un tipo già selezionato, deseleziono quel tipo e ritorno
    if (currentSelection === event.currentTarget) {
        currentSelection = null;
        return;
    }

    currentSelection = event.currentTarget;
    currentSelection.parentNode.classList.add('selected');

    // A seconda del tipo selezionato, imposto gli elementi di pubblicazione del post
    if  (currentSelection.value === "text") {
         document.querySelector("header ."+currentSelection.value).classList.add('visible');
         document.querySelector(".think").classList.add("visible");
    } else if (currentSelection.value !== "text" && currentSelection.value !== "cat") {
        searchBox.classList.add('visible');
        searchBox.disabled = false;
        searchBox.value = '';
        document.querySelector("header ."+currentSelection.value).classList.add('visible');
    } else {
        for (let v of document.querySelectorAll("header .visible")) v.classList.remove('visible');
        searchBox.disabled = true;
        return;
    }
}



// NAVBAR 

document.addEventListener('touchstart', handleTouchStart, false); 
document.addEventListener('touchmove', handleTouchMove, false);
let xDown = null;
let yDown = null;

function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
};

function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    } 
    let xUp = evt.touches[0].clientX;
    let yUp = evt.touches[0].clientY;
    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;
    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
        if ( xDiff > 0 ) closeSidenav();
        else openSidenav();
    } 

    xDown = null;
    yDown = null;
};

function openSidenav() {
    if(!window.matchMedia("(max-width: 960px)").matches) return;
    const back = document.getElementById('sidenav');
    back.classList.remove('hidden');
    setTimeout(function(){
        back.classList.remove('invisible');
        document.getElementById('sidenav_content').classList.add('open');
    }, 3);
}

function closeSidenav() {
    const back = document.getElementById('sidenav');
    back.querySelector('#sidenav_content').classList.remove('open');
    back.classList.add('invisible');
    setTimeout(function(){ 
        back.classList.add('hidden'); 
    }, 303);
}

document.getElementById('s_nav').addEventListener('click', openSidenav);
document.getElementById('sidenav').addEventListener('click', closeSidenav);
document.getElementById('sidenav').addEventListener('click', customStopPropagation);






// PENSIERO
function selectText(event) {
    contentObj = {};
    contentObj.type = 'text';

    const modal = document.getElementById('title_modal');
    modal.querySelector('textarea').value = "";
    modal.classList.remove('hidden');
    setTimeout(function(){modal.classList.remove('invisible');}, 3);
    noScroll();
    
    const placeholder = document.getElementById('modal_preview');
    placeholder.innerHTML = '';

    event.preventDefault();
}