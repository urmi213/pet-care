// src/context/NotificationContext.js
import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize notifications from localStorage
  useEffect(() => {
    const loadNotifications = () => {
      try {
        const saved = localStorage.getItem('petcare_notifications');
        if (saved) {
          const parsed = JSON.parse(saved);
          setNotifications(parsed);
          setUnreadCount(parsed.filter(n => !n.read).length);
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
      setIsInitialized(true);
    };

    loadNotifications();
  }, []);

  // Save to localStorage whenever notifications change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('petcare_notifications', JSON.stringify(notifications));
    }
  }, [notifications, isInitialized]);

  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      time: 'Just now',
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Show toast notification immediately
    toast.success(notification.title, {
      icon: notification.icon || '🔔',
      duration: 3000,
      position: 'top-right'
    });
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const deleteNotification = useCallback((id) => {
    const notification = notifications.find(n => n.id === id);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, [notifications]);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Simulate real-time updates (WebSocket or polling simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications(prev => 
        prev.map(n => ({
          ...n,
          time: getTimeAgo(new Date(n.timestamp))
        }))
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAllNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};