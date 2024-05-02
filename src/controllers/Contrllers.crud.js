//INCLUSÃO DAS DEPENCIAS NECESSARIAS PARA A MANIPULAÇÃO DOS DADOS
const express = require("express")
const Router_lab_app = express.Router()

const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

//importando a conexão com a base de dados # lab-app  E A TABELA OU MODEL TBESCOLA
const bdconnection = require("../database/connection")
const tbescola = require("../models/Model_Escola")



//Função intermediaria para realizar a busca da escola por ID e posteriomente excluir ou actualizar
// FUNÇÃO INTERMÉDIARIA (midleWare) PARA VERIFICAR  existencia da escola
async function findSchool(req, res, next) {
    try {
      const School = await tbescola.findByPk(req.params.ID_Escola);
      if (!School) {
        return res.status(404).json({ message: 'Escola não encontrada' });
      }
      res.School = School;
      next();
    } catch (err) {
      return res.status(500).json({ message:"Não foi possivel encontrar a escola \n",
                                    Erro:err.message 
                                });
    }
  }

// Rota para upload do arquivo CSV/*
/** MIDLEWARE PARA UPLOAD DO ARQUI CSV */
const storage = multer.diskStorage({
    //especificar o caminho para salvar o ficheiro de upload
    destination: function(req,file,cd){
        //indicando o caminho
        cd(null,`./public/arquivos_csv`)
    },
    //criando o nome do ficheiro
    filename: function(req,file,cd){
        cd(null, Date.now()+file.originalname)
    },
})

const Carregar_Ficheiro_CSV =multer({storage})

// Função para ler o arquivo CSV e retornar os dados como objeto JSON
async function parseCSV(filePath) {
    return new Promise((resolve, reject) => {
        const Dados = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => Dados.push(data))
            .on('end', () => {
                //
                resolve(Dados);
            })
            .on('error', (error) => {
                reject("Erro de leitura do Arquivo CSV "+error);
            });
    });
}

// MIDLEWARE PARA VERIFICAR SE A PROVINCIA DIGITADA PELO USUARIOEXISTE NO JSON


//CONSTRUÇÃO DAS ROTAS PARA AS OPERAÇÕES DO #CRUD

//ROTA PARA LISTAGEM DOS DADOS
Router_lab_app.get("/lab_app/read", async (req,res)=>{
    
    try {

        //listar os dados de escolaas registadas no banco de dados
        const listar_escola = await tbescola.findAll({raw:true})
        res.status(200).json(listar_escola)

    } catch (error) {
       
        res.status(400).json({
            message:"Falha na listagem das escolas registadas",
            erro:error.message
        })

    }
})
//ROTA PARA REGISTO DE NOVA ESCOLA
Router_lab_app.post("/lab_app/create",(req,res)=>{
    try {
        const {nome,email,numeroSalas,provincias} = req.body

        const newschool = tbescola.create({
           
            nome: nome,
            email: email,
            numeroSalas: numeroSalas,
            provincias: provincias

        }).then(list=>{
            res.status(200).json("Registo Concluido com Sucesso!")
        }).catch((error)=>{

            res.status(400).json({
                message:"Falha no registo de nova escola",
                erro:error.message
            })
            
        })

    } catch (error) {
        res.status(400).json({
            message:"Falha no registo de nova escola",
            erro:error.message
        })
    }
})
//**** FIM DA ROTA DE CRIAÇÃO DE NOVO REGISTO */

/*** ROTA DE ESCLUSÃO OU ELIMINAÇÃO DE REGISTO POR ID */
Router_lab_app.delete("/lab_app/delete/:ID_Escola",findSchool, async (req,res)=>{
    try {
        const DeleteSchool = await tbescola.destroy({where:{id:req.params.ID_Escola}});

        if(DeleteSchool)
            res.json({ message:"Registo de excluido com suCESSO!"})
        else
            res.json({ message:"Falha na exclusão de registo de nova escola..."})

    } catch (error) {
        res.status(400).json({
            message:"Falha no registo de nova escola",
            erro:error.message
        })
    }
})

/*** ROTA DE ACTUALIZAÇÃO DE REGISTO POR ID */
Router_lab_app.put("/lab_app/update/:ID_Escola",findSchool, async (req,res)=>{ 
    
    //CAPTURA DE DADOS PELO FORMULÁRIO
    const {nome,email,numeroSalas,provincias} = req.body 

    //
    try {
         
        if (nome) res.School.nome = nome;
        if (email) res.School.email = email;
        if (numeroSalas) res.School.numeroSalas = numeroSalas;
        if (provincias) res.School.provincias = provincias; 

        const updateSchool = await res.School.save();

        res.status(200).json({updateSchool});

    } catch (error) {
        res.status(400).json({
            message:"Falha na actualização de registo",
            erro:error.message
        })
    } 
    //
})

//** ROTA RESPONSAVEL POR SALVAR OS DADOS NA BASE DE DADOS */
Router_lab_app.post('/lab_app/upload_csv',Carregar_Ficheiro_CSV.single('file'), async (req, res) => {
    
  
    try {
       // Verifica se o arquivo é CSV
        if (req.file.mimetype !== 'text/csv') {
            return res.status(400).send('Apenas arquivos CSV são permitidos!');
        }

        // Lê o arquivo CSV e lista os dados em formato JSON
        const Caminho_do_ficheiro = req.file.path;
        const DadodosLido = await parseCSV(Caminho_do_ficheiro);

        // Ou, exibindo um por vez
        for (let i = 0; i < DadodosLido.length; i++) {
            console.log(`Dados da linha ${i + 1} como vetor:`);
            const vetor = Object.values(DadodosLido[i]);
            var  Linha = vetor.join(" ")
            var listarVetor = Linha.split(";")

            console.log("lista: "+listarVetor[0]);

            //salvar no banco de dados
            if(listarVetor[0].length >0 && listarVetor[1].length>0 && listarVetor[2].length>0 && listarVetor[3].length>0){
                const newschool = tbescola.create({
           
                    nome: listarVetor[0],
                    email: listarVetor[1],
                    numeroSalas: listarVetor[2],
                    provincias: listarVetor[3]
        
                })
            }
                
         
        }
        res.status(200).json("Ficheiro carregado com sucesso ! \n PArabéns, o armazenamento foi conluido com sucesso. ")

    } catch (error) {
        res.status(500).send('Erro ao processar o arquivo'+error);
    }

})


module.exports = Router_lab_app 

/*
*/

