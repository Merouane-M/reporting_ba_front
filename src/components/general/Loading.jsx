import { useState, useEffect } from 'react';

const Loading = () => {
  const sentences = [
    "Chargement des pixels magiques...",
    "Le serveur fait une pause café...",
    "Attendez, on réveille les données...",
    "PS2 loading vibes activées...",
    "Ne pas éteindre, magie en cours...",
    "Chargement rétro en cours...",
    "Les bits dansent la samba...",
    "Patience, les elfes travaillent...",
    "Données en train de se coiffer...",
    "Chargement quantique en cours...",
  ];

  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.floor(Math.random() * sentences.length)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(Math.floor(Math.random() * sentences.length));
    }, 2000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center p-6">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sofiblue"></div>
      <span className="ml-2 text-sofiblue font-bold transition-opacity duration-500">
        {sentences[currentIndex]}
      </span>
    </div>
  );
};

export default Loading;