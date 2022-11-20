const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

const app = express();

connection
  .authenticate()
  .then(() => {
    console.log("Conexão feita com o Banco de Dados.");
  })
  .catch((msgErro) => {
    console.log(msgErro);
  });

app.set("view engine", "ejs"); //Usando o EJS como View Engine
app.use(express.static("public")); //Importando arquivos estáticos
app.use(bodyParser.urlencoded({ extended: false })); //Body parser
app.use(bodyParser.json());

app.get("/", (req, res) => {
  Pergunta.findAll({raw: true, order: [['id', 'DESC']]}).then(perguntas => {
    res.render("index", {
      perguntas: perguntas
    });
  });
});

app.get("/perguntar", (req, res) => {
  res.render("perguntar");
});

app.post("/salvarpergunta", (req, res) => {
  var titulo = req.body.titulo;
  var descricao = req.body.descricao;
  Pergunta.create({
    titulo: titulo,
    descricao: descricao
  }).then(() => {
    res.redirect("/");
  });
});

app.get("/pergunta/:id", (req, res) => {
  var id = req.params.id
  Pergunta.findOne({
    where: {id: id}
  }).then((pergunta) => {
    if(pergunta != undefined){
      Resposta.findAll({
        where: {perguntaId: pergunta.id},
        order: [["id", "DESC"]]
      }).then(respostas => {
        res.render("pergunta", {
          pergunta: pergunta,
          respostas: respostas
        });
      })
    } else {
      res.redirect("/")
    }
  })
});

app.post("/salvarresposta", (req, res) => {
  var corpo = req.body.corpo;
  var perguntaId = req.body.pergunta;
  Resposta.create({
    corpo: corpo,
    perguntaId: perguntaId
  }).then(() => {
    res.redirect("/pergunta/" + perguntaId);
  });
});

app.listen(8080, () => {
  console.log("App running!");
});
