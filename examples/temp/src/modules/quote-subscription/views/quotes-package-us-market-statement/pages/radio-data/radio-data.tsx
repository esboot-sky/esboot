import { Toast, Card, Radio, Space, Checkbox } from 'antd-mobile';
import { useState, useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { requestSlectData, submitSlectData, requestSlectDatast } from '@/api/quotation/market-statement';
import IconCheckbox from '@/modules/quote-subscription/images/icon_checkbox.svg';
import IconCheckboxAct from '@/modules/quote-subscription/images/icon_checkbox_act.svg';

import { StatementRouter } from '../../constant/const';

import './radio-data.scss';

const OrderTypeIntro = () => {
  const [apiQuestions, setApiQuestions] = useState<string[][]>([]);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [isAllNo, setIsAllNo] = useState(false);
  const [isDeclarationChecked, setIsDeclarationChecked] = useState(false);
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  const [errors, setErrors] = useState<boolean[]>([]);
  const [hasSavedAnswers, setHasSavedAnswers] = useState(false);

  const ensureRef = useRef<HTMLDivElement>(null);
  const [bottomPadding, setBottomPadding] = useState(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (ensureRef.current) {
      const height = ensureRef.current.offsetHeight;
      setBottomPadding(height + 20);
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await requestSlectData({
        types: ['pi_question'],
      });

      if (response?.result?.pi_question && Array.isArray(response.result.pi_question)) {
        setErrors(new Array(response.result.pi_question.length).fill(false));
        setApiQuestions(response.result.pi_question);

        // 获取问题列表后，立即获取保存的答案
        fetchDatast();
      } else {
        console.error('接口返回数据格式不正确:', response);
        Toast.show({ content: '问题数据获取失败，请稍后重试', duration: 2000 });
      }
    } catch (error) {
      console.error('请求失败:', error);
      Toast.show({ content: '请求失败，请检查网络连接', duration: 2000 });
    }
  };

  const fetchDatast = async () => {
    try {
      const response = await requestSlectDatast();
      if (response?.code === 0 && response.result?.answer) {
        try {
          const savedAnswers = JSON.parse(response.result.answer);

          // 检查保存的答案是否是有效的对象
          if (typeof savedAnswers === 'object' && savedAnswers !== null) {
            // 验证保存的答案是否包含所有问题
            const allKeysExist = apiQuestions.every((question) => {
              const key = question[0];
              return savedAnswers[key] !== undefined;
            });

            if (allKeysExist) {
              setAnswers(savedAnswers);
              setHasSavedAnswers(true);

              // 更新全选状态
              const allNo = Object.values(savedAnswers).every((value) => value === false);
              setIsAllNo(allNo);

              // 清除所有错误状态
              setErrors(Array(apiQuestions.length).fill(false));

              Toast.show({ content:formatMessage({ id: 'questionnaire-items.loaded-answer' }), duration: 1000 });
              return;
            }
          }
        } catch (parseError) {
          console.error('解析保存的答案失败:', parseError);
        }
      }

      // 如果没有保存的答案或解析失败，初始化空答案
      if (!hasSavedAnswers) {
        const emptyAnswers: Record<string, boolean> = {};
        apiQuestions.forEach((question) => {
          emptyAnswers[question[0]] = undefined as any;
        });
        setAnswers(emptyAnswers);
      }
    } catch (error) {
      console.error('请求失败:', error);
      Toast.show({ content: '获取保存答案失败', duration: 2000 });
    }
  };

  const handleAnswerChange = (index: number, value: string) => {
    const key = apiQuestions[index][0];
    const boolValue = value === '1';

    setAnswers((prev) => ({
      ...prev,
      [key]: boolValue,
    }));

    const newErrors = [...errors];
    newErrors[index] = false;
    setErrors(newErrors);

    // 清除保存答案标记（用户修改后）
    setHasSavedAnswers(false);
  };

  const handlePreviousStep = () => {
    const source = searchParams.get('source');
    if (source === 'internal') {
      navigate(-1);
    } else {
      navigate(StatementRouter.STATEMENT_PERSONAL_DATA);
    }
  };

  const handleAllNoChange = (checked: boolean) => {
    setIsAllNo(checked);

    if (checked) {
      const allNoAnswers: Record<string, boolean> = {};
      apiQuestions.forEach((question) => {
        const key = question[0];
        allNoAnswers[key] = false;
      });

      setAnswers(allNoAnswers);
      setErrors(Array(apiQuestions.length).fill(false));
    } else {
      // 取消全为否，清空所有答案
      const emptyAnswers: Record<string, boolean> = {};
      apiQuestions.forEach((question) => {
        emptyAnswers[question[0]] = undefined as any;
      });
      setAnswers(emptyAnswers);
      setErrors(Array(apiQuestions.length).fill(false));
    }

    // 清除保存答案标记（用户修改后）
    setHasSavedAnswers(false);
  };

  useEffect(() => {
    if (apiQuestions.length > 0 && !hasSavedAnswers) {
      const allNo = apiQuestions.every((question) => {
        const key = question[0];
        return answers[key] === false;
      });

      setIsAllNo(allNo && Object.keys(answers).length === apiQuestions.length);
    }
  }, [answers, apiQuestions, hasSavedAnswers]);

  const handleNext = () => {
    const unansweredIndices: number[] = [];
    const newErrors = [...errors];

    apiQuestions.forEach((question, index) => {
      const key = question[0];
      if (answers[key] === undefined) {
        newErrors[index] = true;
        unansweredIndices.push(index + 1);
      } else {
        newErrors[index] = false;
      }
    });

    setErrors(newErrors);

    if (unansweredIndices.length > 0) {
      Toast.show({ content: formatMessage({ id: 'questionnaire-items.please-questionnaire' }), duration: 2000 });
      return;
    }

    if (!isDeclarationChecked || !isAgreementChecked) {
      Toast.show({ content: formatMessage({ id: 'questionnaire-items.please-check' }), duration: 1000 });
      return;
    }

    // 创建按问题key排序的答案对象
    const formattedAnswers: Record<string, boolean> = {};
    apiQuestions.forEach((question) => {
      const key = question[0];
      formattedAnswers[key] = answers[key];
    });

    // console.log('用户选择的答案:', formattedAnswers);

    // 提交答案
    submitSlectData(formattedAnswers)
      .then((res) => {
        if (res.success) {
          Toast.show({
            icon: 'success',
            content: formatMessage({ id: 'questionnaire-items.submit-success' }),
            duration: 1000,
            afterClose: () => {
              navigate(StatementRouter.STATEMENT_PROGRESS);
            },
          });
        } else {
          Toast.show({ content: res.msg || formatMessage({ id: 'questionnaire-items.submit-failed' }), duration: 2000 });
        }
      })
      .catch((err) => {
        // console.error('提交失败:', err);
        Toast.show({ content: formatMessage({ id: 'questionnaire-items.submit-failed' }), duration: 2000 });
      });
  };

  const getAnswerValue = (index: number) => {
    const key = apiQuestions[index][0];
    const answer = answers[key];

    if (answer === true) return '1';
    if (answer === false) return '0';
    return undefined;
  };

  return (
    <div styleName="box">
      <div styleName="hint">
      {formatMessage({ id: 'questionnaire-items.questionnaire_title' })}
      </div>

      <div styleName="card-content" style={{ paddingBottom: `${bottomPadding}px` }}>
        {apiQuestions.map((question, index) => (
          <div styleName="cardbox" key={question[1]}>
            <Card
              title={
                <div>
                  {question[1]}
                  <span style={{ color: 'red', marginLeft: 4 }}>*</span>
                </div>
              }
              style={{ border: errors[index] ? '1px solid red' : 'none' }}
            >
              <Radio.Group
                value={getAnswerValue(index)}
                onChange={(val) => handleAnswerChange(index, val)}
                key={isAllNo ? `all-no-${index}` : `normal-${index}`}
              >
                <Space direction="vertical">
                  <Radio value="0">否</Radio>
                  <Radio value="1">是</Radio>
                </Space>
              </Radio.Group>

              {errors[index] && <div style={{ color: 'red', fontSize: 12, marginTop: 8 }}>{formatMessage({ id: 'questionnaire-items.please-select' })}</div>}
            </Card>
          </div>
        ))}
      </div>

      <div styleName="ensure" ref={ensureRef} onTouchMove={(e) => e.preventDefault()}>
        <div styleName="agreement">
          <Checkbox
            checked={isAllNo}
            onChange={handleAllNoChange}
            // eslint-disable-next-line react/no-unstable-nested-components
            icon={(checked) => (checked ? <IconCheckboxAct /> : <IconCheckbox />)}
          >
            {formatMessage({ id: 'us-stock-quotes.statement1' })}
          </Checkbox>
        </div>

        <div styleName="agreement">
          <Checkbox
            checked={isDeclarationChecked}
            onChange={setIsDeclarationChecked}
            // eslint-disable-next-line react/no-unstable-nested-components
            icon={(checked) => (checked ? <IconCheckboxAct /> : <IconCheckbox />)}
          >
            {formatMessage({ id: 'us-stock-quotes.statement2' })}
          </Checkbox>
        </div>

        <div styleName="agreement">
          <Checkbox
            id="agreementCheckbox"
            checked={isAgreementChecked}
            onChange={setIsAgreementChecked}
            // eslint-disable-next-line react/no-unstable-nested-components
            icon={(checked) => (checked ? <IconCheckboxAct /> : <IconCheckbox />)}
          >
            {formatMessage({ id: 'us-stock-quotes.statement3' })}
          </Checkbox>
        </div>

        <div styleName="ensure-btn">
          <div styleName="laststep" onClick={handlePreviousStep}>
          {formatMessage({ id: 'questionnaire-items.last-step' })}
          </div>
          <div styleName="nextstep" onClick={handleNext}>
          {formatMessage({ id: 'questionnaire-items.next-step' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTypeIntro;
