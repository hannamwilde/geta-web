const sv = {
  general: {
    readMore: "Läs mer",
    contact: "Kontakta oss",
  },
  errorPages: {
    notFoundTitle: "Sidan kunde inte hittas",
    notFoundBody:
      "Länken kan vara felstavad, eller så har sidan flyttat eller tagits bort.",
    notFoundCta: "Till startsidan",
    errorTitle: "Något gick fel",
    errorBody:
      "Ett oväntat fel uppstod. Försök igen — hjälper det inte hör gärna av dig.",
    errorRetry: "Försök igen",
  },
  modal: {
    close: "Stäng",
    errorMsg: "Något gick fel. Försök igen eller kontakta oss direkt.",
    sending: "Skickar…",
    successFallback: "Tack!",
    submit: "Skicka meddelande",
    fieldName: "Namn",
    fieldEmail: "E-post",
    fieldCompany: "Företag",
    fieldTopic: "Ämne",
    fieldMessage: "Meddelande",
    topicPlaceholder: "Välj ett ämne…",
    phName: "Ditt namn",
    phEmail: "din@email.se",
    phCompany: "Företagsnamn",
    phMessageContact: "Berätta vad du behöver hjälp med…",
    phMessageBook: "Berätta gärna lite om dig och ditt projekt…",
  },
} as const;

export default sv;
