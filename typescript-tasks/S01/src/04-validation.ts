// Задание 4*. Правила валидации (со звёздочкой)
//
// 1. Опишите Rules так, чтобы ключом могло быть только поле формы (keyof).
// 2. Реализуйте validateForm: в результате только те поля,
//    которые не прошли проверку.
// 3. Сообщения собирайте шаблонной строкой.
//
// Подсказка: тип ошибок — { [K in keyof IFormData]?: string }.
// Отображённые типы (mapped types) — тема следующей лекции,
// поэтому задание необязательное.

export interface IFormData {
  username: string;
  email: string;
  age: number;
}
 
// Rules — mapped type: ключами могут быть только поля IFormData (keyof),
//    и тип функции-валидатора для каждого поля зависит от типа этого поля
export type Rules = {
  [K in keyof IFormData]: (value: IFormData[K]) => boolean;
};
 
// Тип из подсказки: все поля необязательны — у валидного поля
// сообщения об ошибке просто не будет в объекте
export type Errors = {
  [K in keyof IFormData]?: string;
};
 
export const defaultRules: Rules = {
  username: (value) => value.trim().length > 0,
  email: (value) => value.includes("@"),
  age: (value) => value > 0,
};
 
export function validateForm(data: IFormData, rules: Rules): Errors {
  const errors: Errors = {};
 
  // В errors попадают только провалившиеся поля — если правило
  //    вернуло true, соответствующий errors.<поле> просто не задаётся
  // Сообщения — шаблонными строками
  if (!rules.username(data.username)) {
    errors.username = `Поле "username": некорректное значение "${data.username}"`;
  }
  if (!rules.email(data.email)) {
    errors.email = `Поле "email": некорректное значение "${data.email}"`;
  }
  if (!rules.age(data.age)) {
    errors.age = `Поле "age": некорректное значение ${data.age}`;
  }
 
  return errors;
}
