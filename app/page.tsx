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
      title: "Cascata rossa",
      body: "Tutti brindano insieme. Tu puoi fermarti per primo; poi si procede in senso orario, senza fretta.",
      kind: "drink",
    },
    "2": {
      title: "Patto a due",
      body: "Scegli {randomPlayer}. Fate un brindisi incrociato: chi rompe per primo il contatto visivo prende {sip}.",
      kind: "social",
    },
    "3": {
      title: "Due vere, una falsa",
      body: "Hai 15 secondi per dire tre cose su di te. Se il gruppo scopre la bugia prendi {sip}; altrimenti scegli chi beve.",
      kind: "social",
    },
    "4": {
      title: "Mano sul cuore",
      body: "Appoggia la mano sul cuore. Tutti devono imitarti: l'ultimo prende {sip}.",
      kind: "physical",
    },
    "5": {
      title: "Complimento lampo",
      body: "{randomPlayer} ha 5 secondi per fare un complimento sincero a qualcuno. Se esita, prende {sip}.",
      kind: "social",
    },
    "6": {
      title: "Anime gemelle",
      body: "Scegli un compagno. Fino al tuo prossimo turno, quando uno dei due beve, anche l'altro prende un piccolo sorso.",
      kind: "wild",
    },
    "7": {
      title: "Brindisi impossibile",
      body: "Tu e {randomPlayer} bevete guardandovi negli occhi. Chi ride per primo prende anche {sip}.",
      kind: "drink",
    },
    "8": {
      title: "Specchio rosso",
      body: "Scegli {randomPlayer}. Per 15 secondi deve copiare ogni tuo movimento. Il primo che sbaglia prende {sip}.",
      kind: "physical",
    },
    "9": {
      title: "Voto segreto",
      body: "Al tre tutti indicano il giocatore più elegante della serata. Chi riceve più voti assegna {sip2}.",
      kind: "social",
    },
    "10": {
      title: "Cuori incrociati",
      body: "Nomina due giocatori. Devono scambiarsi posto senza parlare: l'ultimo a sedersi prende {sip}.",
      kind: "physical",
    },
    J: {
      title: "Jack cambia posto",
      body: "Tutti in piedi: cambiate posto. L'ultimo a trovare una nuova posizione prende {sip}.",
      kind: "physical",
    },
    Q: {
      title: "Regina del ritmo",
      body: "Crea una sequenza di tre gesti. {randomPlayer} deve copiarla al primo colpo oppure prende {sip}.",
      kind: "physical",
    },
    K: {
      title: "Re di cuori",
      body: "Versa una piccola quantità nel calice centrale. Al quarto Re il calice può essere diviso: nessuno è obbligato a finirlo.",
      kind: "drink",
    },
  },
  diamonds: {
    A: {
      title: "Numero fortunato",
      body: "Il numero del destino è {number}. Se lo indovini prima che appaia, assegni {sip2}; altrimenti prendi {sip}.",
      kind: "wild",
    },
    "2": {
      title: "Rosso o nero",
      body: "Scegli rosso o nero per la prossima carta. Se indovini assegni {sip}; se sbagli lo prendi tu.",
      kind: "wild",
    },
    "3": {
      title: "Torre preziosa",
      body: "Impila tre oggetti sicuri in 15 secondi. Se la torre cade prendi {sip}; se regge scegli chi beve.",
      kind: "physical",
    },
    "4": {
      title: "Mano ferma",
      body: "Sfida {randomPlayer}: bicchiere a braccio teso per 10 secondi. Il primo che piega il gomito prende {sip}.",
      kind: "physical",
    },
    "5": {
      title: "Cinque tocchi",
      body: "Batti sul tavolo una sequenza di cinque tocchi. {randomPlayer} deve ripeterla: chi sbaglia prende {sip}.",
      kind: "physical",
    },
    "6": {
      title: "Diamante caldo",
      body: "Passate un sottobicchiere mentre conti lentamente fino a sei a occhi chiusi. Chi lo tiene alla fine prende {sip}.",
      kind: "physical",
    },
    "7": {
      title: "Pari o dispari",
      body: "Il risultato è {number}. Se avevi scelto la parità giusta assegni {sip2}; altrimenti prendi {sip}.",
      kind: "wild",
    },
    "8": {
      title: "Equilibrio di lusso",
      body: "Tu e {randomPlayer} restate su una gamba con una mano in alto per 8 secondi. Chi cede prende {sip}.",
      kind: "physical",
    },
    "9": {
      title: "Nove dita",
      body: "Tutti mostrano da zero a cinque dita. Chi mostra il tuo stesso numero prende {sip}; se sei solo, lo assegni.",
      kind: "wild",
    },
    "10": {
      title: "Duello dorato",
      body: "Scegli due giocatori: carta-forbice-sasso, al meglio di tre. Chi perde prende {sip2}.",
      kind: "social",
    },
    J: {
      title: "Jackpot",
      body: "La fortuna ha scelto {randomPlayer}: prende {sip}, poi sceglie un compagno per il brindisi.",
      kind: "drink",
    },
    Q: {
      title: "Regina di ghiaccio",
      body: "Fai una posa da statua. L'ultimo a congelarsi nella stessa posa prende {sip}.",
      kind: "physical",
    },
    K: {
      title: "Re di quadri",
      body: "Aggiungi una piccola quantità al calice centrale. Il quarto Re decide con chi condividere il brindisi finale.",
      kind: "drink",
    },
  },
  clubs: {
    A: {
      title: "Onda d'urto",
      body: "Partendo da te, alzatevi uno dopo l'altro come un'onda. Chi rompe il ritmo prende {sip}.",
      kind: "physical",
    },
    "2": {
      title: "High-five fantasma",
      body: "Tenta un high-five con {randomPlayer} ma puoi cambiare mano una volta. Chi cade nel bluff prende {sip}.",
      kind: "physical",
    },
    "3": {
      title: "Tris in posa",
      body: "Scegli due giocatori: avete 5 secondi per creare insieme una posa da copertina. Se il gruppo non approva, bevete.",
      kind: "physical",
    },
    "4": {
      title: "Quattro direzioni",
      body: "Al tre tutti indicano su, giù, destra o sinistra. Chi sceglie la direzione meno votata prende {sip}.",
      kind: "wild",
    },
    "5": {
      title: "Foto finish",
      body: "Tu e {randomPlayer} dovete toccare un oggetto sicuro scelto dal gruppo. L'ultimo prende {sip}.",
      kind: "physical",
    },
    "6": {
      title: "Sei squat",
      body: "Chi vuole partecipa: fate fino a sei squat lenti. Il primo che si ferma prende {sip}; chi non può, passa senza penalità.",
      kind: "physical",
    },
    "7": {
      title: "Mimo espresso",
      body: "Mima un'azione per 7 secondi, senza parole. Se nessuno indovina prendi {sip}, altrimenti lo assegni.",
      kind: "physical",
    },
    "8": {
      title: "Muro contro muro",
      body: "Sfida {randomPlayer} a una mini wall-sit di 8 secondi. Chi si alza per primo prende {sip}. Potete sempre passare.",
      kind: "physical",
    },
    "9": {
      title: "Clap crash",
      body: "Crea un ritmo di tre battiti. Tutti lo ripetono più veloce: il primo fuori tempo prende {sip}.",
      kind: "physical",
    },
    "10": {
      title: "Cambio totale",
      body: "Tutti cambiano posto e indossano un accessorio diverso. L'ultimo pronto prende {sip}.",
      kind: "physical",
    },
    J: {
      title: "Jolly del caos",
      body: "La prossima penalità che ricevi può essere condivisa con un giocatore a tua scelta.",
      kind: "wild",
    },
    Q: {
      title: "Regina comanda",
      body: "Ordina una posa sicura e assurda. L'ultimo a eseguirla prende {sip}.",
      kind: "physical",
    },
    K: {
      title: "Re di fiori",
      body: "Aggiungi una piccola quantità al calice. Al quarto Re: brindisi finale, foto di gruppo e calice condivisibile.",
      kind: "drink",
    },
  },
  spades: {
    A: {
      title: "Nome proibito",
      body: "Fino al tuo prossimo turno nessuno può dire il tuo nome. Chi lo pronuncia prende {sip}.",
      kind: "wild",
    },
    "2": {
      title: "Duello di sguardi",
      body: "Sfida {randomPlayer}: dieci secondi senza ridere né distogliere lo sguardo. Chi cede prende {sip}.",
      kind: "social",
    },
    "3": {
      title: "Tre passi oscuri",
      body: "Inventa tre passi di danza. {randomPlayer} li ripete: il gruppo decide chi dei due prende {sip}.",
      kind: "physical",
    },
    "4": {
      title: "Statua nera",
      body: "Quando tocchi il tavolo tutti devono immobilizzarsi. L'ultimo a fermarsi prende {sip}.",
      kind: "physical",
    },
    "5": {
      title: "Verità secca",
      body: "Rispondi a una domanda leggera scelta dal gruppo oppure prendi {sip}. Nessuna domanda invadente.",
      kind: "social",
    },
    "6": {
      title: "Ombra perfetta",
      body: "Fai una posa di profilo. {randomPlayer} deve ricreare la tua ombra in 6 secondi o prende {sip}.",
      kind: "physical",
    },
    "7": {
      title: "Non ridere",
      body: "Hai 7 secondi per far ridere {randomPlayer}, senza toccarlo. Se ride beve; se resiste bevi tu.",
      kind: "social",
    },
    "8": {
      title: "Voto al buio",
      body: "Tutti chiudono gli occhi e indicano la persona più rumorosa. Chi riceve più voti prende {sip}.",
      kind: "social",
    },
    "9": {
      title: "Nove vite",
      body: "Sfida {randomPlayer} a carta-forbice-sasso, al meglio di tre. Chi perde prende {sip}.",
      kind: "social",
    },
    "10": {
      title: "Countdown muto",
      body: "Da dieci a uno usando solo le dita, senza turni. Se due giocatori agiscono insieme, entrambi prendono {sip}.",
      kind: "wild",
    },
    J: {
      title: "Guardia nera",
      body: "Fino al prossimo Jack, quando incroci le braccia tutti devono copiarti. L'ultimo prende {sip}.",
      kind: "wild",
    },
    Q: {
      title: "Regina del buio",
      body: "Tutti chiudono gli occhi. Sposta un oggetto sicuro: {randomPlayer} deve indovinare dov'è o prende {sip}.",
      kind: "social",
    },
    K: {
      title: "Re di picche",
      body: "Ultimo contributo al calice. Se è il quarto Re, scegliete insieme se dividerlo o sostituirlo con un brindisi leggero.",
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

function penalty(mode: DrinkMode, amount: 1 | 2) {
  if (mode === "shots") return amount === 1 ? "mezzo shot" : "uno shot piccolo";
  return amount === 1 ? "un sorso" : "due sorsi";
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
    const body = source.body
      .replaceAll("{randomPlayer}", randomPlayer)
      .replaceAll("{number}", String(number))
      .replaceAll("{sip2}", penalty(mode, 2))
      .replaceAll("{sip}", penalty(mode, 1));
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
            <p className="eyebrow"><span /> Il drinking game per una sola mano</p>
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
            <span>Designed for the afterparty</span>
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
            <p className="eyebrow"><span /> Il twist</p>
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
                      <span><strong>{challenge.title}</strong>{challenge.body.split(".")[0]}.</span>
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
                <span>🥃</span><b>Shot mix</b><small>penalità = mezzi shot</small>
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
