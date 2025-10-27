export enum StatementRouter {
  STATEMENT_HOME = '/home',
  STATEMENT_PERSONAL_DATA = '/personal-data',
  STATEMENT_RADIO_DATA = '/survey',
  STATEMENT_PROGRESS = '/progress',
}

export enum ProgressTypes {
  AUTH_DATA = 'AUTH_DATA', // 需要弹窗
  USER_DATA = 'USER_DATA', // 个人资料
  ANSWER = 'ANSWER', // 问卷
  REVIEW_ING = 'REVIEW_ING', // 审核中
  REJECT = 'REJECT', // 拒绝
  SUCCESS = 'SUCCESS', // 成功
}
export enum FormDataEnum {
  EN_NAME = 'enName',
  BIRTH_DATE = 'birthDate',
  SEX = 'sex',
  MOBILE = 'mobile',
  EMAIL = 'email',
  RESIDENTIAL_ADDRESS = 'residentialAddress',
  MAIL_ADDRESS = 'mailAddress',
  OCCUPATION = 'occupation',
  EMPLOYER = 'employer',
  EMPLOYER_ADDRESS = 'employerAddress',
  EMPLOYER_TEL = 'employerTel',
  SPECIFIC_INDUSTRY = 'specificIndustry',
  POSITION = 'position',
  WORK_TERM = 'workTerm',
  RESIDENTIAL_COUNTRY = 'residentialCountry',
  MAIL_COUNTRY = 'mailCountry',
  EMPLOYER_COUNTRY = 'employerCountry',
  EMPLOYER_TEL_AREA = 'employerTelArea',
  MOBILE_AREA = 'area',
}
export interface formDataType {
  [FormDataEnum.EN_NAME]: string;
  [FormDataEnum.BIRTH_DATE]: string;
  [FormDataEnum.SEX]: string;
  [FormDataEnum.MOBILE]: string;
  [FormDataEnum.EMAIL]: string;
  [FormDataEnum.RESIDENTIAL_ADDRESS]: string;
  [FormDataEnum.MAIL_ADDRESS]: string;
  [FormDataEnum.OCCUPATION]: string;
  [FormDataEnum.EMPLOYER]: string;
  [FormDataEnum.EMPLOYER_ADDRESS]: string;
  [FormDataEnum.EMPLOYER_TEL]: string;
  [FormDataEnum.SPECIFIC_INDUSTRY]: string;
  [FormDataEnum.POSITION]: string;
  [FormDataEnum.WORK_TERM]: string;
  [FormDataEnum.RESIDENTIAL_COUNTRY]: string;
  [FormDataEnum.MAIL_COUNTRY]: string;
  [FormDataEnum.EMPLOYER_COUNTRY]: string;
  [FormDataEnum.EMPLOYER_TEL_AREA]: string;
  [FormDataEnum.MOBILE_AREA]: string;
}

export interface declarativeInformationItemType {
  key: string;
  title: string;
  type: string;
  options?: any[];
  keyBy?: string;
  attr?: object;
}
export const declarativeInformation = (t: any) => [
  {
    key: 'basic',
    title: t({ id: 'us-stock-quotes.basic_info' }),
    list: [
      {
        key: 'enName',
        title: t({ id: 'us-stock-quotes.name' }),
        type: 'input',
      },
      {
        key: 'birthDate',
        title: t({ id: 'us-stock-quotes.birth_date' }),
        type: 'date',
      },
      {
        key: 'sex',
        title: t({ id: 'us-stock-quotes.gender' }),
        type: 'select',
        options: [],
      },
    ],
  },
  {
    key: 'contact-info',
    title: t({ id: 'us-stock-quotes.contact_info' }),
    list: [
      {
        key: 'mobile',
        keyBy: 'area',
        title: t({ id: 'us-stock-quotes.phone' }),
        type: 'input',
        attr: { type: 'number' },
        options: [
          { value: '+86', label: '+86' },
          { value: '+852', label: '+852' },
          { value: '+853', label: '+853' },
        ],
      },
      {
        key: 'email',
        title: t({ id: 'us-stock-quotes.email' }),
        type: 'input',
      },
      {
        key: 'residentialCountry',
        keyBy: 'residentialAddress',
        title: t({ id: 'us-stock-quotes.residential_address' }),
        type: 'select',
      },
      {
        key: 'mailCountry',
        keyBy: 'mailAddress',
        title: t({ id: 'us-stock-quotes.mailing_address' }),
        type: 'select',
      },
    ],
  },
  {
    key: 'work',
    title: t({ id: 'us-stock-quotes.work_info' }),
    list: [
      {
        key: 'occupation',
        title: t({ id: 'us-stock-quotes.employment_status' }),
        type: 'select',
      },
      {
        key: 'employer',
        title: t({ id: 'us-stock-quotes.company_name' }),
        type: 'input',
      },
      {
        key: 'employerCountry',
        keyBy: 'employerAddress',
        title: t({ id: 'us-stock-quotes.company_address' }),
        type: 'select',
      },
      {
        key: 'employerTel',
        keyBy: 'employerTelArea',
        title: t({ id: 'us-stock-quotes.company_phone' }),
        type: 'input',
        attr: { type: 'number' },
        options: [
          { value: '+86', label: '+86' },
          { value: '+852', label: '+852' },
          { value: '+853', label: '+853' },
        ],
      },
      {
        key: 'specificIndustry',
        title: t({ id: 'us-stock-quotes.business_nature' }),
        type: 'select',
      },
      {
        key: 'position',
        title: t({ id: 'us-stock-quotes.position_title' }),
        type: 'select',
      },
      {
        key: 'workTerm',
        title: t({ id: 'us-stock-quotes.years_of_service' }),
        type: 'input',
        attr: { type: 'number' },
      },
    ],
  },
];
