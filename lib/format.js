import cFL from 'util/capitalize';

export default {
  dateDDMM(string) {
    const date = new Date(string);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  },
  date(string) {
    const date = new Date(string);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  },
  name({ firstName, lastName, email }) {
    if (!firstName && !lastName) {
      return `<${email}>`;
    }
    return `${cFL(firstName.slice(0, 1))}. ${cFL(lastName)}`;
  },
};
