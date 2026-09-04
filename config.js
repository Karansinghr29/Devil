/* ============================================================
   =================  PERSONALIZE HERE  =======================
   Everything you will ever want to change lives in THIS file.
   You never need to touch style.css or script.js.
   Save the file, refresh the page, done.
   ============================================================ */

var CONFIG = {

  /* ---------- 1. NAMES + BROWSER TAB ---------- */
  herName: "Her Name",              // used in the letter greeting
  myName: "Me",                     // used in the letter signature
  pageTitle: "For You ❤",      // browser tab text (keep it a secret, no spoilers)

  /* ---------- 2. OPENING SCREEN (balloons) ---------- */
  opening: {
    eyebrow: "There's a little surprise waiting for you…",
    hint: "Touch a balloon 🎈"
  },

  /* ---------- 3. BIRTHDAY REVEAL ---------- */
  reveal: {
    title: "Happy Birthday, My Life",       // the ❤ is added by the design
    message: "Today is all about you…\nand I just wanted to make this little moment special for you. ❤"
  },

  /* ---------- 4. OUR MEMORIES ----------
     HOW TO ADD YOUR PHOTOS:
       1. Put your images inside the  assets/  folder
       2. Name them photo1.jpg, photo2.jpg ... (or change "src" below)
       3. Portrait photos look best on a phone. ~1200px wide is plenty.
     Until a real file exists, a soft placeholder is shown automatically.
     You can have 3, 4, 5 or more - just add/remove items in this list.  */
  memories: {
    title: "Our Memories",
    subtitle: "Some moments become memories…\nbecause you were there.",
    photos: [
      { src: "assets/photo1.jpg", caption: "The day everything felt lighter." },
      { src: "assets/photo2.jpg", caption: "You laughing — my favourite sound." },
      { src: "assets/photo3.jpg", caption: "Ordinary day. Unforgettable to me." },
      { src: "assets/photo4.jpg", caption: "Somewhere in between all of this, you became home." },
      { src: "assets/photo5.jpg", caption: "And I'd choose this again. Every time." }
    ]
  },

  /* ---------- 5. THE THINGS I NEVER SAID ---------- */
  unspoken: {
    title: "The Things I Never Said",
    lines: [
      "There are feelings I never managed to say out loud.",
      "I kept looking for the right words,",
      "and every single time, you understood me before I found them.",
      "So maybe I never had to say it.",
      "Maybe you always knew."
    ],
    bridge: "But I still wanted to write it down for you."
  },

  /* ---------- 6. TAMIL POEM ----------
     >>> REPLACE THE LINES BELOW WITH YOUR OWN TAMIL POEM. <<<
     One line of the poem = one item in the list.
     Use an empty string ""  to leave a blank line between stanzas.
     Tamil, English or a mix - all render correctly.                */
  poem: {
    intro: "Words I wanted to tell you…",
    titleTamil: "சொல்ல நினைத்தது…",
    lines: [
      "இங்கே உங்கள் கவிதையின்",
      "முதல் வரி வரும்.",
      "",
      "(இந்த வரிகளை நீக்கிவிட்டு",
      "உங்கள் கவிதையை இங்கே எழுதுங்கள்.)",
      "",
      "config.js → poem.lines"
    ],
    signature: ""   // optional, e.g. "— உன்…"  (leave "" to hide)
  },

  /* ---------- 7. THE SONG ----------
     Put your legally obtained audio file in  assets/  and name it song.mp3
     (or change "file" below to match your filename).

     "file" also accepts a full URL, as long as it is a DIRECT https link
     to the audio file itself, e.g.
         file: "https://example.com/asku-laska.mp3"
     YouTube / Spotify / JioSaavn / Google Drive share links will NOT work -
     those are web pages, not audio files.

     Artwork is optional - leave "" for the built-in glowing design.     */
  song: {
    heading: "Maybe This Song Says\nWhat I Couldn't ❤",
    note: "Press play. Listen to it the way I meant it.",
    title: "Asku Laska",
    subtitle: "Nanban (2012)",
    credit: "Music: Harris Jayaraj",
    file: "assets/song.mp3",
    artwork: "",                 // e.g. "assets/artwork.jpg"
    autoPlayWhenReached: false   // true = try to start when the section is reached
  },

  /* ---------- 8. PERSONAL LETTER ----------
     Each item in "paragraphs" becomes its own line/paragraph.       */
  letter: {
    heading: "From my heart…",
    greeting: "Dear",            // rendered as: Dear <herName>,
    paragraphs: [
      "I'm not very good at saying things at the right moment. You already know that.",
      "But somewhere between all our ordinary days, you became the part of my life I never want to explain to anyone - I just want to keep it.",
      "Thank you for understanding the silences. Thank you for reading between my lines. Thank you for staying, even on the days I gave you nothing but a quiet smile.",
      "Today is your day. And whatever I couldn't say out loud, I hope you feel all of it here."
    ],
    signOff: "Always yours,"
  },

  /* ---------- 9. FINAL SCREEN ---------- */
  finale: {
    lines: [
      "Some feelings don't need to be said.",
      "They just need to be understood."
    ],
    symbol: "❤ ∞",
    closing: "Happy Birthday, My Love.",
    replayLabel: "Live it again"
  },

  /* ---------- 10. ATMOSPHERE (safe to leave alone) ---------- */
  atmosphere: {
    density: 1,        // 0.5 = calmer, 1 = default, 1.5 = richer (raise only if it feels smooth)
    balloonCount: 6    // balloons on the opening screen (5-8 looks best)
  }
};
