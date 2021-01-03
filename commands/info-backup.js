const Discord = require('discord.js');
const backup = require('discord-backup');

exports.run = async (client, message, args) => {

    // If the member doesn't have enough permissions
    if(!message.member.hasPermission('MANAGE_MESSAGES')){
        return message.channel.send(':x: You need to have the manage messages permissions to create a backup in this server.');
    }

    const backupID = args.join(' ');

    if (!backupID)
        return message.channel.send(':x: Please specify a valid backup ID!');

    backup.fetch(backupID).then((backup) => {

        const date = new Date(backup.data.createdTimestamp);
        const yyyy = date.getFullYear().toString(), mm = (date.getMonth()+1).toString(), dd = date.getDate().toString();
        const formattedDate = `${yyyy}/${(mm[1]?mm:"0"+mm[0])}/${(dd[1]?dd:"0"+dd[0])}`;

        const embed = new Discord.MessageEmbed()
            .setAuthor('ℹ️ Backup', backup.data.iconURL)
            .addField('Server name', backup.data.name)
            .addField('Size', backup.size + ' kb')
            .addField('Created at', formattedDate)
            .setFooter('Backup ID: '+backup.id);

        return message.channel.send(embed);

    }).catch((err) => {

        if (err === 'No backup found')
            return message.channel.send(':x: No backup found for ID '+backupID+'!');
        else
            return message.channel.send(':x: An error occurred: '+(typeof err === 'string') ? err : JSON.stringify(err));

    });

};
