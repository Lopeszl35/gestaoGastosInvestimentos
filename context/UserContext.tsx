import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { getUser } from "@/utils/tokenStorage"; // Certifique-se de ter criado essa função lá

export interface User {
  id_usuario: number;
  nome: string;
  email: string;
  perfil_financeiro: "conservador" | "moderado" | "arrojado";
  salario_mensal: number;
  saldo_inicial: number;
  saldo_atual: number;
  data_cadastro: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loadingUser: boolean; // Útil para mostrar Splash Screen enquanto carrega
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Efeito que roda UMA VEZ ao iniciar o app para recuperar o usuário salvo
  useEffect(() => {
    async function loadUserFromStorage() {
      try {
        const savedUser = await getUser(); // Busca do SecureStore/LocalStorage
        if (savedUser) {
          // Se achou, restaura o contexto imediatamente
          setUser(savedUser);
        }
      } catch (error) {
        console.error("Erro ao recuperar usuário do armazenamento:", error);
      } finally {
        // Finaliza o carregamento independente de achar ou não
        setLoadingUser(false);
      }
    }

    loadUserFromStorage();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }
  return context;
};