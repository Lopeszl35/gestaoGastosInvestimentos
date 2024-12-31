import { StyleSheet, Dimensions } from 'react-native';
import { themes } from '../global/themes';

const { width } = Dimensions.get('window'); // Pega a largura da tela

export const ModaGlobalStyles = StyleSheet.create({
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
    modalMessage: {
        fontSize: 16,
        fontWeight: "normal",
        marginBottom: 10,
        color: themes.colors.gray
    },
    inputContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%',

    },
    inputLabel: {
        fontSize: 16,
        marginBottom: 5,
        color: themes.colors.gray,
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        borderColor: themes.colors.gray,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        width: '100%',
    },
    dateInput: {
        height: 40,
        borderColor: themes.colors.gray,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: "column",
        gap: 10,
    },
    buttonSucess: {
        borderRadius: 10,
        backgroundColor: themes.colors.success,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },
    buttonCancelar: {
        borderRadius: 10,
        backgroundColor: themes.colors.danger,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },
    buttonText: {
        alignItems: "center",
        fontWeight: "bold",
        color: themes.colors.white,
        justifyContent: "center",
    }
})