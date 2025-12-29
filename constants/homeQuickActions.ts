import type { MaterialIcons } from "@expo/vector-icons";

export type HomeQuickAction = {
  key: string;
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  route?: string;
  onPressFallback?: () => void;
};

/**
 * Lista de ações rápidas exibidas na Home.
 * Mantê-las aqui deixa a Home "data-driven" e fácil de escalar.
 */
export const HOME_QUICK_ACTIONS: HomeQuickAction[] = [
  {
    key: "gastos-variaveis",
    title: "Gastos variáveis",
    description: "Registrar e revisar",
    icon: "receipt-long",
    route: "/gastosVariaveis",
  },
  {
    key: "add-gasto",
    title: "Adicionar gasto",
    description: "1 toque",
    icon: "add-circle-outline",
    onPressFallback: () => alert("Em breve: adicionar gasto rápido"),
  },
  {
    key: "metas",
    title: "Metas",
    description: "Evolução mensal",
    icon: "flag",
    onPressFallback: () => alert("Em breve: metas"),
  },
  {
    key: "relatorios",
    title: "Relatórios",
    description: "Análises",
    icon: "insights",
    onPressFallback: () => alert("Em breve: relatórios"),
  },
];
