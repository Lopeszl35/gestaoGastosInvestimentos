import { param, query, body, validationResult } from "express-validator";
import ErroValidacao from "../../errors/ValidationError.js";

function validarRequisicao(req, res, next) {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    const mensagens = erros.array().map((e) => e.msg);
    throw new ErroValidacao(mensagens.join(", "));
  }
  return next();
}

export const obterVisaoGeralCartoesValidate = [
  param("id_usuario")
    .notEmpty()
    .withMessage("O id_usuario é obrigatório.")
    .isInt({ min: 1 })
    .withMessage("O id_usuario deve ser um inteiro válido."),

  query("ano")
    .notEmpty()
    .withMessage("O ano é obrigatório.")
    .isInt({ min: 2000, max: 2100 })
    .withMessage("O ano deve estar entre 2000 e 2100."),

  query("mes")
    .notEmpty()
    .withMessage("O mês é obrigatório.")
    .isInt({ min: 1, max: 12 })
    .withMessage("O mês deve estar entre 1 e 12."),

  query("cartao_uuid")
    .notEmpty()
    .exists()
    .withMessage("O cartao_uuid é obrigatório.")
    .isUUID()
    .withMessage("cartao_uuid deve ser um UUID válido."),

  validarRequisicao,
];

export const criarCartaoCreditoValidate = [
  param("id_usuario")
    .notEmpty().withMessage("O id_usuario é obrigatório.")
    .isInt({ min: 1 }).withMessage("O id_usuario deve ser um inteiro válido."),

  body("nome")
    .notEmpty().withMessage("O nome do cartão é obrigatório.")
    .isString().withMessage("O nome deve ser texto.")
    .isLength({ min: 2, max: 80 }).withMessage("O nome deve ter entre 2 e 80 caracteres."),

  body("bandeira")
    .optional({ nullable: true })
    .isString().withMessage("A bandeira deve ser texto.")
    .isLength({ min: 2, max: 30 }).withMessage("A bandeira deve ter até 30 caracteres."),

  body("ultimos4")
    .optional({ nullable: true })
    .matches(/^\d{4}$/).withMessage("ultimos4 deve conter exatamente 4 dígitos."),

  body("corHex")
    .optional({ nullable: true })
    .matches(/^#([0-9a-fA-F]{6})$/).withMessage("corHex deve estar no formato #RRGGBB."),

  body("limite")
    .notEmpty().withMessage("O limite é obrigatório.")
    .isFloat({ min: 0 }).withMessage("O limite deve ser um número >= 0."),

  body("diaFechamento")
    .notEmpty().withMessage("O diaFechamento é obrigatório.")
    .isInt({ min: 1, max: 28 }).withMessage("O diaFechamento deve estar entre 1 e 28."),

  body("diaVencimento")
    .notEmpty().withMessage("O diaVencimento é obrigatório.")
    .isInt({ min: 1, max: 28 }).withMessage("O diaVencimento deve estar entre 1 e 28."),

  validarRequisicao,
];

export const criarLancamentoCartaoValidate = [
  param("id_usuario").notEmpty().isInt({ min: 1 }).withMessage("id_usuario inválido."),
  param("cartao_uuid").notEmpty().isUUID().withMessage("cartao_uuid inválido."),

  body("descricao")
    .notEmpty()
    .isString()
    .isLength({ min: 2, max: 255 })
    .withMessage("descricao inválida."),

  body("categoria")
    .optional({ nullable: true })
    .isString()
    .isLength({ max: 80 })
    .withMessage("categoria inválida."),

  body("valorTotal")
    .notEmpty()
    .isFloat({ min: 0.01 })
    .withMessage("valorTotal inválido."),

  body("dataCompra")
    .notEmpty()
    .isISO8601()
    .withMessage("dataCompra inválida (use YYYY-MM-DD)."),

  body("parcelado")
    .notEmpty()
    .isBoolean()
    .withMessage("parcelado inválido (true/false)."),

  body("numeroParcelas")
    .custom((value, { req }) => {
      const parcelado = req.body.parcelado === true || req.body.parcelado === "true";

      if (!parcelado) return true; // à vista: não precisa informar, o back força 1

      const n = Number(value);
      if (!Number.isInteger(n) || n < 2 || n > 60) {
        throw new Error("numeroParcelas inválido (quando parcelado=true, mínimo 2 e máximo 60).");
      }
      return true;
    }),

  validarRequisicao,
];

