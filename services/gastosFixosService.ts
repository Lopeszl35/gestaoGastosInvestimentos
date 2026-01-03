import { fetchWithToken } from "./apiService";
import { USE_MOCK_DATA } from "@/constants/appConfig";

export type UiFixedExpense = {
  id: string;
  nome: string;
  categoria: "Utilidades" | "Assinaturas" | "Saúde" | "Moradia";
  valor: number;
  vencimentoDia: number;
  ativo: boolean;
  gradient: [string, string];
  icon: "bolt" | "water" | "wifi" | "movie" | "music" | "fitness";
};

function mockFixos(): UiFixedExpense[] {
  return [
    {
      id: "f1",
      nome: "Conta de Luz",
      categoria: "Utilidades",
      valor: 180,
      vencimentoDia: 10,
      ativo: true,
      gradient: ["#3B2F20", "#6B4E2E"],
      icon: "bolt",
    },
    {
      id: "f2",
      nome: "Conta de Água",
      categoria: "Utilidades",
      valor: 85,
      vencimentoDia: 15,
      ativo: true,
      gradient: ["#3B2F20", "#6B4E2E"],
      icon: "water",
    },
    {
      id: "f3",
      nome: "Internet",
      categoria: "Assinaturas",
      valor: 120,
      vencimentoDia: 5,
      ativo: true,
      gradient: ["#0B2B4B", "#155E75"],
      icon: "wifi",
    },
    {
      id: "f4",
      nome: "Netflix",
      categoria: "Assinaturas",
      valor: 55.9,
      vencimentoDia: 8,
      ativo: true,
      gradient: ["#0B2B4B", "#155E75"],
      icon: "movie",
    },
    {
      id: "f5",
      nome: "Spotify",
      categoria: "Assinaturas",
      valor: 21.9,
      vencimentoDia: 12,
      ativo: true,
      gradient: ["#0B2B4B", "#155E75"],
      icon: "music",
    },
    {
      id: "f6",
      nome: "Academia",
      categoria: "Saúde",
      valor: 150,
      vencimentoDia: 1,
      ativo: true,
      gradient: ["#3A1D3F", "#6D28D9"],
      icon: "fitness",
    },
  ];
}

export async function getGastosFixosData(id_usuario: number) {
  if (USE_MOCK_DATA) {
    const items = mockFixos();
    const totalMensal = items.reduce((a, i) => a + i.valor, 0);
    const totalAnual = totalMensal * 12;
    const proximos7dias = 2125.9; // mock igual imagem

    const porCategoria = [
      { label: "Utilidades", value: 265.0 },
      { label: "Assinaturas", value: 197.8 },
      { label: "Saúde", value: 600.0 },
      { label: "Moradia", value: 2400.0 },
    ];

    return { items, totalMensal, totalAnual, proximos7dias, porCategoria };
  }

  // 🔌 Backend futuro:
  const res = await fetchWithToken(
    `gastos-fixos/dashboard?id_usuario=${id_usuario}`,
    { method: "GET" }
  );
  if (!res.ok) throw new Error("Erro ao carregar gastos fixos.");
  return res.json();
}
