export type IntentAction = 
  | 'VIEW' 
  | 'EDIT' 
  | 'SHARE' 
  | 'CALL' 
  | 'MESSAGE' 
  | 'CREATE'
  | 'TRANSLATE'
  | 'QUIZ'
  | 'DEBATE'
  | 'STUDY'
  | 'NEWS';

export interface Intent {
  action: IntentAction;
  data?: any;
  type?: string;
  extras?: Record<string, any>;
  targetApp?: string;
}

export type SystemEventType = 
  | 'NOTIFICATION' 
  | 'BATTERY_LOW' 
  | 'NETWORK_CHANGE' 
  | 'AI_MODE_CHANGE'
  | 'CALL_STATE_CHANGE'
  | 'THEME_CHANGE';

export interface SystemEvent {
  type: SystemEventType;
  data: any;
}
