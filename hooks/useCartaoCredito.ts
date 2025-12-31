import { useCallback, useMemo, useState } from "react";

export type CardItem = {
  id: string;
  title: string;
  subtitle: string;
  valorParcela: number;
  parcelasTotal: number;
  parcelasRestantes: number;
  mesRef: string; // "2025-12"
};

function getLastMonths(count: number) {
  const months: string[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    months.push(ym);
  }
  return months;
}

export function useCartaoCredito(cardId: string) {
  const months = useMemo(() => getLastMonths(8), []);
  const [selectedMonth, setSelectedMonth] = useState(months[0]); // mais recente
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Mock: itens do cartão (parcelas/gastos)
  const allItems = useMemo<CardItem[]>(
    () => [
      {
        id: "it-1",
        title: "Smartphone",
        subtitle: "12x • Loja X",
        valorParcela: 189.9,
        parcelasTotal: 12,
        parcelasRestantes: 7,
        mesRef: months[0],
      },
      {
        id: "it-2",
        title: "Academia",
        subtitle: "Recorrente • Saúde",
        valorParcela: 119.9,
        parcelasTotal: 1,
        parcelasRestantes: 1,
        mesRef: months[0],
      },
      {
        id: "it-3",
        title: "Notebook",
        subtitle: "10x • Eletrônicos",
        valorParcela: 249.9,
        parcelasTotal: 10,
        parcelasRestantes: 4,
        mesRef: months[1],
      },
      {
        id: "it-4",
        title: "Seguro",
        subtitle: "Recorrente • Proteção",
        valorParcela: 89.9,
        parcelasTotal: 1,
        parcelasRestantes: 1,
        mesRef: months[2],
      },
      // gere alguns itens extras pra demonstrar paginação
      ...Array.from({ length: 24 }).map((_, idx) => ({
        id: `it-gen-${idx}`,
        title: `Compra #${idx + 1}`,
        subtitle: "Parcelado • Cartão",
        valorParcela: Number((35 + (idx % 7) * 12.35).toFixed(2)),
        parcelasTotal: 6,
        parcelasRestantes: Math.max(1, 6 - (idx % 6)),
        mesRef: months[idx % months.length],
      })),
    ],
    [months]
  );

  const itemsOfMonth = useMemo(
    () => allItems.filter((i) => i.mesRef === selectedMonth),
    [allItems, selectedMonth]
  );

  const totalMes = useMemo(
    () => itemsOfMonth.reduce((acc, cur) => acc + cur.valorParcela, 0),
    [itemsOfMonth]
  );

  const totalPorMes = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of months) map.set(m, 0);
    for (const it of allItems) {
      map.set(it.mesRef, (map.get(it.mesRef) || 0) + it.valorParcela);
    }
    return map;
  }, [allItems, months]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(itemsOfMonth.length / pageSize));
  }, [itemsOfMonth.length]);

  const pagedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return itemsOfMonth.slice(start, start + pageSize);
  }, [itemsOfMonth, page]);

  const goNext = useCallback(() => {
    setPage((p) => Math.min(p + 1, totalPages));
  }, [totalPages]);

  const goPrev = useCallback(() => {
    setPage((p) => Math.max(p - 1, 1));
  }, []);

  const changeMonth = useCallback((m: string) => {
    setSelectedMonth(m);
    setPage(1);
  }, []);

  return {
    cardId,
    months,
    selectedMonth,
    changeMonth,

    totalMes,
    totalPorMes,

    pagedItems,
    page,
    totalPages,
    goNext,
    goPrev,
  };
}
