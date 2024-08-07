/**const mysql = require('mysql2');

// Configuração de conexão
const config = {
    host: 'localhost',
    user: 'root',
    password: 'Proz@2023',
    database: 'joaquim'
};

// Cria a conexão com o banco de dados
const connection = mysql.createConnection(config);

// Conectar ao banco de dados
connection.connect(err => {
    if (err) {
        return console.error('Erro ao conectar ao banco de dados:', err.message);
    }

    // Consulta dados
    const sqlSelect = 'SELECT * FROM Dados_Pessoais WHERE cpf = ?';
    const cpfParaPesquisar = '1234455657742'; // Exemplo de CPF a ser pesquisado

    connection.query(sqlSelect, [cpfParaPesquisar], (err, results) => {
        if (err) {
            console.error('Erro ao consultar dados:', err.message);
        } else {
            if (results.length > 0) {
                // Exibir os resultados encontrados
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
});
*/