import { useEffect, useMemo, useState } from "react";
import { useUser } from "@/context/UserContext";
import { getCartoesCredito, UiCreditCard } from "@/services/cartoesService";

export function useCartoesScreen() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cards, setCards] = useState<UiCreditCard[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [expenses, setExpenses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeInstallments, setActiveInstallments] = useState<any[]>([]);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const id_usuario = (user as any)?.id_usuario;
      if (!id_usuario) throw new Error("Usuário não autenticado.");

      const data = await getCartoesCredito(id_usuario);

      setCards(data.cards);
      setSelectedId(data.cards?.[0]?.id ?? null);
      setExpenses(data.expenses);
      setCategories(data.categories);
      setActiveInstallments(data.activeInstallments);
    } catch (e: any) {
      setError(e?.message ?? "Falha ao carregar cartões.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const selected = useMemo(
    () => cards.find((c) => c.id === selectedId) ?? null,
    [cards, selectedId]
  );

  const totalMes = useMemo(
    () => expenses.reduce((a, i) => a + (Number(i.valor) || 0), 0),
    [expenses]
  );

  return {
    loading,
    error,
    cards,
    selectedId,
    setSelectedId,
    selected,
    expenses,
    categories,
    activeInstallments,
    totalMes,
    reload: load,
  };
}