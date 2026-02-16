
export const FontFamilies = {
  regular: "Inter-Regular",
  medium: "Inter-Medium",
  semibold: "Inter-SemiBold",
  bold: "Inter-Bold",
};

export const Typography = {
  // ===== HEADERS =====
  screenTitle: {
    fontFamily: FontFamilies.bold,
    fontSize: 36,
    lineHeight: 42,
    letterSpacing: -0.5,
    color: "#222",
    marginBottom: 40
  },

  sectionTitle: {
    fontFamily: FontFamilies.semibold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.3,
    color: "#333",
  },

  // ===== CARDS =====
  cardTitle: {
    fontFamily: FontFamilies.semibold,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.2,
    color: "#333",
  },

  cardSubtitle: {
    fontFamily: FontFamilies.regular,
    fontSize: 14,
    lineHeight: 18,
    color: "#666",
  },

  // ===== BODY =====
  body: {
    fontFamily: FontFamilies.regular,
    fontSize: 16,
    lineHeight: 22,
    color: "#444",
  },

  bodySmall: {
    fontFamily: FontFamilies.regular,
    fontSize: 13,
    lineHeight: 18,
    color: "#666",
  },

  // ===== META / UI =====
  label: {
    fontFamily: FontFamilies.medium,
    fontSize: 12,
    letterSpacing: 0.4,
    color: "#777",
  },

  caption: {
    fontFamily: FontFamilies.regular,
    fontSize: 11,
    lineHeight: 14,
    color: "#888",
  },

  buttonText: {
  fontFamily: FontFamilies.semibold,
  fontSize: 18,
  letterSpacing: 0.2,
  color: "#333",
},

  buttonLabel: {
  fontFamily: FontFamilies.semibold,
  fontSize: 18,
  letterSpacing: 0.2,
  color: "#333",
},

  // ===== NUMBERS (scores, tiers) =====
  statLarge: {
    fontFamily: FontFamilies.bold,
    fontSize: 28,
    letterSpacing: -0.3,
    color: "#333",
  },

  statMedium: {
    fontFamily: FontFamilies.semibold,
    fontSize: 18,
    letterSpacing: -0.2,
    color: "#333",
  },
  inputLetter: {
  fontFamily: FontFamilies.semibold,
  fontSize: 32,
  lineHeight: 38, // Explicit line height prevents clipping.
  letterSpacing: -0.5,
  color: "#222",
},
  inputLetterSmall: {
  fontFamily: FontFamilies.semibold,
  fontSize: 24,
  lineHeight: 38, // Explicit line height prevents clipping.
  letterSpacing: -0.5,
  color: "#222",
},
};
