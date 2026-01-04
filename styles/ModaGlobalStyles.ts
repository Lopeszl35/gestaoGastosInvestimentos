import { StyleSheet, Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");

const shadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  android: { elevation: 8 },
});


export const ModaGlobalStyles = StyleSheet.create({
  // Overlay
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.60)",
    padding: 16,
  },

  // Card
  modalContent: {
    width: Math.min(width - 32, 420),
    borderRadius: 18,
    padding: 16,
    backgroundColor: "#111A2E",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    ...shadow,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  closeButton: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#EAF0FF",
  },

  modalMessage: {
    color: "rgba(234,240,255,0.75)",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },

  // Inputs
  inputContainer: {
    marginBottom: 12,
  },

  inputLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "rgba(234,240,255,0.75)",
    marginBottom: 6,
  },

  input: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    color: "#EAF0FF",
  },

  dateInput: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  // Buttons
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },

  buttonSucess: {
    flex: 1,
    backgroundColor: "#2BE080",
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonCancelar: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonDanger: {
    flex: 1,
    backgroundColor: "#FF6B6B",
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonDisabled: {
    opacity: 0.55,
  },

  buttonText: {
    fontWeight: "900",
    color: "#0B1220",
  },

  buttonTextLight: {
    fontWeight: "900",
    color: "#EAF0FF",
  },
    // ==========================
  // Textos auxiliares / mensagens
  // ==========================
  modalMessageStrong: {
    color: "#EAF0FF",
    fontWeight: "900",
  },

  helperText: {
    marginTop: 6,
    fontSize: 12,
    color: "rgba(234,240,255,0.55)",
    fontWeight: "700",
    lineHeight: 16,
  },

  errorText: {
    marginTop: 6,
    fontSize: 12,
    color: "#F87171",
    fontWeight: "900",
    lineHeight: 16,
  },

  // ==========================
  // Segment (forma de pagamento)
  // ==========================
  segmentRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },

  segmentItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  segmentItemActive: {
    backgroundColor: "rgba(43,224,128,0.14)", // verde suave
    borderColor: "rgba(43,224,128,0.55)",
  },

  segmentText: {
    color: "rgba(234,240,255,0.75)",
    fontWeight: "900",
    fontSize: 12,
  },

  segmentTextActive: {
    color: "#2BE080",
  },

  // ==========================
  // Lista de seleção de cartões
  // ==========================
  selectList: {
    marginTop: 10,
    gap: 10,
  },

  selectItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  selectItemActive: {
    backgroundColor: "rgba(234,240,255,0.06)",
    borderColor: "rgba(234,240,255,0.22)",
  },

  selectItemTitle: {
    color: "#EAF0FF",
    fontWeight: "900",
  },

  selectItemSub: {
    marginTop: 4,
    color: "rgba(234,240,255,0.60)",
    fontSize: 12,
    fontWeight: "800",
  },

});

