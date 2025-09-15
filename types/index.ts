export interface SvgConfig {
  width: string;
  height: string;
  path: string;
  viewBox: string;
  className: string;
}

export interface NavItem {
  title: string;
  href: string;
  svg?: SvgConfig;
  disabled?: boolean;
  active?: boolean;
  onClick?: () => void;
}

export interface MainNavItem extends NavItem {}

export interface SideConfig {
  mainNav: MainNavItem[];
}
export interface Message {
  id: number;
  contact_id: number;
  sender: string;
  receiver: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
export interface BackendMessage {
  id: number;
  contact_id: number;
  sender: string;
  receiver: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
export interface Contact {
  id: number;
  email: string;
}
export interface MessageAdmin {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface BackendMessageAdmin {
  id: number;
  contact_id: number;
  sender: string;
  receiver: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
