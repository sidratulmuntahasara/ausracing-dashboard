'use client';

import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task_assigned':
        return '📋';
      case 'task_updated':
        return '🔄';
      case 'task_completed':
        return '✅';
      case 'mention':
        return '💬';
      default:
        return '📢';
    }
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-20" onClick={onClose}>
      <div
        ref={panelRef}
        className="absolute right-4 top-16 w-96 max-h-[80vh] bg-white rounded-lg shadow-xl border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            <div className="flex items-center space-x-2">
              {notifications.some(n => !n.read) && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <span className="text-xl">✕</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-[60vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-2">🔔</div>
              <p className="text-gray-500">No notifications yet</p>
              <p className="text-sm text-gray-400 mt-1">You'll see updates about your tasks here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead(notification.id);
                    }
                  }}
                >
                  <div className="flex space-x-3">
                    {/* Notification Icon */}
                    <div className="flex-shrink-0">
                      <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                    </div>

                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </p>
                          <p className={`text-sm mt-1 ${!notification.read ? 'text-gray-700' : 'text-gray-500'}`}>
                            {notification.message}
                          </p>

                          {/* From User */}
                          {notification.fromUser && (
                            <div className="flex items-center space-x-2 mt-2">
                              {notification.fromUser.profilePicture ? (
                                <img
                                  src={notification.fromUser.profilePicture}
                                  alt={notification.fromUser.name}
                                  className="w-5 h-5 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                                  {getUserInitials(notification.fromUser.name)}
                                </div>
                              )}
                              <span className="text-xs text-gray-500">
                                from {notification.fromUser.name}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Unread Indicator */}
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>

                      {/* Timestamp */}
                      <p className="text-xs text-gray-400 mt-2">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 border-t bg-gray-50">
            <div className="text-center">
              <p className="text-xs text-gray-500">
                {notifications.length} total notification{notifications.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationPanel;
