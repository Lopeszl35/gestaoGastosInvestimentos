import { useEffect, useMemo, useState } from "react";
import { useUser } from "@/context/UserContext";
import {
  getFinanciamentosData,
  UiFinancing,
} from "@/services/financiamentosService";

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function useFinanciamentosScreen() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dashboard, setDashboard] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [valorAmortizar, setValorAmortizar] = useState("5000");

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const id_usuario = (user as any)?.id_usuario;
      if (!id_usuario) throw new Error("Usuário não autenticado.");

      const dto = await getFinanciamentosData(id_usuario);
      setDashboard(dto);
      setSelectedId(dto.items?.[0]?.id ?? null);
    } catch (e: any) {
      setError(e?.message ?? "Falha ao carregar financiamentos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const selected: UiFinancing | null = useMemo(() => {
    const items: UiFinancing[] = dashboard?.items ?? [];
    return items.find((i) => i.id === selectedId) ?? null;
  }, [dashboard, selectedId]);

  // cálculo simples de impacto (apenas UI) — backend no futuro pode devolver tabela completa
  const simResult = useMemo(() => {
    if (!selected) return null;
    const extra = Number(valorAmortizar.replace(",", ".")) || 0;

    const saldo = selected.saldoDevedor;
    const jurosMes = saldo * selected.taxaMensal;
    const amort = Math.max(0, extra - jurosMes);
    const novoSaldo = Math.max(0, saldo - amort);

    return {
      jurosMes: round2(jurosMes),
      amortizacao: round2(amort),
      novoSaldo: round2(novoSaldo),
    };
  }, [selected, valorAmortizar]);

  return {
    loading,
    error,
    dashboard,
    selectedId,
    setSelectedId,
    selected,
    valorAmortizar,
    setValorAmortizar,
    simResult,
    reload: load,
  };
}
