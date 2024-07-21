

interface NotificationMessage {
    id: string;
    title: string;
    message: string;
    createdAt: string;
    read: boolean;
    type: string;
}

export default NotificationMessage;