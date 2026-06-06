export const yearsFrom = (year:number):number => {
    const targetMonth = 0;
    const targetDay = 1;

    const today = new Date();
    const currentYear = today.getFullYear();
    let yearsPassed = currentYear - year;

    if (today.getMonth() < targetMonth || (today.getMonth() === targetMonth && today.getDate() < targetDay))
        yearsPassed--;

    return yearsPassed;
};