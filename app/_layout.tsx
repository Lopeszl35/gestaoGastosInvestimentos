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
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: themes.colors.background },
          }}
        >
          {/* Tela de Login */}
          <Stack.Screen
            name="index"
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: themes.colors.primary },
              headerTintColor: themes.colors.white,
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
              headerShown: true,
              headerStyle: { backgroundColor: themes.colors.primary },
              headerTintColor: themes.colors.white,
              headerTitleStyle: {
                fontWeight: "bold",
              },
              headerTitleAlign: "center",
              headerTitle: "Cadastro",
            }}
          />
        </Stack>
      </UserProvider>
    </SafeAreaProvider>
  );
}
