const defaultPrefix = '/';
const DM = 'dm';

module.exports = {
    dm: DM,
    defaultPrefix: defaultPrefix,
    Command: class Command {

        constructor(optional) {
            this.prefix = optional[0];
            this.aliases = optional[1];
            this.permissions = optional[2];
            this.bot = optional[3];
        }

        isCommand(prefix) {
            if (!prefix.startsWith(defaultPrefix)) return null;

            prefix = prefix.slice(defaultPrefix.length);
            if (this.prefix.toLowerCase() != prefix.toLowerCase()) {
                if (this.aliases == null || this.aliases.length === 0) return false;
                for (let i in this.aliases) {
                    let str = this.aliases[i];
                    if (str.toLowerCase() === prefix.toLowerCase()) {
                        return defaultPrefix + prefix;
                    }
                }
                return null;
            }

            return defaultPrefix + prefix;
        }

        isAllowed(user, bot) {
            if (this.bot != bot) return false;
            if (this.permissions == null || this.permissions === 'undefined') return true;
            for (let i in this.permissions) {
                let permission = this.permissions[i];
                if (user.hasPermission(permission)) return true;
            }
            return false;
        }

        /**
         * 
         * @param {Message} message 
         */
        async runCommand(message, args) {
            message.channel.send([
                "You have executed this command through " + args.split(" ")[0] + "."
            ]);
        }
    }
};