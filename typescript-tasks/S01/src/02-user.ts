// Задание 2. Карточка пользователя (15 минут)
//
// 1. Реализуйте describeUser.
// 2. Отсутствующий возраст не должен превращаться в "undefined лет".
// 3. Контакт различайте оператором in, а не проверкой на undefined.
// 4. Пустой массив хобби обработайте отдельной фразой.
//
// Без any, as и !.

export type Contact = { email: string } | { phone: string };
 
export type User = {
  name: string;
  age?: number;
  hobbies: string[];
  contact: Contact;
};
 
export function describeUser(user: User): string {
  // 2) Возраст: явная проверка на undefined — иначе шаблонная строка
  //    подставила бы буквально текст "undefined"
  const ageText =
    user.age !== undefined ? `${user.age} лет` : "возраст не указан";
 
  // 4) Хобби: пустой массив — отдельная фраза, а не "увлекается: "
  const hobbiesText =
    user.hobbies.length > 0 ? `увлекается: ${user.hobbies.join(", ")}` : "хобби не указаны";
 
  const contactText = "email" in user.contact ? `email: ${user.contact.email}`
      : `телефон: ${user.contact.phone}`;
 
  return `${user.name}, ${ageText}, ${hobbiesText}, ${contactText}`;
}


