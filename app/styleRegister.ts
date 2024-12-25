import { StyleSheet } from "react-native";
import { themes } from "../global/themes";

export const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: themes.colors.background,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: themes.colors.primary,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: themes.colors.gray,
    borderRadius: 8,
    backgroundColor: themes.colors.white,
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: themes.colors.primary,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  textButton: {
    color: themes.colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: themes.colors.error,
    fontSize: 14,
    marginBottom: 10,
  },
  textBottomCadastroContainer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },
  textBottom: {
    fontSize: 14,
    color: themes.colors.gray,
  },
});
