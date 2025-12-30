import { Dimensions, Platform, StyleSheet } from "react-native";
import { themes } from "../global/themes";

const { width } = Dimensions.get("window");

const shadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
  },
  android: { elevation: 6 },
});

// Paleta alinhada com a Home (dark premium)
const COLORS = {
  bg: "#0B1220",
  card: "#111A2E",
  border: "rgba(255,255,255,0.06)",
  text: "#EAF0FF",
  muted: "rgba(234,240,255,0.70)",
  inputBg: "rgba(255,255,255,0.05)",
  inputBorder: "rgba(255,255,255,0.10)",
};

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  keyboard: {
    flexGrow: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
    paddingBottom: 18,
  },

  // Decor
  bgCircleOne: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 320,
    backgroundColor: "rgba(43, 224, 128, 0.10)",
    top: -140,
    left: -140,
  },
  bgCircleTwo: {
    position: "absolute",
    width: 380,
    height: 380,
    borderRadius: 380,
    backgroundColor: "rgba(43, 224, 128, 0.08)",
    bottom: -210,
    right: -210,
  },

  // Hero
  hero: {
    alignItems: "center",
    marginBottom: 16,
  },
  logoWrap: {
    width: 92,
    height: 92,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  logo: {
    width: 70,
    height: 70,
  },
  heroTitle: {
    marginTop: 14,
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: 0.2,
    textAlign: "center",
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: COLORS.muted,
    textAlign: "center",
    maxWidth: 320,
    lineHeight: 18,
  },

  // Card
  card: {
    alignSelf: "center",
    width: Math.min(width - 32, 420),
    borderRadius: 18,
    backgroundColor: COLORS.card,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...shadow,
  },

  // Inputs (override)
  boxInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 14,
    paddingHorizontal: 12,
    backgroundColor: COLORS.inputBg,
    marginBottom: 12,
  },
  titleInput: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "800",
    marginBottom: 6,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: 12,
  },

  // Error banner
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255, 107, 107, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.30)",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 12,
  },
  errorText: {
    flex: 1,
    color: "#FF6B6B",
    fontWeight: "900",
    fontSize: 12,
    lineHeight: 16,
  },

  // Button
  button: {
    marginTop: 6,
    backgroundColor: themes.colors.primary,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonText: {
    fontSize: 15,
    color: themes.colors.white,
    fontWeight: "900",
  },
  buttonLoadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  // Bottom row
  bottomRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 4,
  },
  bottomText: {
    fontSize: 13,
    color: COLORS.muted,
  },
  bottomLink: {
    fontSize: 13,
    color: themes.colors.primary,
    fontWeight: "900",
  },
});
