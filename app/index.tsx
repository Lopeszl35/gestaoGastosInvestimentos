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
import { style } from "../styles/stylesIndex";
import Logo from "../assets/images/logo.png";
import { MaterialIcons } from "@expo/vector-icons";
import { themes } from "../global/themes";
import { Link, useRouter } from "expo-router";
import { stylesGlobal } from "@/styles/stylesGlobal";
import { useTogglePasswordVisibility } from "@/hooks/useTogglePasswordVisibility";
import { loginUser } from "@/services/userServices";
import { useUser } from "@/context/UserContext";


const Login: React.FC = () => {
  const router = useRouter();
  const { setUser } = useUser();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messageError, setMessageError] = useState<string>("");
  const [boxError, setBoxError] = useState<boolean>(false);
  const {isPasswordVisible, togglePasswordVisibility} = useTogglePasswordVisibility();

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
      } 

      const data = await loginUser(email, password);
      // Atualiza o contexto do usuário com os dados retornados do backend
      setUser({
        id_usuario: data.id,
        nome: data.nome,
        email: data.email,
        perfil_financeiro: data.perfil_financeiro,
        salario_mensal: data.salario_mensal,
        saldo_inicial: data.saldo_inicial,
        saldo_atual: data.saldo_atual,
        data_cadastro: data.data_cadastro,
      });
      
      router.push("/home");
      setLoading(false);
      
    } catch (error: any) {
      console.log(error.message);
      setBoxError(true);
      setMessageError(error.message || "Erro ao logar");
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
        <Text style={stylesGlobal.titleInput}>ENDEREÇO E-MAIL</Text>
        <View style={stylesGlobal.boxInput}>
          <TextInput
            style={stylesGlobal.input}
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
        <Text style={stylesGlobal.titleInput}>SENHA</Text>
        <View style={stylesGlobal.boxInput}>
          <TextInput
            style={stylesGlobal.input}
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={!isPasswordVisible}
            placeholder="Digite sua senha"
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <MaterialIcons
              name={isPasswordVisible ? "visibility" : "visibility-off"}
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
            <Text style={stylesGlobal.textButton}>ENTRAR</Text>
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
