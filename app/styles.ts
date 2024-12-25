import { StyleSheet, Dimensions } from 'react-native';
import { themes } from "../global/themes";

const { width } = Dimensions.get('window'); // Pega a largura da tela

export const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themes.colors.background,
        padding: 20,
        justifyContent: 'center',
    },
    boxTop: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    text: {
        fontSize: 18,
        color: themes.colors.primary,
        fontWeight: 'bold',
    },
    boxMid: {
        marginBottom: 20,
    },
    titleInput: {
        fontSize: 14,
        color: themes.colors.gray,
        marginBottom: 5,
    },
    boxInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: themes.colors.gray,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: themes.colors.text,
    },
    boxBottom: {
        marginVertical: 20,
    },
    button: {
        backgroundColor: themes.colors.primary,
        paddingVertical: 12,
        borderRadius: 20,
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px',
        alignItems: 'center',
        justifyContent: 'center',
        width: width * 0.9, // 90% da largura da tela
        alignSelf: 'center', // Centraliza o botão horizontalmente
    },
    textButton: {
        fontSize: 16,
        color: themes.colors.white,
        fontWeight: 'bold',
    },
    textBottomCadastroContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    textBottom: {
        fontSize: 14,
        color: themes.colors.gray,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginVertical: 10,
        textAlign: 'center',
    },
});
