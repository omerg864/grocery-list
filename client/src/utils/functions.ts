import Cookies from 'universal-cookie';

export const addDays = (date: Date, days: number) => {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

export const getCookieExpiration = (cookieName: string): Date | undefined => {
    const cookies = new Cookies();
  const allCookies = cookies.getAll({ doNotParse: true });

  if (!allCookies[cookieName]) {
    return undefined;
  }

  const cookieString = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${cookieName}=`));

  if (!cookieString) {
    return undefined;
  }

  const expiresAttribute = cookieString.split(';').find(attribute => attribute.trim().startsWith('expires='));

  if (!expiresAttribute) {
    return undefined;
  }

  const expiresValue = expiresAttribute.split('=')[1];
  return new Date(expiresValue);
};


export const getMinutesBetweenDates = (date1: Date | string, date2: Date | string): number => {
  // Ensure the input dates are Date objects
  const startDate = new Date(date1);
  const endDate = new Date(date2);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return 0;
  }
  
  // Calculate the difference in milliseconds
  const differenceInMilliseconds = Math.abs(endDate.getTime() - startDate.getTime());
  
  // Convert milliseconds to minutes
  const minutes = Math.floor(differenceInMilliseconds / (1000 * 60));
  
  return minutes;
}

export const formatDate = (date: Date | string): string => {
  // Convert to Date object if input is a string
  const d = new Date(date);
  
  // Validate that the date is valid
  if (isNaN(d.getTime())) {
    return '';
  }

  // Get day, month, and year
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = d.getFullYear();

  // Return formatted date
  return `${day}/${month}/${year}`;
}