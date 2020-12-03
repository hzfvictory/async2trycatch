const ms1 = async () => {
  try {
    return await fff();
  } catch (e) {
    console.error("😭 我大意了啊没有闪", e);
  }
};

let msg = "";

async function funMsg1() {
  try {
    msg = await asyncFunc();
    console.log(msg);
  } catch (e) {
    console.error("😭 我大意了啊没有闪", e);
  }
}

async function funJudge() {
  let a = 1;

  if (a === 1) {
    try {
      let data = await asyncFunc();
      console.log(data);
    } catch (e) {
      console.error("😭 我大意了啊没有闪", e);
    }
  }
}

async function func() {
  try {
    const result = await asyncFunc();
    const result1 = await asyncFunc();
    console.log(result1);
  } catch (e) {
    console.error("😭 我大意了啊没有闪", e);
  }
}

async function fun() {
  try {
    await asyncFunc();
  } catch (e) {
    console.error("😭 我大意了啊没有闪", e);
  }
}

const ms = async () => {
  try {
    await asyncFunc();
  } catch (e) {
    console.error("😭 我大意了啊没有闪", e);
  }

  try {
    await test();
  } catch (e) {
    console.error("😭 我大意了啊没有闪", e);
  }
};

async function tryFn() {
  try {
    await asyncFunc();
  } catch (e) {}
}

async function funProRes() {
  await new Promise((resolve, reject) => resolve(1)).then(data => {
    console.log(data);
  });
}

const manyFun = () => {
  const result = async () => {
    try {
      await fn();
    } catch (e) {
      console.error("😭 我大意了啊没有闪", e);
    }
  };
};

async function funProReject() {
  await Promise.reject(1212);
}