"use client";
import { WalletConnection } from "@/components/connector";
import { useRelayer } from "@/hook/useRelayer";
import { useOpenStore } from "@/store/useConnectionStore";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";

// Données statiques
const DISCO_IMAGES = [
  { src: "image1.png", zone: 2 },
  { src: "image2.png", zone: 3 },
  { src: "image3.png", zone: 1 },
  { src: "image4.png", zone: 2 },
  { src: "image5.png", zone: 2 },
  { src: "image6.png", zone: 2 },
  { src: "image7.png", zone: 3 },
  { src: "image8.png", zone: 1 },
  { src: "image9.png", zone: 2 },
  { src: "image10.png", zone: 1 },
  { src: "image11.png", zone: 2 },
  { src: "image12.png", zone: 2 },
  { src: "image13.png", zone: 2 },
  { src: "image14.png", zone: 2 },
  { src: "image15.png", zone: 3 },
  { src: "image16.png", zone: 3 },
];

const SPECIAL_IMAGES_DATA = [
  { src: "special1.png", probability: 10 },
  { src: "special2.png", probability: 5 },
  { src: "special3.png", probability: 2 },
  { src: "special4.png", probability: 1 },
  { src: "special5.png", probability: 0.1 },
  { src: "special6.png", probability: 0.01 },
  { src: "special7.png", probability: 0.001 },
  { src: "special8.png", probability: 0.0001 },
];

// Exemples de morceaux et lyrics
const TRACKS = [
  {
    src: "song1.mp3",
    lyrics: [
      "[Verse 1]",
      "Monad",
      "Monad purple",
      "Monad wonderful world",
      "Monad",
      "Monad's testnet time",
      "All others people clic",
      "10k TPS",
      "Let's dance",
      "",
      "[Chorus]",
      "(oo-yeah!) Monad (oo)",
      "(oo-yeah!) Testnet (oo)",
      "(oo-yeah!) TPS (heh)",
      "(oo-yeah!) Let's dance (x2)",
      "Who are you?",
      "I'm Monada",
      "Who's that?",
      "Monada",
      "I don't understand",
      "Another diamond!",
      "Let's dance!",
      "",
      "[Verse 2]",
      "All nads",
      "All monoanimals",
      "Let's dance",
      "",
      "[Chorus]",
      "NPC",
      "Woah",
      "(oo-yeah) Valid",
      "NPC",
      "Woah",
      "Nading (oo)",
      "NPC",
      "Woah",
      "So valid",
      "Ennoda (AI drunk)",
      "Selloda (AI on crack)",
      "Nad",
      "",
      "[Bridge]",
      "Hey Monada",
      "What's that?",
      "“Beep-bop”",
      "Ko nikuka gero",
      "Monoanimals walking on 'nads (ofc)",
      "Perform loader (?)",
      "Performer (!)",
      "",
      "[Verse 3]",
      "Gos and cloudbuzz (AI on blunt)",
      "Ciccles and lolyers (AI on cocaine)",
      "Dance !",
      "",
      "[Chorus]",
      "(oo-yeah!) Monad (oo)",
      "(oo-yeah!) Testnet (oo)",
      "(oo-yeah!) TPS (heh)",
      "(oo-yeah!) Let's dance (x2)",
      "",
      "[Final]",
      "All nads,",
      "Monad",
      "All nads,",
      "Monad",
      "Let's dance !",
    ],
  },
  {
    src: "song2.mp3",
    lyrics: [
      "Listen to the ground",
      "There is movement all around",
      "There is something goin' down",
      "And I can feel it",
      "",
      "On the waves of the air",
      "There is dancin' out there",
      "If it's somethin' we can share",
      "We can steal it",
      "",
      "And that sweet city woman",
      "She moves through the light",
      "Controlling my mind and my soul",
      "When you reach out for me",
      "Yeah, and the feelin' is right",
      "",
      "Then I get night fever, night fever",
      "We know how to do it",
      "Gimme that night fever, night fever",
      "We know how to show it",
      "",
      "Here I am",
      "Prayin' for this moment to last",
      "Livin' on the music so fine",
      "Borne on the wind",
      "Makin' it mine",
      "",
      "Night fever, night fever",
      "We know how to do it",
      "Gimme that night fever, night fever",
      "We know how to show it",
      "",
      "In the heat of our love",
      "Don't need no help for us to make it",
      "Gimme just enough to take us to the mornin'",
      "I got fire in my mind",
      "I get higher in my walkin'",
      "And I'm glowin' in the dark",
      "Give you warnin'",
      "",
      "And that sweet city woman",
      "She moves through the night",
      "Controlling my mind and my soul",
      "When you reach out for me",
      "Yeah, and the feelin' is right",
      "",
      "That night fever, night fever",
      "We know how to do it",
      "Gimme that night fever, night fever",
      "We know how to show it",
      "",
      "Here I am",
      "Prayin' for this moment to last",
      "Livin' on the music so fine",
      "Borne on the wind",
      "Makin' it mine",
      "",
      "Night fever, night fever",
      "We know how to do it",
      "Gimme that night fever, night fever",
      "We know how to show it",
      "",
      "Gimme that night fever, night fever",
      "We know how to do it",
    ],
  },
  {
    src: "song3.mp3",
    lyrics: [
      "Dance, Boogie Wonderland, hey, hey",
      "Dance, Boogie Wonderland",
      "",
      "Midnight creeps so slowly into hearts of men",
      "Who need more than they get",
      "Daylight deals a bad hand to a woman",
      "Who has laid too many bets",
      "",
      "The mirror stares you in the face and says",
      '"Baby, uh, uh, it don’t work"',
      "You say your prayers though you don't care",
      "You dance and shake the hat",
      "",
      "Dance, Boogie Wonderland, hey, hey",
      "Dance, Boogie Wonderland",
      "",
      "Sound fly through the night",
      "I chase my vinyl dreams to Boogie Wonderland",
      "I find romance when I start to dance in Boogie Wonderland",
      "I find romance when I start to dance in Boogie Wonderland",
      "",
      "All the love in the world can't be gone",
      "All the need to be loved can't be wrong",
      "All the records are playing and my heart keeps saying",
      '"Boogie Wonderland, Wonderland"',
      "",
      "Dance, Boogie Wonderland, hey, hey",
      "Dance, Boogie Wonderland, hey, hey",
      "",
      "I find romance when I start to dance in Boogie Wonderland",
      "I find romance when I start to dance in Boogie Wonderland",
      "Dance, dance (Boogie Wonderland), dance, dance",
      "Dance, dance (Boogie Wonderland), dance, dance",
      "",
      "Wonderland",
      "Wonderland",
      "",
      "All the love in the world can't be gone (love in the world can't be gone)",
      "All the need to be loved can't be wrong (need to be loved can't be wrong)",
      "All the records are playing and my heart keeps saying",
      "Boogie Wonderland, Wonderland",
      "",
      "Dance, Boogie Wonderland, hey, hey",
      "Dance, Boogie Wonderland, hey, hey",
      "",
      "I find romance when I start to dance in Boogie Wonderland",
      "I find romance when I start to dance in Boogie Wonderland",
      "Dance, dance, dance (Boogie Wonderland), dance, dance, dance, dance",
      "Dance, dance (Boogie Wonderland), dance",
    ],
  },
  {
    src: "song4.mp3",
    lyrics: [
      "Do you remember",
      "The 21st night of September?",
      "Love was changin' the minds of pretenders",
      "While chasin' the clouds away",
      "",
      "Our hearts were ringin'",
      "In the key that our souls were singin'",
      "As we danced in the night, remember",
      "How the stars stole the night away, oh, yeah",
      "",
      "Hey, hey, hey",
      "Ba-dee-ya, say, do you remember?",
      "Ba-dee-ya, dancin' in September",
      "Ba-dee-ya, never was a cloudy day",
      "",
      "Ba-du-da, ba-du-da, ba-du-da, ba-du",
      "Ba-du-da, ba-du, ba-du-da, ba-du",
      "Ba-du-da, ba-du, ba-du-da",
      "",
      "My thoughts are with you",
      "Holdin' hands with your heart to see you",
      "Only blue talk and love, remember",
      "How we knew love was here to stay",
      "",
      "Now December",
      "Found the love that we shared in September",
      "Only blue talk and love, remember",
      "The true love we share today",
      "",
      "Hey, hey, hey",
      "Ba-dee-ya, say, do you remember?",
      "Ba-dee-ya, dancin' in September",
      "Ba-dee-ya, never was a cloudy day",
      "There was a",
      "Ba-dee-ya (dee-ya, dee-ya), say, do you remember?",
      "Ba-dee-ya (dee-ya, dee-ya), dancin' in September",
      "Ba-dee-ya (dee-ya, dee-ya), golden dreams were shiny days",
      "",
      "The bell was ringin', oh, oh",
      "Our souls were singin'",
      "Do you remember never a cloudy day? Yow",
      "",
      "There was a",
      "Ba-dee-ya (dee-ya, dee-ya), say, do you remember?",
      "Ba-dee-ya (dee-ya, dee-ya), dancin' in September",
      "Ba-dee-ya (dee ya, dee-ya), golden dreams were shiny days",
      "",
      "Ba-dee-ya, dee-ya, dee-ya",
      "Ba-dee-ya, dee-ya, dee-ya",
      "Ba-dee-ya, dee-ya, dee-ya, dee-ya!",
      "Ba-dee-ya, dee-ya, dee-ya",
      "Ba-dee-ya, dee-ya, dee-ya",
      "Ba-dee-ya, dee-ya, dee-ya, dee-ya!",
    ],
  },
];

const TILE_COLORS = [
  "#FF00FF",
  "#DA70D6",
  "#9370DB",
  "#8A2BE2",
  "#4B0082",
  "#0000FF",
  "#1E90FF",
  "#00FFFF",
];

const BACKGROUND_COLORS = [
  "#FF1493",
  "#FF69B4",
  "#FF00FF",
  "#FFB6C1",
  "#FF69B4",
  "#FF82AB",
  "#8A2BE2",
  "#9400D3",
  "#9932CC",
  "#BA55D3",
  "#DA70D6",
  "#EE82EE",
  "#0000FF",
  "#1E90FF",
  "#00BFFF",
  "#87CEFA",
  "#00CED1",
  "#48D1CC",
  "#00FF00",
  "#7FFF00",
  "#00FF7F",
  "#98FB98",
  "#FFD700",
  "#FFA500",
  "#FF8C00",
  "#FF7F50",
  "#FF0000",
  "#FF4500",
  "#FF6347",
  "#FF00FF",
  "#00FFFF",
  "#FF1493",
  "#14FFB1",
  "#F4C2C2",
  "#C2F4E7",
  "#C2C2F4",
  "#F4C2F4",
];

export const Home = () => {
  const { address } = useAccount();
  const { open, setOpen } = useOpenStore();
  const [count, setCount] = useState(0);
  const { click } = useRelayer();
  const containerRef = useRef(null);
  const dancefloorRef = useRef(null);
  const dancefloorContainerRef = useRef(null);
  const audioRef = useRef(null);
  const twitterLogoRef = useRef(null);

  // États pour le rendu dynamique
  const [clickCount, setClickCount] = useState(0);
  const [gridSize, setGridSize] = useState(window.innerWidth <= 768 ? 12 : 15);
  const [tileColors, setTileColors] = useState(
    Array.from(
      { length: gridSize * gridSize },
      () => TILE_COLORS[Math.floor(Math.random() * TILE_COLORS.length)]
    )
  );
  const [backgroundGradient, setBackgroundGradient] = useState(
    "linear-gradient(30deg, #836EF9, #FF00FF"
  );
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [collectionImages, setCollectionImages] = useState([]);
  const [discoImage, setDiscoImage] = useState(null);
  const [specialImagesOnScreen, setSpecialImagesOnScreen] = useState([]);
  const [showPopup, setShowPopup] = useState(true);

  // Pour mémoriser la dernière image disco affichée
  const lastDiscoImageRef = useRef(null);
  // Pour stocker l’état des images spéciales (triggered)
  const specialImagesRef = useRef(
    SPECIAL_IMAGES_DATA.map((img) => ({ ...img, triggered: false }))
  );

  // Mise à jour du nombre de colonnes en cas de redimensionnement
  useEffect(() => {
    const handleResize = () => {
      const newSize = window.innerWidth <= 768 ? 12 : 15;
      setGridSize(newSize);
      // Régénérer des couleurs aléatoires pour chaque tuile
      setTileColors(
        Array.from(
          { length: newSize * newSize },
          () => TILE_COLORS[Math.floor(Math.random() * TILE_COLORS.length)]
        )
      );
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fonctions utilitaires
  const getRandomColor = useCallback((colors) => {
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  const updateTileColors = () => {
    setTileColors(
      Array.from({ length: gridSize * gridSize }, () =>
        getRandomColor(TILE_COLORS)
      )
    );
  };

  const setRandomGradient = () => {
    const color1 = getRandomColor(BACKGROUND_COLORS);
    const color2 = getRandomColor(BACKGROUND_COLORS);
    const angle = Math.floor(Math.random() * 360);
    setBackgroundGradient(`linear-gradient(${angle}deg, ${color1}, ${color2})`);
  };

  // Calcule les dimensions d'une zone en fonction du numéro
  const getZoneDimensions = (zoneNumber) => {
    if (!dancefloorContainerRef.current) return null;
    const rect = dancefloorContainerRef.current.getBoundingClientRect();
    const zoneHeight = rect.height / 3;
    const verticalShift = 20;
    const extraUpShift = 40;
    const zone = {
      top: rect.top - verticalShift - extraUpShift,
      left: rect.left,
      width: rect.width,
      height: zoneHeight,
    };
    if (zoneNumber === 1) {
      zone.width = rect.width * 0.4;
      zone.left = rect.left + (rect.width - zone.width) / 2;
      zone.top += 40;
    } else if (zoneNumber === 2) {
      zone.width = rect.width * 0.7;
      zone.left = rect.left + (rect.width - zone.width) / 2;
      zone.top = rect.top + zoneHeight - verticalShift - extraUpShift;
    } else if (zoneNumber === 3) {
      zone.width = rect.width * 0.9;
      zone.left = rect.left + (rect.width - zone.width) / 2;
      zone.top = rect.top + 2 * zoneHeight - verticalShift - extraUpShift;
      zone.height = zone.height * 0.5;
    }
    return zone;
  };

  // Crée et positionne une image disco unique
  const createSingleImage = () => {
    const zoneNumber = Math.floor(Math.random() * 3) + 1;
    const zone = getZoneDimensions(zoneNumber);
    if (!zone) return;
    const availableImages = DISCO_IMAGES.filter(
      (img) => img.zone === zoneNumber
    );
    let chosenImage;
    if (availableImages.length > 1) {
      do {
        chosenImage =
          availableImages[Math.floor(Math.random() * availableImages.length)];
      } while (chosenImage.src === lastDiscoImageRef.current);
    } else {
      chosenImage = availableImages[0];
    }
    lastDiscoImageRef.current = chosenImage.src;
    const imgWidth = 250;
    const imgHeight = 250;
    const randomFactor = 1 - Math.pow(Math.random(), 2);
    const randomX =
      zone.left + randomFactor * Math.max(0, zone.width - imgWidth);
    const randomY =
      zone.top + Math.random() * Math.max(0, zone.height - imgHeight);
    setDiscoImage({
      src: chosenImage.src,
      left: randomX,
      top: randomY,
    });
  };

  // Tente de générer des images spéciales
  const spawnSpecialImages = () => {
    specialImagesRef.current.forEach((special, index) => {
      if (!special.triggered && Math.random() * 100 < special.probability) {
        // Marquer comme déclenchée
        specialImagesRef.current[index].triggered = true;
        createSpecialImage(special);
      }
    });
  };

  // Crée une image spéciale et la rend cliquable
  const createSpecialImage = (special) => {
    const zone = getZoneDimensions(3);
    if (!zone) return;
    const imgWidth = 200;
    const imgHeight = 200;
    const randomFactor = 1 - Math.pow(Math.random(), 2);
    const randomX =
      zone.left + randomFactor * Math.max(0, zone.width - imgWidth);
    const randomY =
      zone.top + Math.random() * Math.max(0, zone.height - imgHeight);
    // Créer un objet représentant l'image spéciale
    const specialObj = {
      id: Date.now() + Math.random(),
      src: special.src,
      left: randomX,
      top: randomY,
    };
    setSpecialImagesOnScreen((prev) => [...prev, specialObj]);
    // Supprimer l'image après 5 secondes si non collectée
    setTimeout(() => {
      setSpecialImagesOnScreen((prev) =>
        prev.filter((img) => img.id !== specialObj.id)
      );
    }, 5000);
  };

  // Lorsqu'une image spéciale est cliquée, on la collecte
  const collectSpecialImage = (id, src, e) => {
    e.stopPropagation();
    setSpecialImagesOnScreen((prev) => prev.filter((img) => img.id !== id));
    setCollectionImages((prev) => [...prev, src]);
  };

  // Gestion du clic principal sur le container
  const handleContainerClick = async () => {
    if (!address) {
      setOpen(true);
      return;
    }
    setClickCount((prev) => prev + 1);
    updateTileColors();
    setRandomGradient();
    createSingleImage();
    spawnSpecialImages();
    click(address as `0x${string}`);
  };

  // Gestion de la musique
  const handleMusicToggle = (e) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current
        .play()
        .then(() => {})
        .catch((err) => console.error(err));
    } else {
      audioRef.current.pause();
    }
  };

  const handleNextTrack = (e) => {
    e.stopPropagation();
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const handlePrevTrack = (e) => {
    e.stopPropagation();
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  // Lors du changement de morceau, mettre à jour la source audio et relancer la lecture
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = TRACKS[currentTrackIndex].src;
      audioRef.current
        .play()
        .then(() => {})
        .catch((err) => console.error(err));
    }
  }, [currentTrackIndex]);

  // Empêcher la propagation du clic sur le logo Twitter
  const handleTwitterLogoClick = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      <WalletConnection />
      <div
        ref={containerRef}
        style={{
          margin: 0,
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          transition: "background-color 0.3s",
          background: backgroundGradient || "black",
          overflow: "hidden",
          position: "relative",
        }}
        onClick={handleContainerClick}
      >
        {/* Pop-up de bienvenue */}
        {showPopup && (
          <div
            id="popup-overlay"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              id="popup"
              style={{
                background: "#222",
                padding: "30px",
                border: "3px solid #FF00FF",
                borderRadius: "10px",
                textAlign: "center",
                fontFamily: "'Luckiest Guy', cursive",
                color: "#fff",
                boxShadow: "0 0 20px #FF00FF",
                maxWidth: "90%",
              }}
            >
              <h1 style={{ margin: "0 0 20px", fontSize: "32px" }}>
                Discomon is Here to Get You Moving !
              </h1>
              <p>Are you ready to lose yourself on the dance floor?</p>
              <p>Crank up the volume to the max and let the beat groove!</p>
              <p>
                Click on the screen to make us dance, and collect the 8 special
                partygoers that will join the party!
              </p>
              <p>
                Our amazing partners have awesome prizes lined up for you every
                week!
              </p>
              <p>
                So now, show Mon Travolta you're better than him by unleashing
                our best choreography! Stress the testnet to the beat of Disco!
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Start Game cliqué");
                  setShowPopup(false);
                  handleContainerClick();
                }}
                style={{
                  background: "linear-gradient(45deg, #FF00FF, #00FFFF)",
                  border: "none",
                  color: "#fff",
                  fontSize: "16px",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  zIndex: "10000",
                  boxShadow: "0 0 10px #FF00FF, 0 0 20px #FF00FF",
                }}
              >
                Start Game
              </button>
            </div>
          </div>
        )}

        {/* Image en haut à gauche */}
        <img
          src="Encart.png"
          alt="Votre Description"
          id="top-left-image"
          style={{
            position: "fixed",
            top: 20,
            left: 20,
            width: 240,
            zIndex: 10,
          }}
          onClick={(e) => e.stopPropagation()}
        />

        {/* Logo Disco en haut-centre */}
        <img
          src="discologo.png"
          alt="Logo Disco"
          className="header-image"
          style={{
            width: "25vw",
            minWidth: 150,
            maxWidth: 300,
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
          }}
          onClick={(e) => e.stopPropagation()}
        />

        {/* Container du dancefloor */}
        <div
          className="main-container"
          style={{
            perspective: "2000px",
            width: "98vw",
            height: "90vh",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            position: "absolute",
            bottom: "-20vh",
          }}
        >
          <div
            className="dancefloor-container"
            ref={dancefloorContainerRef}
            style={{
              transform: "rotateX(75deg)",
              transformStyle: "preserve-3d",
              width: "min(95vh,95vw)",
              height: "min(95vh,95vw)",
              position: "relative",
            }}
          >
            <div
              className="dancefloor"
              ref={dancefloorRef}
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gap: "0.3%",
                width: "100%",
                height: "100%",
                backgroundColor: "black",
                padding: "0.3%",
                position: "relative",
              }}
            >
              {/* Génération des tuiles */}
              {Array.from({ length: gridSize * gridSize }).map((_, i) => (
                <div
                  key={i}
                  className={`tile ${i < gridSize ? "first-row" : ""}`}
                  style={{
                    position: "relative",
                    backgroundColor: tileColors[i],
                    border: "1px solid rgba(255,255,255,0.2)",
                    transition: "background-color 0.3s",
                    aspectRatio: "1",
                  }}
                >
                  {i < gridSize && (
                    <div
                      style={{
                        content: "",
                        position: "absolute",
                        width: "100%",
                        height: 20,
                        backgroundColor: "inherit",
                        bottom: -20,
                        transform: "rotateX(-90deg)",
                        transformOrigin: "top",
                        filter: "brightness(0.7)",
                      }}
                    />
                  )}
                </div>
              ))}
              {/* Représentation du "disco image" */}
              {discoImage && (
                <img
                  src={discoImage.src}
                  alt="Disco"
                  className="disco-image"
                  style={{
                    position: "fixed",
                    transform: "translate(-50%, -50%)",
                    zIndex: 3,
                    pointerEvents: "none",
                    width: 250,
                    height: 250,
                    objectFit: "contain",
                    left: discoImage.left,
                    top: discoImage.top,
                  }}
                />
              )}
              {/* Images spéciales */}
              {specialImagesOnScreen.map((img) => (
                <img
                  key={img.id}
                  src={img.src}
                  alt="Special"
                  className="special-image"
                  style={{
                    position: "fixed",
                    transform: "translate(-50%, -50%)",
                    zIndex: 4,
                    cursor: "pointer",
                    width: 200,
                    height: 200,
                    objectFit: "contain",
                    left: img.left,
                    top: img.top,
                  }}
                  onClick={(e) => collectSpecialImage(img.id, img.src, e)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Compteur de clics */}
        <div
          id="tx-counter"
          style={{
            position: "fixed",
            bottom: 480,
            right: 20,
            width: 220,
            background: "linear-gradient(45deg, #00FFFF, #FF00FF)",
            color: "#fff",
            padding: "5px 10px",
            borderRadius: "5px",
            fontFamily: "'Luckiest Guy', cursive",
            fontSize: 20,
            textAlign: "center",
            zIndex: 6,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          tx number: {clickCount}
        </div>

        {/* Zone de collecte */}
        <div
          id="collection"
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            background: "linear-gradient(45deg, #FF00FF, #00FFFF)",
            color: "#fff",
            width: 240,
            height: 450,
            padding: 10,
            borderRadius: 5,
            zIndex: 5,
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            fontFamily: "'Luckiest Guy', cursive",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="collection-title"
            style={{
              fontSize: 24,
              textAlign: "center",
              marginBottom: 5,
              textShadow: "0 0 5px #FF00FF, 0 0 10px #FF00FF, 0 0 20px #FF00FF",
            }}
          >
            character collection
          </div>
          <div
            className="collection-imgs"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gridAutoRows: "auto",
              gap: 5,
              flexGrow: 1,
              overflowY: "auto",
            }}
          >
            {collectionImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt="Collected"
                style={{
                  maxWidth: 80,
                  maxHeight: 80,
                  objectFit: "contain",
                  width: "100%",
                  height: "auto",
                }}
              />
            ))}
          </div>
        </div>

        {/* Conteneur des boutons musique */}
        <div
          id="music-container"
          style={{
            position: "fixed",
            bottom: 480,
            left: 20,
            width: 240,
            display: "flex",
            justifyContent: "center",
            gap: 10,
            zIndex: 5,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handlePrevTrack}
            style={{
              background: "linear-gradient(45deg, #FF00FF, #00FFFF)",
              border: "none",
              color: "#fff",
              fontSize: 20,
              padding: "10px 15px",
              borderRadius: 5,
              cursor: "pointer",
              boxShadow: "0 0 10px #FF00FF, 0 0 20px #FF00FF",
            }}
          >
            ⏮
          </button>
          <button
            onClick={handleMusicToggle}
            style={{
              background: "linear-gradient(45deg, #FF00FF, #00FFFF)",
              border: "none",
              color: "#fff",
              fontSize: 20,
              padding: "10px 15px",
              borderRadius: 5,
              cursor: "pointer",
              boxShadow: "0 0 10px #FF00FF, 0 0 20px #FF00FF",
            }}
          >
            🎵
          </button>
          <button
            onClick={handleNextTrack}
            style={{
              background: "linear-gradient(45deg, #FF00FF, #00FFFF)",
              border: "none",
              color: "#fff",
              fontSize: 20,
              padding: "10px 15px",
              borderRadius: 5,
              cursor: "pointer",
              boxShadow: "0 0 10px #FF00FF, 0 0 20px #FF00FF",
            }}
          >
            ⏭
          </button>
        </div>

        {/* Zone Lyrics */}
        <div
          id="lyrics"
          style={{
            position: "fixed",
            bottom: 20,
            left: 20,
            background: "linear-gradient(45deg, #FF00FF, #00FFFF)",
            color: "#fff",
            width: 240,
            height: 450,
            padding: 10,
            borderRadius: 5,
            zIndex: 5,
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            overflowY: "auto",
            fontFamily: "'Luckiest Guy', cursive",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="lyrics-title"
            style={{
              fontSize: 24,
              textAlign: "center",
              marginBottom: 5,
              textShadow: "0 0 5px #FF00FF, 0 0 10px #FF00FF, 0 0 20px #FF00FF",
            }}
          >
            Lyrics
          </div>
          <div
            className="lyrics-content"
            style={{
              flexGrow: 1,
              fontSize: 16,
              lineHeight: 1.4,
              whiteSpace: "pre-wrap",
            }}
          >
            {TRACKS[currentTrackIndex].lyrics.join("\n")}
          </div>
        </div>

        {/* Élément audio */}
        <audio ref={audioRef} loop style={{ display: "none" }} />

        {/* Logo Twitter */}
        <a
          href="https://twitter.com/VotreCompteTwitter"
          target="_blank"
          rel="noopener noreferrer"
          id="twitter-logo"
          ref={twitterLogoRef}
          onClick={handleTwitterLogoClick}
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
        >
          <img src="twitter-logo.png" alt="Twitter" style={{ width: 50 }} />
        </a>

        {/* Insertion du CSS global (optionnel) */}
        <style>{`
        /* Vous pouvez déplacer ce CSS dans un fichier séparé */
        .tile.first-row::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 20px;
          background-color: inherit;
          bottom: -20px;
          transform: rotateX(-90deg);
          transform-origin: top;
          filter: brightness(0.7);
        }
      `}</style>
      </div>
    </>
  );
};
