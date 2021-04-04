import React, {useState} from 'react';
import config from '../../config';
import CalculatorBillsList from '../CalculatorBillsList';
import Controls from '../Controls';
import Alert from '../Alert';
import './CalculatorBills.css';


const {garbageBills, homeMaintenance, rentBills, waterTariff, electricityTariff} = config;

function calculateTheCostWithTariff(bill) {
  const {previousValue, currentValue, tariff} = bill; 
  return (Math.abs(currentValue - previousValue)) * tariff;
}

function calculateFullCost(...costBills) {
  return costBills.reduce((totalValue, bill) => {
    return totalValue + bill;
  }, 0).toFixed(2);
}

const CalculatorBills = () => {
  
  const [bills, setBills] = useState([
    {title: 'Вода', tariff: waterTariff, previousValue: '', currentValue: ''},
    {title: 'Электричество', tariff: electricityTariff, previousValue: '', currentValue: ''},
  ]);

  const [totalCost, setTotalCost] = useState('');
  const [isCloseAlert, setIsCloseAlert] = useState(false);

  //TODO: Добавить функционал добавление нового платежа (допусти за газ) и редактирование существующего
  
  const inputPreviousValue = (title) => {
    return function(event) {
      const previousValue = event.currentTarget.value;
      setBills((bills) => { 
        const copyBills = [...bills];
        const bill = copyBills.find(bill => bill.title === title);
        bill.previousValue = previousValue;
        return copyBills;
      });
    }
  }
  
  
  const inputCurrentValue = (title) => {
    return function(event) {
      const currentValue = event.currentTarget.value;
      setBills((bills) => { 
        const copyBills = [...bills];
        const bill = copyBills.find(bill => bill.title === title);
        bill.currentValue = currentValue;   
        return copyBills;
      });
    }
  } 


  const isNotEmptyValue = (values) => {
    return values.every(value => value.previousValue && value.currentValue);
  }

  const closeAlertHandler = () => {
    setIsCloseAlert(false);
  }

  const calculateTheCost = (event) => {
    event.preventDefault();
    const isNotEmptyValues = isNotEmptyValue(bills);
    
    if(isNotEmptyValues) {
      const totalCostBills = bills.map(bill => calculateTheCostWithTariff(bill));
      setTotalCost(calculateFullCost(homeMaintenance, garbageBills, rentBills, ...totalCostBills));  
    } else {
      setIsCloseAlert(true);
    }
  }


  const clearAllValues = () => {
    setBills(() => {
      const newBills = bills.map(bill => {
        const newBill = {...bill};
        newBill.previousValue = '';
        newBill.currentValue = '';
        return newBill;
      });

      return newBills;
    });

    setTotalCost('');
  }


  return (
    <div className="calculator-bills">
      <div className="calculator-bills__container">
        <header className="calculator-bills__header">
          <h1 className="calculator-bills__title title"> Расчет аренды квартиры с коммуналкой </h1>
        </header>
        <form className="bills" onSubmit={calculateTheCost}>
          <div className="static-bill bill">
            <h2 className="title bill__title static-bill__title">Статические счета</h2>
            <ul className="static-bill__list">
              <li className="static-bill__item">
                Аренда квартиры: {rentBills} грн
              </li>
              <li className="static-bill__item">
                Счет за мусор: {garbageBills} грн
              </li>
              <li className="static-bill__item">
                Счет за обслуживание дома: {homeMaintenance} грн
              </li>
            </ul>
          </div>
          <CalculatorBillsList 
            billsData={bills} 
            onInputPreviousValue={inputPreviousValue} 
            onInputCurrentValue={inputCurrentValue}
          />
            {/*TODO: Более подробный вывод, чтобы было понятно как посчитано?*/ }
            {totalCost && <div className="calculator-bills__total-cost title"> Итоговая цена: {totalCost}</div>}
            <Controls onClearAllValues={clearAllValues} />
        </form>
      </div>
        {isCloseAlert && <Alert message='Пожалуйста, заполните все поля значениями!' title='Warning' icon='&#9888;' onClick={closeAlertHandler}/>}
    </div>
  );
}

export  default CalculatorBills;