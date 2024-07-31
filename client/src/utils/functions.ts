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