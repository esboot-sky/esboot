import { env } from 'node:process';

const userInfo = {
  authentication: 'c2f7dfda383ef064ab48c696d2071496',
  clientChannel: '2100',
  clientFlag: 'dzClient',
  device: '6C3C8C2B8CBF',
  faceImg: 'http://183.57.47.83:38083/default_avatar/11.png',
  hotline: '',
  isLogin: true,
  level: 41,
  loginName: '13751198445',
  mobile: '13751198445',
  nickName: '大师版plus1（北一）',
  orgCode: '0007',
  registerChannel: '1000',
  sessionCode: '1878764089136644096',
  userId: 13773,
};

module.exports = {
  port: env.BRIDGE_MOCK_PORT || 3000,
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
        SkinFaceConfig: () => ({
          skin: 'black',
          language: 'zh-Hans',
          raise: 'red', // red, green
          font: {
            additionalSize: -14,
            weight: 'normal',
            list: [-11, -12, -13, -14, -15, -16, -19, -21],
          },
          theme: 'dark', // dark light
          raiseDepth: 'depth',
        }),
        GetUser: () => userInfo,
      },
      {
        get(target, name) {
          return name in target ? target[name] : args => console.log(`收到消息: ${name}, 尚未处理`);
        },
      },
    ),
  },
};
