// INIT DO NOT TOUCH
const CONFIG = require('./config.json')
const { REST } = require('@discordjs/rest');
const nodemailer = require("nodemailer");
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
    Discord.Intents.FLAGS.GUILDS,
  ]
})

const Keyv = require('keyv');
const { config } = require('webpack');
const discord_email = new Keyv(CONFIG.DATABASE_URL, { namespace: 'discord_email' })
const code_email_temp = new Keyv(CONFIG.DATABASE_URL, { namespace: 'code_email_temp' })
const code_discord_temp = new Keyv(CONFIG.DATABASE_URL, { namespace: 'code_discord_temp' })
const ALPHANUM = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

code_discord_temp.clear()
code_email_temp.clear()

client.login(CONFIG.DISCORD_LOGIN_API_TOKEN).then(console.log('// LOGGED'))
client.once('ready', () => console.log('// RUN'))

// SETUP / COMMANDS FOR DISCORD
const rest = new REST({ version: '9' }).setToken(CONFIG.DISCORD_LOGIN_API_TOKEN);
rest.put(
  Routes.applicationGuildCommands(CONFIG.CLIENT_ID, CONFIG.GUILD_ID),
  {
    body: [
      new SlashCommandBuilder()
        .setName('verif')
        .setDescription('Vérifie ton email pour avoir accès au serveur.')
        .addStringOption(option =>
          option.setName('email')
            .setDescription('Ton email étudiant ex: PRENOM.NOM@etu.u-bordeaux.fr')
            .setRequired(true)
        ).toJSON(),
      new SlashCommandBuilder()
        .setName('code')
        .setDescription('Confirme ton email en utilisant le code recu par email.')
        .addStringOption(option =>
          option.setName('code')
            .setDescription('Le code que tu as recu par email.')
            .setRequired(true)
        ).toJSON(),
    ]
  },
)
// INIT END


client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  const MESSAGE_PREFIX = "<@"+interaction.member.id+">"
  // IF USER USE /VERIF COMMAND
  if (interaction.commandName === 'verif') {
    // GET THE EMAIL SENT WITH THE COMMAND AND TRANSFORM TO LOWERCASE
    let email_address = interaction.options.getString("email").toLowerCase()
    
    // CHECK IF EMAIL IS ALREADY VERIFIED AND LINKED
    Promise.all([discord_email.get(email_address)]).then((async discord_email =>{
      // CALL DB AND IF THE QUERY IS NOT EMPTY MEANS EMAIL ALREADY REGISTERED
      if(typeof discord_email[0] != 'undefined'){
        // REPLY ERROR MSG_ALREADY_VERIF
        interaction.reply({
          content: "Oops ! "+ MESSAGE_PREFIX + CONFIG.MSG_ALREADY_VERIF + "<@"+discord_email+">",
          ephemeral: true
        })
      }
      // IF EMAIL IS NOT VERIFIED, CHECK IF REGEX MATCH
      else if (new RegExp(CONFIG.EMAIL_REGEX).test(email_address)) {
        // CREATE TOKEN AND SAVE IT WITH EMAIL AS TEMP INFOS ON DB
        let code = makeid(6)
        code_email_temp.set(code, email_address, 10 * 60 * 1000)
        code_discord_temp.set(code, interaction.member.id, 10 * 60 * 1000)
        
        // CONFIG EMAIL
        let transporter = nodemailer.createTransport({
          host: CONFIG.EMAIL_HOST,
          port: 587,
          secure: false,
          auth: {
            user: CONFIG.HOST_USER, 
            pass: CONFIG.EMAIL_PWD, 
          },
          })
        // SEND EMAIL
        await transporter.sendMail({
          from: CONFIG.FROM_EMAIL, 
          to: email_address, 
          subject: CONFIG.EMAIL_SUBJECT, 
          text: CONFIG.EMAIL_MSG + code,
        }).then(
              // REPLY WITH  EMAIL SEND MESSAGE
              interaction.reply({
              content: MESSAGE_PREFIX + "\n\nNous avons envoyer un email à " + email_address + " contenant un code de vérification ! \nVérifie le code en envoyant /code [LeCode]\n\n `ex: /code Ad6r4`",
              ephemeral: true
            }))
            .catch(reason => console.log(reason))
      } else {
        // IF EMAIL DOES NOT MATCH REGEX SEND MSG_INVALID_EMAIL
        interaction.reply({
          content: MESSAGE_PREFIX +"\n\n"+CONFIG.MSG_INVALID_EMAIL,
          ephemeral: true
        })
      }
    }))
  }
  else if (interaction.commandName === 'code') {
    // GET THE CODE SENT WITH /CODE
    let token = interaction.options.getString("code")
    if (token.match(/^[a-zA-Z0-9]{6}$/)) {
      // FETCH TOKEN'S code_email_temp & code_discord_temp ON DB
      Promise.all([code_email_temp.get(token), code_discord_temp.get(token)])
      .then(([email_address, discord_id]) => {
          // CHECK IF TOKEN,EMAIL AND USERID MATCH THEN GIVE THE ROLE
          if (email_address && discord_id && discord_id === interaction.member.id) {
            // SAVE EMAIL LINKED TO USERID
            discord_email.set(email_address,interaction.member.id) 
            // ADD ROLE
            let role = interaction.guild.roles.cache.find(role => role.name === CONFIG.ROLE_NAME)
            interaction.member.roles.add(role)
            // REPLY WITH MSG_VERIFIED
            interaction.reply({
              content: "Bravo "+ MESSAGE_PREFIX+"!"+ CONFIG.MSG_VERIFIED,
              ephemeral: true 
            })
            // CLEAR TEMP VALUES ON DB
            code_discord_temp.clear(interaction.member.id)
            code_email_temp.clear(interaction.member.id)

          } else {
            // REPLY WITH MSG_INVALID_CODE
            interaction.reply({
              content: CONFIG.MSG_INVALID_CODE,
              ephemeral: true
            })
          }
        })
        .catch(reason => console.log(reason))
    }
  }
})

client.on('messageCreate', message => {
  if (message.author.bot) {
    return
  }
  // JOIN MSG
  if (message.channel.id === CONFIG.WELCOME_CHANNEL_ID) {
    MESSAGE_PREFIX ="<@"+message.author.id+">"
    if (message.type === 'GUILD_MEMBER_JOIN') {
      message.channel
        .send(MESSAGE_PREFIX + CONFIG.MSG_JOIN)
        .catch(reason => console.log(reason))
    }
  }
})

// FUNCTION TO GENERAGE THE CODE
makeid = length => [...Array(length)].map(() => ALPHANUM.charAt(Math.floor(Math.random() * ALPHANUM.length))).join('')
