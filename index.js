var express = require('express'),
    bodyParser = require('body-parser'),
    //Communicate with the PokeAPI
    pokeapi = require('./poke-api.js'),
    //Generate messages for different situations
    battleText = require('./battle-text.js'),
    //Communicate with Redis
    stateMachine = require('./state-machine.js'),
    //Node Telegram Bot API Wrapper
    botAPI = require('node-telegram-bot-api'),
    //Misc configurations
    config = require('./config.js'),
    app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(request, response) {
  response.send('Hello There!')
});

/*
*
* Create an instance of the bot
* using the provided Telegram Bot Token.
*
* Telegram can't make requests to a local server,
* so a web hook is used in production and polling mode
* is used for development.
*
*/

var bot;

if(process.env.NODE_ENV === 'production') {
  bot = new botAPI(config.botToken);
  bot.setWebHook(config.prodURL + bot.token);
} else {
  bot = new botAPI(config.botToken, { polling: true });
}

app.post('/' + config.botToken, function(req, res){
  bot.processUpdate(req.body);
  res.sendStatus(200);
});
//Help
bot.onText(/\/help/, function(msg, match){
  return bot.sendMessage(msg.chat.id,
    '/start - Start a new battle against the, not so smart, AI. /n' +
    '/choose - Choose your own Pokemon./n' +
    '/attack - Attack your opponent using a specific move./n' +
    '/end - Finish your existing battle.')
});
//Start a new battle
bot.onText(/\/start/, function(msg, match) {
  battleText.startBattle(msg.from, msg.chat)
  .then(
    function(startObj){
      bot.sendMessage(msg.chat.id, startObj.text);
      return bot.sendMessage(msg.chat.id, startObj.spriteUrl);
    },
    function(err) {
      console.log(err);
      return bot.sendMessage(msg.chat.id, "Something went wrong. " + err);
    }
  );
});

//End an existing battle
bot.onText(/\/end/, function(msg, match){
  battleText.endBattle()
  .then(
    function(){
      return bot.sendMessage(msg.chat.id, "Battle Over.");
    },
    function(err){
      console.log(err);
      return bot.sendMessage(msg.chat.id, "Couldn't end the battle. " + err);
    }
  );
});

//User chooses a pokemon
bot.onText(/\/choose (.+)/, function(msg, match){
  var pokemon = match[1];
  if(!pokemon || !pokemon.length){
    return bot.sendMessage(msg.chat.id, "Please type the name of your Pokemon: ex. /choose Totodile");
  }
  battleText.userChoosePokemon(pokemon.toLowerCase())
  .then(
    function(chosenObject){
      bot.sendMessage(msg.chat.id, chosenObject.text);
      return bot.sendMessage(msg.chat.id, chosenObject.spriteUrl);
    },
    function(err){
      console.log(err);
      return bot.sendMessage(msg.chat.id, "I don't think that's a real Pokemon. " + err);
    }
  );
});

//Attack the opponent
bot.onText(/\/attack (.+)/, function(msg, match){
  var move = match[1];
  if(!move || !move.length){
    return bot.sendMessage(msg.chat.id, "Please type the name of your Move: ex. /attack Slash");
  }
  battleText.useMove(move.toLowerCase())
  .then(
    function(results){
      if(results[1] === "You Beat Me!") {
        return bot.sendMessage(msg.chat.id, results[1]);
      } else if (results[0] === "You Lost!") {
        return bot.sendMessage(msg.chat.id, results[0]);
      } else {
        bot.sendMessage(msg.chat.id, results[0]);
        return bot.sendMessage(msg.chat.id, results[1]);
      }
    },
    function(err){
      console.log(err);
      return bot.sendMessage(msg.chat.id, "You can't use that move. " + err)
    }
  )
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});
