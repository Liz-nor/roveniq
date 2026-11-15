AI used: ChatGPT
Date: 15.11.2026
Purpose: Ensure the calendar only opens when the user clicks the date input or calendar button.
Outcome: Fixed the dialog state logic so the calendar remains closed on initial page load and opens when requested.

Purpose: Improve the apperance and usability of the calendar.
Outcome: Added spacing between dates, hover effects, selected-date styling, and customized navigation arrows nd month headings using Tailwind CSS.

Purpose: Prevent user from selecting invalid booking dates.
Outcome: Configured DayPicker to disable past dates and optionally today's date.

Purpose: Allow users to close the calendar using the Escape key.
Outcome: Used the native dialog's onCancel and onClose events to synchronize the dialog's visibility with React state.

Purpose: Ensure selected dates are displayed correctly in the booking form.
Outcome: Indentified the need to lift the selected date range state to the parent component and pass it to the calendar and form through props.

Purpose: Allow users to save venues.
Outcome: Designed 



https://daypicker.dev/start
