import { body, param, query } from "express-validator";
import ErroValidacao from "../../errors/ValidationError.js";
import { validationResult } from "express-validator";

// helper para encerrar com erros padronizados
function handleValidation(req, _res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new ErroValidacao(errors.array()));
  return next();
}

// Função para normalizar nomes de categoria
export function normalizarNomeCategoria(nome) {
  return nome
    .trim()
    .toLowerCase()
    .normalize("NFD") // Remove acentos
    .replace(/[\u0300-\u036f]/g, "") // Remove diacríticos
    .replace(/\s+/g, " "); // Normaliza espaços múltiplos
}

export const validateCreateCategoria = [
    body("categoria").exists().withMessage("Objeto categoria obrigatório")
    .isObject().withMessage("categoria deve ser um objeto válido."),

    body("categoria.nome").trim()
    .exists().withMessage("Nome da categoria obrigatório")
    .isString().withMessage("Nome da categoria deve ser uma string.")
    .notEmpty().withMessage("Nome da categoria não pode ser vazio."),

    body("categoria.limite")
    .exists({ checkFalsy: true }).withMessage("Limite obrigatório")
    .isFloat({ min: 0 }).withMessage("Limite deve ser um número positivo."),

    handleValidation
];

export const validateGetCategorias = [
    param('id_usuario').exists().withMessage('Id do usuário obrigatório')
    .isInt({ gt: 0 }).withMessage('Id do usuário deve ser um número inteiro positivo.')
    .notEmpty().withMessage('Id do usuário não pode ser vazio.'),

    // opcionais
    query("ano")
      .optional()
      .isInt({ min: 2000, max: 2100 }).withMessage("Ano inválido."),

    query("mes")
      .optional()
      .isInt({ min: 1, max: 12 }).withMessage("Mês inválido."),

    handleValidation
];

export const validateDeleteCategoria = [
    query('id_categoria').exists().withMessage('Id da categoria obrigatório')
    .isInt({ gt: 0 }).withMessage('Id da categoria deve ser um número inteiro positivo.')
    .notEmpty().withMessage('Id da categoria não pode ser vazio.'),

    handleValidation
]