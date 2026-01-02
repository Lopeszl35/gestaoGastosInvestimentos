import { StyleSheet, Platform, Dimensions } from "react-native";
const { width } = Dimensions.get("window");
const isWide = width >= 900;

const shadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  android: { elevation: 10 },
});

export const FinanciamentosStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0B1220" },
  container: { flex: 1, padding: 16, paddingTop: 10 },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  headerLeft: { flex: 1 },
  h1: { color: "#EAF0FF", fontSize: 22, fontWeight: "900" },
  h2: { color: "rgba(234,240,255,0.65)", marginTop: 4 },

  headerRight: { width: isWide ? 380 : 160, gap: 10, alignItems: "flex-end" },
  search: {
    width: "100%",
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#EAF0FF",
  },
  btnPrimary: {
    marginTop: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "#2BE080",
  },
  btnPrimaryText: { color: "#0B1220", fontWeight: "900" },

  metrics: { marginTop: 14, flexDirection: isWide ? "row" : "column", gap: 12 },
  metric: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    backgroundColor: "#0F1A2E",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    ...shadow,
  },
  metricLabel: {
    color: "rgba(234,240,255,0.60)",
    fontWeight: "800",
    fontSize: 12,
  },
  metricValue: {
    color: "#EAF0FF",
    fontWeight: "900",
    fontSize: 20,
    marginTop: 6,
  },

  gridRow: { marginTop: 14, flexDirection: isWide ? "row" : "column", gap: 14 },
  left: { flex: 1.4, gap: 12 },
  right: { flex: 1, gap: 12 },

  sectionTitle: { color: "#EAF0FF", fontWeight: "900", marginTop: 4 },

  loanCard: {
    borderRadius: 18,
    backgroundColor: "#0F1A2E",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    padding: 14,
    ...shadow,
  },
  loanAccent: { height: 4, borderRadius: 999, marginBottom: 12 },

  loanTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  loanTitle: { color: "#EAF0FF", fontWeight: "900" },
  loanMeta: { color: "rgba(234,240,255,0.60)", fontSize: 12, marginTop: 3 },

  progressLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  progressLabel: { color: "rgba(234,240,255,0.55)", fontSize: 12 },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.10)",
    marginTop: 8,
  },
  progressFill: { height: 6, borderRadius: 999, backgroundColor: "#2BE080" },

  kvRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  k: { color: "rgba(234,240,255,0.60)", fontSize: 12 },
  vGreen: { color: "#2BE080", fontWeight: "900" },
  v: { color: "#EAF0FF", fontWeight: "900" },

  panel: {
    borderRadius: 18,
    backgroundColor: "#0F1A2E",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    padding: 14,
    ...shadow,
  },
  panelTitle: { color: "#EAF0FF", fontWeight: "900" },
  panelSub: { color: "rgba(234,240,255,0.55)", fontSize: 12, marginTop: 4 },

  inputRow: {
    marginTop: 12,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#EAF0FF",
  },
  btnCalc: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "#2BE080",
  },
  btnCalcText: { color: "#0B1220", fontWeight: "900" },

  tableRow: { flexDirection: "row", gap: 10, marginTop: 12 },
  tableBox: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  tableK: { color: "rgba(234,240,255,0.55)", fontSize: 12, fontWeight: "800" },
  tableV: { color: "#EAF0FF", fontWeight: "900", marginTop: 6 },
  tableVRed: { color: "#F87171", fontWeight: "900", marginTop: 6 },
  tableVGreen: { color: "#2BE080", fontWeight: "900", marginTop: 6 },
});
