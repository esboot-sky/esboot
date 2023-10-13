module.exports = {
  port: process.env.BRIDGE_MOCK_PORT || 3000,
  response: {
    url: (url, arg) => {
      console.log(`打开${url}?${JSON.stringify(arg)}`);
      return 'to url success';
    },
    view: (v, arg) => {
      console.log(`打开 ${v} 原生视图,传入参数${JSON.stringify(arg)}`);
      return 'open view';
    },
    msg: new Proxy(
      {
        userInfo: () => ({
          "areaCode": "+852",
          "avatar": "",
          "bcanStatus": "Y",
          "cusNo": 61231218,
          "isLoginTrade": true,
          "mobile": "95738751",
          "nickname": "小信61231218",
          "sessionCode": "a15dfaef-13dd-4108-bccd-4b8cdcc2d6fe",
          "stoken": "",
          "tradeNo": "60526858",
          "userId": 45434
        }),
        sessionCodeExpire: (args) => {
          console.log(`登录超时: \n${JSON.stringify(args)}`);
        },
        getUserConfiguration: () => ({
          "font": {
            "additionalSize": -14,
            "list": [-11, -12, -13, -14, -15, -16, -19, -21],
            "weight": "normal"
          },
          "language": "zh-CN",
          "raise": "red",
          "theme": "dark"
        }),
      },
      {
        get(target, name) {
          return name in target ? target[name] : (args) => console.log(`收到消息: ${name}, 尚未处理`);
        },
      },
    ),
  },
};
