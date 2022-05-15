// INIT DO NOT TOUCH
const CONFIG = require('./config.json')
const { REST } = require('@discordjs/rest');
const nodemailer = require("nodemailer");
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const { MessageAttachment } = require('discord.js')
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
client.once('ready', () => console.log('//RUN'))

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
        .setDescription('Confirme ton email en utilisant le code recu par e-mail.')
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
  if (!interaction.isCommand() || interaction.channel.id != CONFIG.WELCOME_CHANNEL_ID)return;
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
        })
        const EmbedEmailSent = {
          color: 0x93C47D,  
          author: {
            name: interaction.guild.name,
          },
          
          description: `<@${interaction.member.id}>\nNous avons envoyer un e-mail à ${email_address} contenant le code ce vérification.\nUtilise la commande /code [le CODE] pour valider ! \n\n\`ex : /code 7a4Ec\``,
          image: {
            url: 'https://i.ibb.co/yBdkBPt/Likable-Palatable-Flyingfish-max-1mb.gif',
          },
          timestamp: new Date(),
        }
        interaction.reply({ embeds: [EmbedEmailSent],ephemeral: true})
      } else {
        // IF EMAIL DOES NOT MATCH REGEX SEND MSG_INVALID_EMAIL
        const EmbedError = {
          color: 0xCC0000,  
          author: {
            name: interaction.guild.name,
          },
          
          description: `<@${interaction.member.id}>\nTu ne peux verifier que ton e-mail étudiant !\n\n\`ex: PRENOM.NOM@etu.u-bordeaux.fr\``,
          image: {
            url: 'https://i.ibb.co/sm3TN5t/ralph-the-simpsons.gif',
          },
          timestamp: new Date(),
        }
        interaction.reply({ embeds: [EmbedError],ephemeral: true})
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
            const EmbedVerified = {
              color: 0x93C47D,  
              author: {
                name: interaction.guild.name,
              },
              
              description: `Bravo <@${interaction.member.id}> !\nTu est maintenant vérifié ! `,
              image: {
                url: 'https://i.ibb.co/0mhh4zB/4ToY.gif',
              },
              timestamp: new Date(),
            }
            interaction.reply({ embeds: [EmbedVerified],ephemeral: true})
            // CLEAR TEMP VALUES ON DB
            code_discord_temp.clear(interaction.member.id)
            code_email_temp.clear(interaction.member.id)
            console.log(`Verified : ${interaction.member.id} - ${new Date()}`)

          } else {
            // REPLY WITH MSG_INVALID_CODE
            const EmbedWrong = {
              color: 0xCC0000,  
              author: {
                name: interaction.guild.name,
              },
              
              description: `<@${interaction.member.id}>\nMauvais code :/`,
              image: {
                url: 'https://i.ibb.co/sm3TN5t/ralph-the-simpsons.gif',
              },
              timestamp: new Date(),
            }
            interaction.reply({ embeds: [EmbedWrong],ephemeral: true})
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
    if (message.type === 'GUILD_MEMBER_JOIN') {
      const EmbedJoin = {
        color: 0x0099ff,  
        author: {
          name: message.guild.name,
        },
        
        description: `Hola <@${message.member.id}> !\nBienvenue sur LE serveur des L1 de Bordeaux, tu es la ${client.guilds.cache.get(CONFIG.GUILD_ID).memberCount}ieme personne à nous rejoindre.`,
        fields: [
          {
            name: 'Pour acceder aux salons :',
            value: `Nous avons besoin de vérifier ton adresse e-mail etudiante, pour cela envois /verif [ton Email].\n\n\`ex: /verif bart.simpson@etu.u-bordeaux.fr\`\n\n\n Si tu as besoin d'aide :\n<#${966616866275614770}>`,
          }
        ],
        image: {
          url: 'https://i.ibb.co/SKprctj/rafa-los-simpson.gif',
        },
        timestamp: new Date(),
      }
      message.channel.send({ embeds: [EmbedJoin]})
    }
    message.delete()
  }
})
// FUNCTION TO GENERAGE THE CODE
makeid = length => [...Array(length)].map(() => ALPHANUM.charAt(Math.floor(Math.random() * ALPHANUM.length))).join('')
