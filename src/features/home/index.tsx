"use client";
import { WalletConnection } from "@/components/connector";
import { useRelayer } from "@/hook/useRelayer";
import { useOpenStore } from "@/store/useConnectionStore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";

interface DiscoImage {
  src: string;
  zone: number;
}

interface SpecialImageData {
  src: string;
  probability: number;
}

interface SpecialImage extends SpecialImageData {
  triggered: boolean;
}

interface SpecialImageOnScreen {
  id: number;
  src: string;
  left: number;
  top: number;
}

interface Track {
  src: string;
  lyrics: string[];
}

interface DiscoImageState {
  src: string;
  left: number;
  top: number;
}

interface ZoneDimensions {
  top: number;
  left: number;
  width: number;
  height: number;
}

const DISCO_IMAGES: DiscoImage[] = [
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

const SPECIAL_IMAGES_DATA: SpecialImageData[] = [
  { src: "special1.png", probability: 10 },
  { src: "special2.png", probability: 5 },
  { src: "special3.png", probability: 2 },
  { src: "special4.png", probability: 1 },
  { src: "special5.png", probability: 0.1 },
  { src: "special6.png", probability: 0.01 },
  { src: "special7.png", probability: 0.001 },
  { src: "special8.png", probability: 0.0001 },
];

const TRACKS: Track[] = [
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
  // ... (autres morceaux)
];

const TILE_COLORS: string[] = [
  "#FF00FF",
  "#DA70D6",
  "#9370DB",
  "#8A2BE2",
  "#4B0082",
  "#0000FF",
  "#1E90FF",
  "#00FFFF",
];

const BACKGROUND_COLORS: string[] = [
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

export const Home: React.FC = () => {
  const { address } = useAccount();
  const { setOpen } = useOpenStore();
  const { click } = useRelayer();
  const containerRef = useRef<HTMLDivElement>(null);
  const dancefloorRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [clickCount, setClickCount] = useState<number>(0);
  const [gridSize, setGridSize] = useState<number>(
    window.innerWidth <= 768 ? 12 : 15
  );
  const [tileColors, setTileColors] = useState<string[]>(
    Array.from(
      { length: gridSize * gridSize },
      () => TILE_COLORS[Math.floor(Math.random() * TILE_COLORS.length)]
    )
  );
  const [backgroundGradient, setBackgroundGradient] = useState<string>(
    "linear-gradient(30deg, #836EF9, #FF00FF)"
  );
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [collectionImages, setCollectionImages] = useState<string[]>([]);
  const [discoImage, setDiscoImage] = useState<DiscoImageState | null>(null);
  const [specialImagesOnScreen, setSpecialImagesOnScreen] = useState<
    SpecialImageOnScreen[]
  >([]);
  const [showPopup, setShowPopup] = useState<boolean>(true);

  const lastDiscoImageRef = useRef<string | null>(null);
  const specialImagesRef = useRef<SpecialImage[]>(
    SPECIAL_IMAGES_DATA.map((img) => ({ ...img, triggered: false }))
  );

  useEffect(() => {
    const handleResize = () => {
      const newSize = window.innerWidth <= 768 ? 12 : 15;
      setGridSize(newSize);
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

  const getRandomColor = useCallback((colors: string[]): string => {
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

  // On calcule la zone en se basant sur le dancefloor (la grille)
  const getZoneDimensions = (zoneNumber: number): ZoneDimensions | null => {
    if (!dancefloorRef.current) return null;
    const rect = dancefloorRef.current.getBoundingClientRect();
    const zoneHeight = rect.height / 3;
    const verticalShift = 20;
    const extraUpShift = 40;
    const zone: ZoneDimensions = {
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

  // Calcul des coordonnées relatives à la grille
  const createSingleImage = () => {
    const zoneNumber = Math.floor(Math.random() * 3) + 1;
    const zone = getZoneDimensions(zoneNumber);
    if (!zone || !dancefloorRef.current) return;
    const availableImages = DISCO_IMAGES.filter(
      (img) => img.zone === zoneNumber
    );
    let chosenImage: DiscoImage;
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
    // Calcul en viewport
    const randomX =
      zone.left + randomFactor * Math.max(0, zone.width - imgWidth);
    const randomY =
      zone.top + Math.random() * Math.max(0, zone.height - imgHeight);
    // Conversion en coordonnées relatives à la grille
    const gridRect = dancefloorRef.current.getBoundingClientRect();
    const relativeX = randomX - gridRect.left;
    const relativeY = randomY - gridRect.top;
    // Ici, on peut ajuster verticalement si nécessaire (ex. remonter de 50px)
    setDiscoImage({
      src: chosenImage.src,
      left: relativeX,
      top: relativeY - 50, // ajustement pour remonter l'image
    });
  };

  const spawnSpecialImages = () => {
    specialImagesRef.current.forEach((special, index) => {
      if (!special.triggered && Math.random() * 100 < special.probability) {
        specialImagesRef.current[index].triggered = true;
        createSpecialImage(special);
      }
    });
  };

  const createSpecialImage = (special: SpecialImage) => {
    const zone = getZoneDimensions(3);
    if (!zone || !dancefloorRef.current) return;
    const imgWidth = 200;
    const imgHeight = 200;
    const randomFactor = 1 - Math.pow(Math.random(), 2);
    const randomX =
      zone.left + randomFactor * Math.max(0, zone.width - imgWidth);
    const randomY =
      zone.top + Math.random() * Math.max(0, zone.height - imgHeight);
    const gridRect = dancefloorRef.current.getBoundingClientRect();
    const relativeX = randomX - gridRect.left;
    const relativeY = randomY - gridRect.top;
    const specialObj: SpecialImageOnScreen = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      src: special.src,
      left: relativeX,
      top: relativeY - 50, // même ajustement vertical
    };
    setSpecialImagesOnScreen((prev) => [...prev, specialObj]);
    setTimeout(() => {
      setSpecialImagesOnScreen((prev) =>
        prev.filter((img) => img.id !== specialObj.id)
      );
    }, 5000);
  };

  const collectSpecialImage = (
    id: number,
    src: string,
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setSpecialImagesOnScreen((prev) => prev.filter((img) => img.id !== id));
    setCollectionImages((prev) => [...prev, src]);
  };

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

  const handleMusicToggle = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().catch((err) => console.error(err));
    } else {
      audioRef.current.pause();
    }
  };

  const handleNextTrack = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const handlePrevTrack = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = TRACKS[currentTrackIndex].src;
      audioRef.current.play().catch((err) => console.error(err));
    }
  }, [currentTrackIndex]);

  const handleTwitterLogoClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
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
                So now, show Mon Travolta you&apos;re better than him by
                unleashing our best choreography! Stress the testnet to the beat
                of Disco!
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
                  zIndex: 10000,
                  boxShadow: "0 0 10px #FF00FF, 0 0 20px #FF00FF",
                }}
              >
                Start Game
              </button>
            </div>
          </div>
        )}
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
        {/* Conteneur du dancefloor avec rotation */}
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
          {/*
  Le conteneur "dancefloor-container" crée un stacking context (position: relative + transform).
  La grille ("dancefloor") est rendue avec un z-index bas,
  puis les images sont rendues après avec un z-index plus élevé pour s'afficher par-dessus.
*/}
          <div
            className="dancefloor-container"
            style={{
              position: "relative",
              transform: "rotateX(75deg)",
              transformStyle: "preserve-3d",
              width: "min(95vh,95vw)",
              height: "min(95vh,95vw)",
            }}
          >
            {/* Grille du dancefloor */}
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
                zIndex: 1,
              }}
            >
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
                    zIndex: 1,
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
                        zIndex: 1,
                        transform: "rotateX(-90deg)",
                        transformOrigin: "top",
                        filter: "brightness(0.7)",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Images placées après la grille pour s'afficher au-dessus */}
            {discoImage && (
              <img
                src={discoImage.src}
                alt="Disco"
                style={{
                  position: "absolute",
                  transform:
                    "translate(-50%, -50%) rotateX(-75deg) scale(200%)",
                  zIndex: 100, // z-index supérieur à celui de la grille
                  pointerEvents: "none",
                  width: 250,
                  height: 250,
                  objectFit: "contain",
                  left: discoImage.left,
                  top: discoImage.top - 30, // ajustement vertical si besoin
                }}
              />
            )}
            {specialImagesOnScreen.map((img) => (
              <img
                key={img.id}
                src={img.src}
                alt="Special"
                style={{
                  position: "absolute",
                  transform: "translate(-50%, -50%) rotateX(-75deg)",
                  zIndex: 100,
                  cursor: "pointer",
                  width: 200,
                  height: 200,
                  objectFit: "contain",
                  left: img.left,
                  top: img.top - 30, // même ajustement
                }}
                onClick={(e) => collectSpecialImage(img.id, img.src, e)}
              />
            ))}
          </div>
        </div>
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
        <audio ref={audioRef} loop style={{ display: "none" }} />
        <a
          href="https://twitter.com/VotreCompteTwitter"
          target="_blank"
          rel="noopener noreferrer"
          id="twitter-logo"
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
        <style>{`
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
