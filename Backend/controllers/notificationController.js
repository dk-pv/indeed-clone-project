import Notification from "../models/notificationModel.js";


export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: notifications });
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
};


export const markAsRead = async (req, res) => {
  const { notificationId } = req.body;

  try {
    const updated = await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }
    res.json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    console.error("❌ Error marking notification as read:", error);
    res.status(500).json({ success: false, message: "Failed to mark as read" });
  }
};



export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.error("❌ Error marking all as read:", error);
    res.status(500).json({ success: false, message: "Failed to mark all as read" });
  }
};


export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ userId: req.user._id, isRead: false });
    res.json({ success: true, count });
  } catch (error) {
    console.error("❌ Error getting unread count:", error);
    res.status(500).json({ success: false, message: "Failed to get unread count" });
  }
};
