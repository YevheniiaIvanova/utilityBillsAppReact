import React from 'react';
import FormTitle from '../../FormComponents/FormTitle/FormTitle';
import NumericInput from '../../FormComponents/FormInput/NumericInput';
import FormButton from '../../FormComponents/FormButton/FormButton';
import './CalculatorBillsItem.css';

const CalculatorBillsItem = (props) => {
  const {
          title, 
          tariff, 
          previousValue, 
          currentValue, 
          onInputPreviousValue, 
          onInputCurrentValue,
          isDeleteBill,
          onDeleteBill, 
        } = props;
  return ( 
    <div className="bill calculator-bills__item bills-item">
      <FormTitle>
        {`${title}: текущий тариф ${tariff} грн`}
      </FormTitle>
        
   
      <p className="bill-item__content">
        <label className="bill-item__label">
          Текущее значение счетчика:
        </label>
        <NumericInput  value={currentValue} onInput={onInputCurrentValue(title)} placeholder='###'/>
      </p>
      <p className="bill-item__content">
        <label className="bill-item__label">
          Предыдущее значение счетчика:
        </label>
        <NumericInput value={previousValue} onInput={onInputPreviousValue(title)} placeholder='###'/>
      </p>
      {isDeleteBill && <FormButton onClick={onDeleteBill(title)} heading="Удалить"/>}
    </div>
  );
}


export default CalculatorBillsItem;