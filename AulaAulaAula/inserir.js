/**const mysql = require('mysql2');
const inquirer = require('inquirer');

// Configuração de conexão
const config = {
    host: 'localhost',
    user: 'root',
    password: 'Proz@2023',AQ
    database: 'joaquim'
};

// Cria a conexão com o banco de dados
const connection = mysql.createConnection(config);

// Função para inserir dados e gerenciar transações
function inserirDados(nome, cpf, idade, endereco) {
    connection.beginTransaction(err => {
        if (err) {
            console.error('Erro ao iniciar transação:', err.message);
            return connection.end();
        }

        // SQL para inserir dados
        const sqlInsert = 'INSERT INTO Dados_Pessoais (nome, cpf, idade, endereco) VALUES (?, ?, ?, ?)';
        const valores = [nome, cpf, idade, endereco];

        connection.query(sqlInsert, valores, (err, results) => {
            if (err) {
                console.error('Erro ao inserir dados:', err.message);
                return connection.rollback(() => {
                    console.log('Transação revertida.');
                    connection.end();
                });
            }

            // Verificar dados inseridos
            const sqlSelect = 'SELECT * FROM Dados_Pessoais WHERE cpf = ?';
            connection.query(sqlSelect, [cpf], (err, results) => {
                if (err) {
                    console.error('Erro ao consultar dados:', err.message);
                    return connection.rollback(() => {
                        console.log('Transação revertida.');
                        connection.end();
                    });
                }

                if (results.length > 0) {
                    // Dados encontrados, confirma a transação
                    connection.commit(err => {
                        if (err) {
                            console.error('Erro ao confirmar transação:', err.message);
                            return connection.rollback(() => {
                                console.log('Transação revertida.');
                                connection.end();
                            });
                        }
                        console.log('Dados inseridos com sucesso e transação confirmada.');
                        connection.end();
                    });
                } else {
                    // Dados não encontrados, reverte a transação
                    connection.rollback(() => {
                        console.log('Falha ao inserir dados e transação revertida.');
                        connection.end();
                    });
                }
            });
        });
    });
}

// Função para obter dados do usuário
function obterDados() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'nome',
            message: 'Digite o nome:',
            validate: value => value ? true : 'Nome não pode ser vazio.'
        },
        {
            type: 'input',
            name: 'cpf',
            message: 'Digite o CPF (somente números):',
            validate: value => /^\d{11}$/.test(value) ? true : 'Digite um CPF válido com 11 dígitos.'
        },
        {
            type: 'number',
            name: 'idade',
            message: 'Digite a idade:',
            validate: value => value > 0 ? true : 'Idade deve ser um número positivo.'
        },
        {
            type: 'input',
            name: 'endereco',
            message: 'Digite o endereço:',
            validate: value => value ? true : 'Endereço não pode ser vazio.'
        }
    ]).then(answers => {
        const { nome, cpf, idade, endereco } = answers;
        inserirDados(nome, cpf, idade, endereco);
    }).catch(error => {
        console.error('Erro ao obter dados do usuário:', error.message);
        connection.end();
    });
}

// Conectar ao banco de dados e iniciar o processo
connection.connect(err => {
    if (err) {
        return console.error('Erro ao conectar ao banco de dados:', err.message);
    }

    obterDados();
});
*/