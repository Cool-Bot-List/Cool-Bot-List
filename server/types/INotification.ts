export default interface INotification {
    /**
     * Whether this notification was marked as read by the user.
     */
    read: boolean;
    /**
     * The actual content of this notification.
     */
    message: string;
}
