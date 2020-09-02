import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class NotificationType {
    /**
     * Whether this notification was marked as read by the user.
     */
    @Field()
    read: boolean;
    /**
     * The actual content of this notification.
     */
    @Field()
    message: string;
}