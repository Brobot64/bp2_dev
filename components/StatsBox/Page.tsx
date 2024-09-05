import React from 'react';
import style from '../all.module.css'

interface StatsBoxProps {
  title: string;
  count: number;
}

const StatsBox: React.FC<StatsBoxProps> = ({ title, count }) => {
  return (
    <div className={style.statsBox}>
      <h3 className={style.title}>{title}</h3>
      <p className={style.count}>{count}</p>
    </div>
  );
};

export default StatsBox;
