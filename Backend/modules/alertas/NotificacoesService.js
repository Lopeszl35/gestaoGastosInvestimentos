/**
 * Camada de notificações.
 *
 * - Inserir em `alertas_financeiros` já garante a "mensagem" no app.
 * - Este serviço existe para você plugar um canal real (push/FCM, e-mail, websocket, WhatsApp, etc.).
 * - Por enquanto, ele apenas registra no console (não quebra transação).
 */
export default class NotificacoesService {
  async enviarMensagemParaUsuario({ id_usuario, titulo, mensagem, dados_extras }) {
    console.log("[Notificação -> Usuário]", {
      id_usuario,
      titulo,
      mensagem,
      dados_extras,
      enviado_em: new Date().toISOString(),
    });

    return { enviado: true };
  }
}
