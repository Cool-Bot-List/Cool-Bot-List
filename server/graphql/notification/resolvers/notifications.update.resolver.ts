import INotification from "../../../types/INotification";
import Users from "../../../database/models/User";

const NotificationUpdateResolver = {
    Notification: {
        update: async (parent: INotification , { method }: { method: "read" | "unread" }, _:unknown, info: any) => {
            console.log(info.rootValue);
            const userId = info.rootValue.userObj.id;
          
            const foundUser = await Users.findOne({id: userId});
            console.log(parent);
            console.log(foundUser);
            return parent;
        },
    },
};

export default NotificationUpdateResolver;