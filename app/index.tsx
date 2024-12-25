import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from "react-native";
import { style } from "../styles/styles";
import Logo from "../assets/images/logo.png";
import { MaterialIcons } from "@expo/vector-icons";
import { themes } from "../global/themes";
import { Link } from "expo-router";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messageError, setMessageError] = useState<string>("");
  const [boxError, setBoxError] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  async function getLogin() {
    setLoading(true);
    try {
      if (!email || !password) {
        setBoxError(true);
        setMessageError("Preencha todos os campos");
        setLoading(false);
      } else if (!email.includes("@") || !email.includes(".com")) {
        setBoxError(true);
        setMessageError("Email inválido");
        setLoading(false);
      } else {
        setTimeout(() => {
          setBoxError(false);
          setMessageError("");
          Alert.alert("Logado com sucesso!");
          setLoading(false);
        }, 3000);
      }
    } catch (error) {
      console.log("Erro ao logar: ", error);
      setBoxError(true);
      setMessageError("Erro ao logar");
      setLoading(false);
    }
  }

  return (
    <View style={style.container}>
      <View style={style.boxTop}>
        <Image source={Logo} style={style.logo} resizeMode="contain" />
        <Text style={style.text}>
          Gerencie suas finanças e conquiste seus objetivos!
        </Text>
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
        <TouchableOpacity style={style.button} onPress={getLogin}>
          {loading ? (
            <ActivityIndicator
              color={themes.colors.secondary}
              size={"small"}
            />
          ) : (
            <Text style={style.textButton}>ENTRAR</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={style.textBottomCadastroContainer}>
        <Text style={style.textBottom}>Não possui uma conta? </Text>
        <Link href="/register">
          <Text style={{ color: themes.colors.primary }}>Cadastre-se</Text>
        </Link>
      </View>
    </View>
  );
};

export default Login;
