import { Stack } from "expo-router";
import { themes } from "../global/themes";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: themes.colors.primary }, // Cor de fundo do cabeçalho
        headerTintColor: themes.colors.white, // Cor do texto no cabeçalho
        contentStyle: { backgroundColor: themes.colors.background }, // Cor de fundo das telas
      }}
    >
      <Stack.Screen name="index" options={{ headerTitle: "Login" }} />
      <Stack.Screen name="register" options={{ headerTitle: "Cadastro" }} />
    </Stack>
  );
}
