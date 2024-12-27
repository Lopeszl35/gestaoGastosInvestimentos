import { StyleSheet, Dimensions } from "react-native";
import { themes } from "../global/themes";

const { width, height } = Dimensions.get("window"); // Pega a largura e altura da tela

export const homeStyles = StyleSheet.create({
    navBar: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: themes.colors.primary,
        padding: 10,
    },
    welcomeContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    welcomeText: {
        color: themes.colors.white,
        fontSize: 14,
        fontWeight: "bold",
        marginRight: 5,
    },
    menuContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    menuOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        height: height,
        width: width,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo transparente
        zIndex: 1, // Garante que o overlay fique acima
    },
    sideMenu: {
        position: "absolute",
        top: 0,
        left: 0,
        height: height,
        width: width * 0.75, // 75% da largura da tela
        backgroundColor: themes.colors.black, // Fundo preto
        padding: 20,
        zIndex: 2, // Fica acima do overlay
    },
    menuItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: themes.colors.lightGray,
    },
    menuText: {
        color: themes.colors.white,
        fontSize: 16,
        fontWeight: "bold",
    },
});
