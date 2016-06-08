# Telegram-Pokemon

This is a [Telegram](https://telegram.org/) bot ported from [Slack-Pokemon](https://github.com/rvinluan/slack-pokemon) for having Pokemon battles.

Here's an example battle:

<img src="https://dl.dropboxusercontent.com/u/61268700/telegram-bot.png" alt="Example Battle">

## Setting up

This is written in [Node.js.](http://nodejs.org) After installing Node, you also need to install [npm](https://npmjs.org) and [Redis.](http://redis.io/)

### Installing dependencies

The first step is to install all dependencies for the project

```Shell
$ npm install
```

### Creating a Telegram Bot

You'll need to contact [@BotFather](https://telegram.me/BotFather), and type `/newbot`.
The Bot Father will ask for you to type a **name** and an **identifier** for your bot and provide you with a **token**.

Within the source code, create a file called *config.js*, copy the template located at *config.template.js* and replace the `botToken` with the token you received from The Bot Father.

### Starting the server

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)    

However, if you would like set up the server manually through [Heroku](https://www.heroku.com/), you can read the following articles:

- [Node](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Redis to Go](https://addons.heroku.com/redistogo)

Please note that there is some RedisToGo/Heroku specific code in `state-machine.js`. Don't use that if you're using some other type of server.

### Running locally

To run locally, start Redis in a new tab:

```Shell
$ redis-server
```

and then start the node app:

```Shell
$ node index.js
```

Your app should now be running on `localhost:5000`.

##Features

Currently the battle system is a tiny fraction of Pokemon's actual battle system. It supports:

- one battle between a user and an NPC
- one pokemon per player (of any currently existing pokemon from Bulbasaur to Zygarde. No Volcanion, Diancie, or Hoopa.)
- moves with appropriate power and type effectiveness (moves can be Super Effective or Not Effective, etc.)

It currently does not support:

- taking stats into account when calculating damage (including accuracy and critical hits)
- levels, or stats based on levels (including EVs and IVs)
- ANY non-damaging moves
- secondary effects of damaging moves (status, buffs/debuffs, multi-hits)
- items and abilities
- multiple concurrent battles
- player vs player battles
