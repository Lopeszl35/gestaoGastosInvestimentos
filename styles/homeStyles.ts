import { StyleSheet, Platform } from "react-native";

const shadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  android: { elevation: 10 },
});

export const homeColors = {
  bg: "#0B1220",
  bg2: "#0A0F1A",
  card: "rgba(255,255,255,0.06)",
  card2: "rgba(255,255,255,0.08)",
  stroke: "rgba(255,255,255,0.10)",
  text: "#EAF0FF",
  text2: "rgba(234,240,255,0.72)",
  text3: "rgba(234,240,255,0.55)",
  green: "#22C55E",
  red: "#F87171",
  blue: "#38BDF8",
  yellow: "#FBBF24",
};

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: homeColors.bg,
  },
  scrollContent: {
    paddingBottom: 18,
  },

  errorText: {
    marginTop: 10,
    marginHorizontal: 16,
    color: homeColors.red,
    fontWeight: "700",
  },

  grid2Cols: {
    marginTop: 12,
    paddingHorizontal: 16,
    gap: 12,
  },

  card: {
    backgroundColor: homeColors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: homeColors.stroke,
    padding: 14,
    ...shadow,
  },

  cardTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 10,
  },
  cardTitle: {
    color: homeColors.text,
    fontSize: 16,
    fontWeight: "900",
  },
  cardSubtitleLink: {
    color: homeColors.text2,
    fontSize: 12,
    fontWeight: "700",
  },

  // badge de valor positivo/negativo
  delta: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "800",
  },

  quickActionsGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
},

quickAction: {
  width: "48%",              // força 2 colunas
  borderRadius: 18,
  padding: 14,
  marginBottom: 12,          // espaçamento vertical
  backgroundColor: "rgba(255,255,255,0.06)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.10)",
},

});

