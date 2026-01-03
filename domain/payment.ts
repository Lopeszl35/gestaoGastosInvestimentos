/**
 * 📍 Arquivo: domain/payment.ts
 * Responsabilidade: representar o domínio de forma de pagamento
 * (tipos + listas + labels). Sem UI.
 */

export const PAYMENT_METHODS = [
  "DINHEIRO",
  "DEBITO",
  "CREDITO",
  "PIX",
  "BOLETO",
  "TRANSFERENCIA",
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PaymentMethodLabel: Record<PaymentMethod, string> = {
  DINHEIRO: "Dinheiro",
  DEBITO: "Débito",
  CREDITO: "Crédito",
  PIX: "Pix",
  BOLETO: "Boleto",
  TRANSFERENCIA: "Transferência",
};
