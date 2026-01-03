import { fetchWithToken } from "./apiService";
import { USE_MOCK_DATA } from "@/constants/appConfig";

export type UiCreditCard = {
  id: string;
  nome: string;
  bandeira: "VISA" | "MC" | "ELO" | "AMEX";
  last4: string;
  limiteTotal: number;
  limiteUsado: number;
  fechamentoDia: number;
  vencimentoDia: number;
  gradient: [string, string]; // para ficar igual aos cards da imagem
};

export type UiCardExpense = {
  id: string;
  titulo: string;
  dataLabel: string; // "01 de jan."
  valor: number;
  cor: string; // cor do ícone/pill
  isInstallment?: boolean;
  installmentLabel?: string; // "3/12"
  remainingLabel?: string; // "Restam 9x"
};

export type UiCategorySum = { label: string; value: number };
export type UiActiveInstallment = {
  titulo: string;
  parcelaLabel: string;
  valor: number;
  restanteLabel: string;
};

function mockCards(): UiCreditCard[] {
  return [
    {
      id: "1",
      nome: "Nubank",
      bandeira: "MC",
      last4: "4532",
      limiteTotal: 8000,
      limiteUsado: 3250,
      fechamentoDia: 8,
      vencimentoDia: 15,
      gradient: ["#6D28D9", "#7C3AED"],
    },
    {
      id: "2",
      nome: "Itaú Platinum",
      bandeira: "VISA",
      last4: "8821",
      limiteTotal: 15000,
      limiteUsado: 4800,
      fechamentoDia: 10,
      vencimentoDia: 17,
      gradient: ["#EA580C", "#F97316"],
    },
    {
      id: "3",
      nome: "Bradesco",
      bandeira: "ELO",
      last4: "1199",
      limiteTotal: 5000,
      limiteUsado: 1200,
      fechamentoDia: 25,
      vencimentoDia: 1,
      gradient: ["#DC2626", "#EF4444"],
    },
  ];
}

function mockExpenses(): UiCardExpense[] {
  return [
    {
      id: "e1",
      titulo: "Amazon - iPhone Case",
      dataLabel: "01 de jan.",
      valor: 89.9,
      cor: "#A855F7",
    },
    {
      id: "e2",
      titulo: "iFood",
      dataLabel: "02 de jan.",
      valor: 45.5,
      cor: "#F97316",
    },
    {
      id: "e3",
      titulo: "PlayStation 5",
      dataLabel: "04 de jan.",
      valor: 416.58,
      cor: "#22C55E",
      isInstallment: true,
      installmentLabel: "3/12",
      remainingLabel: "Restam 9x",
    },
    {
      id: "e4",
      titulo: "Curso Udemy",
      dataLabel: "07 de jan.",
      valor: 27.9,
      cor: "#EAB308",
    },
    {
      id: "e5",
      titulo: "Uber",
      dataLabel: "09 de jan.",
      valor: 32.4,
      cor: "#60A5FA",
    },
  ];
}

function mockCategory(): UiCategorySum[] {
  return [
    { label: "Entertainment", value: 416.58 },
    { label: "Shopping", value: 89.9 },
    { label: "Food", value: 45.5 },
    { label: "Transport", value: 32.4 },
    { label: "Education", value: 27.9 },
  ];
}

function mockActiveInstallments(): UiActiveInstallment[] {
  return [
    {
      titulo: "PlayStation 5",
      parcelaLabel: "3/12",
      valor: 416.58,
      restanteLabel: "Restam 9x",
    },
  ];
}

export async function getCartoesCredito(id_usuario: number) {
  if (USE_MOCK_DATA) {
    return {
      cards: mockCards(),
      expenses: mockExpenses(),
      categories: mockCategory(),
      activeInstallments: mockActiveInstallments(),
    };
  }

  // 🔌 Backend (futuro):
  // GET /cartoes/dashboard?id_usuario=...
  const res = await fetchWithToken(
    `cartoes/dashboard?id_usuario=${id_usuario}`,
    { method: "GET" }
  );
  if (!res.ok) throw new Error("Erro ao carregar cartões.");
  return res.json();
}