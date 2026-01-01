import { body, param, query, validationResult } from 'express-validator';
import ErroValidacao from '../../errors/ValidationError.js';
import ValidaEntradas from './ValidaEntradasGastos.js';
import RequisicaoIncorreta from '../../errors/RequisicaoIncorreta.js';

// helper para encerrar com erros padronizados
function handleValidation(req, _res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new ErroValidacao(errors.array()));
  return next();
}

export const validateGetLimiteGastoMes = [
    query('id_usuario').exists().withMessage('Id do usuário obrigatório')
    .isInt({ gt: 0 }).withMessage('Id do usuário deve ser um número inteiro positivo.')
    .notEmpty().withMessage('Id do usuário não pode ser vazio.'),

    query('ano').exists().withMessage('Ano obrigatório')
    .isInt({ min: 2000 }).withMessage('Ano deve ser um número inteiro válido.')
    .notEmpty().withMessage('Ano não pode ser vazio.'),

    query('mes').exists().withMessage('Mês obrigatório')
    .isInt({ min: 1, max: 12 }).withMessage('Mês deve ser um número inteiro entre 1 e 12.')
    .notEmpty().withMessage('Mês não pode ser vazio.'),

    handleValidation
]

export const validateConfigGastoLimiteMes = [
    param('id_usuario').exists().withMessage('Id do usuário obrigatório')
    .isInt({ gt: 0 }).withMessage('Id do usuário deve ser um número inteiro positivo.')
    .notEmpty().withMessage('Id do usuário não pode ser vazio.'),

    body('dadosMes').custom((value) => {
        if (typeof value !== 'object' || value === null) {
            throw new Error('dadosMes deve ser um objeto válido.');
        } 
        return true;
    }),

    body('dadosMes').custom((dadosMes, { req }) => {
        const id_usuario = req.params.id_usuario;
        ValidaEntradas.validarEntradaLimiteGastoMes({ id_usuario, dadosMes });
        return true;
    }),

    handleValidation
]

export const validateGetGastosTotaisPorCategoria = [
    query('id_usuario').exists().withMessage('Id do usuário obrigatório')
    .isInt({ gt: 0 }).withMessage('Id do usuário deve ser um número inteiro positivo.')
    .notEmpty().withMessage('Id do usuário não pode ser vazio.'),

    query('inicio').optional()
    .isDate({ format: 'YYYY-MM-DD' }).withMessage('Data inicio deve estar no formato YYYY-MM-DD.'),

    query('fim').optional()
    .isDate({ format: 'YYYY-MM-DD' }).withMessage('Data fim deve estar no formato YYYY-MM-DD.'),

    // Validação customizada para verificar se ambas as datas foram enviadas ou nenhuma
    query('inicio').custom((inicio, { req }) => {
        const { fim } = req.query;
        ValidaEntradas.validaDatas({ inicio, fim });
        return true;
    }),

    handleValidation
]

export const validateAddGasto = [
  query("id_usuario")
    .exists({ checkFalsy: true }).withMessage("Id do usuário é obrigatório.")
    .bail()
    .isInt({ gt: 0 }).withMessage("Id do usuário inválido."),

  body("gastos")
    .exists({ checkFalsy: true }).withMessage("Objeto 'gastos' é obrigatório.")
    .bail()
    .custom((value) => {
      if (typeof value !== "object" || value === null || Array.isArray(value)) {
        throw new Error("'gastos' deve ser um objeto.");
      }
      return true;
    }),

  body("gastos").custom((gasto, { req }) => {
    ValidaEntradas.ValidarGastos(req.query.id_usuario, gasto);
    return true;
  }),

  body("gastos.descricao")
  .optional()
  .trim()
  .isString()
  .withMessage("O campo 'descricao' deve ser uma string.")
  .isLength({ max: 100 })
  .withMessage("O campo 'descricao' deve conter no máximo 100 caracteres."),


  handleValidation,
];