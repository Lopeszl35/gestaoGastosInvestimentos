export default class UserPublicDTO {
  constructor(row) {
    this.id_usuario = Number(row.id_usuario);
    this.nome = row.nome;
    this.email = row.email;
    this.senha_hash = row.senha_hash;
    this.perfil_financeiro = row.perfil_financeiro;
    this.salario_mensal = row.salario_mensal != null ? Number(row.salario_mensal) : null;
    this.saldo_atual = row.saldo_atual != null ? Number(row.saldo_atual) : null;
  }
}

