import { StyleSheet, Dimensions } from "react-native";
import { themes } from "../global/themes";

const { width, height } = Dimensions.get("window"); // Pega a largura da tela

export const styleNavBar = StyleSheet.create({
    navBar: {
        width: width,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between", // Botão de menu à esquerda e usuário à direita
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
    // Overlay para o fundo quando o menu lateral é aberto
    menuOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        height: height,
        width: width,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Overlay transparente
        zIndex: 1,
    },
    // Estilo do menu lateral
    sideMenu: {
        position: "absolute",
        top: 0,
        left: 0,
        height: height,
        width: width * 0.75,
        backgroundColor: "#f4f4f4", // Cor de fundo clara
        padding: 10,
        zIndex: 2,
        borderTopRightRadius: 20, // Bordas arredondadas
        borderBottomRightRadius: 20,
        shadowColor: "#000", // Sombra para destacar o menu
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5, // Sombra no Android
    },
    // Estilo dos itens do menu lateral
    menuItem: {
        flexDirection: "row", // Ícone à direita do texto
        justifyContent: "flex-start",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 10, // Bordas arredondadas nos itens
        backgroundColor: themes.colors.white, // Fundo branco para os itens
        marginBottom: 10,
        shadowColor: "#000", // Sombra nos itens
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    menuItemActive: {
        flexDirection: "row", // Ícone à direita do texto
        justifyContent: "flex-start",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 10, // Bordas arredondadas nos itens
        backgroundColor: themes.colors.gray, // Fundo branco para os itens
        marginBottom: 10,
        shadowColor: "#000", // Sombra nos itens
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    menuText: {
        color: themes.colors.black, // Texto preto para contraste
        fontSize: 16,
        fontWeight: "600",
    },
    menuTextActive: {
        color: themes.colors.white, // Destaque para o item ativo
        fontSize: 16,
        fontWeight: "bold",
    },
    menuButton: {
        alignItems: "center",
        justifyContent: "center",
    },
    // Estilo do submenu
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
        borderRadius: 8,
        backgroundColor: "#eaeaea", // Fundo claro para submenus
        marginBottom: 8,
    },
    subMenuText: {
        color: themes.colors.gray,
        fontSize: 14,
        fontFamily: "Arial",
    },
    subMenuIconActive: {
        color: themes.colors.white,
    },
})