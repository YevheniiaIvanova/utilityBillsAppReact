import React, {useState, useEffect} from 'react';
import BillsDataService from '../../services/billsData-service';
import config from '../../config';
import CalculatorBillsList from '../CalculatorBillsList';
import Controls from '../Controls';
import FormTitle from '../../FormComponents/FormTitle/FormTitle';
import Alert from '../Alert';
import NewBill from '../NewBill';
import EditBill from '../EditBill';
import './CalculatorBills.css';


const {garbageBills, homeMaintenance, rentBills} = config;

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
  
  const [bills, setBills] = useState([]);
  const [totalCost, setTotalCost] = useState('');
  const [alertType, setAlertType] = useState('');
  const [isShowNewBillBlock, setIsShowNewBillBlock] = useState(false);
  const [newBill, setNewBill] = useState({title: '', tariff: '', previousValue: '', currentValue: '' });
  const [isDeleteBill, setIsDeleteBill] = useState(false);
  const [isEditBill, setIsEditBill] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const response = await BillsDataService.getData();
      const bills = response.data.map(bill => ({...bill, previousValue: '', currentValue: ''}));
      setBills(() => bills);
    }
    fetchData();
  }, []);


  //Buttons Handlers
  const closeAlertHandler = () => {
    setAlertType('');
  }
  
  const onAddButtonHandler = () => {
    if(isEditBill) {
      setIsEditBill(false);
    }
    if(isDeleteBill) {
      setIsDeleteBill(false);
    }
    setIsShowNewBillBlock(true);
  }

  const onEditButtonHandler = () => {
    if(isDeleteBill) {
      setIsDeleteBill(false);
    }
    if(isShowNewBillBlock){
      setIsShowNewBillBlock(false);
    }
    setIsEditBill(true);
  }

  const onDeleteButtonHandler = () => {
    if(isEditBill) {
      setIsEditBill(false);
    }
    if(isShowNewBillBlock){
      setIsShowNewBillBlock(false);
    }
    setIsDeleteBill(true);
  }



  //TODO: ???????????????? ???????????????????? ???????????????????????????? ?????????????????????????? ??????????
  
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


  const calculateTheCost = (event) => {
    event.preventDefault();
    const isNotEmptyValues = isNotEmptyValue(bills);
    
    if(isNotEmptyValues) {
      const totalCostBills = bills.map(bill => calculateTheCostWithTariff(bill));
      setTotalCost(calculateFullCost(homeMaintenance, garbageBills, rentBills, ...totalCostBills));  
    } else {
      setAlertType('emptyValues');
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


  const onInputNewBillTitle = (event) => {
    const titleNewBill = event.currentTarget.value;
    setNewBill((newBill) => {
      return {
        ...newBill,
        title: titleNewBill
      }
    });
  }

  const onInputNewBillTariff = (event) => {
    const tariffNewBill = event.currentTarget.value;
    setNewBill((newBill) => {
      return {
        ...newBill,
        tariff: tariffNewBill
      }
    });
  }

  const addNewBill = () => {
    if(newBill.title && newBill.tariff) {
      setBills((bills) => {
        const copyBills = [...bills, newBill];
        return copyBills;
      });
      /* TODO: ???????????????? ?????????? ???????????????? ?????? ???? ???????????????? ???????????? ???????????????? + ???????????????? ?????????????? ???????????????? */
      setNewBill((newBill) => {
        return {
          ...newBill,
          title: '', 
          tariff: '',
        };
      });
      setIsShowNewBillBlock(false);
    } else {
      setAlertType('emptyValues');
    }
  }

  const deleteBill = (title) => {
    return function() {
      setBills((bills) => {
        const copyBills = [...bills];
        return copyBills.filter(bill => bill.title !== title);
      });
    }
  }

  const editBill = () => {
    if(newBill.title && newBill.tariff) {
      setBills((bills) => {
        const copyBills = [...bills];
        const indexBill  = copyBills.findIndex(bill => bill.title === newBill.title);
        if(indexBill !== -1) {
          copyBills[indexBill] = {...newBill};
          return copyBills;
        } else {
          setAlertType('nonExistentValue');
        }
        return bills;
        
      });
    } else {
      setAlertType('emptyValues');
     
    }
  }

  return (
    <div className="calculator-bills">
      <div className="calculator-bills__container">
        <header className="calculator-bills__header">
          <h1 className="calculator-bills__title title"> ???????????? ???????????? ???????????????? ?? ?????????????????????? </h1>
        </header>
        <form className="bills" onSubmit={calculateTheCost}>
          <div className="static-bill bill">
            <FormTitle heading="?????????????????????? ??????????" className="static-bill__title" />
            <ul className="static-bill__list">
              <li className="static-bill__item">
                ???????????? ????????????????: {rentBills} ??????
              </li>
              <li className="static-bill__item">
                ???????? ???? ??????????: {garbageBills} ??????
              </li>
              <li className="static-bill__item">
                ???????? ???? ???????????????????????? ????????: {homeMaintenance} ??????
              </li>
            </ul>
          </div>
          <CalculatorBillsList 
            billsData={bills} 
            onInputPreviousValue={inputPreviousValue} 
            onInputCurrentValue={inputCurrentValue}
            isDeleteBill={isDeleteBill}
            onDeleteBill={deleteBill}
          />
            { isShowNewBillBlock && <NewBill 
                                      heading="???????????????? ?????????? ????????"
                                      billData={newBill}
                                      onSave={addNewBill} 
                                      onInputNewBillTariff={onInputNewBillTariff} 
                                      onInputNewBillTitle={onInputNewBillTitle}/> 
            }
            
            {isEditBill && <EditBill 
                              heading="?????????????????????????? ?????????? ??????????"
                              billData={newBill}
                              onSave={editBill} 
                              onInputNewBillTariff={onInputNewBillTariff} 
                              onInputNewBillTitle={onInputNewBillTitle}/> 

            } 
            {/*TODO: ?????????? ?????????????????? ??????????, ?????????? ???????? ?????????????? ?????? ???????????????????*/ }
            {totalCost && <div className="calculator-bills__total-cost title"> ???????????????? ????????: {totalCost}</div>}

            <Controls onClearAllValues={clearAllValues} 
                      onAddButtonClick={onAddButtonHandler}
                      onEditButtonClick={onEditButtonHandler}
                      onDeleteButtonClick={onDeleteButtonHandler}
                      onCalculateButtonClick={calculateTheCost}
            />
        </form>
      </div>
        {alertType==='emptyValues' && <Alert message='????????????????????, ?????????????????? ?????? ???????? ????????????????????!' title='Warning' icon='&#9888;' onClick={closeAlertHandler}/>}
        {alertType==='nonExistentValue' && <Alert message='???????????? ???????????????? ??????!' title='Warning' icon='&#9888;' onClick={closeAlertHandler}/>}
    </div>
  );
}

export  default CalculatorBills;