import { useState } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';

type Booking = {
  dateFrom: string;
  dateTo: string;
};

type BookingCalendarProps = {
  bookings: Booking[];
  onDatesChange: (range: DateRange | undefined) => void;
};

export function BookingCalendar({
  bookings,
  onDatesChange,
}: BookingCalendarProps) {
  const [selected, setSelected] = useState<DateRange>();

  //Convert existing bookings to diabled dates
  //Checkout days can be used for another guest's check-in
  const bookedDates = bookings.map((booking) => ({
    from: new Date(booking.dateFrom),
    to: new Date(new Date(booking.dateTo).getTime() - 86400000),
  }));

  function handleSelect(range: DateRange | undefined) {
    setSelected(range);
    onDatesChange(range);
  }

  return (
    <DayPicker
      mode="range"
      min={1}
      selected={selected}
      onSelect={handleSelect}
      disabled={[{ before: new Date() }, ...bookedDates]}
      excludeDisabled
    />
  );
}
