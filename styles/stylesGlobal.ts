import { StyleSheet } from 'react-native';
import { themes } from '../global/themes';

export const stylesGlobal = StyleSheet.create({
    logo: {
        width: 100,
        height: 100,
        marginBottom: 10,
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
    textButton: {
        fontSize: 16,
        color: themes.colors.white,
        fontWeight: 'bold',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: themes.colors.gray,
    },
})