import { StyleSheet, Dimensions } from "react-native";
import { themes } from "@/global/themes";

const { width } = Dimensions.get("window");

export const stylesGastosVariaveis = StyleSheet.create({
    titleContainer: {
        marginVertical: 10,
        paddingHorizontal: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: themes.colors.black,
    },
    summaryBox: {
        backgroundColor: "#ffffff",
        padding: 15,
        marginHorizontal: 15,
        marginVertical: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    summaryText: {
        fontSize: 18,
        fontWeight: "bold",
        color: themes.colors.black,
        marginBottom: 5,
    },
    summarySubText: {
        fontSize: 14,
        color: themes.colors.gray,
    },
    settingsContainer: {
        width: "100%",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    settingsIcon: {
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        backgroundColor: themes.colors.white,
        borderRadius: 30, // Torna o ícone redondo
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3, // Sombra no Android
    },
    alertText: {
        fontSize: 16,
        fontWeight: "bold",
        color: themes.colors.alertExcedido,
    },
    chartContainer: {
        marginVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: themes.colors.white,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: themes.colors.primary,
        marginBottom: 10,
    },
    // Estilo dos cards de resumo
    cardsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 15,
    },
    card: {
        width: "48%",
        backgroundColor: themes.colors.white,
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardExceeded: {
        backgroundColor: themes.colors.alert, // Vermelho para alertas de gastos excedidos
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: themes.colors.primary,
        marginBottom: 5,
    },
    cardDetail: {
        fontSize: 14,
        color: themes.colors.gray,
        marginBottom: 5,
    },
    cardAlert: {
        fontSize: 14,
        fontWeight: "bold",
        color: themes.colors.white,
    },
    addButtonContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: width,
    },
    addButton: {
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
        paddingVertical: 30,
        paddingRight: 40,
    },
    optionIcon: {
        position: "absolute",
        width: 50,
        height: 50,
        backgroundColor: "#ffffff",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    overlay: {
        position: "absolute",
        zIndex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        top: "50%",
        left: "55%",
        transform: [{ translateX: -25 }, { translateY: -25 }],
    },
});
