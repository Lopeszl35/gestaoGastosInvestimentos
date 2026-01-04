/**
 * Barramento de eventos simples (in-memory) com suporte a listeners assíncronos.
 *
 * - Executa listeners SEQUENCIALMENTE e AGUARDANDO (await).
 * - Se algum listener falhar, a exceção sobe (e sua transação faz rollback).
 */
export default class BarramentoEventos {
  constructor() {
    this.listenersPorEvento = new Map();
  }

  registrarListener(nomeEvento, funcaoListener) {
    if (!nomeEvento) throw new Error("nomeEvento é obrigatório");
    if (typeof funcaoListener !== "function") {
      throw new Error("funcaoListener deve ser uma função");
    }

    const listeners = this.listenersPorEvento.get(nomeEvento) || [];
    listeners.push(funcaoListener);
    this.listenersPorEvento.set(nomeEvento, listeners);
  }

  async emitir(nomeEvento, payload) {
    const listeners = this.listenersPorEvento.get(nomeEvento) || [];
    for (const listener of listeners) {
      await listener(payload);
    }
  }
}
