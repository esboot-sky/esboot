import { Input, Popup, Toast } from 'antd-mobile';
import React, { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { requestDataConfirm, requestUserData } from '@/api/quotation/market-statement';
import CloseIcon from '@/modules/quote-subscription/images/icon_close.svg';
import DropDown from '@/modules/quote-subscription/images/icon_drop_down.svg';
import SelectedIcon from '@/modules/quote-subscription/images/icon_selected.svg';

import DatePicker from '../../components/date-picker';
import {
  declarativeInformation,
  declarativeInformationItemType,
  formDataType,
  StatementRouter,
} from '../../constant/const';
import useDataDictionary from '../../hooks/use-data-dictionary';

import './personal-data.scss';

const PersonalData = () => {
  const [searchParams] = useSearchParams();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<formDataType>({
    enName: '',
    birthDate: '',
    sex: '',
    mobile: '',
    email: '',
    residentialAddress: '',
    mailAddress: '',
    occupation: '',
    employer: '',
    employerAddress: '',
    employerTel: '',
    specificIndustry: '',
    position: '',
    workTerm: '',
    residentialCountry: 'CN',
    mailCountry: 'CN',
    employerCountry: 'CN',
    employerTelArea: '+86',
    area: '+86',
  });
  const [showSelectMsg, setShowSelectMsg] = useState({
    visible: false,
    key: '',
    list: [],
  });
  const [showDate, setShowDate] = useState(false);
  const { data: dataDictionary = {} } = useDataDictionary([
    'sex',
    'occupation',
    'country',
    'specific_industry',
    'position',
  ]);
  const formList = declarativeInformation(formatMessage);

  const selectPopupClose = () => {
    setShowSelectMsg({ visible: false, key: '', list: [] });
  };
  const selectPopupChange = (val: any) => {
    console.log(val);
    selectPopupClose();
    setFormData({
      ...formData,
      [showSelectMsg.key]: val.value,
    });
  };

  const handlerSubmit = async () => {
    // const keys = Object.keys(formData);
    console.log('formData', formData);
    const { email, mobile, area, employerTel, employerTelArea } = formData;
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailPattern.test(email)) {
      Toast.show({
        content: formatMessage({ id: 'us-stock-quotes.please_enter_the_correct_phone_number' }),
        duration: 1000,
      });
      return;
    }
    if (mobile) {
      let isValidMobile = false;

      if (area === '+86') {
        isValidMobile = /^1[3-9]\d{9}$/.test(mobile); // 中国大陆手机号正则表达式
      } else if (area === '+852') {
        isValidMobile = /^[5689]\d{7}$/.test(mobile); // 香港手机号正则表达式
      } else if (area === '+853') {
        isValidMobile = /^[6]\d{7}$/.test(mobile); // 澳门手机号正则表达式
      }

      if (!isValidMobile) {
        Toast.show({
          content: `${formatMessage({ id: 'us-stock-quotes.phone' })}${formatMessage({
            id: 'us-stock-quotes.input_error',
          })}`,
          duration: 2000,
        });
        return;
      }
    }
    if (employerTel) {
      let isValidMobile = false;

      if (employerTelArea === '+86') {
        isValidMobile = /^1[3-9]\d{9}$/.test(employerTel); // 中国大陆手机号正则表达式
      } else if (employerTelArea === '+852') {
        isValidMobile = /^[5689]\d{7}$/.test(employerTel); // 香港手机号正则表达式
      } else if (employerTelArea === '+853') {
        isValidMobile = /^[6]\d{7}$/.test(employerTel); // 澳门手机号正则表达式
      }

      if (!isValidMobile) {
        Toast.show({
          content: `${formatMessage({ id: 'us-stock-quotes.company_phone' })}${formatMessage({
            id: 'us-stock-quotes.input_error',
          })}`,
          duration: 1000,
        });
        return;
      }
    }
    try {
      const data = await requestDataConfirm(formData);
      console.log(data);
      Toast.show({
        icon: 'success',
        content: '提交成功',
        duration: 1000,
        afterClose: () => {
          navigate(`${StatementRouter.STATEMENT_RADIO_DATA}?source=internal`);
        },
      });
    } catch (error: any) {
      console.log(error, '<<<=====error');
      Toast.show({
        icon: 'fail',
        content: error.message || error.msg,
        duration: 1000,
      });
    }
  };

  const handlePreviousStep = () => {
    const source = searchParams.get('source');
    if (source === 'internal') {
      navigate(-1);
    } else {
      navigate(StatementRouter.STATEMENT_HOME);
    }
  };

  const isSubmit = useMemo(() => {
    const keys = Object.keys(formData);
    return keys.every((key) => formData[key] !== '');
  }, [formData]);

  useEffect(() => {
    requestUserData().then((res) => {
      console.log('++++++requestUserData++++', res);
      const { result } = res;
      const obj: any = { ...formData };
      const keys = Object.keys(formData);
      keys.forEach((key) => {
        const value = result[key];
        if (value) {
          obj[key] = value;
        }
      });
      setFormData(obj);
    });
  }, []);

  const formListData = useMemo(() => {
    const keys = Object.keys(dataDictionary);
    if (keys.length === 0) return formList;

    formList.forEach((item) => {
      item.list.forEach((val: any) => {
        const selectCountry = ['residentialCountry', 'mailCountry', 'employerCountry'];
        if (keys.includes(val.key) || val.key === 'specificIndustry' || selectCountry.includes(val.key)) {
          let res = dataDictionary[val.key];
          if (val.key === 'specificIndustry') {
            res = dataDictionary.specific_industry;
            console.log('specificIndustry', formData[val.key as keyof formDataType]);
          } else if (selectCountry.includes(val.key)) {
            res = dataDictionary.country;
          }
          const selectData = res.map((opt: string[]) => {
            return {
              value: opt[0],
              label: opt[1],
            };
          });
          val.options = selectData;
        }
      });
    });
    return formList;
  }, [dataDictionary, formList]);

  const createOperate = (item: declarativeInformationItemType) => {
    const { key = '', type, options = [], keyBy = '', attr = {} } = item;
    console.log('+++++++++++++++keyBy+++++++++++++++++++', keyBy);

    if (type === 'input') {
      const filterData: any[] = options.filter((option) => option.value === formData[keyBy as keyof formDataType]);
      const text = filterData.length > 0 ? filterData[0].label : '';
      return (
        <div styleName="input-item">
          {keyBy ? (
            <div
              styleName="please-select-box"
              key={key}
              onClick={() => setShowSelectMsg({ visible: true, key: keyBy, list: options })}
            >
              {formData[keyBy as keyof formDataType] ? (
                <span>{text}</span>
              ) : (
                <span styleName="select-placeholder">{formatMessage({ id: 'us-stock-quotes.please_select' })}</span>
              )}
              <DropDown styleName="select-drop-down" />
            </div>
          ) : null}
          <Input
            key={key}
            placeholder={formatMessage({ id: 'us-stock-quotes.please_input' })}
            value={formData[key]}
            styleName="input-box"
            onChange={(val) => {
              let filteredValue = val;
              if (key === 'enName') {
                filteredValue = val.replace(/[^a-zA-Z\s]/g, ''); // 仅允许输入字母和空格
              }
              if (key === 'mobile' || key === 'employerTel') {
                filteredValue = val.slice(0, 11); // 限制电话号码最长为11位
              }

              if (key === 'workTerm') {
                filteredValue = val.replace(/[^0-9]/g, ''); // 仅允许输入数字
                const numericValue = parseInt(filteredValue, 10);
                if (numericValue < 0 || numericValue > 100) return;
              }
              setFormData({
                ...formData,
                [key]: filteredValue,
              });
            }}
            {...attr}
          />
        </div>
      );
    }
    if (type === 'date') {
      return (
        <div styleName="select-box" onClick={() => setShowDate(true)}>
          {formData[key as keyof formDataType] ? (
            <span>{formData[key as keyof formDataType]}</span>
          ) : (
            <span styleName="select-placeholder">{formatMessage({ id: 'us-stock-quotes.please_select' })}</span>
          )}
          <DropDown key="date" styleName="select-drop-down" />
        </div>
      );
    }
    if (type === 'select') {
      const filterData: any[] = options.filter((option) => option.value === formData[key as keyof formDataType]);
      const text = filterData.length > 0 ? filterData[0].label : '';
      return (
        <>
          <div styleName="select-box" key={key} onClick={() => setShowSelectMsg({ visible: true, key, list: options })}>
            {formData[key as keyof formDataType] ? (
              <span>{text}</span>
            ) : (
              <span styleName="select-placeholder">{formatMessage({ id: 'us-stock-quotes.please_select' })}</span>
            )}
            <DropDown styleName="select-drop-down" />
          </div>
          {keyBy ? (
            <Input
              key={key}
              placeholder={formatMessage({ id: 'us-stock-quotes.please_input' })}
              value={formData[keyBy]}
              styleName="input-box"
              onChange={(val) => {
                setFormData({
                  ...formData,
                  [keyBy]: val,
                });
              }}
            />
          ) : null}
        </>
      );
    }
    return null;
  };

  const createFromItem = (list: any) => {
    return list.map((item: any) => {
      const { key } = item;
      return (
        <div styleName="section-item" key={key}>
          <div styleName="section-item-title">
            <span>{item.title}</span>
            <span styleName="required-mark">*</span>
          </div>
          {createOperate(item)}
        </div>
      );
    });
  };

  const createrFrom = useMemo(() => {
    console.log('++++++++formListData+++++++', formListData);

    return formListData.map((section) => (
      <div key={section.key} styleName="form-section">
        <div styleName="section-title">{section.title}</div>
        <div styleName="form-item-box">{createFromItem(section.list)}</div>
      </div>
    ));
  }, [formListData]);

  return (
    <div styleName="personal-data-page">
      <div styleName="form-box-warp">{createrFrom}</div>
      <div styleName="button-box">
        <div styleName="btn" onClick={handlePreviousStep}>
          上一步
        </div>
        <div
          styleName={`btn confirm ${isSubmit ? '' : 'submit-disable'}`}
          onClick={() => {
            if (!isSubmit) return;
            handlerSubmit();
          }}
        >
          下一步
        </div>
      </div>

      <Popup visible={showSelectMsg.visible} className="select-popup" key="select-popup">
        <div styleName="select-popup-box">
          <div styleName="select-popup-title">
            <span>{formatMessage({ id: 'us-stock-quotes.please_select' })}</span>
            <p onClick={selectPopupClose}>
              <CloseIcon />
            </p>
          </div>
          <div styleName="select-popup-content">
            <ul>
              {showSelectMsg.list.map((item: any) => (
                <li
                  key={item.value}
                  styleName={item.value === formData[showSelectMsg.key] ? 'select-popup-item-active' : ''}
                  onClick={() => selectPopupChange(item)}
                >
                  <p>{item.label}</p>
                  {item.value === formData[showSelectMsg.key] ? (
                    <SelectedIcon styleName="select-popup-item-icon" />
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Popup>
      <DatePicker
        visible={showDate}
        value={formData.birthDate}
        dateChange={(val: string) => {
          console.log('birthDate', val);
          setFormData({ ...formData, birthDate: val });
          setShowDate(false);
        }}
        close={() => setShowDate(false)}
      />
    </div>
  );
};

export default PersonalData;
