const mysql = require('mysql2');
const inquirer = require('inquirer');

// Configuração de conexão
const config = {
    host: 'localhost',
    user: 'root',
    password: 'Proz@2023',
    database: 'joaquim'
};

// Cria a conexão com o banco de dados
const connection = mysql.createConnection(config);

// Função para calcular a idade com base na data de nascimento
function calcularIdade(dataNascimento) {
    // Converte o formato DD/MM/YYYY para YYYY-MM-DD
    const [dia, mes, ano] = dataNascimento.split('/').map(Number);
    const nascimento = new Date(ano, mes - 1, dia); // Meses são baseados em zero
    const hoje = new Date();
    
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const diaAtual = hoje.getDate();
    
    // Ajusta a idade se a data de nascimento ainda não ocorreu este ano
    if (mesAtual < nascimento.getMonth() || (mesAtual === nascimento.getMonth() && diaAtual < nascimento.getDate())) {
        idade--;
    }
    
    return idade;
}

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
            type: 'input',
            name: 'dataNascimento',
            message: 'Digite a data de nascimento (no formato DD/MM/YYYY):',
            validate: value => {
                const [dia, mes, ano] = value.split('/').map(Number);
                const data = new Date(ano, mes - 1, dia);
                return !isNaN(data.getTime()) && dia > 0 && mes > 0 && mes <= 12 && dia <= new Date(ano, mes, 0).getDate() 
                       ? true 
                       : 'Digite uma data válida no formato DD/MM/YYYY.';
            }
        },
        {
            type: 'input',
            name: 'endereco',
            message: 'Digite o endereço:',
            validate: value => value ? true : 'Endereço não pode ser vazio.'
        }
    ]).then(answers => {
        const { nome, cpf, dataNascimento, endereco } = answers;
        const idade = calcularIdade(dataNascimento);
        console.log(`Idade calculada: ${idade} anos`);
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
