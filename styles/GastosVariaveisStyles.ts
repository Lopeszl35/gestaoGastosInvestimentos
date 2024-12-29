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
    }
});
