const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://MarcMartinez:superlocal@cluster0-idx6q.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri);

var bodyParser = require('body-parser');
var express = require('express');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var users = [];
var cartasDB = [];
var mazosDB = [];


var userLogin;
var cartas = [];
var mazos = [];
var cartasMazos = [];
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.send('Hola');
});


app.get('/login', function(req, res) {
    res.render('index');
});

app.post('/login', function(req, res){
  var correcto = false;
  for (var i = 0; i < users.length; i++) {
    if(users[i].nameUser == req.body.name && users[i].passUser == req.body.pass){
      correcto = true;
      userLogin = users[i];
      break;
    }
  }

  if (correcto == true) {

    listCartasYMazos();


    res.render('user', {
      usuario: userLogin,
      listaCartas: cartas,
      listaMazos: mazos,
	  cartasDelMazos : cartasMazos
    });

  } else if (correcto == false) {
    res.send("El usuario es incorrecto.");
  }
});

function listCartasYMazos() {
  console.log("");

  for (var i = 0; i < cartasDB.length; i++) {
    for (var x = 0; x < userLogin.userColection.length; x++) {
      if (cartasDB[i].id == userLogin.userColection[x]) {
        cartas.push(cartasDB[i]);
      }
    }
  }

  for (var i = 0; i < mazosDB.length; i++) {
    for (var x = 0; x < userLogin.userDecks.length; x++) {
      if (mazosDB[i].deckID == userLogin.userDecks[x]) {
        mazos.push(mazosDB[i]);
      }
    }
  }
    for (var i = 0; i < mazosDB.length; i++) {
    cartasMazos.push(mazosDB[i].infoCartas);
  }
}


async function main(){
    try {
        await client.connect();
        console.log("");
        console.log("LEAGUE OF RUNETERRA");
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

MongoClient.connect(uri, function(err, db) {

  if (err) throw err;
    var dbo = db.db("LeagueOfRuneterra");
    dbo.collection("Users").find({}).toArray(function(err, result) {
      if (err) throw err;
        users = result;
        db.close();
    });

  if (err) throw err;
    var dbo = db.db("LeagueOfRuneterra");
    dbo.collection("Cartas").find({}).toArray(function(err, result) {
      if (err) throw err;
        cartasDB = result;
        db.close();
    });

  if (err) throw err;
    var dbo = db.db("LeagueOfRuneterra");
    dbo.collection("Decks").find({}).toArray(function(err, result) {
      if (err) throw err;
        mazosDB = result;
        db.close();
    });
});



app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});
