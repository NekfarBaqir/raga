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
export interface SubmissionDetail {
  id: number;
  team_name: string;
  name: string;
  email: string;
  status: "approved" | "pending" | "rejected";
  score: number;
  feedback: string;
  strengths: string;
  weaknesses: string;
  keywords: string;
  risk_level: string;
  created_at: string;
  answers: {
    question_text: string;
    answer: string;
  }[];
}
export interface Message {
  sender: string;       
  receiver: string;     
  message: string;      
  is_read: boolean;     
  created_at: string;   
  updated_at: string;   
}

export interface Contact {
  email: string;
  name: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}
