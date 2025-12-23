export default class UserModelDTO {
    constructor({ id, nome, email, perfil_financeiro, salario_mensal, saldo_atual }) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.perfil_financeiro = perfil_financeiro;
        this.salario_mensal = salario_mensal;
        this.saldo_atual = saldo_atual;
    }
}