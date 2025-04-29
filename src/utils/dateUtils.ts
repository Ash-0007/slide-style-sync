
export const getDateSuffix = (day: number): string => {
  if (4 <= day && day <= 20 || 24 <= day && day <= 30) {
    return "th";
  } else {
    return {1: "st", 2: "nd", 3: "rd"}[day % 10] || "th";
  }
};

export const formatDateInfo = (date: Date): { 
  day: string; 
  date: string; 
  month: string; 
  year: string; 
} => {
  const day = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const dateNum = date.getDate();
  const suffix = getDateSuffix(dateNum);
  const month = date.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
  const year = date.getFullYear().toString();
  
  return {
    day,
    date: `${dateNum}${suffix}`,
    month,
    year
  };
};
