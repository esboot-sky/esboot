const userInfo = {
  "bcanStatus": "Y",
  "bindTrade": true,
  "isLogin": true,
  "mobile": "15455700770",
  "nickName": "小信61531890",
  "orgCode": "0001",
  "sessionCode": "4fdf27cf-7377-4ca8-8a59-49eb5f660a78",
  "sessionId": "eyJjbGllbnRJZCI6IjYwNTE5NzI4IiwiYWNjb3VudCI6IjYwNTE5NzI4IiwiY25hbWUiOiI2MDUxOTcyOCIsImNsaWVudE5hbWUiOiI2MDUxOTcyOCIsImRldmljZUlkIjoiZmU4MGY4NTItYmNiZi00ZDRjLWI1MDEtZjdjZjNmYTAwOWU4LWNvbV9jc2NpX2FwcF90ZXN0IiwidHJhZGluZ0FjY1NlcSI6IjEiLCJzZXNzaW9uSWQiOiJGOUM0NDI3OTQyNTVCQTJGOTQ2OThFRDJDQTFDMEEzODQxQkFFRTM0RDA3QTIwNEI0NzczQUM5NTlCRjAwNzAzIiwiYWNjb3VudFR5cGUiOiJDIiwidG9rZW4iOiI0ZmRmMjdjZi03Mzc3LTRjYTgtOGE1OS00OWViNWY2NjBhNzgiLCJtb2JpbGUiOiIxODUwMDM1NzI0MiIsImVtYWlsIjoic2FtdWVsc2l1QGNzY2kuaGsiLCJhcmVhQ29kZSI6Iis4NiJ9",
  "trade2faCode": "4fdf27cf-7377-4ca8-8a59-49eb5f660a78",
  "tradeToken": "4fdf27cf-7377-4ca8-8a59-49eb5f660a78",
  "tradingAccSeq": "1",
  "userId": "111268"
};

const tradeConfig = {
  orderToConfirmByDialog: true,
  orderToConfirmByPwd: false,
  idleAutoLockDuration: '15m',
  searchMarketPreference: 'US',
};

const userConfig = {
  deviceNo: 'fe80f852-bcbf-4d4c-b501-f7cf3fa009e8-com_csci_app_test',
  font_size: 2, // 0 - 4  最小 - 最大 默认值2
  global_font_scale: 2,
  language: 'zh-CN', // zh-TW  zh-CN
  raise: 'red', // 红涨绿跌 还是绿涨红跌
  theme: 'dark', // dark light red
  themeMode: 'dark',

  // 发现app目前没有提供的
  env: 'dev',
  orderToConfirmByDialog: true,
};

const serverConfig = {
  websocketServer: 'ws://120.31.161.173:48130/socket', //websoket地址
};

// 用戶配置切換
// {"name":"updateUserConfiguration","params":{"env": "dev", "language":"zh-TW","theme":"light","raise": "green","font_size": "4"}}
// {"name":"updateUserInfo","params":{"userId":9527,"mobile":"0","customerName":"法外狂徒_张三","customerNickname":"nick","orgCode":"0002","tradeToken":"65a79ea5-ccb5-40f6-8077-bfd624fe8056","sessionCode":"65a79ea5-ccb5-40f6-8077-bfd624fe8056","isLogin":true,"bindTrade":true}}

module.exports = {
  port: 3000,
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
        userInfo: () => userInfo,
        getTradeConfig: () => tradeConfig,
        sessionCodeExpire: (args) => {
          console.log(`登录超时: \n${JSON.stringify(args)}`);
        },
        getUserConfiguration: () => userConfig,
        getServerConfig: () => serverConfig,
      },
      {
        get(target, name) {
          return name in target ? target[name] : (args) => console.log(`收到消息: ${name}, 尚未处理`);
        },
      },
    ),
  },
};
