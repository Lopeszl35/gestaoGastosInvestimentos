import { Dimensions, StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const style = StyleSheet.create({
    container : {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    boxTop : {
        height:Dimensions.get('window').height / 3,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    boxMid : {
        height:Dimensions.get('window').height / 4,
        width: '100%',
        paddingHorizontal: 37
    },
    boxBottom : {
        height:Dimensions.get('window').height / 3,
        width: '100%',
        alignItems: 'center',
    },
    logo : {
        width: 80,
        height: 80
    },
    text : {
        fontWeight: 'bold',
        marginTop: 40,
        fontSize: 18
    },
    titleInput : {
        marginLeft: 5,
        marginTop: 20,
        color: themes.colors.gray
    },
    boxInput : {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderRadius: 40,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        backgroundColor: themes.colors.lightGray,
        borderColor: themes.colors.lightGray
    },
    input : {
        height: '100%',
        width: '90%',
        borderRadius: 40,
        paddingLeft: 5
    }, 
    button : {
        width: '50%',
        height: 40,
        marginTop: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40,
        backgroundColor: themes.colors.primary,
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
    },
    textButton : {
        color: themes.colors.secondary,
        fontWeight: 'bold',
    },
    textBottom : {
        fontSize: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textBottomCadastroContainer : {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
})