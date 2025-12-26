import UserPublicDTO from "./UserPublicDTO.js";
import NaoEncontrado from "../../errors/naoEncontrado.js";

class UserController {
  constructor(UserService, TransactionUtil) {
    this.UserService = UserService;
    this.TransactionUtil = TransactionUtil;
  }

  async createUser(req, res, next) {
    const user = req.body;
    console.log("user recebido no controller: ", user);
    try {
      // Executa a lógica dentro de uma transação
      const response = await this.TransactionUtil.executeTransaction(
        async (connection) => {
          const response = await this.UserService.createUser(new UserPublicDTO(user), connection);
          if (response.insertId) {
            throw new Error('Erro ao criar o usuário: ' + response);
          }
        }
      );
      res.status(200).json(response);
    } catch (error) {
      console.error("Erro ao criar o usuário:", error.message);
      next(error);
    }
  }

  async atualizarUsuario(req, res, next) {

  }

  async loginUser(req, res, next) {
    const { email, password } = req.body;

    try {
      const result = await this.UserService.loginUser(email, password);
      console.log("result: ", result);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getUserSaldo(req, res, next) {
    const { userId } = req.body;
    try {
      const saldo = await this.UserService.getUserSaldo(userId);
      res.status(200).json({ saldo });
    } catch (error) {
      next(error);
    }
  }

  async atualizarUserSaldo(req, res, next) {
    try {
      const { userId, saldo } = req.body;
      console.log("Saldo recebido no controller:", saldo);
      const result = await this.UserService.atualizarUserSaldo(
        userId,
        saldo
      );
      res.status(200).json(result);
    } catch (erro) {
      next(erro);
    }
  }

  async getUserData(req, res, next) {
    try {
      const { userId } = req.params;
      const userData = await this.UserService.getUserData(userId);
      if (!userData) {
        throw new NaoEncontrado('Usuário não encontrado');
      }
      res.status(200).json(userData);
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
