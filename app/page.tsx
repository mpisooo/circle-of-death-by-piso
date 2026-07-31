"use client";

import { useMemo, useState } from "react";

type Screen = "landing" | "rules" | "setup" | "transition" | "game" | "end";
type SuitKey = "hearts" | "diamonds" | "clubs" | "spades";
type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";
type DrinkMode = "sips" | "shots";
type ChallengeKind = "drink" | "physical" | "social" | "wild";

type Suit = {
  key: SuitKey;
  symbol: "♥" | "♦" | "♣" | "♠";
  name: string;
  flavor: string;
};

type Challenge = {
  title: string;
  body: string;
  kind: ChallengeKind;
};

type Card = {
  rank: Rank;
  suit: Suit;
};

type RevealedCard = Card & {
  challenge: Challenge;
  isFinalKing: boolean;
};

const SUITS: Suit[] = [
  { key: "hearts", symbol: "♥", name: "Cuori", flavor: "alleanze e sguardi" },
  { key: "diamonds", symbol: "♦", name: "Quadri", flavor: "fortuna e precisione" },
  { key: "clubs", symbol: "♣", name: "Fiori", flavor: "movimento e caos" },
  { key: "spades", symbol: "♠", name: "Picche", flavor: "bluff e sangue freddo" },
];

const RANKS: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const CHALLENGES: Record<SuitKey, Record<Rank, Challenge>> = {
  hearts: {
    A: {
      title: "Cascata",
      body: "Iniziate tutti a bere insieme. Tu puoi fermarti quando vuoi; chi è alla tua sinistra può fermarsi solo dopo di te, e così via.",
      kind: "drink",
    },
    "2": {
      title: "Due sorsi da regalare",
      body: "Hai {sip2} da assegnare. Puoi darli entrambi alla stessa persona oppure dividerli tra due giocatori.",
      kind: "drink",
    },
    "3": {
      title: "Due verità e una bugia",
      body: "Racconta tre cose su di te: due vere e una falsa. Se il gruppo indovina la bugia, bevi {sip}; altrimenti distribuisci {sip2}.",
      kind: "social",
    },
    "4": {
      title: "Mano sul cuore",
      body: "Metti una mano sul cuore. Tutti devono copiarti: l'ultimo che se ne accorge beve {sip}.",
      kind: "physical",
    },
    "5": {
      title: "Complimento o sorso",
      body: "{randomPlayer} ha 5 secondi per fare un complimento sincero a qualcuno. Se non ci riesce, beve {sip}.",
      kind: "social",
    },
    "6": {
      title: "Compagno di bevuta",
      body: "Scegli un compagno. Fino al tuo prossimo turno, ogni volta che uno di voi beve, anche l'altro beve {sip}.",
      kind: "wild",
    },
    "7": {
      title: "Sguardo fisso",
      body: "Tu e {randomPlayer} vi guardate negli occhi per 10 secondi. Il primo che ride o distoglie lo sguardo beve {sip2}.",
      kind: "social",
    },
    "8": {
      title: "Lo specchio",
      body: "Scegli {randomPlayer}. Per 15 secondi deve copiare tutti i tuoi movimenti. Al primo errore beve {sip}.",
      kind: "physical",
    },
    "9": {
      title: "Nove sorsi da distribuire",
      body: "Hai {sip9} da distribuire. Puoi scegliere chi vuoi, ma non puoi assegnarne più di 3 alla stessa persona.",
      kind: "drink",
    },
    "10": {
      title: "Dieci sorsi da distribuire",
      body: "Hai {sip10} da distribuire come vuoi. Puoi darli tutti a una persona oppure dividerli tra più giocatori.",
      kind: "drink",
    },
    J: {
      title: "Cambio di posto",
      body: "Tutti in piedi e tutti devono cambiare posto. L'ultimo che si siede beve {sip2}.",
      kind: "physical",
    },
    Q: {
      title: "La coreografia",
      body: "Inventa tre movimenti. {randomPlayer} deve ripeterli nello stesso ordine: se sbaglia, beve {sip2}.",
      kind: "physical",
    },
    K: {
      title: "Re di cuori",
      body: "Versa una piccola quantità nel bicchiere al centro. Chi pesca il quarto Re decide se berlo o dividerlo con il gruppo.",
      kind: "drink",
    },
  },
  diamonds: {
    A: {
      title: "Il numero fortunato",
      body: "Il numero uscito è {number}. Conta i giocatori partendo da te: la persona su cui cade il numero beve {sip2}.",
      kind: "wild",
    },
    "2": {
      title: "Rosso o nero",
      body: "Prima della prossima carta scegli rosso o nero. Se indovini distribuisci {sip2}; se sbagli li bevi tu.",
      kind: "wild",
    },
    "3": {
      title: "La torre",
      body: "Hai 15 secondi per impilare tre oggetti sicuri. Se la torre cade, bevi {sip2}; se resta in piedi, distribuiscili.",
      kind: "physical",
    },
    "4": {
      title: "Quattro sorsi da distribuire",
      body: "Hai {sip4} da distribuire tra gli altri giocatori. Decidi tu quanti darne a ciascuno.",
      kind: "drink",
    },
    "5": {
      title: "Ripeti il ritmo",
      body: "Batti sul tavolo una sequenza di cinque colpi. {randomPlayer} deve ripeterla senza errori oppure beve {sip2}.",
      kind: "physical",
    },
    "6": {
      title: "Sei sorsi da distribuire",
      body: "Hai {sip6} da distribuire. Puoi coinvolgere quante persone vuoi.",
      kind: "drink",
    },
    "7": {
      title: "Pari o dispari",
      body: "Il numero uscito è {number}. Se è pari bevono i giocatori in posizione pari; se è dispari bevono quelli in posizione dispari.",
      kind: "wild",
    },
    "8": {
      title: "Mano ferma",
      body: "Tu e {randomPlayer} tenete il bicchiere a braccio teso per 8 secondi. Il primo che piega il gomito beve {sip2}.",
      kind: "physical",
    },
    "9": {
      title: "Mesi al contrario",
      body: "Hai 9 secondi per dire i mesi dell'anno al contrario. Se sbagli o ti blocchi, bevi {sip2}.",
      kind: "social",
    },
    "10": {
      title: "Dieci sorsi, massimo cinque",
      body: "Distribuisci {sip10}, ma non puoi assegnarne più di 5 alla stessa persona.",
      kind: "drink",
    },
    J: {
      title: "Fortuna sfacciata",
      body: "Hai vinto: distribuisci {sip5} tra gli altri giocatori come preferisci.",
      kind: "drink",
    },
    Q: {
      title: "Regina di ghiaccio",
      body: "Mettiti in posa senza dire nulla. L'ultimo che ti imita beve {sip2}.",
      kind: "physical",
    },
    K: {
      title: "Re di quadri",
      body: "Versa una piccola quantità nel bicchiere al centro. Se è il quarto Re, scegli con chi condividere il brindisi finale.",
      kind: "drink",
    },
  },
  clubs: {
    A: {
      title: "L'onda",
      body: "Partendo da te, alzatevi uno alla volta in senso orario. Chi parte fuori tempo beve {sip}.",
      kind: "physical",
    },
    "2": {
      title: "Mano sul tavolo",
      body: "Dai un colpo sul tavolo. Tutti devono fare lo stesso: l'ultimo beve {sip2}.",
      kind: "physical",
    },
    "3": {
      title: "Posa di gruppo",
      body: "Scegli due giocatori. Avete 5 secondi per inventare una posa insieme; se uno dei tre si muove o ride, beve {sip}.",
      kind: "physical",
    },
    "4": {
      title: "Su, giù, destra o sinistra",
      body: "Al tre, tutti indicano una delle quattro direzioni. Chi sceglie la direzione meno votata beve {sip2}.",
      kind: "wild",
    },
    "5": {
      title: "Cinque sorsi in palio",
      body: "Sfida {randomPlayer} a carta, forbice, sasso. Chi vince distribuisce {sip5}.",
      kind: "drink",
    },
    "6": {
      title: "Sei squat",
      body: "Chi vuole partecipa: fate sei squat lenti. Il primo che si ferma beve {sip}; chi non può farli passa senza penalità.",
      kind: "physical",
    },
    "7": {
      title: "Mimo in sette secondi",
      body: "Mima un'azione per 7 secondi. Se qualcuno indovina, distribuisci {sip2}; altrimenti li bevi tu.",
      kind: "physical",
    },
    "8": {
      title: "Schiena al muro",
      body: "Tu e {randomPlayer} restate con la schiena al muro e le ginocchia piegate per 8 secondi. Chi si alza per primo beve {sip2}.",
      kind: "physical",
    },
    "9": {
      title: "Batti il ritmo",
      body: "Crea un ritmo di tre battiti. Gli altri lo ripetono uno alla volta: il primo che sbaglia beve {sip2}.",
      kind: "physical",
    },
    "10": {
      title: "Corsa al posto",
      body: "Tutti devono cambiare posto. L'ultimo che si siede beve {sip2}.",
      kind: "physical",
    },
    J: {
      title: "Il jolly",
      body: "Conserva questa carta: puoi passare a un altro giocatore la prossima penalità che ricevi.",
      kind: "wild",
    },
    Q: {
      title: "La regina comanda",
      body: "Scegli una posa semplice. Tutti devono copiarla: l'ultimo beve {sip2}.",
      kind: "physical",
    },
    K: {
      title: "Re di fiori",
      body: "Versa una piccola quantità nel bicchiere al centro. Se è il quarto Re, fate un brindisi di gruppo e decidete come dividerlo.",
      kind: "drink",
    },
  },
  spades: {
    A: {
      title: "Nome vietato",
      body: "Fino al tuo prossimo turno nessuno può pronunciare il tuo nome. Chi lo dice beve {sip}.",
      kind: "wild",
    },
    "2": {
      title: "Duello di sguardi",
      body: "Tu e {randomPlayer} vi guardate negli occhi per 10 secondi. Il primo che ride o guarda altrove beve {sip2}.",
      kind: "social",
    },
    "3": {
      title: "Tre sorsi da distribuire",
      body: "Hai {sip3} da distribuire tra gli altri giocatori. Puoi darli tutti alla stessa persona oppure dividerli.",
      kind: "drink",
    },
    "4": {
      title: "Statua",
      body: "Prima del tuo prossimo turno puoi gridare «Statua!». Tutti devono fermarsi: l'ultimo che si immobilizza beve {sip2}.",
      kind: "physical",
    },
    "5": {
      title: "Rispondi o bevi",
      body: "Il gruppo ti fa una domanda. Puoi rispondere oppure bere {sip2}; le domande troppo personali si possono sempre rifiutare.",
      kind: "social",
    },
    "6": {
      title: "Sei sorsi per il gruppo",
      body: "Distribuisci {sip6} tra gli altri giocatori. Devi coinvolgere almeno due persone.",
      kind: "drink",
    },
    "7": {
      title: "Non ridere",
      body: "Hai 7 secondi per far ridere {randomPlayer}, senza toccarlo. Se ride beve {sip2}; se resiste, li bevi tu.",
      kind: "social",
    },
    "8": {
      title: "Otto sorsi da distribuire",
      body: "Hai {sip8} da distribuire. Devi assegnarli ad almeno due giocatori.",
      kind: "drink",
    },
    "9": {
      title: "Sfida al meglio di tre",
      body: "Sfida {randomPlayer} a carta, forbice, sasso. Chi perde due manche beve {sip2}.",
      kind: "social",
    },
    "10": {
      title: "Dieci secondi di silenzio",
      body: "Per 10 secondi nessuno può parlare o ridere mentre tu provi a distrarli. Il primo che fa rumore beve {sip2}; se resistono tutti, bevi tu.",
      kind: "social",
    },
    J: {
      title: "Maestro delle domande",
      body: "Fino al prossimo Jack, chi risponde a una tua domanda beve {sip}. Vale anche se la risposta è solo «sì» o «no».",
      kind: "wild",
    },
    Q: {
      title: "Scelta della regina",
      body: "Scegli due giocatori: bevono {sip} insieme. Poi distribuisci altri {sip3} come preferisci.",
      kind: "drink",
    },
    K: {
      title: "Re di picche",
      body: "Versa una piccola quantità nel bicchiere al centro. Se è il quarto Re, puoi dividerlo con chi vuoi.",
      kind: "drink",
    },
  },
};

const kindLabels: Record<ChallengeKind, string> = {
  drink: "Brindisi",
  physical: "Sfida fisica",
  social: "Faccia a faccia",
  wild: "Caos",
};

function buildDeck() {
  const deck = SUITS.flatMap((suit) => RANKS.map((rank) => ({ rank, suit })));
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function penalty(mode: DrinkMode, amount: number) {
  if (mode === "shots") {
    if (amount === 1) return "mezzo shot";
    if (amount === 2) return "1 shot piccolo";
    return `${Math.ceil(amount / 2)} shot piccoli`;
  }
  return amount === 1 ? "1 sorso" : `${amount} sorsi`;
}

function formatChallengeBody(
  body: string,
  mode: DrinkMode,
  randomPlayer = "un giocatore",
  number = 7,
) {
  return body
    .replaceAll("{randomPlayer}", randomPlayer)
    .replaceAll("{number}", String(number))
    .replace(/\{sip(\d+)?\}/g, (_match, amount: string | undefined) =>
      penalty(mode, Number(amount ?? "1")),
    );
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [names, setNames] = useState(["", "", "", ""]);
  const [players, setPlayers] = useState<string[]>([]);
  const [mode, setMode] = useState<DrinkMode>("sips");
  const [deck, setDeck] = useState<Card[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [revealed, setRevealed] = useState<RevealedCard | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [kings, setKings] = useState(0);
  const [finalPlayer, setFinalPlayer] = useState("");
  const [soundOn, setSoundOn] = useState(true);

  const currentName = players[currentPlayer] ?? "Giocatore";

  const playerQueue = useMemo(
    () => players.map((name, index) => ({ name, active: index === currentPlayer })),
    [players, currentPlayer],
  );

  function playTone(frequency = 180, duration = 0.08) {
    if (!soundOn) return;
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(frequency, context.currentTime);
      gain.gain.setValueAtTime(0.035, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + duration);
    } catch {
      // L'audio è un dettaglio opzionale.
    }
  }

  function setPlayerCount(delta: number) {
    setNames((current) => {
      const nextLength = Math.max(2, Math.min(12, current.length + delta));
      if (nextLength > current.length) {
        return [...current, ...Array(nextLength - current.length).fill("")];
      }
      return current.slice(0, nextLength);
    });
    playTone(delta > 0 ? 240 : 160, 0.05);
  }

  function beginGame() {
    const cleanPlayers = names.map((name, index) => name.trim() || `Giocatore ${index + 1}`);
    setPlayers(cleanPlayers);
    setDeck(buildDeck());
    setCurrentPlayer(0);
    setKings(0);
    setFinalPlayer("");
    setRevealed(null);
    setScreen("transition");
    playTone(92, 0.35);
    try {
      localStorage.setItem("circle-players", JSON.stringify(names));
    } catch {
      // Ignora se il browser blocca il salvataggio.
    }
    window.setTimeout(() => {
      setScreen("game");
      playTone(220, 0.18);
    }, 2300);
  }

  function resolveChallenge(card: Card) {
    const source = CHALLENGES[card.suit.key][card.rank];
    const otherPlayers = players.filter((_, index) => index !== currentPlayer);
    const randomPlayer =
      otherPlayers[Math.floor(Math.random() * Math.max(otherPlayers.length, 1))] ?? currentName;
    const number = Math.floor(Math.random() * 10) + 1;
    const body = formatChallengeBody(source.body, mode, randomPlayer, number);
    return { ...source, body };
  }

  function drawCard() {
    if (drawing || revealed || deck.length === 0) return;
    setDrawing(true);
    navigator.vibrate?.(35);
    playTone(124, 0.12);
    const [card, ...remaining] = deck;
    window.setTimeout(() => {
      const nextKings = card.rank === "K" ? kings + 1 : kings;
      const isFinalKing = card.rank === "K" && nextKings === 4;
      setDeck(remaining);
      setKings(nextKings);
      setRevealed({ ...card, challenge: resolveChallenge(card), isFinalKing });
      setDrawing(false);
      navigator.vibrate?.([25, 35, 55]);
      playTone(card.rank === "K" ? 110 : 260, 0.2);
    }, 620);
  }

  function nextTurn() {
    if (!revealed) return;
    if (revealed.isFinalKing) {
      setFinalPlayer(currentName);
      setScreen("end");
      playTone(88, 0.5);
      return;
    }
    setRevealed(null);
    setCurrentPlayer((index) => (index + 1) % players.length);
    playTone(210, 0.06);
  }

  function restart() {
    if (screen === "game" && !window.confirm("Vuoi uscire dalla partita in corso?")) return;
    setRevealed(null);
    setScreen("landing");
  }

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="noise" />

      {screen === "landing" && (
        <section className="screen landing-screen">
          <nav className="landing-nav">
            <span className="wordmark"><i>COD</i> by Piso</span>
            <button className="sound-button" onClick={() => setSoundOn((value) => !value)} aria-label="Attiva o disattiva audio">
              {soundOn ? "◖))" : "◖×"}
            </button>
          </nav>

          <div className="hero-copy">
            <p className="eyebrow"><span /> Il gioco da bere per una sola mano</p>
            <h1>
              Circle
              <span>of Death</span>
            </h1>
            <p className="hero-lead">
              52 carte. 52 sfide. Ogni seme cambia le regole.
              <strong> Un solo iPhone, tutto il gruppo dentro al cerchio.</strong>
            </p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => setScreen("setup")}>
                Entra nel cerchio <b>→</b>
              </button>
              <button className="text-button" onClick={() => setScreen("rules")}>
                Scopri come funziona
              </button>
            </div>
            <div className="hero-facts" aria-label="Dettagli del gioco">
              <span><b>2–12</b> giocatori</span>
              <span><b>1</b> telefono</span>
              <span><b>0</b> categorie noiose</span>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            {SUITS.map((suit, index) => (
              <div className={`floating-card floating-card-${index + 1}`} key={suit.key}>
                <span>{index === 0 ? "8" : ["Q", "A", "K"][index - 1]}</span>
                <b className={suit.key === "hearts" || suit.key === "diamonds" ? "red" : ""}>{suit.symbol}</b>
              </div>
            ))}
            <div className="hero-seal">
              <small>BY</small>
              <strong>PISO</strong>
              <i>♛</i>
            </div>
          </div>

          <footer className="landing-footer">
            <span>18+ · Bevi responsabilmente</span>
            <span>Pensato per il dopocena</span>
          </footer>
        </section>
      )}

      {screen === "rules" && (
        <section className="screen scroll-screen rules-screen">
          <header className="screen-top">
            <button className="round-button" onClick={() => setScreen("landing")} aria-label="Torna alla home">←</button>
            <span className="mini-wordmark">CIRCLE / REGOLE</span>
            <span className="step-pill">01</span>
          </header>

          <div className="content-wrap rules-wrap">
            <p className="eyebrow"><span /> La differenza</p>
            <h2>Il numero non basta più.</h2>
            <p className="section-lead">
              Ogni combinazione di numero e seme attiva una sfida diversa. L&apos;8, per esempio, ha quattro vite.
            </p>

            <div className="suit-grid">
              {SUITS.map((suit) => (
                <article className={`suit-card suit-${suit.key}`} key={suit.key}>
                  <div className="suit-symbol">{suit.symbol}</div>
                  <div>
                    <h3>{suit.name}</h3>
                    <p>{suit.flavor}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="eight-showcase">
              <div className="eight-title">
                <span>8</span>
                <div><small>ESEMPIO</small><h3>Quattro semi, quattro sfide</h3></div>
              </div>
              <div className="eight-list">
                {SUITS.map((suit) => {
                  const challenge = CHALLENGES[suit.key]["8"];
                  return (
                    <div key={suit.key}>
                      <b className={suit.key === "hearts" || suit.key === "diamonds" ? "red" : ""}>{suit.symbol}</b>
                      <span><strong>{challenge.title}</strong>{formatChallengeBody(challenge.body, "sips").split(".")[0]}.</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="how-to">
              <article><span>01</span><h3>Inserite i nomi</h3><p>Il telefono gestisce ordine e turni.</p></article>
              <article><span>02</span><h3>Tocca il mazzo</h3><p>La carta rivela una sfida unica.</p></article>
              <article><span>03</span><h3>Passa il telefono</h3><p>Il quarto Re chiude il cerchio.</p></article>
            </div>

            <aside className="safety-note">
              <b>Giocate bene, non forte.</b>
              <p>Ogni penalità può diventare acqua o analcolico. Niente pressioni, niente guida, sfide fisiche solo se lo spazio è sicuro.</p>
            </aside>

            <button className="primary-button full-button" onClick={() => setScreen("setup")}>Prepara la partita <b>→</b></button>
          </div>
        </section>
      )}

      {screen === "setup" && (
        <section className="screen scroll-screen setup-screen">
          <header className="screen-top">
            <button className="round-button" onClick={() => setScreen("landing")} aria-label="Torna alla home">←</button>
            <span className="mini-wordmark">CIRCLE / SETUP</span>
            <span className="step-pill">02</span>
          </header>

          <div className="content-wrap setup-wrap">
            <p className="eyebrow"><span /> Chi entra?</p>
            <h2>Date un nome al caos.</h2>
            <p className="section-lead">Un solo telefono, da passare in senso orario dopo ogni carta.</p>

            <div className="count-card">
              <div><small>GIOCATORI</small><strong>{names.length}</strong></div>
              <div className="count-controls">
                <button onClick={() => setPlayerCount(-1)} disabled={names.length <= 2} aria-label="Rimuovi giocatore">−</button>
                <button onClick={() => setPlayerCount(1)} disabled={names.length >= 12} aria-label="Aggiungi giocatore">+</button>
              </div>
            </div>

            <div className="player-list">
              {names.map((name, index) => (
                <label className="player-field" key={index}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <input
                    value={name}
                    onChange={(event) => setNames((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))}
                    placeholder={`Giocatore ${index + 1}`}
                    maxLength={18}
                    autoComplete="off"
                  />
                </label>
              ))}
            </div>

            <fieldset className="mode-picker">
              <legend>Cosa avete sul tavolo?</legend>
              <button className={mode === "sips" ? "selected" : ""} onClick={() => setMode("sips")}>
                <span>🍹</span><b>Drink</b><small>penalità = piccoli sorsi</small>
              </button>
              <button className={mode === "shots" ? "selected" : ""} onClick={() => setMode("shots")}>
                <span>🥃</span><b>Shot</b><small>1 penalità = mezzo shot</small>
              </button>
            </fieldset>

            <p className="setup-disclaimer">Le quantità sono indicative. Fermarsi o passare una sfida è sempre una mossa valida.</p>
            <button className="primary-button full-button sticky-start" onClick={beginGame}>
              Mischia le carte <b>→</b>
            </button>
          </div>
        </section>
      )}

      {screen === "transition" && (
        <section className="screen ritual-screen" aria-live="polite">
          <div className="ritual-rings" aria-hidden="true">
            <i>♥</i><i>♦</i><i>♣</i><i>♠</i>
          </div>
          <p className="eyebrow"><span /> Mazzo in movimento</p>
          <h2>Il cerchio<br />si chiude.</h2>
          <div className="shuffle-line"><span /></div>
          <p><strong>{players[0]}</strong> pesca per primo</p>
        </section>
      )}

      {screen === "game" && (
        <section className="screen game-screen">
          <header className="game-header">
            <button className="round-button" onClick={restart} aria-label="Esci dalla partita">×</button>
            <div className="turn-copy"><small>TURNO DI</small><strong>{currentName}</strong></div>
            <button className="sound-button" onClick={() => setSoundOn((value) => !value)} aria-label="Attiva o disattiva audio">
              {soundOn ? "◖))" : "◖×"}
            </button>
          </header>

          <div className="game-meta">
            <span>{deck.length} <small>CARTE</small></span>
            <div className="king-track" aria-label={`${kings} Re pescati su 4`}>
              {[0, 1, 2, 3].map((index) => <i className={index < kings ? "found" : ""} key={index}>♛</i>)}
            </div>
            <span>{currentPlayer + 1}/{players.length} <small>TURNO</small></span>
          </div>

          <div className={`table-zone ${revealed ? "has-reveal" : ""}`}>
            {!revealed && (
              <button className={`deck-button ${drawing ? "is-drawing" : ""}`} onClick={drawCard} disabled={drawing} aria-label="Pesca una carta">
                <span className="deck-layer layer-three" />
                <span className="deck-layer layer-two" />
                <span className="deck-face">
                  <i className="corner-mark">COD</i>
                  <b>♛</b>
                  <strong>{drawing ? "Mischio…" : "Tocca"}</strong>
                  <small>PER PESCARE</small>
                </span>
              </button>
            )}

            {revealed && (
              <div className="reveal-layout">
                <div className={`playing-card card-${revealed.suit.key}`}>
                  <div className="card-corner top"><strong>{revealed.rank}</strong><span>{revealed.suit.symbol}</span></div>
                  <div className="card-center">
                    <small>{revealed.suit.name}</small>
                    <b>{revealed.suit.symbol}</b>
                    <em>{revealed.rank}</em>
                  </div>
                  <div className="card-corner bottom"><strong>{revealed.rank}</strong><span>{revealed.suit.symbol}</span></div>
                </div>

                <article className="challenge-panel">
                  <div className="challenge-kicker">
                    <span>{kindLabels[revealed.challenge.kind]}</span>
                    <i>{revealed.suit.symbol} {revealed.suit.name}</i>
                  </div>
                  <h2>{revealed.challenge.title}</h2>
                  <p>{revealed.challenge.body}</p>
                  <button className="primary-button full-button" onClick={nextTurn}>
                    {revealed.isFinalKing ? "Chiudi il cerchio" : "Sfida accettata"} <b>→</b>
                  </button>
                </article>
              </div>
            )}
          </div>

          <div className="player-rail" aria-label="Ordine dei giocatori">
            {playerQueue.map((player, index) => (
              <span className={player.active ? "active" : ""} key={`${player.name}-${index}`}>
                <i>{index + 1}</i>{player.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {screen === "end" && (
        <section className="screen end-screen">
          <div className="end-crown" aria-hidden="true">♛</div>
          <p className="eyebrow"><span /> Quarto Re</p>
          <h2>Il cerchio<br />è completo.</h2>
          <p className="end-copy"><strong>{finalPlayer}</strong> ha pescato l&apos;ultimo Re. Dividete il calice, fate il vostro brindisi e chiudetela bene.</p>
          <div className="end-toast">SALUTE <span>♥ ♦ ♣ ♠</span></div>
          <button className="primary-button" onClick={() => setScreen("setup")}>Nuova partita <b>↻</b></button>
          <button className="text-button" onClick={() => setScreen("landing")}>Torna all&apos;inizio</button>
          <p className="end-safety">Acqua, pausa, taxi. La serata continua solo se state bene.</p>
        </section>
      )}
    </main>
  );
}
