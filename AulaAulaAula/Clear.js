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

// Função para deletar dados com base no CPF
function deletarDados(cpf) {
    const sqlDelete = 'DELETE FROM Dados_Pessoais WHERE cpf = ?';

    connection.query(sqlDelete, [cpf], (err, results) => {
        if (err) {
            console.error('Erro ao deletar dados:', err.message);
            connection.end();
            return;
        }

        if (results.affectedRows > 0) {
            console.log(`Dados com CPF ${cpf} foram deletados com sucesso.`);
        } else {
            console.log(`Nenhum dado encontrado com o CPF ${cpf}.`);
        }

        connection.end();
    });
}

// Função para obter o CPF do usuário
function obterCPF() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'cpf',
            message: 'Digite o CPF do registro a ser deletado (somente números):',
            validate: value => /^\d{11}$/.test(value) ? true : 'Digite um CPF válido com 11 dígitos.'
        }
    ]).then(answers => {
        const { cpf } = answers;
        deletarDados(cpf);
    }).catch(error => {
        console.error('Erro ao obter CPF do usuário:', error.message);
        connection.end();
    });
}

// Conectar ao banco de dados e iniciar o processo de exclusão
connection.connect(err => {
    if (err) {
        return console.error('Erro ao conectar ao banco de dados:', err.message);
    }

    obterCPF();
});
