//IMPORTAÇÃO DAS DEPENDENCIAS express, end body-parser
const express = require("express") 
const bodyParser = require('body-parser');

const app = express()

//CONFIGURANDO PARA QUE SEJA LIDO ARQUIVOS OU DADOS JSON E A CAPTURA DE DADOS PELA URL USANDO BODY-PARSER
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"))

//MPORTANDO A CONTROLLES RESPONSAVEL PELAS OPERAÇÕES DO CRUD
const controll_crud = require("./controllers/Contrllers.crud")

//CRIAÇÃO DA ROTA PRINCIPAL PARA EXIBIR A PRIMEIRA VIEW
app.use('/',controll_crud)
app.get('/',(req,res)=>{
    try {
        res.json({
            status:'400',
            message:"SEJA BEM VINDO AO LAB-APP",   
        })
    } catch (error) {
        res.json({
            status:'401',
            message:"ERRO, PAGINA NÃO EXISTE",
            
        })
    }
   
})


//CRIAÇÃO DO SERVIDOS NA PORTA 3000
app.listen(3000,(req,res,erro)=>{
    if(erro)
        console.log("Erro o rodar o servidor ")
    else
        console.log("Revidor Rodando na por 3000 ")     
})
