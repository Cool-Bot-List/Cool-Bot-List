import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Bot } from "src/bot/bot.schema";
import { User } from "src/user/user.schema";
import { Review } from "src/review/review.schema";

@WebSocketGateway()
export class EventsGateway {

    @WebSocketServer()
    private socket: Server;


    public emitNewBot(bot: Bot): SocketIO.Namespace {
        return this.socket.emit("new-bot", bot);
    }

    public emitBotUpdate(bot: Bot): SocketIO.Namespace {
        return this.socket.emit("bot-update", bot);
    }

    public emitBotDelete(bot: Bot): SocketIO.Namespace {
        return this.socket.emit("bot-delete", bot);
    }

    public emitNewNotification(user: User): SocketIO.Namespace {
        return this.socket.emit("new-notification", user);
    }

    public emitNotificationUpdate(user: User): SocketIO.Namespace {
        return this.socket.emit("notification-update", user);
    }

    public emitNewUser(user: User): SocketIO.Namespace {
        return this.socket.emit("new-user", user);
    }

    public emitUserUpdate(user: User): SocketIO.Namespace {
        return this.socket.emit("user-update", user);
    }

    public emitUserDelete(user: User): SocketIO.Namespace {
        return this.socket.emit("user-delete", user);
    }

    public emitNewReview(review: Review): SocketIO.Namespace {
        return this.socket.emit("new-review", review);
    }

    public emitReviewUpdate(review: Review): SocketIO.Namespace {
        return this.socket.emit("review-update", review);
    }

    public emitReviewLike(review: Review, user: User, userToPushTo: User, like: boolean): SocketIO.Namespace {
        return this.socket.emit("review-like", review, user, userToPushTo, like);
    }

    public emitReviewDislike(review: Review, user: User, userToPushTo: User, dislike: boolean): SocketIO.Namespace {
        return this.socket.emit("review-dislike", review, user, userToPushTo, dislike);
    }

    public emitReviewDelete(review: Review): SocketIO.Namespace {
        return this.socket.emit("review-delete", review);
    }

    public emitNewOwnerReply(review: Review, owner: User, userToPushTo: User): SocketIO.Namespace {
        return this.socket.emit("new-owner-reply", review, owner, userToPushTo);
    }

    public emitOwnerReplyUpdate(review: Review, owner: User): SocketIO.Namespace {
        return this.socket.emit("owner-reply-update", review, owner);
    }

    public emitOwnerReplyLike(review: Review, user: User, like: boolean): SocketIO.Namespace {
        return this.socket.emit("owner-reply-like", review, user, like);
    }

    public emitOwnerReplyDislike(review: Review, user: User, dislike: boolean): SocketIO.Namespace {
        return this.socket.emit("owner-reply-dislike", review, user, dislike);
    }

    public emitOwnerReplyDelete(review: Review): SocketIO.Namespace {
        return this.socket.emit("owner-reply-delete", review);
    }

    public emitNewVote(user: User, bot: Bot): SocketIO.Namespace {
        return this.socket.emit("new-vote", user, bot);
    }

}
