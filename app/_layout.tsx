import { Stack } from "expo-router";
import { themes } from "../global/themes";
import { UserProvider } from "@/context/UserContext";
import { useSegments } from "expo-router";
import NavBar from "@/components/NavBar";

export default function Layout() {
  const segments = useSegments();

  // Adicionando log para depuração
  console.log("segments: ", segments);

  // Use um fallback para o primeiro segmento
  const firstSegment = segments.length > 0 ? segments[0] : "index"; // Fallback para "index"
  console.log("firstSegment: ", firstSegment);

  // Decide se o NavBar deve ser exibido
  const showNavBar = firstSegment !== "index" && firstSegment !== "register";

  return (
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
      </Stack>
    </UserProvider>
  );
}
