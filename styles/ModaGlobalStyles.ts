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

/**
 * 📍 Arquivo: styles/ModaGlobalStyles.ts
 * Estilos globais para modais, alinhados ao padrão premium/dark da Home.
 */
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

  helperText: {
    marginTop: 2,
    fontSize: 12,
    color: "rgba(234,240,255,0.55)",
  },
});