import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('zh-CN').format(num);
}

export function getInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.charAt(0) || '';
  const last = lastName?.charAt(0) || '';
  return (first + last).toUpperCase();
}

export function getRiskLevel(score: number): {
  label: string;
  color: string;
  bgColor: string;
} {
  if (score <= 30) {
    return {
      label: "高风险",
      color: "text-red-800",
      bgColor: "bg-red-100"
    };
  }
  if (score <= 60) {
    return {
      label: "中风险", 
      color: "text-yellow-800",
      bgColor: "bg-yellow-100"
    };
  }
  return {
    label: "低风险",
    color: "text-green-800", 
    bgColor: "bg-green-100"
  };
}

export function getRiskBarColor(score: number): string {
  if (score <= 30) return "bg-red-500";
  if (score <= 60) return "bg-yellow-500";
  return "bg-green-500";
}

export function getSeverityColor(severity: string): {
  color: string;
  bgColor: string;
} {
  switch (severity) {
    case "critical":
      return { color: "text-red-800", bgColor: "bg-red-100" };
    case "high":
      return { color: "text-orange-800", bgColor: "bg-orange-100" };
    case "medium":
      return { color: "text-yellow-800", bgColor: "bg-yellow-100" };
    case "low":
      return { color: "text-green-800", bgColor: "bg-green-100" };
    default:
      return { color: "text-gray-800", bgColor: "bg-gray-100" };
  }
}

export function getStatusColor(status: string): {
  color: string;
  bgColor: string;
} {
  switch (status) {
    case "active":
    case "online":
    case "resolved":
      return { color: "text-green-800", bgColor: "bg-green-100" };
    case "inactive":
    case "offline":
    case "closed":
      return { color: "text-gray-800", bgColor: "bg-gray-100" };
    case "locked":
    case "alert":
    case "critical":
      return { color: "text-red-800", bgColor: "bg-red-100" };
    case "warning":
    case "in-progress":
      return { color: "text-yellow-800", bgColor: "bg-yellow-100" };
    case "new":
      return { color: "text-blue-800", bgColor: "bg-blue-100" };
    default:
      return { color: "text-gray-800", bgColor: "bg-gray-100" };
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidIP(ip: string): boolean {
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}小时${minutes}分钟`;
  }
  if (minutes > 0) {
    return `${minutes}分钟${secs}秒`;
  }
  return `${secs}秒`;
}

export function getTimeAgo(date: Date | string): string {
  const now = new Date();
  const target = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return '刚刚';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}小时前`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}天前`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}个月前`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}年前`;
}
