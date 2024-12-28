import { StyleSheet, Dimensions } from "react-native";
import { themes } from "../global/themes";

const { width, height } = Dimensions.get("window");

export const homeStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themes.colors.background, // Fundo principal
    },
    // Caixa de resumo do saldo e perfil
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
    // Estilo para contêiner de gráficos
    chartContainerPizza: {
        backgroundColor: "#ffffff",
        padding: 5,
        marginHorizontal: 15,
        marginVertical: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 7,
    },
    chartContainerBarra: {
        backgroundColor: "#ffffff",
        padding: 14,
        marginHorizontal: 15,
        marginVertical: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 7,
    },
    sectionTitle: {
        paddingHorizontal: 10,
        fontSize: 16,
        fontWeight: "bold",
        color: themes.colors.black,
        marginBottom: 10,
    },
    // Estilo para metas financeiras
    goalsContainer: {
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
    goalItem: {
        marginBottom: 10,
    },
    goalText: {
        fontSize: 16,
        fontWeight: "bold",
        color: themes.colors.black,
    },
    goalProgress: {
        fontSize: 14,
        color: themes.colors.gray,
    },
});
