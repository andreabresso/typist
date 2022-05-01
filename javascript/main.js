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

/* Creo una variable global que me va a servir en otras funciones para indicar que el usario está jugando al juego */
let isPlaying;

/* Creo variables para el timer */
let timer,
maxTime = 60,
timeLeft = maxTime;

/* Creo un Array multidimensional que contiene cuatro arrays con 50 palabras cada uno */
const wordsArray = [
    ["constitución", "jurisprudencia", "prestamista", "posición", "apelación", "tribunal", "juez", "ilegalidad", "material", "consecuencias", "recurso", "procesal", "prejudicialidad", "intimación", "público", "notorio", "manifiestamente", "improcedente", "incpacidad", "perentorio", "plazo", "sucesión", "parentesco", "agenda", "económico", "financiero", "inmobiliario", "practicidad", "recurrente", "contraria", "parámetro", "traslado", "instancia", "caducidad", "particular", "querellante", "penalidad", "preventivo", "remedio", "cautelar", "aseguramiento", "intencionalidad", "tasación", "reposición", "sellado", "casación", "contencioso", "administrativo", "homicidio", "agravante"],
    ["perro", "gato", "delfín", "tortuga", "jirafa", "araña", "oveja", "león", "tigre", "leopardo", "pantera", "mariposa", "cisne", "tero", "tucán", "halcón", "camello", "lobo", "ratón", "ballena", "pez", "escarabajo", "conejo", "vaca", "caballo", "burro", "medusa", "quis", "liebre", "búho", "carancho", "garza", "cotorra", "gorrión", "paloma", "flamenco", "águila", "topo", "iguana", "víbora", "alacrán", "cucaracha", "oso", "zebra", "rinoceronte", "hipopótamo", "sapo", "pato", "gallina", "canario"],
    ["cuchara", "tenerdor", "cuchillo", "fuente", "olla", "horno", "cocina", "espátula", "batidor", "espumadera", "taza", "cucharón", "bandeja", "tartera", "bowl", "sacacorcho", "abrelatas", "tiernizador", "parrilla", "pincel", "sartén", "tostadora", "microondas", "termo", "cafetara", "pava", "abrelatas", "botella", "tapa", "termómetro", "molde", "pirotin", "colador", "escurridor", "vaso", "copa", "rejilla", "esponja", "repasador", "jarra", "mate", "bombilla", "encendedor", "agarradera", "pinza", "azucarera", "hornalla", "decantador", "calentador", "canasta"],
    ["pan", "lechuga", "queso", "pepino", "tomate", "rúcula", "chocolate", "uva", "manzana", "banana", "ciruela", "café", "acelga", "pizza", "cebolla", "pimiento", "tarta", "sopa", "pasta", "fideos", "puré", "zapallo", "batata", "papa", "huevo", "pollo", "pescado", "sardina", "atún", "magdalena", "galleta", "torta", "merengue", "manteca", "sal", "pimienta", "panqueque", "bondiola", "carré", "milanesa", "jamón", "tortilla", "bizcochuelo", "pera", "naranja", "mandarina", "aceite", "asado", "costilla", "salsa"]
]

/* Creo una función que elige uno de esos arrays al azar y se lo muestra al usuario utilizando join */
function loadWords (wordsArray) {
    const ranIndex = Math.floor(Math.random() * wordsArray.length);
    /* Muestro el texto para que el usuario escirba */
    let wordsShowed = wordsArray[ranIndex];
    currentTextDisplayed.innerHTML = wordsShowed.join(" ");
}

loadWords(wordsArray);

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

        /* No permito que el usario ingrese más palabras al text area */
        inputText.setAttribute('disabled',"");

        /* Cuando el tiempo se termina se llama a la función que cuenta las palabras del texto ingresado por el usuario */
        let correctWords = accuracy(inputText.value, currentTextDisplayed.innerText);

        /* Cuando el tiempo se termina se llama a la función que cuenta las palabras del texto ingresado por el usuario */
        let incorrectWords = inaccuracy(inputText.value, currentTextDisplayed.innerText);
    
        /* Mensaje de la cantidad de palabras */ 
        displayWordsPerMinute.innerHTML = correctWords;

        /* Mensaje de la cantidad de errores */
        displayMistakes.innerHTML = incorrectWords;
        
    }
}

/* Creo una función para contar palabras */
function wordCounter(text) {
    /* Creo una variable para eliminar los caracteres de espacio y puntuación con expresiones regulares */
    let removeChar = text.replace(/[^A-Za-z]\s+/g, " ");

    /* Creo una nueva variable para dividir el resultado en un array de palabras */
    let newWord = removeChar.trim().split(" ");

    /* La función cuenta los componentes del array y los muestra */
    return newWord.length;
}

/* Creo una función para resetear la text area cuando se recarga la página con el evento onload */
function reset (){
    document.getElementById("user-text-input").value = "";
}
window.onload = reset;

/* Arriba solo he creado una función que me permite contar las palabras, pero el proyecto terminado va a contener las siguientes funciones:
1) Una función que carga el texto del array que el usuario tiene que tipear usando un random index.
2) Una función que da inicio al juego cuando el usuario empieza a tipear en el textarea.
3) Una función que hace que el tiempo empiece a correr cuando se inicia el juego usando la función setInterval de Javascript.
4) Una función que muestra un mensaje cuando el tiempo se termina.
5) Una función que corrobora que el valor del text area ingresado por el usuario sea correcto, es decir, se corresponda con el valor del texto que se muestra.
6) Esto todavía no es definitivo pero, de ser posible, crearía una función para que el color del texto mostrado vaya cambiando a medida que el usario lo tipea (de un color si el usuario lo escribe bien y de otro si es un error) con la propiedad Element.classList.
7) Una función que calcule la cantidad de palabras y caracteres tipeados en el tiempo dado. 
8) Una función que resetea el juego.
*/