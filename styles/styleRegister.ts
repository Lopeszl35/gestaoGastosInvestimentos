import { StyleSheet, Dimensions } from "react-native";
import { themes } from "../global/themes";

const { width } = Dimensions.get('window'); // Pega a largura da tela

export const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: themes.colors.background,
    padding: 20,
    marginTop: 60
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: themes.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: themes.colors.gray,
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
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: themes.colors.gray,
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  pickerContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: themes.colors.gray,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: themes.colors.white,
  },
  picker: {
    width: "100%",
    height: 50,
  },
  button: {
    width: width * 0.6,
    padding: 15,
    backgroundColor: themes.colors.primary,
    borderRadius: 20,
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px',
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
