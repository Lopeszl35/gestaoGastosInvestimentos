import { Stack } from "expo-router";
import { themes } from "../global/themes";
import { UserProvider } from "@/context/UserContext";

export default function Layout() {
  return (
    <UserProvider>
      <Stack>
        {/* Tela de Login com opções de estilo específicas */}
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

        {/* Tela de Cadastro com opções de estilo específicas */}
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

        {/* Outras telas (sem cabeçalho ou estilos específicos) */}
        <Stack.Screen
          name="home"
          options={{
            headerShown: false, // Oculta o cabeçalho
          }}
        />

      </Stack>
    </UserProvider>
  );
}
