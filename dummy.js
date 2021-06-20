var obj = { name: 'Test', address: 'Thailand' };
var obj2 = {
  data1: { name: 'Test1', address: 'Thailand' },
  data2: { name: 'Test2', address: 'Thailand' },
};

console.log(obj);
console.log(obj2);

var obj3 = Object.values(obj2)[0].name;
var obj4 = Object.values(obj2)[1].name;
console.log(obj3);
console.log(obj4);

var obj5 = Object.values(obj2).map((value) => value.name);
console.log(obj5);
