class ErroSqlHandler {
    static tratarErroSql(error, entidade) {
        if (error.code === 'ER_DUP_ENTRY') {
            return this.tratarErroDuplicado(error, entidade);
        }
        if (error.code === 'ER_BAD_NULL_ERROR') {
            return this.tratarErroCamposNulos(error, entidade);
        } 
        if (error.code === 'ER_NO_SUCH_TABLE') {
            return this.tratarErroTabelaNaoEncontrada(error, entidade);
        }
        if (error.code === 'WARN_DATA_TRUNCATED') {
            return this.tratarErroTruncamentoDeDados(error, entidade);
        }
        if (error.code === 'ER_BAD_FIELD_ERROR') {
            return this.tratarErroCamposInvalidos(error, entidade);
        }
        throw error;
    }

    static tratarErroDuplicado(error, entidade) {
        switch (entidade) {
            case 'usuario':
                if (error.message.includes('email')) {
                    throw new Error('Email já cadastrado para Usuário');
                } else if (error.message.includes('RG')) {
                    throw new Error('RG já cadastrado para Paciente');
                } else if (error.message.includes('CartaoSUS')) {
                    throw new Error('Cartão SUS já cadastrado para Paciente');
                } else if (error.message.includes('Email')) {
                    throw new Error('Email já cadastrado para Paciente');
                } 
                break;

            case 'profissional':
                if (error.message.includes('CPF')) {
                    throw new Error('CPF já cadastrado para Profissional');
                } else if (error.message.includes('registroProfissional')) {
                    throw new Error('Registro profissional já cadastrado');
                } else if (error.message.includes('Email')) {
                    throw new Error('Email já cadastrado para Profissional');
                } else if (error.message.includes('RG')) {
                    throw new Error('RG já cadastrado para Profissional');
                }
                break;

            case 'usuario':
                if (error.message.includes('Email')) {
                    throw new Error('Email já cadastrado para Usuário');
                }
                break;

            case 'horarios':
                if (error.message.includes('ID_Profissional')) {
                    throw new Error('Horário ja cadastrado para Profissional nesta data');
                }
                break;

            // Adicione mais entidades conforme necessário
            default:
                throw new Error(`Erro de duplicação em ${entidade}: ${error.message}`);
        }
        throw error;
    }

    static tratarErroCamposNulos(error, entidade) {
        switch (entidade) {
            case 'horarios':
                if (error.message.includes('Data')) {
                    throw new Error('Data nula');
                } else if (error.message.includes('HoraInicio')) {
                    throw new Error('Hora de inicio nula');
                } else if (error.message.includes('HoraFim')) {
                    throw new Error('Hora de fim nula');
                }
                break;

            case 'agendamento':
                if (error.message.includes('Data_Hora')) {
                    throw new Error('Data e hora não podem ser nulas');
                }   
                if (error.message.includes('Prontuario')) {
                    throw new Error('Paciente deve ser informado para agendamento');
                }
                break;
            case 'servicos':
                if (error.message.includes('Sexo')) {
                    throw new Error('Sexo não pode ser nulo, informe o sexo do paciente, contate o desenvolvedor');
                }
                break;
            case 'paciente':
                if (error.message.includes('Sexo')) {
                    throw new Error('Sexo não pode ser nulo, informe o sexo do paciente, contate o desenvolvedor');
                }
                break;

        }
    }

    static tratarErroTabelaNaoEncontrada(error, entidade) {
        switch (entidade) {
            case 'profissional':
                if (error.message.includes('Usuarios')) {
                    throw new Error('Tabela Usuarios não encontrada no banco de dados. Entre em contato com o desenvolvedor.');
                }
                if (error.message.includes('Horarios')) {
                    throw new Error('Tabela Horarios nao encontrada no banco de dados. Entre em contato com o desenvolvedor.');
                }
                if (error.message.includes('Agendamentos')) {
                    throw new Error('Tabela Agendamentos nao encontrada no banco de dados. Entre em contato com o desenvolvedor.');
                }
                if (error.message.includes('Servicos')) {
                    throw new Error('Tabela Servicos nao encontrada no banco de dados. Entre em contato com o desenvolvedor.');
                }
                if (error.message.includes('Profissional')) {
                    throw new Error('Tabela Profissional nao encontrada no banco de dados. Entre em contato com o desenvolvedor.');
                }
                break;
        }
    }

    static tratarErroTruncamentoDeDados(error, entidade) {
        switch (entidade) {
            case 'paciente':
                if (error.message.includes('Sexo')) {
                    throw new Error('Sexo truncado para Paciente, Por Favor informe o sexo completo, Masculino ou Feminino.');
                }
        }
    }

    static tratarErroCamposInvalidos(error, entidade) {
        switch (entidade) {
            case 'paciente':
                if (error.message.includes('Sexo')) {
                    throw new Error('Tabela Sexo nao encontrada no banco de dados. Entre em contato com o desenvolvedor.');
                }
                if (error.message.includes('Cidade')) {
                    throw new Error('Tabela Cidade nao encontrada no banco de dados. Entre em contato com o desenvolvedor.');
                }
                if (error.message.includes('Estado')) {
                    throw new Error('Tabela Estado nao encontrada no banco de dados. Entre em contato com o desenvolvedor.');
                }
                if (error.message.includes('Bairro')) {
                    throw new Error('Tabela Bairro nao encontrada no banco de dados. Entre em contato com o desenvolvedor.');
                }
                if (error.message.includes('Rua')) {
                    throw new Error('Tabela Rua nao encontrada no banco de dados. Entre em contato com o desenvolvedor.');
                }
                if (error.message.includes('Raça')) {
                    throw new Error('Tabela Raça nao encontrada no banco de dados. Entre em contato com o desenvolvedor.');
                }
        }
    }


}

export default ErroSqlHandler;