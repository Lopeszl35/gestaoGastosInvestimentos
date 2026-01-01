import { useCallback, useMemo, useState } from "react";

export type FixedExpenseType = "cartao" | "financiamento" | "contas" | "outros";

export type CreditCard = {
  id: string;
  nome: string;
  bandeira?: string;
  limite: number;
  fechamentoDia: number; // dia de fechamento
  vencimentoDia: number; // dia de vencimento
  gastoMesAtual: number;
};

export type FixedBill = {
  id: string;
  tipo: Exclude<FixedExpenseType, "cartao">;
  titulo: string;
  descricao: string;
  valorMensal: number;
  vencimentoDia: number;
};

export function useGastosFixos() {
  const [selectedType, setSelectedType] = useState<FixedExpenseType>("cartao");
  const [refreshing, setRefreshing] = useState(false);

  // Mock: até integrar com backend
  const creditCards = useMemo<CreditCard[]>(
    () => [
      {
        id: "card-nubank",
        nome: "Nubank",
        bandeira: "Mastercard",
        limite: 4500,
        fechamentoDia: 25,
        vencimentoDia: 1,
        gastoMesAtual: 1280.75,
      },
      {
        id: "card-inter",
        nome: "Banco Inter",
        bandeira: "Visa",
        limite: 3000,
        fechamentoDia: 10,
        vencimentoDia: 15,
        gastoMesAtual: 720.4,
      },
    ],
    []
  );

  const fixedBills = useMemo<FixedBill[]>(
    () => [
      {
        id: "bill-luz",
        tipo: "contas",
        titulo: "Energia",
        descricao: "Conta de luz",
        valorMensal: 210.5,
        vencimentoDia: 12,
      },
      {
        id: "bill-agua",
        tipo: "contas",
        titulo: "Água",
        descricao: "Conta de água",
        valorMensal: 98.2,
        vencimentoDia: 18,
      },
      {
        id: "bill-fin",
        tipo: "financiamento",
        titulo: "Financiamento",
        descricao: "Parcela do financiamento",
        valorMensal: 860.0,
        vencimentoDia: 5,
      },
    ],
    []
  );

  const filteredBills = useMemo(() => {
    if (selectedType === "cartao") return [];
    return fixedBills.filter((b) => b.tipo === selectedType);
  }, [fixedBills, selectedType]);

  const refresh = useCallback(async () => {
    try {
      setRefreshing(true);
      // futuramente: buscar do backend
      await new Promise((r) => setTimeout(r, 450));
    } finally {
      setRefreshing(false);
    }
  }, []);

  return {
    selectedType,
    setSelectedType,

    creditCards,
    fixedBills,
    filteredBills,

    refreshing,
    refresh,
  };
}
