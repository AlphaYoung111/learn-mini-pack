import { SyncHook, AsyncParallelHook } from 'tapable'


class List {
  getRoutes () {
  }
}

class Car {
  constructor() {
    this.hooks = {
      accelerate: new SyncHook(["newSpeed"]),
      brake: new SyncHook(),
      calculateRoutes: new AsyncParallelHook(["source", "target", "routesList"])
    };
  }
  setSpeed (newSpeed) {
    // following call returns undefined even when you returned values
    this.hooks.accelerate.call(newSpeed);
  }

  useNavigationSystemPromise (source, target) {
    const routesList = new List();
    return this.hooks.calculateRoutes.promise(source, target, routesList).then((res) => {
      // res is undefined for AsyncParallelHook
      console.log('我是回调')
      return routesList.getRoutes();
    });
  }

  useNavigationSystemAsync (source, target, callback) {
    const routesList = new List();
    this.hooks.calculateRoutes.callAsync(source, target, routesList, err => {
      if (err) return callback(err);
      callback(null, routesList.getRoutes());
    });
  }
}

const myCar = new Car()

// 1. 注册
myCar.hooks.accelerate.tap('test 1', (speed) => {
  console.log('accelerate', speed);
})

myCar.hooks.calculateRoutes.tapPromise('test promise', (source, target) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 先执行完注册事件，在执行回调
      console.log('calculateRoutes', source, 'calculateRoutes:', target);
      resolve()
    }, 10);
  })

})

// 2. 触发

myCar.setSpeed(10)

myCar.useNavigationSystemPromise('i am source', 'i am target')