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

export const randomIndex = (length:number):number => {
    return Math.floor(Math.random() * length);
}

export const isColorDark = (hexColor: string): boolean => {
  const hex = hexColor.replace('#', '');
  
  const fullHex = hex.length === 3 
    ? hex.split('').map(char => char + char).join('') 
    : hex;

  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness < 128;
}