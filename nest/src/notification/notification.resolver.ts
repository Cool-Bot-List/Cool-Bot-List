import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { NotificationService } from "./notification.service";
import { NotificationType } from "./gql-types/notification.type";
import { HttpException } from "@nestjs/common";

@Resolver()
export class NotificationResolver {
    constructor(private service: NotificationService) { }

    @Mutation(() => NotificationType)
    public updateNotification(@Args("userId") userId: string, @Args("indexOrMessage") indexOrMessage: string,
        @Args("method") method: string
    ): Promise<NotificationType | HttpException> {
        return this.service.update(userId, indexOrMessage, method);
    }

    @Mutation(() => [NotificationType])
    public updateAllNotifications(@Args("userId") userId: string, @Args("method") method: string): Promise<NotificationType[] | HttpException> {
        return this.service.updateAll(userId, method);
    }
}
