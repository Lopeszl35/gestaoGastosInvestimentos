import { StyleSheet, Dimensions } from "react-native";
import { themes } from "@/global/themes";

const { width } = Dimensions.get("window");

export const stylesScroolNav = StyleSheet.create({
    container: {
        width: width,
        paddingVertical: 5,
        backgroundColor: themes.colors.black, // Fundo da barra de navegação
    },
    item: {
        paddingHorizontal: 20,
        paddingVertical: 5,
        marginHorizontal: 3,
        backgroundColor: themes.colors.white, // Fundo branco para os itens
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // Sombra no Android
    },
    itemText: {
        color: themes.colors.black, // Cor do texto
        fontWeight: "bold",
        fontSize: 14,
    },
    addButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginHorizontal: 5,
        backgroundColor: themes.colors.success, // Botão de cor verde
        borderRadius: 30, // Botão circular
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // Sombra no Android
    },
});
