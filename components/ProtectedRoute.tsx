import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { useRouter } from "expo-router";
import { isAuthenticated } from "../utils/auth";
import { themes } from "../global/themes";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      setIsAuth(authenticated);
      setLoading(false);

      if (!authenticated) {
        router.replace("/"); // Redireciona para a página de login
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: themes.colors.background }}>
        <ActivityIndicator size="large" color={themes.colors.primary} />
      </View>
    );
  }

  return <>{isAuth ? children : null}</>;
};

export default ProtectedRoute;
