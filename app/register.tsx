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
import { Picker } from "@react-native-picker/picker";
import { Link } from "expo-router";
import { themes } from "@/global/themes";
import { MaterialIcons } from "@expo/vector-icons";
import { registerUser } from "../services/userServices";
import { UserCadastro } from "../interfaces/userInterface";
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
  const { isPasswordVisible, togglePasswordVisibility } =
    useTogglePasswordVisibility();

    async function handlerRegisterValidetor() {
      const erros = [];

      if (!name || !email || !password || !perfilFinanceiro || !salarioMensal) {
        erros.push("Preencha todos os campos obrigatórios");
      }
      if (!email.includes("@") || !email.includes(".com")) {
        erros.push("Email inválido");
      }
      if (password.length < 8) {
        erros.push("A senha deve ter pelo menos 8 caracteres");
      }
      if (erros.length > 0) {
        setMessageError(erros.join("\n"));
      } else {
        return true;
      }
    }

  async function handleRegister() {
    setLoading(true);
    const validado = await handlerRegisterValidetor();

    if (!validado) {
      setLoading(false);
      return;
    }

    try {
      const user: UserCadastro = {
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
      style={style.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={style.keyboard}
        keyboardShouldPersistTaps="handled"
      >
        {/* Decor */}
        <View style={style.bgCircleOne} />
        <View style={style.bgCircleTwo} />

        {/* Hero */}
        <View style={style.hero}>
          <Text style={style.heroTitle}>
            Você está mais próximo de conquistar seus objetivos
          </Text>
          <Text style={style.heroSubtitle}>
            Crie sua conta e comece a organizar seus gastos e investimentos.
          </Text>
        </View>

        {/* Card */}
        <View style={style.card}>
          <Text style={style.cardTitle}>Cadastro</Text>

          <View style={style.boxInput}>
            <TextInput
              style={style.input}
              placeholder="Nome completo"
              placeholderTextColor="rgba(234,240,255,0.55)"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={style.boxInput}>
            <TextInput
              style={style.input}
              placeholder="E-mail"
              placeholderTextColor="rgba(234,240,255,0.55)"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <MaterialIcons
              name="email"
              size={20}
              color="rgba(234,240,255,0.70)"
            />
          </View>

          <View style={style.boxInput}>
            <TextInput
              style={style.input}
              placeholder="Senha"
              placeholderTextColor="rgba(234,240,255,0.55)"
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={setPassword}
            />
            {/* ✅ mantém o ícone já usado no login */}
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <MaterialIcons
                name={isPasswordVisible ? "visibility" : "visibility-off"}
                size={20}
                color="rgba(234,240,255,0.70)"
              />
            </TouchableOpacity>
          </View>

          <Text style={style.label}>Perfil Financeiro</Text>
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

          <View style={style.boxInput}>
            <TextInput
              style={style.input}
              placeholder="Salário Mensal (R$)"
              placeholderTextColor="rgba(234,240,255,0.55)"
              keyboardType="numeric"
              value={salarioMensal}
              onChangeText={setSalarioMensal}
            />
          </View>

          <View style={style.boxInput}>
            <TextInput
              style={style.input}
              placeholder="Saldo Inicial (R$)"
              placeholderTextColor="rgba(234,240,255,0.55)"
              keyboardType="numeric"
              value={saldoInicial}
              onChangeText={setSaldoInicial}
            />
          </View>

          <View style={style.boxInput}>
            <TextInput
              style={style.input}
              placeholder="Saldo Atual (R$)"
              placeholderTextColor="rgba(234,240,255,0.55)"
              keyboardType="numeric"
              value={saldoAtual}
              onChangeText={setSaldoAtual}
            />
          </View>

          {!!messageError && (
            <View style={style.errorBanner}>
              <MaterialIcons name="error-outline" size={18} color="#FF6B6B" />
              <Text style={style.errorText}>{messageError}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[style.button, loading && style.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <View style={style.buttonLoadingRow}>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={style.buttonText}>Criando conta...</Text>
              </View>
            ) : (
              <Text style={style.buttonText}>CADASTRAR</Text>
            )}
          </TouchableOpacity>

          <View style={style.bottomRow}>
            <Text style={style.bottomText}>Já tem uma conta?</Text>
            <Link href="/">
              <Text style={style.bottomLink}>Faça login</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;
