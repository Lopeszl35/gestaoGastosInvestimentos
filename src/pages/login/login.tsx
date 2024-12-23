import React, { useState } from "react";

import {
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import { style } from "./styles";
import Logo from '../../assets/logo.png';
import { MaterialIcons } from '@expo/vector-icons';
import { themes } from "../../global/themes";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [messageError, setMessageError] = useState('');
    const [boxError, setBoxError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function getLogin() {
        setLoading(true);
        try {
            if(!email || !password) {
                setBoxError(true);
                setMessageError('Preencha todos os campos');
                setLoading(false);
            }
           else if(!email.includes('@') || !email.includes('.com')) {
                setBoxError(true);
                setMessageError('Email inválido');
                setLoading(false);
           }
            else {
                setTimeout(() =>  {
                    setBoxError(false);
                    setMessageError('');
                    alert('Logado com sucesso!');
                    setLoading(false);
                }, 3000);
            } 
        } catch (error) {
            console.log("Erro ao logar: ", error);
            setBoxError(true);
            setMessageError('Erro ao logar');
        }
    }

    return (
        <View style={style.container}>
            <View style={style.boxTop}>
                <Image
                    source={Logo}
                    style={style.logo}
                    resizeMode="contain"
                />
                <Text style={style.text}>Gerencie suas finanças e conquiste seus objetivos!</Text>
            </View>

            <View style={style.boxMid}>
                <Text style={style.titleInput}>ENDEREÇO E-MAIL</Text>
                <View style={style.boxInput}>
                    <TextInput 
                        style={style.input}
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        placeholder="Digite seu e-mail"
                    />
                    <MaterialIcons
                        name="email"
                        size={20}
                        color={themes.colors.gray}
                    />
                </View>
                <Text style={style.titleInput}>SENHA</Text>
                <View style={style.boxInput}>
                    <TextInput 
                        style={style.input}
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        secureTextEntry={!showPassword}
                        placeholder="Digite sua senha"
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <MaterialIcons
                            name={showPassword ? "visibility" : "visibility-off"}
                            size={20}
                            color={themes.colors.gray}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {boxError && <Text style={style.errorText}>{messageError}</Text>}

            <View style={style.boxBottom}>
                <TouchableOpacity style={style.button} onPress={() => getLogin()}>
                    {loading ? 
                    <ActivityIndicator color={themes.colors.secondary} size={'small'}/> : 
                    <Text style={style.textButton}>ENTRAR</Text>}
                </TouchableOpacity>
            </View>
            <View style={style.textBottomCadastroContainer}>
                <Text style={style.textBottom}>Não possui uma conta? </Text> 
                <TouchableOpacity><Text style={{color: themes.colors.primary}}>Cadastre-se</Text></TouchableOpacity>
            </View>
        </View>
    );
}
