import { param, validationResult, query, body } from "express-validator";
import ErroValidacao from "../../errors/ValidationError.js";

// helper para encerrar com erros padronizados
function handleValidation(req, _res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new ErroValidacao(errors.array()));
  return next();
}

export const validateGetResumoGastosFixos = [
  param("id_usuario")
    .exists({ checkFalsy: true }).withMessage("Id do usuário obrigatório.")
    .bail()
    .isInt({ gt: 0 }).withMessage("Id do usuário deve ser um número inteiro positivo."),

  handleValidation,
];

export const validateAddGastoFixo = [
  query("id_usuario")
    .exists({ checkFalsy: true }).withMessage("Id do usuário obrigatório.")
    .bail()
    .isInt({ gt: 0 }).withMessage("Id do usuário deve ser um número inteiro positivo."),

  body("gastoFixo")
    .exists({ checkFalsy: true }).withMessage("Objeto gastoFixo é obrigatório.")
    .bail()
    .isObject().withMessage("gastoFixo deve ser um objeto."),

  body("gastoFixo.tipo")
    .exists({ checkFalsy: true }).withMessage("tipo é obrigatório.")
    .bail()
    .isIn(["luz", "agua", "internet", "assinatura", "telefone", "outro"])
    .withMessage("tipo inválido."),

  body("gastoFixo.titulo")
    .exists({ checkFalsy: true }).withMessage("titulo é obrigatório.")
    .bail()
    .isString().withMessage("titulo deve ser string.")
    .bail()
    .isLength({ min: 2, max: 80 }).withMessage("titulo deve ter entre 2 e 80 caracteres."),

  body("gastoFixo.descricao")
    .optional({ nullable: true })
    .isString().withMessage("descricao deve ser string.")
    .bail()
    .isLength({ max: 255 }).withMessage("descricao pode ter no máximo 255 caracteres."),

  body("gastoFixo.valor")
    .exists({ checkFalsy: true }).withMessage("valor é obrigatório.")
    .bail()
    .isFloat({ gt: 0 }).withMessage("valor deve ser maior que zero."),

  body("gastoFixo.dia_vencimento")
    .exists({ checkFalsy: true }).withMessage("dia_vencimento é obrigatório.")
    .bail()
    .isInt({ min: 1, max: 31 }).withMessage("dia_vencimento deve ser entre 1 e 31."),

  body("gastoFixo.recorrencia")
    .optional({ nullable: true })
    .isIn(["mensal", "bimestral", "trimestral", "anual"])
    .withMessage("recorrencia inválida."),

  body("gastoFixo.ativo")
    .optional({ nullable: true })
    .isInt({ min: 0, max: 1 }).withMessage("ativo deve ser 0 ou 1."),

  handleValidation,
];

export const validateGetGastosFixos = [
  param("id_usuario")
    .exists({ checkFalsy: true }).withMessage("Id do usuário obrigatório.")
    .bail()
    .isInt({ gt: 0 }).withMessage("Id do usuário deve ser um número inteiro positivo."),

  // opcional: filtrar ativos (1) ou todos
  query("somente_ativos")
    .optional({ nullable: true })
    .isIn(["0", "1"]).withMessage("somente_ativos deve ser 0 ou 1."),

  handleValidation,
];

export const validateToggleGastoFixoAtivo = [
  param("id_gasto_fixo")
    .exists({ checkFalsy: true }).withMessage("id_gasto_fixo é obrigatório.")
    .bail()
    .isInt({ gt: 0 }).withMessage("id_gasto_fixo deve ser um número inteiro positivo."),

  query("id_usuario")
    .exists({ checkFalsy: true }).withMessage("id_usuario é obrigatório.")
    .bail()
    .isInt({ gt: 0 }).withMessage("id_usuario deve ser um número inteiro positivo."),

  body("ativo")
    .exists({ checkFalsy: true }).withMessage("ativo é obrigatório.")
    .bail()
    .isInt({ min: 0, max: 1 }).withMessage("ativo deve ser 0 ou 1."),

  handleValidation,
];