import { fetchWithToken } from "./apiService";
import type { CreditCard } from "@/domain/cartao";

/**
 * 📍 Arquivo: services/cartoesService.ts
 * Responsabilidade: acesso à API (fetch) para recursos de cartão.
 * Regras de negócio (cálculos, filtros) devem ficar em domain/hooks.
 */
export async function getCartoesCredito(id_usuario: number): Promise<CreditCard[]> {
  const response = await fetchWithToken(`cartoes/${id_usuario}`, {
    method: "GET",
  });

  if (!response.ok) {
    let msg = "Erro ao buscar cartões.";
    try {
      const err = await response.json();
      msg = err?.message || msg;
    } catch {
      // se não vier JSON, apiService já teria lançado erro; aqui é apenas fallback
    }
    throw new Error(msg);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}
