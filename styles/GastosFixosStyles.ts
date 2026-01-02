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

export const GastosFixosStyles = StyleSheet.create({
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

  cardsTop: {
    marginTop: 14,
    flexDirection: isWide ? "row" : "column",
    gap: 12,
  },
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
    fontSize: 22,
    marginTop: 6,
  },
  metricSub: { color: "rgba(234,240,255,0.50)", marginTop: 4, fontSize: 12 },

  panel: {
    marginTop: 12,
    borderRadius: 18,
    padding: 14,
    backgroundColor: "#0F1A2E",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    ...shadow,
  },
  panelTitle: { color: "#EAF0FF", fontWeight: "900" },

  catRow: { marginTop: 12, flexDirection: isWide ? "row" : "column", gap: 10 },
  catPill: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  catName: { color: "rgba(234,240,255,0.60)", fontWeight: "800", fontSize: 12 },
  catValue: { color: "#EAF0FF", fontWeight: "900", marginTop: 6 },

  grid: { marginTop: 12, flexDirection: "row", flexWrap: "wrap", gap: 12 },
  item: {
    width: isWide ? "32%" : "100%",
    borderRadius: 18,
    overflow: "hidden",
    ...shadow,
  },
  itemInner: { padding: 14 },
  itemTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 99,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  itemTitle: { color: "#EAF0FF", fontWeight: "900", marginTop: 10 },
  tag: {
    marginTop: 4,
    alignSelf: "flex-start",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  tagText: { color: "rgba(234,240,255,0.85)", fontWeight: "900", fontSize: 11 },

  itemValue: {
    color: "#EAF0FF",
    fontWeight: "900",
    fontSize: 20,
    marginTop: 10,
  },
  itemDue: { color: "rgba(234,240,255,0.55)", marginTop: 4, fontSize: 12 },

  switch: {
    width: 46,
    height: 26,
    borderRadius: 99,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
  },
  knobOn: {
    width: 22,
    height: 22,
    borderRadius: 99,
    backgroundColor: "#2BE080",
    marginLeft: 22,
  },
});
