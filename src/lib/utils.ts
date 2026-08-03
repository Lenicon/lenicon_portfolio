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

export const getAge = (birthDateString: string) => {
    const today = new Date();
    const birthDate = new Date(birthDateString);
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}