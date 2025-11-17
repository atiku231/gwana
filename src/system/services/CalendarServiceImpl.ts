import type { CalendarService } from '../types/system.types';
import type { CalendarEvent } from '@/src/lib/types';
import * as calendarService from '@/src/services/calendarService';
import * as geminiService from '@/src/services/geminiService';

export class CalendarServiceImpl implements CalendarService {
  async getEvents(): Promise<CalendarEvent[]> {
    return calendarService.getUpcomingEvents();
  }

  async addEvent(event: CalendarEvent): Promise<CalendarEvent> {
    return calendarService.addCalendarEvent(event);
  }

  async deleteEvent(eventId: string): Promise<void> {
    return calendarService.deleteCalendarEvent(eventId);
  }

  async generateSuggestion(event: CalendarEvent): Promise<any> {
    return geminiService.generateCalendarSuggestion(event);
  }
}
