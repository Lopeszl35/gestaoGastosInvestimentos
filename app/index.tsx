import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";

import Logo from "../assets/images/logo.png";
import { themes } from "../global/themes";

import { style } from "../styles/stylesIndex";
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

  const { isPasswordVisible, togglePasswordVisibility } =
    useTogglePasswordVisibility();

  const isFormValid = useMemo(() => {
    // Regra mínima para UX (sem acoplar em regra de negócio)
    return email.trim().length > 0 && password.trim().length > 0;
  }, [email, password]);

  async function getLogin() {
    setLoading(true);

    try {
      if (!email || !password) {
        setBoxError(true);
        setMessageError("Preencha todos os campos");
        return;
      }

      if (!email.includes("@") || !email.includes(".com")) {
        setBoxError(true);
        setMessageError("Email inválido");
        return;
      }

      const data = await loginUser(email, password);

      // Atualiza o contexto do usuário com os dados retornados do backend
      setUser({
        id_usuario: data.id,
        nome: data.nome,
        email: data.email,
      });

      setBoxError(false);
      setMessageError("");

      router.replace("/home");
    } catch (error: any) {
      setBoxError(true);
      setMessageError(error?.message || "Não foi possível entrar agora.");
      Alert.alert("Erro", error?.message || "Não foi possível entrar agora.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={style.container}>
      {/* Elementos decorativos (somente UI) */}
      <View style={style.bgCircleOne} />
      <View style={style.bgCircleTwo} />

      <KeyboardAvoidingView
        style={style.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* HERO */}
        <View style={style.hero}>
          <View style={style.logoWrap}>
            <Image source={Logo} style={style.logo} resizeMode="contain" />
          </View>

          <Text style={style.heroTitle}>Bem-vindo</Text>
          <Text style={style.heroSubtitle}>
            Gerencie seus gastos e evolua com clareza, mês após mês.
          </Text>
        </View>

        {/* CARD */}
        <View style={style.card}>
          <Text style={style.cardTitle}>Entrar</Text>

          {/* Banner de erro */}
          {boxError && !!messageError && (
            <View style={style.errorBanner}>
              <MaterialIcons name="error-outline" size={18} color="#7A1B1B" />
              <Text style={style.errorBannerText}>{messageError}</Text>
            </View>
          )}

          <Text style={stylesGlobal.titleInput}>ENDEREÇO E-MAIL</Text>
          <View style={stylesGlobal.boxInput}>
            <TextInput
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (boxError) setBoxError(false);
              }}
              placeholder="ex: voce@email.com"
              placeholderTextColor={themes.colors.gray}
              autoCapitalize="none"
              keyboardType="email-address"
              style={stylesGlobal.input}
            />
            <MaterialIcons name="mail-outline" size={20} color={themes.colors.gray} />
          </View>

          <Text style={stylesGlobal.titleInput}>SENHA</Text>
          <View style={stylesGlobal.boxInput}>
            <TextInput
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (boxError) setBoxError(false);
              }}
              placeholder="Sua senha"
              placeholderTextColor={themes.colors.gray}
              secureTextEntry={!isPasswordVisible}
              style={stylesGlobal.input}
            />

            {/* Ícone mantido (visibilidade da senha) */}
            <TouchableOpacity onPress={togglePasswordVisibility} style={style.iconButton}>
              <MaterialIcons
                name={isPasswordVisible ? "visibility" : "visibility-off"}
                size={20}
                color={themes.colors.gray}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              style.button,
              (!isFormValid || loading) && style.buttonDisabled,
            ]}
            onPress={getLogin}
            disabled={!isFormValid || loading}
            activeOpacity={0.88}
          >
            {loading ? (
              <View style={style.buttonLoadingRow}>
                <ActivityIndicator color={themes.colors.white} />
                <Text style={style.buttonText}>Entrando...</Text>
              </View>
            ) : (
              <Text style={style.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <View style={style.bottomRow}>
            <Text style={style.bottomText}>Não possui uma conta? </Text>
            <Link href="/register" asChild>
              <TouchableOpacity>
                <Text style={style.bottomLink}>Cadastre-se</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
