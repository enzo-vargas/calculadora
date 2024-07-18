// 0. Definindo variáveis

const express = require('express');
const cors = require ('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const pool = require("./db");
  


// 1. Função que calcula resultado da operação

 function calculateResult(expression) {
    

    try{
        var currentDisplay = expression;
        var result =  eval(currentDisplay);
        currentDisplay += "\n= " + result.toString();
        
    } catch {
        currentDisplay += "\n Error"
    }

    return result;

}


// 2. POST que chama função calculateResult() e armazena dados no banco

app.post('/calculate', async (req, res) => {

    var resultOperation = calculateResult(req.body.expression);
    
    const client = await pool.connect();

    try {
        console.log("iniciando query no banco");
        console.log(req.body.expression);
        console.log(resultOperation);
        const result =  await client.query(
            'INSERT INTO calculadora (expression, result) VALUES ($1, $2) RETURNING *',
            [req.body.expression, resultOperation]
          );
          console.log(result);
          
          res.status(201).json({
            message: "Novo registro criado com sucesso!",
            usuario: result.rows[0]
          });
          console.log("res status");
        } catch (error) {
          console.error('Erro ao criar novo registro:', error);
          res.status(500).json({ error: 'Erro interno do servidor' });
        } finally {
            client.release();
        }

        console.log("res send");
    res.send(resultOperation);

})

// 3. Log app online

app.listen(PORT,() => {
    console.log(`App online na porta ${PORT}`)
})


// 4. GET que puxa histórico do banco

app.get('/calculate', async (req, res) => {
    
    const client = await pool.connect();

    try {
    
        const expression =  await client.query(
            'SELECT expression FROM calculadora'
          );
        
        const result =  await client.query(
            'SELECT result FROM calculadora'
          );
          
          res.status(201).json({
            message: "GET feito com sucesso!",
            historic: {
                        expression:expression,
                        result:result
            }
          });
        } catch (error) {
          console.error('Erro ao criar novo registro:', error);
          res.status(500).json({ error: 'Erro interno do servidor' });
        } finally {
            client.release();
        }

})