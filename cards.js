// MAZZO CARTE E REGOLE
const CARDS_DATA = {
  '2': {
    title: 'Categoria',
    desc: 'Scegli una categoria (es. tipi di frutta, marche di bevande). A turno ogni giocatore deve nominare qualcosa a tema. Chi non riesce o ripete una parola gia detta... beve!',
    gender: ''
  },
  '3': {
    title: 'Rima',
    desc: 'Scegli una parola qualsiasi. A turno ogni giocatore deve nominare una parola che faccia rima. Il primo che non riesce a trovare una rima... beve!',
    gender: ''
  },
  '4': {
    title: 'Question Master',
    desc: 'Se qualcuno ti risponde a una domanda che fai... beve! Mantieni questo ruolo finche un altro giocatore non pesca un altro 4.',
    gender: ''
  },
  '5': {
    title: 'Contatore',
    desc: 'Scegli un numero tra 3 e 9. I giocatori contano a turno, ma al posto del numero scelto (o suoi multipli) si dice una parola scelta (es. ca**o). Chi sbaglia beve!',
    gender: ''
  },
  '6': {
    title: 'Carta del Cesso',
    desc: 'Solo tu puoi andare in bagno! Nessun altro giocatore puo andare in bagno finche non pesca un altro 6.',
    gender: ''
  },
  '7': {
    title: 'Bevi solo tu',
    desc: 'Semplice. Bevi tu e solo tu!',
    gender: ''
  },
  '8': {
    title: 'Thumb Master',
    desc: 'Puoi mettere il pollice sul bordo del tavolo quando vuoi. Tutti gli altri devono fare lo stesso. L ultimo che lo fa... beve! Ruolo mantenuto finche un altro giocatore non pesca un 8.',
    gender: ''
  },
  '9': {
    title: 'Inventa una regola',
    desc: 'Inventa una regola di sana pianta che si applica per il resto del gioco. Es: vietato menzionare nomi propri, vietato indicare, ecc. Chi non segue la regola beve!',
    gender: ''
  },
  '10': {
    title: 'Distribuisci 10 sorsi',
    desc: 'Distribuisci 10 sorsi tra gli altri giocatori come vuoi (uno a ciascuno, 5 a uno solo, ecc.). Ottimo per vendicarsi!',
    gender: ''
  },
  'J': {
    title: 'Gli uomini bevono',
    desc: 'Tutti i ragazzi devono bere!',
    gender: 'Solo i maschi bevono.'
  },
  'Q': {
    title: 'Le donne bevono',
    desc: 'Tutte le ragazze devono bere!',
    gender: 'Solo le femmine bevono.'
  },
  'K': {
    title: 'Coppa del Re',
    desc: 'Riempi il calice al centro! Il primo Re: 1/4 pieno. Il secondo: 1/2 pieno. Il terzo: 3/4 pieno. Il quarto Re deve berlo tutto e il gioco finisce. SALUTE!',
    gender: ''
  },
  'A': {
    title: 'Cascata',
    desc: 'Chi pesca l Asso inizia a bere insieme a tutti gli altri. Gli altri possono smettere solo quando il primo smette!',
    gender: ''
  }
};

const SUITS = ['♠','♥','♦','♣'];
const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

function buildDeck() {
  const deck = [];
  for (let s of SUITS) {
    for (let r of RANKS) {
      deck.push({ rank: r, suit: s });
    }
  }
  return shuffle(deck);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
