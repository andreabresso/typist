/* Elementos DOM */
const userNameDisplayed = document.querySelector("#user-name-displayed");
const currentTextDisplayed = document.querySelector("#text-displayed");
const timeDisplayed = document.querySelector("#time");
const message = document.querySelector("#time-up-message");
const inputText = document.querySelector("#user-text-input");
const displayWordsPerMinute = document.querySelector("#words-per-minute");
const displayMistakes = document.querySelector("#mistakes");
const startButton = document.querySelector("#start-button");
const resetButton = document.querySelector("#restart-button");
const saveScoreButton = document.querySelector("#save-score-button");
const userName = document.querySelector("#username");
const highScoresList = document.querySelector("#highScoresList");
const apiUrl = "http://api.quotable.io/random";
const quoteDisplayed = document.querySelector("#quote-displayed");
const quoteP = document.querySelector("#quote-p");

/* Creo una variable global que me va a servir en otras funciones para indicar que el usario está jugando al juego */
let isPlaying;

/* Creo variables para el timer */
let timer,
maxTime = 60,
timeLeft = maxTime;

/* Evento que inicia el juego */
startButton.addEventListener("click", init);

/* Iniciar el juego */
function init(){
    //Desaparece el botón de comenzar
    startButton.style.display = "none";
    //Habilito la text area
    inputText.removeAttribute('disabled');
    //Hacemos que el text area esté enfocado para que el usuario pueda empezar a tipear
    document.getElementById("user-text-input").focus();
    //Llamamos a la función que carga el párrafo
    loadWords(wordsArray);
    //Llamamos a la función para que comience a correr el tiempo
    timer = setInterval(initTimer,1000);
    //Establecemos que el jugador está jugando
    isPlaying = true;
} 

/* Creo un Array multidimensional que contiene cuatro arrays con palabras */
const wordsArray = [
    ["constitución", "jurisprudencia", "prestamista", "posición", "apelación", "tribunal", "juez", "ilegalidad", "material", "consecuencias", "recurso", "procesal", "prejudicialidad", "intimación", "público", "notorio", "manifiestamente", "improcedente", "incapacidad", "perentorio", "plazo", "sucesión", "parentesco", "agenda", "económico", "financiero", "inmobiliario", "practicidad", "recurrente", "contraria", "parámetro", "traslado", "instancia", "caducidad", "particular", "querellante", "penalidad", "preventivo", "remedio", "cautelar", "aseguramiento", "intencionalidad", "tasación", "reposición", "sellado", "casación", "contencioso", "administrativo", "homicidio", "agravante", "pleno", "plenario", "patrocinio", "patrocinante", "comparendo", "compareciente"],
    ["perro", "gato", "delfín", "tortuga", "jirafa", "araña", "oveja", "león", "tigre", "leopardo", "pantera", "mariposa", "cisne", "tero", "tucán", "halcón", "camello", "lobo", "ratón", "ballena", "pez", "escarabajo", "conejo", "vaca", "caballo", "burro", "medusa", "quis", "liebre", "búho", "carancho", "garza", "cotorra", "gorrión", "paloma", "flamenco", "águila", "topo", "iguana", "víbora", "alacrán", "cucaracha", "oso", "zebra", "rinoceronte", "hipopótamo", "sapo", "pato", "gallina", "canario", "molusco", "arácnido", "avestruz"],
    ["cuchara", "tenedor", "cuchillo", "fuente", "olla", "horno", "cocina", "espátula", "batidor", "espumadera", "taza", "cucharón", "bandeja", "tartera", "bowl", "sacacorcho", "abrelatas", "tiernizador", "parrilla", "pincel", "sartén", "tostadora", "microondas", "termo", "cafetera", "pava", "abrelatas", "botella", "tapa", "termómetro", "molde", "pirotin", "colador", "escurridor", "vaso", "copa", "rejilla", "esponja", "repasador", "jarra", "mate", "bombilla", "encendedor", "agarradera", "pinza", "azucarera", "hornalla", "decantador", "calentador", "canasta", "heladera"],
    ["pan", "lechuga", "queso", "pepino", "tomate", "rúcula", "chocolate", "uva", "manzana", "banana", "ciruela", "café", "acelga", "pizza", "cebolla", "pimiento", "tarta", "sopa", "pasta", "fideos", "puré", "zapallo", "batata", "papa", "huevo", "pollo", "pescado", "sardina", "atún", "magdalena", "galleta", "torta", "merengue", "manteca", "sal", "pimienta", "panqueque", "bondiola", "carré", "milanesa", "jamón", "tortilla", "bizcochuelo", "pera", "naranja", "mandarina", "aceite", "asado", "costilla", "salsa", "aceituna", "jamón"]
]

/* Creo una función que elige uno de esos arrays al azar y se lo muestra al usuario utilizando join */
function loadWords (wordsArray) {
    const ranIndex = Math.floor(Math.random() * wordsArray.length);
    /* Muestro el texto para que el usuario escirba */
    let wordsShowed = wordsArray[ranIndex];
    currentTextDisplayed.innerHTML = wordsShowed.join(" ");
}

/* Creo una función que va a contar los 60 segundos que tiene el usuario para tipear las palabras */

function initTimer() {
    /*Primero me aseguro de que el tiempo no se haya terminado y le indico que mientras el tiempo no se haya terminado reste 1 */
    if (timeLeft > 0) {
        timeLeft--;
        timeDisplayed.innerHTML = timeLeft;
    } else {

        clearInterval(timer);

        isPlaying = false;

        /* Mesaje que le aparece al jugador cuando el tiempo se termina */
        message.innerHTML = "¡Tu tiempo ha terminado!";
        message.style.display = "block";

        /* No permito que el usario ingrese más palabras al text area */
        inputText.setAttribute('disabled',"");

        /* Cuando el tiempo se termina se llama a la función que cuenta las palabras correctas del texto ingresado por el usuario */
        let correctWords = accuracy(inputText.value, currentTextDisplayed.innerText);

        /* Cuando el tiempo se termina se llama a la función que cuenta las palabras incorrectas del texto ingresado por el usuario */
        let incorrectWords = inaccuracy(inputText.value, currentTextDisplayed.innerText);
    
        /* Mensaje de la cantidad de palabras */ 
        displayWordsPerMinute.innerHTML = correctWords;

        /* Mensaje de la cantidad de errores */
        displayMistakes.innerHTML = incorrectWords;

        /* Habilito el username input */
        userName.removeAttribute('disabled');

        /* Guardo en local storage la cantidad de palabras correctas */
        localStorage.setItem('mostRecentScore', correctWords);
    }
}

/* Creo una función que cuenta las palabras correctas */
function accuracy (inputText, currentTextDisplayed){
    /* Primero aplico el método split al texto mostrado al usuario y declaro en cero la variable de conteo */
    currentTextDisplayed = (currentTextDisplayed.split(" "));
    let count = 0;
    /* Luego aplico los métodos trim y split al texto ingresado por el usuario para crear un nuevo array. Después recorro ese array con for each y le aplico una función - anónima - a cada item de ese nuevo array que controla -con IndexOf- si cada uno de los items se encuentra en el texto mostrado y me devuelve su número de índice. Como si el item no se encuentra la función me devuelve -1,cada vez que me devuelva un número mayor a -1 el contador de palabras correctas sube */
    inputText.trim().split(" ").forEach(function (item) {
        if(currentTextDisplayed.indexOf(item) > -1)
        count++;
    });
    return count;
}

/* Creo una función que cuenta las palabras incorrectas */
function inaccuracy (inputText, currentTextDisplayed){
    /* Primero aplico el método split al texto mostrado al usuario y declaro en cero la variable de errores */
    currentTextDisplayed = (currentTextDisplayed.split(" "));
    let mistakes = 0;
    /* Luego aplico los métodos trim y split al texto ingresado por el usuario para crear un nuevo array. Después recorro ese array con for each y le aplico una función - anónima - a cada item de ese nuevo array que controla -con IndexOf- si cada uno de los items se encuentra en el texto mostrado y me devuelve su número de índice. Como si el item no se encuentra la función me devuelve -1, cada vez que me devuelva -1 el contador de errores sube */
    inputText.trim().split(" ").forEach(function (item) {
        if(currentTextDisplayed.indexOf(item) == -1)
        mistakes++;
    });
    return mistakes;
}

/* Evento que reinicia el juego */
resetButton.onclick = () => {
    //Reseteo la textarea
    document.getElementById("user-text-input").value = "";
    //Hago que reaparezca el botón de comenzar
    startButton.style.display = "block";
    //Hago que desaparezca el mensaje de tiempo terminado
    message.style.display = "none";
    //Reseteo los elementos del timer
    clearInterval(timer);
    timeLeft = maxTime;
    timeDisplayed.innerHTML = timeLeft;
    //Reseteo las palabras y los errores
    displayWordsPerMinute.innerHTML = 0;
    displayMistakes.innerHTML = 0;
}

/* Creo una función para resetear la text area cuando se recarga la página con el evento onload */
function reset (){
    document.getElementById("user-text-input").value = "";
}
window.onload = reset;

/* Código para mostrar el puntaje */

/* Const para los puntajes más altos */
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

/* Creo una const que va a determinar que en la leader board solo se van a ver los 5 puntajes más altos */
const maxHighScores = 5;

userName.addEventListener('keyup', () => {
    //No habilito el botón guardar hasta que el usuario ingrese su nombre
    saveScoreButton.disabled = !userName.value;
});

saveScoreButton.onclick = (e) => {
    e.preventDefault();

    /* Creo una constante que va a recuperar el último puntaje del jugador del local storage */
    const latestScore = localStorage.getItem('mostRecentScore');

    /* Creo un objeto que va a guardar el puntaje con el nombre ingresado por el usuario */
    const score = {
        score: latestScore,
        name: userName.value
    }
    /* Lo guardo en el array de puntajes más altos */
    highScores.push(score);

    /* Uso sort para comparar los elementos del array para ver cuál es el puntaje más alto */
    highScores.sort((a,b) => b.score - a.score)

    /* Uso splice para limitar el array de puntajes más altos a los 5 más altos */
    highScores.splice(5);

    /* Actualizamos el local storage */
    localStorage.setItem("highScores", JSON.stringify(highScores));

    //Reseteo el input del usuario
    document.getElementById("username").value = "";

    /* Muestro los puntajes más altos usando map y creando elementos de una unordered list con template literals */
    highScoresList.innerHTML = highScores.map ( score => {
        return `<li class="high-score text-center">${score.name} - ${score.score}</li>`;
    }).join("");

    /* Mensaje que le aparece al jugador con Sweet Alert cuando guardo el puntaje */ 
    if (latestScore >= 50){
        swal({
            title: "¡Wow!",
            text: "Eres un as del tipeo",
            icon: "../multimedia/surprised-joey.jpg",
            button: "Entendido",
        });
    } else if (latestScore >= 35){
        swal({
            title: "¡Lo lograste!",
            text: "¡Eres rápido tipeando!",
            icon: "../multimedia/leo-toast.jpg",
            button: "Entendido",
        });
    } else {
        swal({
            title: "¡Buen intento!",
            text: "Pero debes seguir practicando...",
            icon: "../multimedia/success-kid-rs.jpg",
            button: "Entendido",
        });
    };
    
    /* Hago que aparezca la frase motivacional */
    quoteP.innerHTML = "A continuación te dejamos una frase motivacional para que sigas practicando";
    quoteP.style.display = "block";
    renderNewQuote()
}

/* Utilización de una API para mostrar frases motivacionales */ 
function getRandomQuote() {
    return fetch(apiUrl)
      .then(response => response.json())
      .then(data => data.content);
}

async function renderNewQuote(){
    const quote = await getRandomQuote();
    quoteDisplayed.innerHTML = quote;
}