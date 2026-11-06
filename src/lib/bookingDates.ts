type BookingDates = {
    dateFrom: string;
    dateTo: string;
};

export function isVenueAvailable(
    booking: BookingDates[],
    checkIn:string,
    checkOut: string
): boolean {
    return booking.every((booking) => {
        return (
            checkOut <= booking.dateFrom ||
            checkIn >= booking.dateTo
        )
    })
    
}