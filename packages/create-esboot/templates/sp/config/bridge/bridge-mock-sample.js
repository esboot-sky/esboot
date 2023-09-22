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
          userId: 0,
          mobile: '0',
          orgCode: '0001',
          sessionCode: '3d79979b-f588-40dc-9310-c4cc0cca044e',
          isLogin: false,
          isLoginTrade: false,
        }),
        getTradeConfig: () => {},
        sessionCodeExpire: (args) => {
          console.log(`登录超时: \n${JSON.stringify(args)}`);
        },
        isOptional: (info) => {
          return true;
        },
        addOptional: () => undefined,
        removeOptional: () => undefined,
        getUserConfiguration: () => ({
          env: 'dev',
          language: 'zh-CN',
          language: 'zh-TW',
          raise: 'red',
          raise: 'green',
          theme: 'black',
          font: {
            additionalSize: -14,
            weight: 'normal',
            weight: 'bold',
          },
        }),
        getServerConfig: () => ({
          websocketServer: 'ws://47.112.147.47:10001/socket',
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
