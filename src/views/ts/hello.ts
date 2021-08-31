// 参数注解
function greeter(person: string) {
  return "Hello, " + person;
}

let user = "Jane User";

// 接口
interface Person {
  firstName: string;
  lastName: string;
}

function greeter1(person: Person) {
  return "Hello, " + person.firstName + " " + person.lastName;
}

let user1 = { firstName: "Jane", lastName: "User" };

// 类和继承
class Student {
  fullName: string;
  constructor(public firstName, public middleInitial, public lastName) {
      this.fullName = firstName + " " + middleInitial + " " + lastName;
  }
}

interface Person {
  firstName: string;
  lastName: string;
}

function greeter2(person : Person) {
  return "Hello, " + person.firstName + " " + person.lastName;
}

let user2 = new Student("Jane", "M.", "User");

export default {
  name: 'TsHello',
  render (h) {
    return h('div', [
      h('div', greeter(user)),
      h('div', greeter1(user1)),
      h('div', greeter2(user2))
    ])
  }
}