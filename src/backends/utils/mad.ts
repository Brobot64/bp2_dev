export function isMonthAnniversary(dateInput: string): boolean {
    const today = new Date();
    const inputDate = new Date(dateInput);
  
    // Ensure the input date is valid
    if (isNaN(inputDate.getTime())) {
      throw new Error("Invalid date input");
    }
  
    // Check if it's the same day of the month
    const isSameDay = today.getDate() === inputDate.getDate();
  
    // Check if today's month is an increment of the input date's month
    const monthDifference =
      today.getFullYear() * 12 + today.getMonth() -
      (inputDate.getFullYear() * 12 + inputDate.getMonth());
  
    return isSameDay && monthDifference > 0 && monthDifference % 1 === 0;
  }
  
  // Usage Example:
  //console.log(isMonthAnniversary("2023-10-11")); // Will return true if today is the 11th of any subsequent month since October 2023.
  