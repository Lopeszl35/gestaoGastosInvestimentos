import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { style } from "./styleRegister"; // Importando o arquivo de estilos atualizado
import { Link } from "expo-router";
import { themes } from "@/global/themes";

const Register: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messageError, setMessageError] = useState<string>("");

  async function handleRegister() {
    setLoading(true);
    try {
      if (!name || !email || !password) {
        setMessageError("Preencha todos os campos");
        setLoading(false);
      } else if (!email.includes("@") || !email.includes(".com")) {
        setMessageError("Email inválido");
        setLoading(false);
      } else if (password.length < 6) {
        setMessageError("A senha deve ter pelo menos 6 caracteres");
        setLoading(false);
      } else {
        setTimeout(() => {
          Alert.alert("Usuário cadastrado com sucesso!");
          setLoading(false);
        }, 3000);
      }
    } catch (error) {
      console.log("Erro ao cadastrar: ", error);
      setMessageError("Erro ao cadastrar usuário");
      setLoading(false);
    }
  }

  return (
    <View style={style.container}>
      <Text style={style.title}>Cadastro</Text>

      <TextInput
        style={style.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={style.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={style.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {messageError ? <Text style={style.errorText}>{messageError}</Text> : null}

      <TouchableOpacity style={style.button} onPress={handleRegister}>
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size={"small"} />
        ) : (
          <Text style={style.textButton}>CADASTRAR</Text>
        )}
      </TouchableOpacity>

      <View style={style.textBottomCadastroContainer}>
        <Text style={style.textBottom}>Já tem uma conta? </Text>
        <Link href="/">
          <Text style={{ color: themes.colors.primary }}>Faça login</Text>
        </Link>
      </View>
    </View>
  );
};

export default Register;
