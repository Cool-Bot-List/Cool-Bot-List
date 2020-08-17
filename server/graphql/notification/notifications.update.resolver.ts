
import INotification from "../../types/INotification";

const NotificationUpdateResolver = {
    Notification: {
        update: (parent: INotification , { method }: { method: "read" | "unread" }) => {
            console.log(parent);
            return parent;
        }
    }
}

export default NotificationUpdateResolver;