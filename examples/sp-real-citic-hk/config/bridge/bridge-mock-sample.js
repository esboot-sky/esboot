const userInfo = {
  bcanStatus: 'Y',
  bindTrade: true,
  isLogin: true,
  mobile: '15455700770',
  nickName: '小信61531890',
  orgCode: '0001',
  sessionCode: 'a6c9bc20-15e2-4e8b-a021-107e76cdc467',
  tradeToken: 'a6c9bc20-15e2-4e8b-a021-107e76cdc467',
  tradingAccSeq: '1',
  userId: '111268',
  currentAccount: '200090'
};

const tradeConfig = {
  orderToConfirmByDialog: true,
  orderToConfirmByPwd: false,
  idleAutoLockDuration: '15m',
  searchMarketPreference: 'HK',
};

const userConfig = {
  deviceNo: 'fe80f852-bcbf-4d4c-b501-f7cf3fa009e8-com_csci_app_test',
  language: 'zh-CN', // zh-TW zh-CN
  theme: 'light',
};

// 用戶配置切換
// {"name":"updateUserConfiguration","params":{"env": "dev", "language":"zh-TW","theme":"light","raise": "green","font_size": "4"}}
// {"name":"updateUserInfo","params":{"userId":9527,"mobile":"0","customerName":"法外狂徒_张三","customerNickname":"nick","orgCode":"0002","tradeToken":"65a79ea5-ccb5-40f6-8077-bfd624fe8056","sessionCode":"65a79ea5-ccb5-40f6-8077-bfd624fe8056","isLogin":true,"bindTrade":true}}

module.exports = {
  port: process.env.BRIDGE_MOCK_PORT,
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
        NORMAL_GET_USER_INFO: () => userInfo,
        getTradeConfig: () => tradeConfig,
        sessionCodeExpire: (args) => {
          console.log(`登录超时: \n${JSON.stringify(args)}`);
        },
        NORMAL_GET_USER_CONFIG: () => userConfig,
      },
      {
        get(target, name) {
          return name in target ? target[name] : (args) => console.log(`收到消息: ${name}, 尚未处理`);
        },
      },
    ),
  },
};
