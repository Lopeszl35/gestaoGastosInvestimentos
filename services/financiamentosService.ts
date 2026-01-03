import { fetchWithToken } from "./apiService";
import { USE_MOCK_DATA } from "@/constants/appConfig";

export type UiFinancing = {
  id: string;
  titulo: string;
  tipo: "Veículo" | "Imóvel" | "Pessoal";
  banco: string;
  parcelaMensal: number;
  saldoDevedor: number;
  taxaMensal: number; // 0.0129 = 1.29% a.m.
  totalParcelas: number;
  pagas: number;
  accent: string; // cor da borda superior
};

function mockFin(): UiFinancing[] {
  return [
    {
      id: "l1",
      titulo: "Honda Civic 2023",
      tipo: "Veículo",
      banco: "Banco Honda",
      parcelaMensal: 2850,
      saldoDevedor: 78000,
      taxaMensal: 0.0129,
      totalParcelas: 48,
      pagas: 15,
      accent: "#22C55E",
    },
    {
      id: "l2",
      titulo: "Apartamento Centro",
      tipo: "Imóvel",
      banco: "Caixa Econômica",
      parcelaMensal: 3200,
      saldoDevedor: 380000,
      taxaMensal: 0.0085,
      totalParcelas: 360,
      pagas: 24,
      accent: "#10B981",
    },
    {
      id: "l3",
      titulo: "Empréstimo Reforma",
      tipo: "Pessoal",
      banco: "Nubank",
      parcelaMensal: 1800,
      saldoDevedor: 35000,
      taxaMensal: 0.018,
      totalParcelas: 36,
      pagas: 10,
      accent: "#C026D3",
    },
  ];
}

export async function getFinanciamentosData(id_usuario: number) {
  if (USE_MOCK_DATA) {
    const items = mockFin();
    return {
      items,
      dividaTotal: 493000,
      parcelasMensais: 7850,
      taxaMedia: 0.0138,
      mesesRestantes: 266,
      table: { totalPago: 136800, totalJuros: 50999.12, custoEfetivo: 42.5 },
    };
  }

  const res = await fetchWithToken(
    `financiamentos/dashboard?id_usuario=${id_usuario}`,
    { method: "GET" }
  );
  if (!res.ok) throw new Error("Erro ao carregar financiamentos.");
  return res.json();
}