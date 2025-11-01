type RoleMessage = 'user' | 'model';

export interface BasicMessage {
  role: RoleMessage;
  content: string;
}
