import {DayPicker, type DateRange} from 'react-day-picker';
import {useEffect, useId, useMemo, useRef, useState} from 'react';
import {format, parse, startOfDay, subDays} from 'date-fns';

type Booking = {
    dateFrom: string;
    dateTo: string;
};

type BookingCalendarProps = {
    bookings: Booking[];
    selected: DateRange | undefined;
    onSelect: (range: DateRange | undefined) => void;
};

// API dates are ISO strings ("2026-11-20T00:00:00.000Z"). Use only the date
// part so the day doesn't shift with the user's timezone.
function toLocalDay(iso: string) {
    return parse(iso.slice(0, 10), 'yyyy-MM-dd', new Date());
}

function formatRange(range: DateRange | undefined) {
    if (!range?.from) return 'Please select your dates';
    if (!range.to) return `${format(range.from, 'd MMM yyyy')} – choose check-out`;
    return `${format(range.from, 'd MMM yyyy')} – ${format(range.to, 'd MMM yyyy')}`;
}

export function BookingCalendar({bookings, selected, onSelect}: BookingCalendarProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const dialogId = useId();
    const headerId = useId();
    // Hold the month in state for the calendar
    const [month, setMonth] = useState(new Date());

    //Hold dialog visibility in state
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const openDialog = () => setIsDialogOpen(true);
    const closeDialog = () => setIsDialogOpen(false);
    const calendarLabel = `Calendar, ${format(month, "MMMM yyyy")}`;

    // Booked nights are dateFrom up to (but not including) dateTo,
    // so a guest's check-out day is free for the next guest to check in.
    const bookedNights = useMemo(
        () =>
            bookings.map((booking) => ({
                from: toLocalDay(booking.dateFrom),
                to: subDays(toLocalDay(booking.dateTo), 1),
            })),
        [bookings],
    );

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isDialogOpen && !dialog.open) {
            document.body.style.overflow = 'hidden';
            dialog.showModal();
        } else if (!isDialogOpen && dialog.open) {
            document.body.style.overflow = '';
            dialog.close();
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isDialogOpen]);

    const handleDayPickerSelect = (range: DateRange | undefined) => {
        onSelect(range);
        // Close once both check-in and check-out are chosen
        if (range?.from && range?.to && range.from.getTime() !== range.to.getTime()) {
            closeDialog();
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-3">
            <button
                type="button"
                onClick={openDialog}
                aria-controls={dialogId}
                aria-haspopup="dialog"
                aria-expanded={isDialogOpen}
                className="rounded-md border px-3 py-2 cursor-pointer hover:bg-teal-50"
            >
                📅 {formatRange(selected)}
            </button>
            {selected?.from && (
                <button
                    type="button"
                    onClick={() => onSelect(undefined)}
                    className="text-sm text-neutral-600 underline cursor-pointer"
                >
                    Clear dates
                </button>
            )}
            <dialog
                ref={dialogRef}
                id={dialogId}
                aria-modal
                aria-labelledby={headerId}
                onCancel={(e) => {
                    e.preventDefault();
                    closeDialog();
                }}
                onClose={closeDialog}
                onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                        e.preventDefault();
                        closeDialog();
                    }
                }}
                onClick={(e) => {
                    // Clicks on the backdrop land on the <dialog> element itself
                    if (e.target === e.currentTarget) closeDialog();
                }}
                className="m-auto rounded p-0 bg-muted-background shadow-xl backdrop:bg-black/40"
            >
                <div className="p-4">
                    <h2 id={headerId}>Pick your check-in and check-out dates</h2>
                    <DayPicker
                        month={month}
                        onMonthChange={setMonth}
                        autoFocus
                        role="application"
                        aria-label={calendarLabel}
                        mode="range"
                        min={1}
                        selected={selected}
                        onSelect={handleDayPickerSelect}
                        disabled={[{before: startOfDay(new Date())}, ...bookedNights]}
                        excludeDisabled
                        modifiers={{booked: bookedNights}}
                        modifiersClassNames={{booked: "line-through"}}
                        classNames={{
                            month_caption: "text-lg font-semibold text-teal-900",
                            caption_label: "text-lg font-medium",
                            nav: "flex justify-between items-center m-2",
                            button_previous: "rounded-full p-2 cursor-pointer hover:bg-teal-100 transition-colors",
                            button_next: "rounded-full p-2 cursor-pointer hover:bg-teal-100 transition-colors",
                            chevron: "fill-teal-700",
                            day: "p-2",
                            day_button: "h-10 w-10 rounded-full cursor-pointer transition-colors duration-200 hover:bg-teal-100 hover:text-teal-900",
                            selected: "bg-teal-700 text-white rounded-full",
                            range_middle: "bg-teal-100 text-teal-900",
                            today: "font-bold text-teal-900 rounded-full",
                            disabled: "opacity-30 cursor-not-allowed",
                            month_grid: "mx-auto border-separate border-spacing-2"
                        }}
                        footer={
                            <span className="font-bold" aria-live="polite">
                                {formatRange(selected)}
                            </span>
                        }
                    />
                </div>
            </dialog>
        </div>
    );
}
