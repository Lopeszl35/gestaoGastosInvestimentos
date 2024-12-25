import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { style } from "../styles/styleRegister";
import { stylesGlobal } from "@/styles/stylesGlobal";
import { Picker } from "@react-native-picker/picker";
import { Link } from "expo-router";
import { themes } from "@/global/themes";
import { MaterialIcons } from "@expo/vector-icons";
import { registerUser, User } from "../services/userServices";
import { useTogglePasswordVisibility } from "@/hooks/useTogglePasswordVisibility";

const Register: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [perfilFinanceiro, setPerfilFinanceiro] = useState<string>("moderado");
  const [salarioMensal, setSalarioMensal] = useState<string>("");
  const [saldoInicial, setSaldoInicial] = useState<string>("");
  const [saldoAtual, setSaldoAtual] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messageError, setMessageError] = useState<string>("");
  const {isPasswordVisible, togglePasswordVisibility} = useTogglePasswordVisibility();

  async function handleRegister() {
    setLoading(true);
    if (!name || !email || !password || !perfilFinanceiro || !salarioMensal) {
      setMessageError("Preencha todos os campos obrigatórios");
      setLoading(false);
    } else if (!email.includes("@") || !email.includes(".com")) {
      setMessageError("Email inválido");
      setLoading(false);
    } else if (password.length < 8) {
      setMessageError("A senha deve ter pelo menos 8 caracteres");
      setLoading(false);
    } 
    setMessageError("");
    
    try {

      const user: User = {
        nome: name,
        email: email,
        senha_hash: password,
        perfil_financeiro: perfilFinanceiro,
        salario_mensal: parseFloat(salarioMensal),
        saldo_inicial: parseFloat(saldoInicial),
        saldo_atual: parseFloat(saldoAtual),
      };

      const data = await registerUser(user);
      Alert.alert("Sucesso", data.message || "Usuário cadastrado com sucesso!");
    } catch (error: any) {
      setMessageError(error.message || "Erro ao conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={style.titleContainer}>
          <Text style={style.title}>
            Você está mais próximo de conquistar seus objetivos
          </Text>
        </View>
        <View style={style.container}>
          <Text style={style.subTitle}>Cadastro</Text>

          <View style={stylesGlobal.boxInput}> 
            <TextInput
              style={stylesGlobal.input}
              placeholder="Nome completo"
              value={name}
              onChangeText={setName}
            />

          </View>
          <View style={stylesGlobal.boxInput}>
            <TextInput
              style={stylesGlobal.input}
              placeholder="E-mail"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <MaterialIcons
              name="email"
              size={20}
              color={themes.colors.gray}
            />
          </View>
          <View style={stylesGlobal.boxInput}>
            <TextInput
              style={stylesGlobal.input}
              placeholder="Senha"
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <MaterialIcons
                name={isPasswordVisible ? "visibility" : "visibility-off"}
                size={20}
                color={themes.colors.gray}
              />
            </TouchableOpacity>
          </View>

          <Text style={style.label}>Perfil Financeiro:</Text>
          <View style={style.pickerContainer}>
            <Picker
              selectedValue={perfilFinanceiro}
              onValueChange={(itemValue) => setPerfilFinanceiro(itemValue)}
              style={style.picker}
            >
              <Picker.Item label="Conservador" value="conservador" />
              <Picker.Item label="Moderado" value="moderado" />
              <Picker.Item label="Arrojado" value="arrojado" />
            </Picker>
          </View>
          <View style={stylesGlobal.boxInput}>
            <TextInput
              style={stylesGlobal.input}
              placeholder="Salário Mensal (R$)"
              keyboardType="numeric"
              value={salarioMensal}
              onChangeText={setSalarioMensal}
            />
          </View>
          <View style={stylesGlobal.boxInput}>
            <TextInput
              style={stylesGlobal.input}
              placeholder="Saldo Inicial (R$)"
              keyboardType="numeric"
              value={saldoInicial}
              onChangeText={setSaldoInicial}
            />
          </View>
          <View style={stylesGlobal.boxInput}>
            <TextInput
              style={stylesGlobal.input}
              placeholder="Saldo Atual (R$)"
              keyboardType="numeric"
              value={saldoAtual}
              onChangeText={setSaldoAtual}
            />
          </View>

          {messageError ? (
            <Text style={style.errorText}>{messageError}</Text>
          ) : null}

          <TouchableOpacity style={style.button} onPress={handleRegister}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size={"small"} />
            ) : (
              <Text style={stylesGlobal.textButton}>CADASTRAR</Text>
            )}
          </TouchableOpacity>

          <View style={style.textBottomCadastroContainer}>
            <Text style={style.textBottom}>Já tem uma conta? </Text>
            <Link href="/">
              <Text style={{ color: themes.colors.primary }}>Faça login</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;