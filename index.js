const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder')

const SERVER_HOST = process.env.SERVER_HOST || 'anchorhub.aternos.me'
const SERVER_PORT = parseInt(process.env.SERVER_PORT, 10) || 41246
const BOT_USERNAME = process.env.BOT_USERNAME || 'Pappu-Bhaiya'
const BOT_PASSWORD = process.env.BOT_PASSWORD || ''

function createBot() {
  const bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: BOT_USERNAME,
    password: BOT_PASSWORD,
    version: false
  })

  bot.loadPlugin(pathfinder)

  bot.once('spawn', () => {
    const mcData = require('minecraft-data')(bot.version)
    const defaultMove = new Movements(bot, mcData)
    bot.pathfinder.setMovements(defaultMove)
    chatLoop()
    randomWalk()
  })

  function chatLoop() {
    const messages = [
      "Pappu-Bhaiya OP!",
      "ShadowPlaYzZ OP!",
      "HVRgmrz7 OP!"
    ]

    let index = 0

    function sendNextMessage() {
      bot.chat(messages[index])
      index++
      if (index < messages.length) {
        setTimeout(sendNextMessage, 30000) // 30 seconds delay
      } else {
        index = 0
        setTimeout(sendNextMessage, 120000) // 2 minutes delay
      }
    }

    sendNextMessage()
  }

  function randomWalk() {
    setInterval(() => {
      const x = bot.entity.position.x + (Math.random() * 10 - 5)
      const y = bot.entity.position.y
      const z = bot.entity.position.z + (Math.random() * 10 - 5)
      const goal = new GoalNear(x, y, z, 1)
      bot.pathfinder.setGoal(goal, true)
    }, 15000) // every 15 seconds
  }

  bot.on('error', err => console.log('Error: ', err))
  bot.on('end', () => {
    console.log('Bot disconnected. Reconnecting...')
    setTimeout(createBot, 5000)
  })
}

createBot()
