//CRIAÇÃO DE CONEXÃO COM O BANCO DE DADO
const database = new sequelize("lab-app","root","",{
    host:"localhost",
    dialect:"mysql"
})

//VERIFICAR A AUTENTICIDADE DAS CREEDENCIAIS
database.authenticate().then(()=>{
     
    console.log({
        status:"",
        message:"Database Conected sucessfully! ...",
    })

}).catch((erro)=>{

    console.log({
        status:404,
        message:"Failed! Was not possible connect to the Database. ..."+erro    })
    
})

//EXPORTAÇÃO DA VARIAVEL DE CONEXAO PARA PERMITIR O ACESSO EM OUTROS CONTROLLES
module.exports=database