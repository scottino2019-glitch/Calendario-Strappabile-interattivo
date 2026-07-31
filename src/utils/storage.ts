import { CalendarConfig } from '../types';
import { INITIAL_CONFIG } from '../data/defaults';

const STORAGE_KEY = 'torn_paper_calendar_config_v1';

export function loadConfigFromStorage(): CalendarConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return INITIAL_CONFIG;
    const parsed = JSON.parse(saved);
    // Merge with initial config to avoid missing properties from schema updates
    return {
      ...INITIAL_CONFIG,
      ...parsed,
      agendaContent: {
        ...INITIAL_CONFIG.agendaContent,
        ...(parsed.agendaContent || {}),
      },
    };
  } catch (e) {
    console.warn('Failed to load saved calendar config', e);
    return INITIAL_CONFIG;
  }
}

export function saveConfigToStorage(config: CalendarConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.warn('Failed to save calendar config', e);
  }
}

export function resetConfigStorage(): CalendarConfig {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to reset calendar config', e);
  }
  return INITIAL_CONFIG;
}
