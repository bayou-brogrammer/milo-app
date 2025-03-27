export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  calendarId: string;
}

export interface Calendar {
  id: string;
  title: string;
  color: string;
  source: string;
}

export interface EnergyLevel {
  id: string;
  level: string;
  description: string;
  timestamp: Date;
  userId: string;
}

export interface Recommendation {
  title: string;
  description: string;
}