import Cookies from "js-cookie";

export const getUserId = (): string => {
  const userCookie = Cookies.get("SessionData");
  const dataUser = JSON.parse(userCookie as string);
  const userId: string = dataUser.id;
  return userId;
};
