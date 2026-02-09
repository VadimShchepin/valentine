import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { CRYING_GIFS, SUCCESS_GIF, KISSING_GIFS, REJECTION_PHRASES } from "./constants";

// Custom styles for the floating animation
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes floatUp {
    0% { transform: translateY(0) scale(0.5); opacity: 0; }
    10% { opacity: 0.7; }
    90% { opacity: 0.7; }
    100% { transform: translateY(-60vh) scale(1.2); opacity: 0; }
  }
  .floating-heart {
    position: absolute;
    bottom: -50px;
    animation-name: floatUp;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    z-index: 0;
    pointer-events: none;
  }
`;
document.head.appendChild(styleSheet);

const FloatingHearts = () => {
  const [hearts, setHearts] = useState<Array<{ id: number; left: number; duration: number; delay: number; emoji: string }>>([]);

  useEffect(() => {
    const emojis = ["❤️", "🌹", "💖", "🌸", "💗", "🌺"];
    const newHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 6 + Math.random() * 8, // 6-14s duration for a gentle float
      delay: Math.random() * -15, // Negative delay to start mid-animation
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="floating-heart text-3xl md:text-5xl opacity-50 filter blur-[0.5px]"
          style={{
            left: `${heart.left}%`,
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`,
          }}
        >
          {heart.emoji}
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [noPosIndex, setNoPosIndex] = useState(-1);

  // Predefined positions around the screen — visible, playful, catchable
  const noButtonPositions = [
    { top: "10%", left: "75%" },
    { top: "80%", left: "15%" },
    { top: "15%", left: "20%" },
    { top: "75%", left: "70%" },
    { top: "45%", left: "85%" },
    { top: "85%", left: "45%" },
    { top: "10%", left: "45%" },
    { top: "50%", left: "10%" },
    { top: "30%", left: "70%" },
    { top: "70%", left: "25%" },
  ];

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const moveNoButton = () => {
    setNoPosIndex((prev) => {
      let next = Math.floor(Math.random() * noButtonPositions.length);
      while (next === prev) {
        next = Math.floor(Math.random() * noButtonPositions.length);
      }
      return next;
    });
  };

  const handleNoClick = () => {
    const newCount = noCount + 1;
    setNoCount(newCount);

    moveNoButton();
  };

  const handleNoHover = () => {
    // After 5 clicks, also dodge on hover — truly uncatchable
    if (noCount > 5) {
      moveNoButton();
    }
  };


  const getRejectionPhrase = () => {
    if (noCount === 0) return "Пожалуйста, не говори нет 🥺😢💔";
    return REJECTION_PHRASES[Math.min(noCount, REJECTION_PHRASES.length - 1)];
  };

  const getCryingGif = () => {
    return CRYING_GIFS[noCount % CRYING_GIFS.length];
  };

  if (yesPressed) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-pink-100 overflow-hidden relative">
        <Confetti width={windowSize.width} height={windowSize.height} />
        <FloatingHearts />
        
        {/* Floating Kissing GIFs background decoration */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {KISSING_GIFS.map((src, index) => (
            <img
              key={index}
              src={src}
              alt="kissing"
              className="absolute w-56 h-56 object-cover rounded-full shadow-xl border-4 border-pink-400 animate-bounce"
              style={{
                top: `${(index + 1) * 20}%`,
                left: index % 2 === 0 ? "10%" : "80%",
                animationDelay: `${index * 0.5}s`
              }}
            />
          ))}
        </div>

        <div className="z-20 flex flex-col items-center text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl mx-4">
          <img 
            src={SUCCESS_GIF} 
            alt="Success" 
            className="rounded-lg shadow-lg mb-8 max-w-[300px] md:max-w-md w-full"
          />
          <h1 className="text-4xl md:text-6xl font-extrabold text-pink-600 animate-pulse mb-4">
            УРА! Я знал! ❤️
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 font-medium">
            Готовься к лучшему Дню Валентина!
          </p>
        </div>
      </div>
    );
  }

  // Calculate Yes button size
  // Base size 1rem (text-base) * scale factor
  const yesButtonSize = noCount * 20 + 16;
  
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gradient-to-br from-pink-50 to-red-100 overflow-hidden selection:bg-pink-200 relative">
      <FloatingHearts />
      
      <div className="flex flex-col items-center gap-6 w-full max-w-4xl px-4 relative z-10">
        
        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-center text-pink-600 drop-shadow-sm font-serif">
          Будешь моей Валентинкой?
        </h1>

        {/* GIF Container */}
        <div className="w-full flex justify-center h-[200px] sm:h-[300px]">
          <img
            src={getCryingGif()}
            alt="Reaction"
            className="h-full object-contain rounded-xl shadow-xl transition-all duration-300 hover:scale-105"
          />
        </div>

        {/* Dynamic Rejection Text */}
        <div className="h-8 flex items-center justify-center">
          <p className="text-xl md:text-2xl text-red-500 font-medium text-center animate-pulse">
            {getRejectionPhrase()}
          </p>
        </div>

        {/* Buttons Container */}
        <div className="flex flex-wrap justify-center items-center gap-4 w-full min-h-[100px]">

          {/* Yes Button */}
          <button
            className={`bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full transition-all duration-150 ease-in-out shadow-lg z-30`}
            style={{
              fontSize: yesButtonSize,
              padding: 'clamp(8px, 1em, 100px) clamp(16px, 2em, 200px)',
              lineHeight: 1.2
            }}
            onClick={() => setYesPressed(true)}
          >
            Да ❤️
          </button>

          {/* No Button — inline at start, then jumps around */}
          {noPosIndex === -1 && (
            <button
              onClick={handleNoClick}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 z-10 whitespace-nowrap"
            >
              Нет 💔
            </button>
          )}
        </div>
      </div>

      {/* Floating No button — jumps around the whole screen, behind Yes */}
      {noPosIndex >= 0 && (
        <button
          onClick={handleNoClick}
          onMouseEnter={handleNoHover}
          onTouchStart={(e) => { e.preventDefault(); moveNoButton(); }}
          className="fixed bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 z-20 whitespace-nowrap"
          style={{
            top: noButtonPositions[noPosIndex].top,
            left: noButtonPositions[noPosIndex].left,
          }}
        >
          Нет 💔
        </button>
      )}

      <div className="absolute bottom-4 text-pink-300 text-sm z-10">
        Сделано с ❤️ для тебя
      </div>
    </div>
  );
}