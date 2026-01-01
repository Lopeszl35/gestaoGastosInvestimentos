import NaoEncontrado from "../errors/naoEncontrado.js";

export default function manipulador404(req, res, next) {
  next(new NaoEncontrado('Recurso não encontrado', {caminho: req.originalUrl}, 404));
}
