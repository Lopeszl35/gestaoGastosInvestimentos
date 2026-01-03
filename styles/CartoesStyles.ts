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

export const CartoesStyles = StyleSheet.create({
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

  topActionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    justifyContent: "flex-end",
  },
  btnGhost: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  btnGhostText: { color: "#EAF0FF", fontWeight: "900" },

  btnPrimary: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "#2BE080",
  },
  btnPrimaryText: { color: "#0B1220", fontWeight: "900" },

  monthRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  monthPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  monthText: { color: "#EAF0FF", fontWeight: "900" },

  cardsRow: { marginTop: 14 },
  cardWrap: { width: Math.min(340, width - 64), marginRight: 12 },

  creditCard: {
    borderRadius: 18,
    padding: 16,
    overflow: "hidden",
    ...shadow,
  },
  ccTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ccBrand: { color: "rgba(255,255,255,0.9)", fontWeight: "900" },
  ccNumLabel: { color: "rgba(255,255,255,0.7)", marginTop: 16, fontSize: 12 },
  ccNum: { color: "#fff", fontWeight: "900", marginTop: 6, letterSpacing: 1.8 },
  ccName: { color: "#fff", fontWeight: "900", marginTop: 12 },
  ccLimitLabel: { color: "rgba(255,255,255,0.7)", marginTop: 10, fontSize: 12 },

  barTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
    marginTop: 8,
  },
  barFill: { height: 6, borderRadius: 999, backgroundColor: "#2BE080" },
  ccBarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  ccBarText: {
    color: "rgba(255,255,255,0.85)",
    fontWeight: "900",
    fontSize: 12,
  },

  gridRow: { marginTop: 14, flexDirection: isWide ? "row" : "column", gap: 14 },
  colLeft: { flex: 1, gap: 14 },
  colRight: { flex: 1.3, gap: 14 },

  panel: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: "#0F1A2E",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    ...shadow,
  },
  panelTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  panelTitle: { color: "#EAF0FF", fontWeight: "900" },
  badgeTotal: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  badgeText: { color: "#EAF0FF", fontWeight: "900" },

  kvRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  k: { color: "rgba(234,240,255,0.65)" },
  v: { color: "#EAF0FF", fontWeight: "900" },
  vRed: { color: "#F87171", fontWeight: "900" },
  vGreen: { color: "#2BE080", fontWeight: "900" },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginTop: 12,
  },

  expenseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  expLeft: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    flex: 1,
    paddingRight: 10,
  },
  expIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  expTitle: { color: "#EAF0FF", fontWeight: "900" },
  expSub: { color: "rgba(234,240,255,0.60)", marginTop: 2, fontSize: 12 },
  expRight: { alignItems: "flex-end" },
  expValue: { color: "#F87171", fontWeight: "900" },
  expMini: { color: "rgba(234,240,255,0.55)", fontSize: 12, marginTop: 2 },

  pill: {
    marginTop: 4,
    alignSelf: "flex-start",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  pillText: { color: "#EAF0FF", fontWeight: "900", fontSize: 11 },
});
