// m100Rows.js

export const M100_ROWS = [
  { code: 1001, label: "Capital social ou dotation" },
  { code: 1002, label: "Primes liées au capital social" },
  { code: 1003, label: "Réserves (hors écarts de réévaluation et d'évaluation)" },
  { code: 1004, label: "Report à nouveau créditeur" },
  { code: 1005, label: "Provisions réglementées" },
  { code: 1006, label: "Résultat net bénéficiaire du dernier exercice clos (net d'impôts et  de dividendes à prévoir)" },
  { code: 1007, label: "Résultats bénéficiaires arrêtés à des dates intermédiaires" },

  { code: 1008, label: "SOUS TOTAL (1001 à 1007)", calculated: true },

  { code: 1009, label: "Actions propres rachetées" },
  { code: 1010, label: "Report à nouveau débiteur" },
  { code: 1011, label: "Résultats déficitaires en instance d'affectation" },
  { code: 1012, label: "Résultat semestriel débiteur" },
  { code: 1013, label: "Provisions complémentaires demandées par la Commission bancaire" },
  { code: 1014, label: "Actifs incorporels nets d'amortissements et de provisions constituant des non valeurs (écarts d'acquisition…..)" },
  { code: 1015, label: "50% du montant des participations et autres créances assimilables à des fonds propres détenues dans d'autres banques et établissements financiers" },
  { code: 1016, label: "Dépassements des limites en matière de participations" },

  { code: 1017, label: "SOUS TOTAL (1009 à 1016)", calculated: true },
  { code: 1018, label: "TOTAL DES FONDS PROPRES DE BASE (1008 - 1017)", calculated: true },

  { code: 1019, label: "50% écarts de réévaluation" },
  { code: 1020, label: "50% des plus values latentes découlant de l’évaluation à juste valeur des actifs disponibles à la vente " },
  { code: 1021, label: "Provisions pour risques bancaires généraux, dans la limite de 1,25% des actifs pondérés du risque de crédit" },
  { code: 1022, label: "Titres participatifs et autres titres à durée indéterminée" },
  { code: 1023, label: "Titres article 10 tiret 5 du règlement n°14-01 du 16/02/2014" },
  { code: 1024, label: "Titres subordonnés article 10 tiret 6 du règlement n°14-01 du 16/02/2014" },

  { code: 1025, label: "TOTAL DES FONDS PROPRES COMPLEMENTAIRES (1019 à 1024)", calculated: true },

  { code: 1026, label: "50% du montant des participations et autres créances assimilables à des fonds propres détenues dans d'autres banques et établissements financiers" },
  { code: 1027, label: "Part des titres subordonnés dépassant la limite des 50% des fonds propres de base" },
  { code: 1028, label: "TOTAL DES FONDS PROPRES COMPLEMENTAIRES AVANT LIMITE GLOBALE", calculated: true },

  { code: 1029, label: "PART DES FONDS PROPRES COMPLEMENTAIRES APRES LIMITE GLOBALE", calculated: true },
  { code: 1030, label: "TOTAL FONDS PROPRES REGLEMENTAIRES (C+H)", calculated: true },
];
