import RequisicaoIncorreta from "../errors/RequisicaoIncorreta.js";

class UserController {
  constructor(UserModel, TransactionUtil) {
    this.UserModel = UserModel;
    this.TransactionUtil = TransactionUtil;
  }

  async createUser(req, res, next) {
    const user = req.body;
    console.log("user recebido no controller: ", user);
    try {
      // Executa a lógica dentro de uma transação
      const response = await this.TransactionUtil.executeTransaction(
        async (connection) => {
          const userModelo = {
            nome: user.nome,
            email: user.email,
            senha_hash: user.senha_hash,
            perfil_financeiro: user.perfil_financeiro,
            salario_mensal: user.salario_mensal,
            saldo_inicial: user.saldo_inicial,
            saldo_atual: user.saldo_atual,
          };

          return await this.UserModel.createUser(userModelo, connection);
        }
      );

      res.status(200).json(response);
    } catch (error) {
      console.error("Erro ao criar o usuário:", error.message);
      next(error);
    }
  }

  async loginUser(req, res, next) {
    const { email, password } = req.body;

    try {
      const result = await this.UserModel.loginUser(email, password);
      console.log("result: ", result);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getUserSaldo(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.body;

    try {
      const saldo = await this.UserModel.getUserSaldo(userId);
      console.log("Saldo do usuário: ", saldo);
      res.status(200).json({ saldo });
    } catch (error) {
      console.error("Erro ao obter o saldo do usuário:", error.message);
      res
        .status(400)
        .json({
          message: "Erro ao obter o saldo do usuário: " + error.message,
        });
    }
  }

  async atualizarUserSaldo(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { userId, saldo } = req.body;
      console.log("Saldo recebido no controller:", saldo);

      // aqui bloqueia letras
      const saldoNumber = Number(String(saldo).trim().replace(",", "."));
      if (!Number.isFinite(saldoNumber)) {
        throw new RequisicaoIncorreta(
          "Saldo inválido: envie apenas números (ex: 1000.50)."
        );
      }

      const result = await this.UserModel.atualizarUserSaldo(
        userId,
        saldoNumber
      );

      res.status(200).json(result);
    } catch (erro) {
      next(erro);
    }
  }

  async getUserData(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ErroValidacao(errors.array());
      }
      const { userId } = req.params;
      const userData = await this.UserModel.getUserData(userId);
      res.status(200).json(userData);
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
