import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { style } from "../styles/stylesIndex";
import Logo from "../assets/images/logo.png";
import { MaterialIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useTogglePasswordVisibility } from "@/hooks/useTogglePasswordVisibility";
import { loginUser } from "@/services/userServices";
import { useUser } from "@/context/UserContext";
import { storeUser } from "@/utils/tokenStorage";



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
      setUser(data.user);
      await storeUser(data.user);
      
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
    <KeyboardAvoidingView
      style={style.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={style.keyboard}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Decor */}
        <View style={style.bgCircleOne} />
        <View style={style.bgCircleTwo} />

        {/* Hero */}
        <View style={style.hero}>
          <View style={style.logoWrap}>
            <Image source={Logo} style={style.logo} resizeMode="contain" />
          </View>
          <Text style={style.heroTitle}>Bem-vindo de volta</Text>
          <Text style={style.heroSubtitle}>
            Gerencie suas finanças e conquiste seus objetivos.
          </Text>
        </View>

        {/* Card */}
        <View style={style.card}>
          <Text style={style.titleInput}>ENDEREÇO E-MAIL</Text>
          <View style={style.boxInput}>
            <TextInput
              style={style.input}
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Digite seu e-mail"
              placeholderTextColor="rgba(234,240,255,0.55)"
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <MaterialIcons name="email" size={20} color="rgba(234,240,255,0.70)" />
          </View>

          <Text style={style.titleInput}>SENHA</Text>
          <View style={style.boxInput}>
            <TextInput
              style={style.input}
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={!isPasswordVisible}
              placeholder="Digite sua senha"
              placeholderTextColor="rgba(234,240,255,0.55)"
            />
            {/* ✅ mantém o ícone já colocado no login */}
            <TouchableOpacity onPress={togglePasswordVisibility} style={{ paddingLeft: 8, paddingVertical: 6 }}>
              <MaterialIcons
                name={isPasswordVisible ? "visibility" : "visibility-off"}
                size={20}
                color="rgba(234,240,255,0.70)"
              />
            </TouchableOpacity>
          </View>

          {boxError && (
            <View style={style.errorBanner}>
              <MaterialIcons name="error-outline" size={18} color="#FF6B6B" />
              <Text style={style.errorText}>{messageError}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[style.button, loading && style.buttonDisabled]}
            onPress={getLogin}
            disabled={loading}
          >
            {loading ? (
              <View style={style.buttonLoadingRow}>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={style.buttonText}>Entrando...</Text>
              </View>
            ) : (
              <Text style={style.buttonText}>ENTRAR</Text>
            )}
          </TouchableOpacity>

          <View style={style.bottomRow}>
            <Text style={style.bottomText}>Não possui uma conta?</Text>
            <Link href="/register">
              <Text style={style.bottomLink}>Cadastre-se</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
