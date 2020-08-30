import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { VoteType } from "src/vote/gqlTypes/vote.type";
import { NotificationType } from "src/notification/gqlTypes/notification.type";
import { Document } from "mongoose";

@Schema()
export class User extends Document {
    /**
     * The discord id of the user.
     */
    @Prop({ unique: true })
    id: string;
    /**
     * The discord tag of the user.
     */
    @Prop()
    tag: string;
    /**
     * The URL to the discord avatar of the user.
     */
    @Prop({ default: "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png", required: false })
    avatarUrl: string;
    /**
     * The bio of the user.
     */
    @Prop({ default: "", required: false })
    bio: string;
    /**
    * An array of botIds that the user owns. 
     */
    @Prop({ default: [], required: false })
    bots: string[];
    /**
    * Whether this is the first time the user has logged in. 
     */
    @Prop({ default: true, required: false })
    newUser: boolean;
    /**
    * An array of all the notifications for the user.
    */
    @Prop({ default: [], required: false })
    notifications: NotificationType[];
    /**
     * The token used to access the api for this user.
     */
    @Prop({ required: false, default: null })
    token: string;
    /**
     * Information about the user's last vote.
     */
    @Prop({
        default: { date: null, bot: null },
    })
    vote: VoteType;

}

export const UserSchema = SchemaFactory.createForClass(User);