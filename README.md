# U-Bordeaux-Verif
    # OniriiK#2908
    # https://github.com/Oniriik

# LANG - FR

    U-Bordeaux-Verif permet de vérifier qu'un utilisateur discord est bien étudiant à l'université de bordeaux grâce a son email @etu.u-bordeaux.fr

    Pour que le bot fonctionne correctement vous devez remplir un fichier config.json suivant config.json.template :

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

# LANG - EN 
    U-Bordeaux-Verif allows you to check that a discord user is a student at the university of Bordeaux thanks to his email @etu.u-bordeaux.fr

    For the bot to work properly you must fill in a config.json file following config.json.template :

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