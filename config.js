/* ============================================================
   =================  PERSONALIZE HERE  =======================
   Everything you will ever want to change lives in THIS file.
   You never need to touch style.css or script.js.
   Save the file, refresh the page, done.

   THE TWO VOICES
   Every section has a Tamil block ("ta") and English text.
   Tamil is always shown ABOVE the English.
   They are deliberately NOT translations of each other:
       ta      = the feeling, in my own words, as a poem
       English = another part of the story, said plainly
   Read them together and they should add up. Read either alone
   and it should still stand on its own.

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
    ta: [
      "இன்று உனக்குப் பிறந்த நாள்…",
      "",
      "எனக்கோ,",
      "நீ கிடைத்ததற்கு",
      "நன்றி சொல்லும் நாள். ❤"
    ],
    message: "Today the whole world gets to wish you.\nI just wanted a corner of it that was only ours."
  },

  /* ---------- 4. OUR MEMORIES ----------
     HOW TO ADD YOUR PHOTOS:
       1. Put your images inside the  assets/  folder
       2. Name them photo1.jpg, photo2.jpg ... (or change "src" below)
       3. Portrait photos look best on a phone. ~1200px wide is plenty.
     Until a real file exists, a soft placeholder is shown automatically.
     You can have 3, 4, 5 or more - just add/remove items in this list.

     Each photo takes a short Tamil line and an English one. Keep them
     different from each other - Tamil the feeling, English the moment.  */
  memories: {
    title: "Our Memories",
    ta: [
      "நினைவுகள் என்பவை",
      "நாம் வாழ்ந்த நிமிடங்கள் அல்ல…",
      "",
      "நீ இருந்த நிமிடங்கள்."
    ],
    subtitle: "I keep going back to the ordinary days.\nNothing happened in them. You were just there.",
    photos: [
      { src: "assets/photo1.jpg", captionTa: "அன்று உலகம் லேசாக இருந்தது.",        caption: "The day everything felt lighter." },
      { src: "assets/photo2.jpg", captionTa: "உன் சிரிப்பு… என் பிடித்த ஓசை.",      caption: "I still hear this one." },
      { src: "assets/photo3.jpg", captionTa: "சாதாரண நாள். சாதாரணமில்லை.",          caption: "Nothing special happened. I remember all of it." },
      { src: "assets/photo4.jpg", captionTa: "எங்கோ ஒரு நாளில்,\nநீ வீடானாய்.",     caption: "Somewhere in between, you became the place I come back to." },
      { src: "assets/photo5.jpg", captionTa: "மீண்டும் ஒரு முறை என்றால்,\nஇதே தான்.", caption: "And I'd choose this again. Every time." }
    ]
  },

  /* ---------- 5. THE THING WE BOTH ALREADY KNOW ---------- */
  feelings: {
    title: "The One Thing We Both Know",
    ta: [
      "நம்ம இருவருக்கும் தெரிந்த ஒரு உண்மை…",
      "",
      "என் மனதில் நீ இருந்தது",
      "நேற்று அல்ல…",
      "",
      "இன்று சொல்லப் போகும்",
      "அந்த வார்த்தைகளுக்கு முன்பே. ∞"
    ],
    lines: [
      "You never had to guess how I felt.",
      "It was never a secret. It just never became a sentence.",
      "Three words, still waiting for their turn."
    ],
    bridge: "And all of it goes back to one day, exactly a year ago."
  },

  /* ---------- 6. LAST YEAR ----------
     What actually happened: she said it first, and I answered with a
     poem instead of the words - and told her the answer was inside it.

     >>> PUT YOUR OWN TAMIL POEM IN "lines_poem" BELOW. <<<
     One line of the poem = one item in the list.
     Use an empty string ""  to leave a blank line between stanzas.   */
  lastYear: {
    eyebrow: "Last year, on my birthday…",
    ta: [
      "கடந்த வருடத்தின் அந்த நாளை",
      "எப்படி மறக்க முடியும்…",
      "",
      "நீ ஒரு வார்த்தையில்",
      "உன் மனதை என்னிடம் வைத்தாய்…",
      "",
      "நான் மட்டும்,",
      "என் மனதில் இருந்த பதிலை",
      "சில வரிகளுக்குள் வைத்து",
      "உன்னிடம் கொடுத்தேன்…",
      "",
      "அந்த வரிகளின் அர்த்தம்",
      "முழுமையாய் உனக்குப் புரியாமல் போனாலும்,",
      "அதற்குள் இருந்த காதல் மட்டும்",
      "உனக்குத் தெரிந்திருந்தது. ❤"
    ],
    lines: [
      "You said it first. You said it plainly.",
      "I didn't answer in the same words —",
      "I answered you with a poem, and told you the answer was somewhere inside it.",
      "You knew what I meant. You just never got all of it."
    ],
    poemLabel: "The poem I gave you that day",
    titleTamil: "அன்று சொன்ன பதில்…",
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
    ta: [
      "சில உணர்வுகளுக்கு",
      "நம்மிடம் வார்த்தைகள் இருப்பதில்லை…",
      "",
      "அப்போதெல்லாம்",
      "ஒரு பாடல் மட்டும்",
      "நமக்குப் பதிலாகப் பேசும். ❤"
    ],
    heading: "Maybe This Song Says\nWhat I Couldn't ❤",
    note: "You've heard it a hundred times.\nHear it once more — as an answer.",
    title: "Asku Laska",
    subtitle: "Nanban (2012)",
    credit: "Music: Harris Jayaraj",
    file: "assets/song.mp3",
    artwork: "",                 // e.g. "assets/artwork.jpg"
    autoPlayWhenReached: false   // true = try to start when the section is reached
  },

  /* ---------- 8. PERSONAL LETTER ----------
     Each item in "paragraphs" becomes its own paragraph.               */
  letter: {
    heading: "From my heart…",
    ta: [
      "எழுதிப் பார்த்தேன்…",
      "அழித்துப் பார்த்தேன்…",
      "",
      "சொல்ல நினைத்தது",
      "சின்ன விஷயம் தான்…",
      "",
      "சொல்லும் நேரம் மட்டும்",
      "சரியாக வர வேண்டியிருந்தது. ❤"
    ],
    greeting: "Dear",            // rendered as: Dear <herName>,
    paragraphs: [
      "I'm not good at saying things at the right moment. You've told me that yourself.",
      "You asked me once why I never just say it casually. It was never that I didn't feel it. It's that I didn't want it to sound like nothing.",
      "Some words you only get to say for the first time once. I wanted the moment to be worth them.",
      "I think this is that moment. I think it's today."
    ],
    signOff: "Always yours,"
  },

  /* ---------- 9. MY VOICE ----------
     Record yourself saying it, save as  assets/voice.mp3  and refresh.
     Using .m4a instead? Just change "file" below - nothing else:
         file: "assets/voice.m4a"
     Until the file exists the card stays, calm and unbroken, and simply
     says the recording is still coming.                                */
  voice: {
    ta: [
      "எழுத்துகளால் சொல்லிப் பார்த்தேன்…",
      "கவிதையாய் சொல்லிப் பார்த்தேன்…",
      "ஒரு பாடலிடம் கூட",
      "என் மனதை ஒப்படைத்தேன்…",
      "",
      "ஆனால்,",
      "இத்தனை நாளும் சொல்லாமல் இருந்த",
      "அந்த மூன்று வார்த்தைகள்…",
      "",
      "இந்த முறை",
      "என் குரலில்…",
      "உனக்காக மட்டும். ❤"
    ],
    heading: "One last thing…\nThis time, I want you to hear it from me.",
    label: "Listen to me",
    labelTa: "என் குரலில்…",
    file: "assets/voice.mp3",
    missing: "The recording is still coming. ❤"
  },

  /* ---------- 10. THE FINAL WORDS ---------- */
  finale: {
    ta: [
      "இத்தனை நாள் காத்திருந்தது",
      "இந்த ஒரு நிமிடத்திற்குத் தான். ∞"
    ],
    lines: [
      "No poem this time.",
      "No song to say it for me."
    ],
    big: "I LOVE YOU",          // the climax - shown large
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
