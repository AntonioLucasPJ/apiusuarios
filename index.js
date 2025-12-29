import express from 'express'
import { prisma } from './node_modules/lib/prisma.js'
import cors from 'cors'
const app = express()
app.use(express.json())
const allowedOrigins = [
    process.env.CORS_ORIGINS ?? 'http://localhost:3000'
]
app.use(cors({
    origin(origin,callback){
        if(!origin || allowedOrigins.includes(origin)){
            callback(null,true)
        } else {
            callback(new Error(`Origin não permitido :${origin}`))
        }
    },
    methods:['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders:['Content-Type','Authorization']
}))
app.options('/usuarios',cors())
const port = 3000
let usuarios = ''

//Method GET
app.get('/usuarios', async (req, res) => {
    if(req.query){
        usuarios = await prisma.user.findMany({
            where: {
                nome: req.query.nome
            }
        })
    } else {
        usuarios = await prisma.user.findMany()
    }
    res.status(200).send(usuarios)
})
//Method POST
app.post('/usuarios', async (req, res) => {
    await prisma.user.create({
        data: {
            usuario: req.body.usuario.toLowerCase(),
            senha: req.body.senha,
            nome: req.body.nome.toLowerCase(),
            perfil: req.body.perfil.toLowerCase(),
            email: req.body.email.toLowerCase(),
            numero: req.body.numero,
            img: req.body.img
        }
    })
    res.status(201).send("Dados enviados para o Mongo DB")
    console.log(req.body)
})

//Method PUT 
app.put("/usuarios/:id", async (req, res) => {
    await prisma.user.update({
        where: {
            id: req.params.id
        },
        data: {
            usuario: req.body.usuario,
            senha: req.body.senha,
            nome: req.body.nome,
            perfil: req.body.perfil,
            email: req.body.email,
            numero: req.body.numero,
            img: req.body.img
        }
    })
    res.status(200).send("Dados editados na API")
})
//Method DELETE 
app.delete("/usuarios/:id", async (req, res) => {
    await prisma.user.delete({
        where:{
            id:req.params.id
        }
    })
    res.status(200).send("Usuario deletado na api")
})

app.listen(port, () => {
    console.log(`Api executando na porta ${port}`)
})