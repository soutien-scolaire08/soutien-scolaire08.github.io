window.SSA = window.SSA || {};

SSA.config = {
  contact: {
    email: "ardennesoutienscolaire08@gmail.com",
    phone: "",
    whatsapp: ""
  },

  booking: {
    formEndpoint: "https://formsubmit.co/ajax/ardennesoutienscolaire08@gmail.com",
    freeLessonMinutes: 60,
    minDaysAhead: 1,
    closedDays: [0],
    slots: [
      "Matin (9 h – 12 h)",
      "Début d'après-midi (13 h – 16 h)",
      "Fin d'après-midi (16 h – 18 h)",
      "Soir (18 h – 20 h)"
    ]
  },

  prices: {
    levels: [
      { label: "Primaire (CP – CM2)", hour: 15 },
      { label: "Collège (6e – 3e)", hour: 17 },
      { label: "Lycée (2nde – Terminale)", hour: 20 },
      { label: "Études supérieures", hour: 24 }
    ],
    weeklyDiscount: [
      { lessons: 1, off: 0, label: "1 cours par semaine" },
      { lessons: 2, off: 1, label: "2 cours par semaine" },
      { lessons: 3, off: 2, label: "3 cours ou plus par semaine" }
    ]
  },

  legal: {
    nom: "Richard T.",
    statut: "Intervenant à domicile, employé directement par les familles (Cesu)",
    adresse: "Charleville-Mézières, Ardennes",
    telephone: "",
    hebergeur: "GitHub, Inc. (GitHub Pages), 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis",
    conservation: "12 mois après le dernier échange"
  },

  media: {
    video: "",
    poster: "",
    photos: [
      { src: "cours-1.jpg", alt: "Un répétiteur explique un exercice à un élève devant l'ordinateur", position: "75% center" },
      { src: "cours-2.jpg", alt: "Un adulte aide un enfant à faire ses devoirs à la maison", position: "center 30%" }
    ]
  }
};
