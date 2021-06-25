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

// Synchronous & Single Thread
const ขออนุญาตขายวัคซีน = (req, ใบอนุญาต, next) => {
  const สรรพคุณของวัคซีน = req.body.สรรพคุณของวัคซีน; //แฟ้มชื่อ สรรพคุณของวัคซีน
  const ผลทางห้องแล็บ = req.body.ผลทางห้องแล็บ; // แฟ้มชื่อ ผลทางห้องแล็บ

  // หรือเขียนแบบ Destructuring
  const { สรรพคุณของวัคซีน, ผลทางห้องแล็บ } = req.body;

  // ถ้าเจ้าหน้าที่ไม่พบแฟ้มสรรพคุณของวัคซีน และแฟ้มผลทางห้องแล็บ
  if (!สรรพคุณของวัคซีน || !ผลทางห้องแล็บ) {
    return next(new ErrorResponse('ท่านยื่นเอกสารไม่ครบ', 400));
  }

  // ถ้าเอกสารทั้ง 2 แฟ้มเรียบร้อย เจ้าหน้าที่จะต้องค้นระเบียนผู้ขอฯว่าเคยขอมั๊ย
  // ในขณะเดียวกันวัคซีนได้ถูกส่งไปที่เจ้าหน้าที่อีกชุดเพื่อทำการทดลอง
  const ผู้ขอ = แฟ้มระเบียนผู้ขอ.findOne({ อีเมล: อีเมล }); // หาระเบียนผู้ขอด้วยอีเมลที่เคยลงทะเบียนไว้

  // ในระหว่างที่เจ้าหน้าที่กำลังค้นระเบียนผู้ขอฯ เจ้าหน้าที่อีกชุดหนึ่งนำวัคซีนไปทดลอง
  const ผลวิจัย = ผู้ขอ.ผลวิจัย(วัคซีน);

  // ถ้าผลวิจัยตรงกันกับผลทางห้องแล็บของผู้ขอฯ เจ้าหน้าที่จะออกใบอนุญาตเตรียมเอาไว้
  // เมื่อพบว่าผู้ขอฯ มีชื่อในระเบียนจะเรียกผู้ขอฯเข้ามารับใบอนุญาต
  ออกใบอนุญาต(ผู้ขอ, 200, ใบอนุญาต);
};

// Asynchronous JavaScript
// Async Await
const ขออนุญาตขายวัคซีน = async (req, ใบอนุญาต, next) => {
  const สรรพคุณของวัคซีน = req.body.สรรพคุณของวัคซีน; //แฟ้มชื่อ สรรพคุณของวัคซีน
  const ผลทางห้องแล็บ = req.body.ผลทางห้องแล็บ; // แฟ้มชื่อ ผลทางห้องแล็บ

  // หรือเขียนแบบ Destructuring
  const { สรรพคุณของวัคซีน, ผลทางห้องแล็บ } = req.body;

  // ถ้าเจ้าหน้าที่ไม่พบแฟ้ม สรรพคุณของวัคซีน และผลทางห้องแล็บ
  if (!สรรพคุณของวัคซีน || !ผลทางห้องแล็บ) {
    return next(new ErrorResponse('ท่านยื่นเอกสารไม่ครบ', 400));
  }

  // ถ้าเอกสารทั้ง 2 แฟ้มเรียบร้อย เจ้าหน้าที่จะต้องค้นระเบียนผู้ขอฯว่าเคยขอมั๊ย ขั้นตอนนี้ต้องรอครับ หรือ Await
  const ผู้ขอ = await แฟ้มระเบียนผู้ขอ.findOne({ อีเมล: อีเมล }); // หาระเบียนผู้ขอด้วยอีเมลที่เคยลงทะเบียนไว้

  // ถ้าไม่พบระเบียนผู้ขอฯ เจ้าหน้าที่จะไม่อนุมัติ และแจ้งปฏิเสธไปที่ผู้ขอฯ
  if (!ผู้ขอ) {
    return next(
      new ErrorResponse('ไม่อนุมัติเพราะท่านไม่มีชื่อในระเบียน', 401)
    );
  }

  // ถ้าพบชื่อผู้ขอฯในระเบียน และเอกสารถูกต้อง เจ้าหน้าที่ดำเนินการทดลองผลของวัคซีน ขั้นตอนนี้ต้องรอครับ
  const ผลวิจัย = await ผู้ขอ.ผลวิจัย(วัคซีน);

  // ถ้าผลวิจัยไม่ตรงกับผลทางห้องแล็บของผู้ขอฯ
  if (!ผลวิจัย) {
    return next(new ErrorResponse('วัคซีนให้ผลทดลองที่ไม่ตรงกัน', 401));
  }

  // ถ้าผลวิจัยตรงกันกับผลทางห้องแล็บของผู้ขอฯ
  ออกใบอนุญาต(ผู้ขอ, 200, ใบอนุญาต);
};
