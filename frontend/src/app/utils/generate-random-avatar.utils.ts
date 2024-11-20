import md5 from "md5";

export const generateRandomAvatarUrl = (key:string):string => {
  return `https://gravatar.com/avatar/${md5(key)}?s=400&d=robohash&r=x`;
};
