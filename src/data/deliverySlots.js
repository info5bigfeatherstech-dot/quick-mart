/**
 * Delivery slot configurations for today and tomorrow.
 * Slots include time ranges, startHour (in 24-hr format for disabling past slots),
 * and an optional isFull flag.
 */
export const dummyDeliverySlots = [
  { id: 'slot-1', time: '08:00 AM - 10:00 AM', startHour: 8, endHour: 10, isFull: false },
  { id: 'slot-2', time: '10:00 AM - 12:00 PM', startHour: 10, endHour: 12, isFull: false },
  { id: 'slot-3', time: '12:00 PM - 02:00 PM', startHour: 12, endHour: 14, isFull: false },
  { id: 'slot-4', time: '02:00 PM - 04:00 PM', startHour: 14, endHour: 16, isFull: true }, // marked Full as per spec
  { id: 'slot-5', time: '04:00 PM - 06:00 PM', startHour: 16, endHour: 18, isFull: false },
  { id: 'slot-6', time: '06:00 PM - 08:00 PM', startHour: 18, endHour: 20, isFull: false },
  { id: 'slot-7', time: '08:00 PM - 10:00 PM', startHour: 20, endHour: 22, isFull: false },
];
