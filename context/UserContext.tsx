import React, { createContext, useState, useContext, ReactNode } from "react";

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
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
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
