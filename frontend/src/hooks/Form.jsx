import './components.css'
import React, { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';

const Form = () => {
    const [spendings, setSpendings] = useState({
    groceries: '',
    transport: '',
    entertainment: '',
    eatOut: '',
    healthcare: '',
    education: '',
    miscellaneous: '',
  });

  const handleValueChange = (name) => (value) => {
    setSpendings((prev) => ({ ...prev, [name]: value || '' }));
  };

  const categories = [
    { key: 'groceries', label: 'Groceries' },
    { key: 'transport', label: 'Transport' },
    { key: 'entertainment', label: 'Entertainment' },
    { key: 'eatOut', label: 'Eat-Out', name: 'eat-out' },
    { key: 'healthcare', label: 'Healthcare' },
    { key: 'education', label: 'Education' },
    { key: 'miscellaneous', label: 'Miscellaneous', name: 'misc' },
  ];

  return (
    <>
    <form>
        <label> How much do you make in a year?
            <br />
            <input type="text" name="name"/>
        </label>
                <br />
        <label> What is your date of birth?
            <br />
            <input type="date" name="dob" />
        </label>
            <br />
        <label> What do you do for a living? <br />
            <input type="text" name="occupation" />
            <br />
        </label>
    </form>

    <div className="">
      <span className="">
        What are your monthly spendings in the following categories?
      </span>

        {categories.map((cat) => (
        <div key={cat.key} className="">
            <label
            htmlFor={cat.key}
            className="">
                {cat.label}
            </label>
            <br />
            <CurrencyInput
                id={cat.key}
                name={cat.name || cat.key}
                value={spendings[cat.key]}
                onValueChange={handleValueChange(cat.key)}
                prefix="₹ "
                placeholder="0.00"
                decimalsLimit={2}
                min={0}
                intlConfig={{ locale: 'en-IN' }} 
                className=""
            />
        </div>
      ))}
    </div>

    <form>
        <label> How much do you make in a year?
            <br />
            <input type="text" name="name"/>
        </label>
                <br />
        <label> What is your date of birth?
            <br />
            <input type="date" name="dob" />
        </label>
            <br />
        <label> What do you do for a living? <br />
            <input type="text" name="occupation" />
            <br />
        </label>
    </form>
    </>
  );
}

export default Form;
