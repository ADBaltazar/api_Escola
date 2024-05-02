const database = require("../database/connection") 
const sequelize = require('sequelize')   

/**
 * 
 * CRIAÇÃO DA MODEL ("TABELA NO BANCO DE DADOS ")
 */
const Model_Escola = database.define('Tbescola',{
    nome:{
        type: sequelize.STRING,
        allowNull: false,
        unique: false // Define como único
    },
    email:{
        type: sequelize.TEXT,
        allowNull: false,
        unique: true// Define como único
    },
    numeroSalas:{
        type:sequelize.INTEGER,
        allowNull: false,
        unique: false, // Define como único,
        default:0
    },
    provincias:{
        type:sequelize.TEXT,
        allowNull: false, 
    } 
}) 

database.sync({

})
//EXPORTAR A MODEL CRIADA PARA A SUA RESPECTIVA UTILIZAÇÃO EM OUTRAS PARTES DO PROJECTO
module.exports = Model_Escola