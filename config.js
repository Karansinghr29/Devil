/* ============================================================
   =================  PERSONALIZE HERE  =======================
   Everything you will ever want to change lives in THIS file.
   You never need to touch style.css or script.js.
   Save the file, refresh the page, done.

   ABOUT THE TWO LANGUAGES
   Every section has English text and a separate "ta" (Tamil) block.
   The Tamil is NOT a translation of the English - it is its own
   poetic layer saying the same feeling a different way.
   Each item in a "ta" list is one line. Use "" for a blank line.
   ============================================================ */

var CONFIG = {

  /* ---------- 1. NAMES + BROWSER TAB ---------- */
  herName: "Her Name",              // used in the letter greeting
  myName: "Me",                     // used in the letter signature
  pageTitle: "For You ❤",           // browser tab text (no spoilers)

  /* ---------- 2. OPENING SCREEN (balloons) ---------- */
  opening: {
    eyebrow: "There's a little surprise waiting for you…",
    hint: "Touch a balloon 🎈"
  },

  /* ---------- 3. BIRTHDAY REVEAL ---------- */
  reveal: {
    title: "Happy Birthday, My Life",       // the ❤ is added by the design
    message: "Today is all about you…\nand I just wanted to make this little moment special for you. ❤",
    ta: [
      "இன்று உலகத்திற்கு உன் பிறந்தநாள்.",
      "எனக்கோ… ஒவ்வொரு நாளும் நீதான். ❤"
    ]
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
    ta: [
      "புகைப்படங்களில் தேதிகள் நிற்கும்…",
      "என் நினைவில் நீ மட்டும் நிற்கிறாய்."
    ],
    photos: [
      { src: "assets/photo1.jpg", caption: "The day everything felt lighter." },
      { src: "assets/photo2.jpg", caption: "You laughing — my favourite sound." },
      { src: "assets/photo3.jpg", caption: "Ordinary day. Unforgettable to me." },
      { src: "assets/photo4.jpg", caption: "Somewhere in between all of this, you became home." },
      { src: "assets/photo5.jpg", caption: "And I'd choose this again. Every time." }
    ]
  },

  /* ---------- 5. THE FEELING WE BOTH ALREADY KNOW ---------- */
  feelings: {
    title: "The One Thing We Both Know",
    lines: [
      "We both already know what this feeling is.",
      "I was just the one who hadn't put it into those words yet.",
      "Not because I wasn't sure.",
      "Maybe I was only waiting for the right moment."
    ],
    ta: [
      "நம் இருவருக்கும் தெரிந்த ஒன்று…",
      "நான் மட்டும் அதை வார்த்தையாக்கவில்லை.",
      "",
      "அந்த ஒரு வார்த்தைக்காகவே",
      "இத்தனை நாள் காத்திருந்தேன். ∞"
    ],
    bridge: "And it started a year ago, on my own birthday."
  },

  /* ---------- 6. LAST YEAR'S POEM ----------
     The framing text, then the poem you actually wrote her last year.

     >>> PUT YOUR OWN TAMIL POEM IN "lines" BELOW. <<<
     One line of the poem = one item in the list.
     Use an empty string ""  to leave a blank line between stanzas.   */
  lastYear: {
    eyebrow: "Last year, on my birthday…",
    lines: [
      "You said it first. You said it plainly.",
      "I answered you with a poem instead —",
      "and I let the words hide inside it.",
      "Maybe this time, I shouldn't hide them anymore."
    ],
    ta: [
      "கடந்த வருடம்",
      "சொல்ல நினைத்ததைக் கவிதைக்குள் மறைத்தேன்…",
      "புரிந்துகொள்வாய் என்று நினைத்தேன்.",
      "",
      "இந்த முறை மட்டும்,",
      "மறைக்காமல் சொல்லப் போகிறேன். ❤"
    ],
    poemLabel: "The poem I gave you then",
    titleTamil: "சொல்ல நினைத்தது…",
    lines_poem: [
      "இங்கே உங்கள் கவிதையின்",
      "முதல் வரி வரும்.",
      "",
      "(இந்த வரிகளை நீக்கிவிட்டு",
      "உங்கள் கவிதையை இங்கே எழுதுங்கள்.)",
      "",
      "config.js → lastYear.lines_poem"
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
    ta: [
      "கடந்த முறை கவிதைக்குள் மறைத்தேன்…",
      "இந்த முறை இசைக்குள் சொல்லப் போகிறேன்.",
      "",
      "நீ ஏற்கனவே அறிந்த உணர்வுக்கு,",
      "இன்று என் வார்த்தைகளையும் சேர்க்கிறேன். ❤"
    ],
    title: "Asku Laska",
    subtitle: "Nanban (2012)",
    credit: "Music: Harris Jayaraj",
    file: "assets/song.mp3",
    artwork: "",                 // e.g. "assets/artwork.jpg"
    autoPlayWhenReached: false   // true = try to start when the section is reached
  },

  /* ---------- 8. PERSONAL LETTER ----------
     Each item in "paragraphs" becomes its own paragraph.
     The Tamil block below it is what leads her into the voice note.   */
  letter: {
    heading: "From my heart…",
    greeting: "Dear",            // rendered as: Dear <herName>,
    paragraphs: [
      "I'm not good at saying things at the right moment. You've told me that yourself.",
      "You asked me once why I never just say it casually. It was never that I didn't feel it. It's that I didn't want it to be casual.",
      "Some words you only get to say for the first time once. I wanted the moment to deserve them.",
      "I think this is that moment. I think it's today."
    ],
    signOff: "Always yours,",
    ta: [
      "எழுதி முடித்த பிறகும்",
      "சொல்லாத ஒரு வரி மீதம் இருக்கிறது…",
      "",
      "அதை எழுத்தில் அல்ல,",
      "என் குரலில் சொல்கிறேன். ❤"
    ]
  },

  /* ---------- 9. MY VOICE ----------
     Record yourself saying it, save as  assets/voice.mp3  and refresh.
     Using .m4a instead? Just change "file" below - nothing else:
         file: "assets/voice.m4a"
     Until the file exists the card stays, calm and unbroken, and simply
     says the recording is still coming.                                */
  voice: {
    heading: "One last thing\nI wanted you to hear from me…",
    ta: [
      "எழுத்தில் சொல்ல முயன்றேன்…",
      "கவிதைக்குள் மறைத்து வைத்தேன்…",
      "இசையிலும் சொல்லிப் பார்த்தேன்…",
      "",
      "ஆனால் இந்த முறை,",
      "என் குரலிலேயே நீ கேட்க வேண்டும். ❤"
    ],
    label: "Listen to me",
    labelTa: "என் குரலில்…",
    file: "assets/voice.mp3",
    missing: "The recording is still coming. ❤"
  },

  /* ---------- 10. THE FINAL WORDS ---------- */
  finale: {
    lines: [
      "No poem this time.",
      "No song to say it for me."
    ],
    big: "I LOVE YOU",          // the climax - shown large
    ta: [
      "இத்தனை நாள் காத்திருந்தது",
      "இந்த ஒரு வார்த்தைக்காகத்தான்."
    ],
    symbol: "❤ ∞",
    closing: "Happy Birthday, My Love.",
    replayLabel: "Live it again"
  },

  /* ---------- 11. ATMOSPHERE (safe to leave alone) ---------- */
  atmosphere: {
    density: 1,        // 0.5 = calmer, 1 = default, 1.5 = richer
    balloonCount: 6    // balloons on the opening screen (5-8 looks best)
  }
};
