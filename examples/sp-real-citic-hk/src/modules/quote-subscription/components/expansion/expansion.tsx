import * as React from 'react';
import { useEffect } from 'react';
import { Ellipsis } from 'antd-mobile';
import './expansion.scss';

interface IProps {
  content: string;
  rows?: number;
  expandText?: string;
  collapseText?: string;
}

const Expansion: React.FC<IProps> = ({ content, rows, expandText, collapseText }) => {
  useEffect(() => {
    window.onerror = (errorMessage) => {
      console.log('错误', errorMessage);
    };
  }, []);
  return (
    <div styleName="expansion">
      <Ellipsis
        content={content}
        direction="end"
        expandText={expandText}
        rows={rows}
        collapseText={collapseText}
      />
    </div>
  );
};

Expansion.defaultProps = {
  rows: 1,
  expandText: '',
  collapseText: '',
};
export default Expansion;
