import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { style } from "../styles/styleRegister";
import { Picker } from "@react-native-picker/picker";
import { Link } from "expo-router";
import { themes } from "@/global/themes";
import { registerUser, User } from "../services/userServices";

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

  async function handleRegister() {
    setLoading(true);
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
    <>
      <View style={style.titleContainer}>
        <Text style={style.title}>
          Você está mais próximo de conquistar seus objetivos
        </Text>
      </View>
      <View style={style.container}>
        <Text style={style.subTitle}>Cadastro</Text>

        <TextInput
          style={style.input}
          placeholder="Nome completo"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={style.input}
          placeholder="E-mail"
          keyboardType="email-address"
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

        <TextInput
          style={style.input}
          placeholder="Salário Mensal (R$)"
          keyboardType="numeric"
          value={salarioMensal}
          onChangeText={setSalarioMensal}
        />
        <TextInput
          style={style.input}
          placeholder="Saldo Inicial (R$)"
          keyboardType="numeric"
          value={saldoInicial}
          onChangeText={setSaldoInicial}
        />
        <TextInput
          style={style.input}
          placeholder="Saldo Atual (R$)"
          keyboardType="numeric"
          value={saldoAtual}
          onChangeText={setSaldoAtual}
        />

        {messageError ? (
          <Text style={style.errorText}>{messageError}</Text>
        ) : null}

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
    </>
  );
};

export default Register;
