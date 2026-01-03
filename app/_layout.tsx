import { Stack } from "expo-router";
import { themes } from "../global/themes";
import { UserProvider } from "@/context/UserContext";
import { useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import NavBar from "@/components/NavBar";

export default function Layout() {
  const segments = useSegments();

  // Use um fallback para o primeiro segmento
  const firstSegment = segments.length > 0 ? segments[0] : "index"; // Fallback para "index"

  // Decide se o NavBar deve ser exibido
  const showNavBar = firstSegment !== "index" && firstSegment !== "register";

  return (
    <SafeAreaProvider>
      <UserProvider>
        {showNavBar && <NavBar />}
        <Stack>
          {/* Tela de Login */}
          <Stack.Screen
            name="index"
            options={{
              headerStyle: { backgroundColor: themes.colors.primary },
              headerTintColor: themes.colors.white,
              contentStyle: { backgroundColor: themes.colors.background },
              headerTitleStyle: {
                fontWeight: "bold",
              },
              headerTitleAlign: "center",
              headerTitle: "Login",
            }}
          />

          {/* Tela de Cadastro */}
          <Stack.Screen
            name="register"
            options={{
              headerStyle: { backgroundColor: themes.colors.primary },
              headerTintColor: themes.colors.white,
              contentStyle: { backgroundColor: themes.colors.background },
              headerTitleStyle: {
                fontWeight: "bold",
              },
              headerTitleAlign: "center",
              headerTitle: "Cadastro",
            }}
          />

          {/* Outras telas */}
          <Stack.Screen
            name="home"
            options={{
              headerShown: false, // Oculta o cabeçalho
            }}
          />
          {/* Tela de Gastos Variáveis */}
          <Stack.Screen
            name="gastosVariaveis"
            options={{
              headerShown: false, // Oculta o cabeçalho
            }}
          />

          {/* Tela de Gastos Fixos */}
          <Stack.Screen
            name="gastosFixos"
            options={{
              headerShown: false, // Oculta o cabeçalho
            }}
          />

          {/* Tela de Cartão */}
          <Stack.Screen
            name="cartoes"
            options={{
              headerShown: false, // Oculta o cabeçalho
            }}
          />

          {/* Tela de financiamento */}
          <Stack.Screen
            name="financiamentos"
            options={{
              headerShown: false, // Oculta o cabeçalho
            }}
          />
        </Stack>
      </UserProvider>
    </SafeAreaProvider>
  );
}
