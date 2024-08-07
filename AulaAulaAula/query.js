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

// Função para consultar dados com base no CPF fornecido
function consultarDados(cpf) {
    const sqlSelect = 'SELECT * FROM Dados_Pessoais WHERE cpf = ?';

    connection.query(sqlSelect, [cpf], (err, results) => {
        if (err) {
            console.error('Erro ao consultar dados:', err.message);
        } else {
            if (results.length > 0) {
                console.log('Dados encontrados:', results);
            } else {
                console.log('Nenhum dado encontrado para o CPF fornecido.');
            }
        }

        // Fechar a conexão
        connection.end(err => {
            if (err) {
                console.error('Erro ao fechar a conexão:', err.message);
            }
        });
    });
}

// Função para obter o CPF do usuário
function obterCpf() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'cpf',
            message: 'Digite o CPF para pesquisar:',
            validate: function(value) {
                const valid = /^\d{11}$/.test(value); // Valida se o CPF tem exatamente 11 dígitos
                return valid || 'Digite um CPF válido com 11 dígitos.';
            }
        }
    ]).then(answers => {
        const cpf = answers.cpf;
        console.log(`Você digitou o CPF: ${cpf}`);
        consultarDados(cpf);
    }).catch(error => {
        console.error('Erro ao obter o CPF do usuário:', error.message);
        connection.end();
    });
}

// Conectar ao banco de dados e iniciar o processo
connection.connect(err => {
    if (err) {
        return console.error('Erro ao conectar ao banco de dados:', err.message);
    }

    obterCpf();
});
