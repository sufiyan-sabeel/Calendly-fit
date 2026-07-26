/**
 * Calendy Fit - Shared Utilities
 * Date formatting, validation, formatting helpers
 */

// ---- Date Utilities ----
export {
  formatDate,
  formatTime,
  formatDateTime,
  formatRelativeTime,
  formatTimeSlot,
  getDurationMinutes,
  getDurationHours,
  isToday,
  isTomorrow,
  isPast,
  isFuture,
  doSlotsOverlap,
  generateTimeSlots,
  getWeekDays,
  getMonthDays,
  addBufferTime,
  getTodayRange,
  getWeekRange,
  getMonthRange,
} from './date';

// ---- Formatting ----
export {
  formatCurrency,
  formatCompactCurrency,
  formatNumber,
  formatCompactNumber,
  formatPercentage,
  getInitials,
  truncateText,
  formatDuration,
  formatRating,
  formatPhone,
} from './format';

// ---- Validation ----
export {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateRequired,
  validateForm,
  hasErrors,
} from './validation';
