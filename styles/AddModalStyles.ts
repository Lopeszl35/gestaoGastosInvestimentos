import { StyleSheet, Dimensions } from 'react-native';
import { themes } from '../global/themes';

const { width } = Dimensions.get('window'); // Pega a largura da tela

export const AddModalStyles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        padding: 20,
        backgroundColor: themes.colors.white,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: themes.colors.gray,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: "column",
        gap: 10,
    },
    button: {
        flex: 1,
        backgroundColor: themes.colors.success,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: "center",
        marginHorizontal: 5,
    },
    buttonCancel: {
        flex: 1,
        backgroundColor: themes.colors.danger,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: "center",
        marginHorizontal: 5,
    },
    buttonText: {
        color: themes.colors.white,
        fontWeight: "bold",
    },
})