"use client";

import { useEffect, useState } from "react";

export function useNotifications(unreadOnly = false) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchNotifications() {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (unreadOnly) params.append("unreadOnly", "true");

      const response = await fetch(`/api/notifications?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching notifications:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(notificationIds?: string[]) {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notificationIds,
          markAllAsRead: !notificationIds,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark notifications as read");
      }

      // Refetch notifications
      await fetchNotifications();
    } catch (err: any) {
      console.error("Error marking notifications as read:", err);
    }
  }

  useEffect(() => {
    fetchNotifications();
  }, [unreadOnly]);

  return { 
    notifications, 
    unreadCount, 
    loading, 
    error, 
    markAsRead,
    refetch: fetchNotifications,
  };
}
