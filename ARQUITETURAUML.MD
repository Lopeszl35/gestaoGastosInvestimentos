classDiagram
    direction TB

    %% --- INFRAESTRUTURA ---
    class Server {
        +app: Express
        +port: Number
        +start()
    }

    class DependencyInjector {
        <<Service Locator>>
        +inject() Object
    }

    class MySQLPool {
        <<Database>>
        +getConnection()
        +query()
    }

    %% --- MÓDULO DE USUÁRIO ---
    class UserController {
        -userService: UserService
        +login(req, res)
        +register(req, res)
    }

    class UserService {
        -userRepository: userRepository
        +autenticarUsuario(email, senha)
        +criarUsuario(dados)
    }

    class userRepository {
        -connection: MySQLPool
        +findByEmail(email)
        +save(user)
    }

    %% --- MÓDULO DE GASTOS ---
    class GastoMesController {
        -gastoMesService: GastoMesService
        +addGasto(req, res)
        +getLimite(req, res)
    }

    class GastoMesService {
        -GastoMesRepository: GastoMesRepository
        +addGasto(gastos, id_usuario)
        +configGastoLimiteMes(id_usuario, dados)
        +getGastosTotaisPorCategoria(params)
    }

    class GastoMesRepository {
        -connection: MySQLPool
        +getSaldoAtual(id_usuario)
        +addGasto(gastos, id_usuario)
        +getLimiteGastosMes(id_usuario)
    }

    %% --- TRATAMENTO DE ERROS (HERANÇA) ---
    class ErroBase {
        <<Abstract>>
        +mensagem: String
        +status: Number
        +enviarResposta(res)
    }

    class ValidationError {
        +erros: Array
    }

    class ErroSqlHandler {
        +code: String
    }

    %% --- RELACIONAMENTOS DE DEPENDÊNCIA (Quem chama quem) ---
    Server ..> DependencyInjector : "Inicializa e usa"
    DependencyInjector --> UserController : "Instancia"
    DependencyInjector --> GastoMesController : "Instancia"
    
    UserController o-- UserService : "Agrega/Chama"
    UserService o-- userRepository : "Agrega/Chama"
    userRepository --> MySQLPool : "Consulta"

    GastoMesController o-- GastoMesService : "Agrega/Chama"
    GastoMesService o-- GastoMesRepository : "Agrega/Chama"
    GastoMesRepository --> MySQLPool : "Consulta"

    %% --- RELACIONAMENTOS DE HERANÇA ---
    ErroBase <|-- ValidationError
    ErroBase <|-- ErroSqlHandler
    
    %% --- NOTAS DE FLUXO ---
    note for Server "O ponto de entrada que configura as rotas\ne injeta os controladores prontos."
    note for GastoMesService "Aqui reside a lógica de negócio,\ncomo a validação de saldo insuficiente."