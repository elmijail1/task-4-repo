export const inputValidators = {
  email: {
    minLength: 6,
    maxLength: 20,
    patternRegEx: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
    patternText: "like name@gmail.com",
  },
  password: {
    minLength: 1,
    maxLength: 20,
    patternRegEx: /(^[A-Za-z0-9!#$%&? "]+$)/i,
    patternText:
      'Latin letters, numbers, and these symbols: !, #, $, %, &, ?, "',
  },
  name: {
    minLength: 1,
    maxLength: 20,
    patternRegEx: /(^[A-Za-z0-9]+$)/i,
    patternText: "Latin letters and numbers",
  },
};
