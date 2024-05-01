// import React, { useState } from 'react';

// const Calculator = ({ onClose }) => {
//   const [expression, setExpression] = useState('');

//   const handleKeyPress = (char) => {
//     setExpression((prev) => prev + char);
//   };

//   const calculateResult = () => {
//     try {
//       const result = eval(expression);
//       setExpression(result.toString());
//     } catch (error) {
//       setExpression('Error');
//     }
//   };

//   const clearExpression = () => {
//     setExpression('');
//   };

//   return (
//     <div className="calculator-modal">
//       <div className="calculator">
//         <div className="display">{expression}</div>
//         <div className="keypad">
//           <button onClick={() => handleKeyPress('7')}>7</button>
//           <button onClick={() => handleKeyPress('8')}>8</button>
//           <button onClick={() => handleKeyPress('9')}>9</button>
//           <button onClick={() => handleKeyPress('+')}>+</button>
//           {/* Include other calculator buttons */}
//           <button onClick={calculateResult}>=</button>
//           <button onClick={clearExpression}>C</button>
//         </div>
//         <button onClick={onClose}>Close</button>
//       </div>
//     </div>
//   );
// };

// export default Calculator;

import React, { useState } from 'react';
import './Calculator.css';

const Calculator = ({ onClose }) => {
  const [expression, setExpression] = useState('');

  const handleKeyPress = (char) => {
    setExpression((prev) => prev + char);
  };

  const calculateResult = () => {
    try {
      const result = eval(expression);
      setExpression(result.toString());
    } catch (error) {
      setExpression('Error');
    }
  };

  const clearExpression = () => {
    setExpression('');
  };

  return (
    <div className="calculator-popup">
      <div className="calculator-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="display">{expression || '0'}</div>
        <div className="keypad">
          <button onClick={() => handleKeyPress('7')}>7</button>
          <button onClick={() => handleKeyPress('8')}>8</button>
          <button onClick={() => handleKeyPress('9')}>9</button>
          <button onClick={() => handleKeyPress('+')}>+</button>
          <button onClick={() => handleKeyPress('4')}>4</button>
          <button onClick={() => handleKeyPress('5')}>5</button>
          <button onClick={() => handleKeyPress('6')}>6</button>
          <button onClick={() => handleKeyPress('-')}>-</button>
          <button onClick={() => handleKeyPress('1')}>1</button>
          <button onClick={() => handleKeyPress('2')}>2</button>
          <button onClick={() => handleKeyPress('3')}>3</button>
          <button onClick={() => handleKeyPress('*')}>*</button>
          <button onClick={() => handleKeyPress('0')}>0</button>
          <button onClick={() => handleKeyPress('.')}>.</button>
          <button onClick={calculateResult}>=</button>
          <button onClick={clearExpression}>C</button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
