import { StyleSheet, Dimensions } from "react-native";
import { themes } from "../global/themes";

const { width, height } = Dimensions.get("window");

export const homeStyles = StyleSheet.create({
    navBar: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between", // Botão de menu à esquerda e "Bem-vindo" à direita
        backgroundColor: themes.colors.primary,
        padding: 10,
    },
    welcomeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    welcomeText: {
        color: themes.colors.white,
        fontSize: 14,
        fontWeight: "bold",
        marginRight: 5,
    },
    menuOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        height: height,
        width: width,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1,
    },
    sideMenu: {
        position: "absolute",
        top: 0,
        left: 0,
        height: height,
        width: width * 0.75,
        backgroundColor: themes.colors.black,
        padding: 20,
        zIndex: 2,
    },
    menuItem: {
        flexDirection: "row", // Ícone à direita do texto
        justifyContent: "flex-start",
        alignItems: "center",
        paddingVertical: 15,
    },
    menuText: {
        color: themes.colors.white,
        fontSize: 16,
        fontWeight: "bold",
    },
    menuTextActive: {
        color: themes.colors.blue,
        fontSize: 16,
        fontWeight: "bold",
    },
    menuButton: {
        alignItems: "center",
        justifyContent: "center",
    },
    subMenu: {
        paddingTop: 5,
        paddingLeft: 20, // Indenta para diferenciar do menu principal
    },
    subMenuItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingVertical: 10,
        paddingLeft: 5, // Adiciona mais indentação
    },
    subMenuText: {
        color: themes.colors.gray,
        fontSize: 14,
        fontFamily: "Arial",
    },

    subMenuIconActive: {
        color: themes.colors.blue,
    }
});

