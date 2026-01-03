/**
 * 📍 Arquivo: domain/cartao.ts
 * Responsabilidade: tipos do domínio de cartão (sem UI).
 * Mantém compatibilidade com o que o addGastosModal espera:
 * - id_cartao
 * - nome
 * - bandeira (opcional)
 */

export type CreditCard = {
  id_cartao: number;
  id_usuario?: number;
  nome: string;
  bandeira?: string;
  last4?: string; // opcional, útil para UI futuramente
  limite?: number; // opcional
  dia_fechamento?: number; // opcional
  dia_vencimento?: number; // opcional
};
