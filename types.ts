export enum EngagementType {
  HIRE = 'HIRE',
  COLLABORATE = 'COLLABORATE',
  OUTSOURCE = 'OUTSOURCE',
}

export interface BookingData {
  name: string;
  email: string;
  date: Date | null;
  timeSlot: string | null;
  description: string;
  agenda?: string;
}

export interface EngagementOption {
  id: EngagementType;
  title: string;
  description: string;
  iconName: 'Briefcase' | 'Users' | 'Rocket';
  gradient: string;
}

export type ViewState = 'LANDING' | 'BOOKING' | 'SUCCESS';