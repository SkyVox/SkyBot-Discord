const DM_CHANNEL = 'dm';

class Command {

    /**
     * Build a new Command.
     *
     * Values from this optional are:
     * optional[0]{CommandCategory#String} = Command category such Game|Fun|Gif etc.
     * optional[1]{String} = The SubCommand.
     * optional[2]{String[]} = Command permissions if has|null otherwise.
     * optional[3]{boolean} = If bot can or not execute this command.
     * optional[4]{boolean} = If this command uses or not reaction.
     *
     * @param {object[]} optional
     */
    constructor(optional) {
        this.category = optional[0];
        this.command = optional[1];
        this.permissions = optional[2];
        this.bot = optional[3];
        this.useReaction = optional.length >= 3 ? optional[4] : false;
    }

    /**
     * Check if the given @command contains|is a valid
     * command from @CommandCategory#value.
     * command==CommandCategory#value.
     *
     * @param {String} command
     * @returns {boolean}
     */
    isCommand(command) {
        let cmd = this.category.filter(str => { return str === command.toLowerCase() });
        return cmd.length > 0;
    }

    hasSubCommand() {
        return this.command != null && this.command !== 'undefined';
    }

    isAllowed(user, bot) {
        if (this.bot !== bot) return false;
        if (this.permissions == null || this.permissions === 'undefined') return true;
        for (let i in this.permissions) {
            let permission = this.permissions[i];
            if (user.hasPermission(permission)) return true;
        }
        return false;
    }

    /**
     * Triggered when user executes a
     * command which the given @category
     * and @command are equals to this.
     *
     * @param {Message} message
     * @param {String} args
     */
    async onCommand(message, args) {}

    /**
     * Triggered whether this command uses
     * reactions.
     *
     * @param {MessageReaction} reaction
     * @param {User} user
     * @returns {Promise<void>}
     */
    async onReactionAdd(reaction, user) {}

    // async onReactRemove() {}
}

module.exports = {
    dmChannel: DM_CHANNEL,
    Command: Command
};