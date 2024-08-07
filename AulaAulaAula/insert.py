import mysql.connector
#Dados de conexão
config = {
    'username': 'root',
    'password': 'Alunos@proz',
    'host': 'localhost',
    'database': 'joaquim',
}
try:
    #Estabelecer conexão
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

    #Iniciando Tranzação
    cursor.execute("START TRANSACTION")
    #Inserir dados
    sql_insert = "INSERT INTO Dados_Pessoais (nome, cpf, idade, endereco) values (%s, %s, %s, %s)"
    valores = ('joaquim', '12903821123', 18, 'Rua Teste')
    cursor.execute(sql_insert, valores)

    #Verificar dados
    sql_select = "SELECT * FROM Dados_Pessoais WHERE CPF = %s"
    cpf = ('12903821123',)
    cursor.execute(sql_select, cpf)

    #Armazenar Resultados

    resultado = cursor.fetchall()

    if resultado: 
        conn.commit()
        print("Dados inseridos com sucesso e transação confirmada. ")
    else:
        conn.rollback()
        print("Falha ao inserir dados e transação revertida. ")
        #Fechando conexão
except Exception as e:
    print("Erro ao conectar ao banco de dados: ", e)
    conn.rollback()

finally:
    if conn.is_connected():
        cursor.close()
        conn.close()
        print("Conexão encerrada. ")
        