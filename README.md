# U-Bordeaux-Verif
   U-Bordeaux-Verif allows you to check that a discord user is a student at the university of Bordeaux thanks to his email @etu.u-bordeaux.fr

# Disclaimer
   This code is not 'Public' ready, I will rewrite it ASAP ! 
# Config
   For the bot to work properly you must create a config.json following config.json.template :

    {
        "DATABASE_URL"           : "sqlite://verified_users.db",
        "DISCORD_LOGIN_API_TOKEN": "BOT API TOKEN",
        
        "ROLE_NAME"              : "ROLE YOU WANT TO BE ADDED",
        "CLIENT_ID"              : "BOT ID",
        "GUILD_ID"               : "SERVER ID",
        "WELCOME_CHANNEL_ID"     : "CHANNEL ID WHERE THE BOT SEND MSG",
        
        "EMAIL_REGEX"            : ".*@etu.u-bordeaux.fr",
        "EMAIL_HOST"             : "smtpauth.u-bordeaux.fr",
        "HOST_USER"              : "ENT ID",
        "EMAIL_PWD"              : "ENT PASSWORD",

        "EMAIL_SUBJECT"          : "Discord U-Bordeaux Vérification CODE",
        "FROM_EMAIL"             : "YOURNAME.YOURLASTNAME@etu.u-bordeaux.fr",
        "EMAIL_MSG"              : "Voici ton code pour te vérifier sur discord : ",

        "MSG_INVALID_EMAIL"      : "Tu ne peux verifier que ton email étudiant \n`ex: PRENOM.NOM@etu.u-bordeaux.fr`",
        "MSG_ALREADY_VERIF"     : "\n\nCette email est déja verifié et liée à ",
        "MSG_INVALID_CODE"       : "Le code n'est pas bon :/",
        "MSG_JOIN"               : "\n\nBienvenue sur le serveur !\nAfin de te donner accès au serveur nous avons besoin de vérifier ton email etudiant !\n\nPour cela envoi /verif [tonEmailUBordeaux]\n`ex: /verif NOM.PRENOM@etu.u-Bordeaux.fr`",
        "MSG_VERIFIED"           : "\n\n Tu es maintenant vérifié !\nGrâce à cela tu peux avoir accès aux channels du serveur."
    }
# Demo
   It works using / commands on discord.<br/> 
   #1 On the welcome channel people are asked to register using /verif command followed by their @ student<br/>
   ![website preview](https://i.ibb.co/xG7rhmM/Screenshot-10.png)<br/> 
   #2 User use /verif [student@email.com]<br/> 
   Wrong email (not @etu.u-bordeaux.fr):<br/> 
       ![website preview](https://i.ibb.co/ncRWjVG/Screenshot-3.png)
       ![website preview](https://i.ibb.co/k5b11s8/Screenshot-4.png):<br/>
   Good email::<br/>
       ![website preview](https://i.ibb.co/m4WVwbQ/Screenshot-5.png)
       ![website preview](https://i.ibb.co/7SjZ2yd/Screenshot-6.png)<br/>
   Email sent on student's mailbox:<br/>
       ![website preview](https://i.ibb.co/7bsFnCH/Screenshot-11.png)<br/>
   #2 Student use /code [code]<br/>
   ![website preview](https://i.ibb.co/2FXPQ1m/Screenshot-9.png)
   ![website preview](https://i.ibb.co/bHxzpFg/Screenshot-8.png)<br/>
   Tadam ! the student gets the role 'verified' that grant access to our discord channels
