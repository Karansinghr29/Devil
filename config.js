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
  herName: "My charming girl",      // used in the letter greeting
  myName: "உன்னவன் 💚",             // used in the letter signature
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
       2. Name them Photo1.jpg, Photo2.jpg ... (or change "src" below)
       3. Portrait photos look best on a phone. ~1200px wide is plenty.
     Until a real file exists, a soft placeholder is shown automatically.
     You can have 3, 4, 5 or more - just add/remove items in this list.

     Each photo takes a short Tamil line and an English one. Keep them
     different from each other - Tamil the feeling, English the moment.  */
  memories: {
    title: "Our Memories",
    ta: [
      "உன் சிரிப்பு…",
      "என் மனதுக்குப் பிடித்த ஓசை."
    ],
    subtitle: "I keep going back to the ordinary days.\nNothing happened in them. You were just there.",
    photos: [
      { src: "assets/Photo1.jpg", captionTa: "அன்று உலகம் லேசாக இருந்தது.",        caption: "The day everything felt lighter." },
      { src: "assets/Photo2.jpg", captionTa: "இந்த நிமிடம் மட்டும் மீண்டும் வேண்டும்.", caption: "I still hear this one." },
      { src: "assets/Photo3.jpg", captionTa: "சாதாரண நாள். சாதாரணமில்லை.",          caption: "Nothing special happened. I remember all of it." },
      { src: "assets/Photo4.jpg", captionTa: "எங்கோ ஒரு நாளில்,\nநீ வீடானாய்.",     caption: "Somewhere in between, you became the place I come back to." },
      { src: "assets/Photo5.jpg", captionTa: "மீண்டும் ஒரு முறை என்றால்,\nஇதே தான்.", caption: "And I'd choose this again. Every time." }
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
      "என் அழகிய கவிதையே! ❤️",
      "",
      "நீ என் வாழ்வில் வந்ததோ தாமதம் தான்…",
      "ஆனால்",
      "என் மனதில் குடியேறியதோ",
      "சிறுவயதிலேயே…",
      "",
      "அப்போது",
      "காதல் என்ற சொல்லின் அர்த்தம் அறியாத வயது…",
      "ஆனால்",
      "உன்னைப் பார்த்த நொடிகளில் மட்டும்",
      "என் மனம் அறிந்தது",
      "ஏதோ ஒரு இனிய மாற்றத்தை… ✨",
      "",
      "பெயரிடப்படாத அந்த உணர்வு,",
      "வார்த்தைகளால் சொல்லப்படாத அந்த பாசம்,",
      "காலத்தின் பக்கங்களில்",
      "மௌனமாகவே வளர்ந்தது…",
      "",
      "நான் உன்னிடம் பேசவில்லை…",
      "நீயும் என்னிடம் சொல்லவில்லை…",
      "",
      "ஆனால்",
      "சில உணர்வுகளுக்கு",
      "வார்த்தைகள் தேவையில்லை அல்லவா?",
      "",
      "பார்வைகள் பேசும்…",
      "மௌனம் பதில் சொல்லும்…",
      "மனங்கள் மட்டும்",
      "தங்களுக்குள் ஒரு ரகசியத்தை",
      "சுமந்து கொண்டிருக்கும்… ❤️",
      "",
      "அந்த ரகசியம் தான்",
      "நம் இருவருக்குள்ளும் இருந்திருக்க வேண்டும்…",
      "",
      "சொல்ல நினைத்தேன்…",
      "பல முறை…",
      "",
      "ஆனால்",
      "என் வார்த்தைகள் உதடுகளைத் தொடுவதற்குள்",
      "ஒரு பயம் வந்து தடுத்தது…",
      "",
      "“நான் சொன்னால்",
      "அவள் வீட்டில் சொல்லிவிடுவாளோ…”",
      "",
      "என்ற அந்த சிறிய பயம்",
      "என் பெரிய காதலை",
      "என் மனதுக்குள்ளேயே பூட்டி வைத்தது. 🥹",
      "",
      "அதனால்",
      "சொல்லப்படாத காதலாக,",
      "எழுதப்படாத கவிதையாக,",
      "என் மனதின் ஒரு மூலையில்",
      "நீ மட்டும் இருந்தாய்… 🌸",
      "",
      "காலம் ஓடியது…",
      "பருவங்கள் மாறின…",
      "வாழ்க்கை பல பாதைகளை",
      "என் முன்னால் விரித்தது…",
      "",
      "ஆனால்",
      "காலம் எடுத்துச் சென்ற",
      "எத்தனையோ நினைவுகளுக்கு நடுவிலும்",
      "உன்னை மட்டும்",
      "என் மனம் விட்டுக் கொடுக்கவில்லை.",
      "",
      "சில நினைவுகள்",
      "கடந்து போகும் காலத்தின் நிழல்கள்…",
      "",
      "ஆனால்",
      "சிலர் மட்டும்",
      "காலம் கடந்தும்",
      "நம் மனதில் மாறாத முகங்களாக இருப்பார்கள்…",
      "",
      "எனக்கு அந்த முகம் — நீ. ❤️",
      "",
      "நாம் சொல்லாமல் வைத்திருந்த",
      "அந்த சிறிய உணர்வை",
      "விதி மட்டும் மறக்கவில்லை போல…",
      "",
      "காலம் ஒரு நாள்",
      "நம்மை மீண்டும்",
      "ஒரே பக்கத்தில் கொண்டு வந்து நிறுத்தியது.",
      "",
      "நான் சொல்லத் தயங்கியதை",
      "நீயே சொல்லிவிட்டாய்…",
      "",
      "அதுவும்",
      "என் பிறந்தநாள் நாளில்… 🎂❤️",
      "",
      "என் பிறந்தநாளுக்கு",
      "நீ கொடுத்த அந்த பரிசு",
      "எந்தப் பொருளாலும் அளக்க முடியாதது…",
      "",
      "உன் காதல். ❤️",
      "",
      "அன்று",
      "என் மனதில் இருந்த பதில்",
      "வார்த்தைகளாக வெளிவரவில்லை…",
      "",
      "மீண்டும்",
      "என் மனதை ஒரு கவிதைக்குள் மறைத்தேன்.",
      "",
      "அந்தக் கவிதையின் ஒவ்வொரு வரியிலும்",
      "நான் சொல்ல நினைத்ததை",
      "நீ புரிந்துகொண்டாய்…",
      "",
      "நான் மறைத்த காதலையும்",
      "நீ கண்டுகொண்டாய்…",
      "",
      "ஆனால்",
      "சில உணர்வுகளை",
      "எவ்வளவு அழகாக எழுதினாலும்",
      "அதை ஒருமுறை",
      "கண்களைப் பார்த்துச் சொல்லும்",
      "அந்த உணர்வுக்கு ஈடாகாது.",
      "",
      "அதனால் தான்… ❤️",
      "",
      "நான்கு நாட்களுக்கு முன்",
      "உன் கண்களைப் பார்த்து",
      "என் மனதில் பல வருடங்களாக",
      "மௌனமாக இருந்த காதலை",
      "மூன்று வார்த்தைகளாக",
      "உன்னிடம் வைத்தேன்…",
      "",
      "“I love you.” ❤️",
      "",
      "அந்த மூன்று வார்த்தைகள்",
      "அன்று பிறந்தவை அல்ல…",
      "",
      "அவை",
      "சிறுவயதில்",
      "என் மனதில் முளைத்தவை…",
      "",
      "காலத்தால் அழியாமல்",
      "என் நினைவுகளில் வளர்ந்தவை…",
      "",
      "சொல்லத் தயங்கியதால்",
      "என் மௌனத்தில் வாழ்ந்தவை…",
      "",
      "நீ உன் காதலை",
      "என் வாழ்க்கைக்குள் கொண்டு வந்தபோது",
      "முழுமை பெற்றவை… 💕",
      "",
      "அந்தக் காதலின்",
      "மூன்று வார்த்தை வடிவம் தான்…",
      "",
      "“நான் உன்னை காதலிக்கிறேன்.” ❤️",
      "",
      "இன்று",
      "உன் பிறந்தநாள்… 🎂",
      "",
      "உனக்காக",
      "விலையுயர்ந்த பரிசு ஒன்றை",
      "கொடுக்க முடியாமல் போகலாம்…",
      "",
      "ஆனால்",
      "என் மனதில்",
      "பல வருடங்களாக பாதுகாத்து வைத்திருந்த",
      "இந்த உணர்வை",
      "உனக்காக ஒரு கவிதையாக",
      "கொடுக்க முடியும். 🌸",
      "",
      "நேற்றை",
      "மீண்டும் எழுத முடியாது…",
      "",
      "கடந்த காலத்தின்",
      "மௌனங்களை மீண்டும் பேச வைக்கவும் முடியாது…",
      "",
      "ஆனால்",
      "இன்று முதல் எழுதப்படும்",
      "ஒவ்வொரு நாளிலும்",
      "உன் பெயரை மட்டும்",
      "என் மனதின் அருகில் எழுத முடியும். ❤️",
      "",
      "நீ என் வாழ்க்கையில்",
      "வந்தது தாமதமாக இருக்கலாம்…",
      "",
      "ஆனால்",
      "என் மனதில்",
      "நீ வந்த நேரம்",
      "எப்போதுமே சரியான நேரம்.",
      "",
      "ஏனென்றால்…",
      "",
      "என் வாழ்க்கையின் கதையில்",
      "நீ ஒரு நாள் வந்து சேர்ந்தவள்…",
      "",
      "ஆனால்",
      "",
      "என் மனம் எழுதத் தொடங்கிய",
      "முதல் கவிதையின்",
      "முதல் வரியிலேயே",
      "நீ இருந்தவள். ✨",
      "",
      "அதனால்தான்",
      "நீ எனக்கு",
      "ஒரு காதல் மட்டும் அல்ல…",
      "",
      "நான் அறியாமலேயே",
      "சிறுவயதில் தொடங்கி,",
      "காலம் முழுவதும்",
      "என்னோடு பயணித்து,",
      "இன்று என் வாழ்வின்",
      "அழகான அர்த்தமாக மாறிய",
      "என் அழகிய கவிதை. ❤️",
      "",
      "பிறந்தநாள் வாழ்த்துகள்",
      "என் அழகிய கவிதையே… 🎂❤️",
      "",
      "இன்று மட்டும் அல்ல…",
      "என் வாழ்வின்",
      "மீதமுள்ள எல்லா பக்கங்களிலும்…",
      "",
      "என் கவிதையின் ஒவ்வொரு வரியாகவும்,",
      "என் மனதின் ஒவ்வொரு துடிப்பாகவும்,",
      "நீயே இருக்க வேண்டும். ❤️"
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
    title: "Nanban",
    subtitle: "",
    credit: "",
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
    greeting: "",                // rendered as: <herName>,  (e.g. "Dear" -> Dear <herName>,)
    paragraphs: [
      "I'm not good at saying things at the right moment. You've told me that yourself.",
      "You asked me once why I never just say it casually. It was never that I didn't feel it. It's that I didn't want it to sound like nothing.",
      "Some words you only get to say for the first time once. I wanted the moment to be worth them.",
      "I think this is that moment. I think it's today."
    ],
    signOff: "Always yours,"
  },

  /* ---------- 9. MY VOICE ----------
     Record yourself saying it, save as  assets/Voice.mp3  and refresh.
     Using .m4a instead? Just change "file" below - nothing else:
         file: "assets/voice.m4a"
     Until the file exists the card stays, calm and unbroken, and simply
     says the recording is still coming.

     IMPORTANT - THE SURPRISE:
     She does NOT see that this is a recording. She first sees a sealed
     card and has to scratch it away with her finger. Only once the cover
     is gone do the Tamil lines, the heading and the play button appear.
     So keep "surprise" below free of any hint about audio.             */
  voice: {

    /* the sealed cover she scratches - say nothing about a recording */
    surprise: {
      coverTitle:  "A little surprise for you ❤",
      coverSub:    "There's something waiting underneath…",
      coverHint:   "scratch with your finger",
      foundTitle:  "You found it… ❤",
      foundSub:    "Now, listen.",
      skipLabel:   "or tap here to open it",
      threshold:   0.5    // how much must be scratched (0.45 - 0.6)
    },

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
    file: "assets/Voice.mp3",
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

  /* ---------- 10b. ONE LAST SURPRISE (after the finale) ----------
     A card slides down once she has reached the very end.
     Tap it: black screen, one blue heart, then the whole screen
     fills with hearts and these lines, then the final wish,
     then everything returns to the balloons.                     */
  lastSurprise: {
    cardTitle: "One Last Surprise ❤️",
    cardHint: "tap to open",
    lines: [                         // shown one at a time, a random selection
      "Love you ❤️",
      "I’ll be with you.",
      "Until my last breath.",
      "I saw you… and everything changed.",
      "You are my favourite part of every day.",
      "Stay with me.",
      "Always you. ❤️",
      "My heart chose you.",
      "You are my forever.",
      "With you, everything feels right.",
      "Every version of my future has you.",
      "I’ll choose you, again and again.",
      "Wherever life takes us, I’ll be with you.",
      "You are my home.",
      "Still you. Always you. ❤️"
    ],
    wish: "One last wish… ❤️",
    final: "Happy Birthday, My Darlzzzz Queeen ❤️",
    /* music for this moment only - starts on her tap, swells in as the
       heart opens, loops if it's shorter than the scene, fades with the
       final wish. Leave "" for silence. */
    bgm: "assets/ReelAudio-76796.mp3"
  },

  /* ---------- 11. ATMOSPHERE (safe to leave alone) ---------- */
  atmosphere: {
    density: 1,        // 0.5 = calmer, 1 = default, 1.5 = richer
    balloonCount: 6    // balloons on the opening screen (5-8 looks best)
  }
};
