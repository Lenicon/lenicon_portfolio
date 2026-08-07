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

export const obfuscateData = (data: any) => btoa(encodeURIComponent(JSON.stringify(data)));

export const deobfuscateData = (encoded: string) => {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)));
  } catch (err) {
    return [];
  }
};

export const sanitizeText = (text: string): string => {
  if (!text) return '';

  let normalized = text.normalize("NFKD");

  normalized = Array.from(normalized).map((char) => {
    const code = char.codePointAt(0) ?? 0;
    if (code >= 0x24B6 && code <= 0x24CF) return String.fromCharCode(code - 0x24B6 + 97);
    if (code >= 0x24D0 && code <= 0x24E9) return String.fromCharCode(code - 0x24D0 + 97);
    if (code >= 0x1F130 && code <= 0x1F149) return String.fromCharCode(code - 0x1F130 + 97);
    if (code >= 0x1F150 && code <= 0x1F169) return String.fromCharCode(code - 0x1F150 + 97);
    if (code >= 0x1F170 && code <= 0x1F189) return String.fromCharCode(code - 0x1F170 + 97);

    return char;
  }).join('');

  const lookalikes: Record<string, string> = {
    '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '8': 'b', '@': 'a'
  };
  normalized = Array.from(normalized).map(char => lookalikes[char] || char).join('');

  return normalized.toLowerCase().replace(/[^a-z0-9]/g, '');
};

export const getAge = (birthDateString: string): number => {
  const today = new Date();
  const birthDate = new Date(birthDateString);
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

export const getOrdinalSuffix = (n: number): string => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n.toString() + (s[(v - 20) % 10] || s[v] || s[0]);
}

export const isDateRange = (fromMonth: number, fromDay: number, toMonth: number, toDay: number): boolean => {
  const today = new Date();
  const currentYear = today.getFullYear();

  // 0 - 11 (January - December)
  const rangeStart = new Date(currentYear, fromMonth, fromDay);
  const rangeEnd = new Date(currentYear, toMonth, toDay);

  today.setHours(0, 0, 0, 0);
  rangeStart.setHours(0, 0, 0, 0);
  rangeEnd.setHours(0, 0, 0, 0);

  return today >= rangeStart && today <= rangeEnd;
}

export const isBirthday = (): boolean => {
  return isDateRange(7, 8, 7, 10);
}

export const isChristmas = (): boolean => {
  return isDateRange(11, 1, 11, 31);
}

export const isAprilFools = (): boolean => {
  return isDateRange(3, 1, 3, 1);
}

export const isHalloween = (): boolean => {
  return isDateRange(9, 31, 10, 2);
}

export const isNewYear = (): boolean => {
  return isDateRange(0, 1, 0, 1);
}