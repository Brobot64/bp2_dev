import React, {useState} from 'react';
import style from './SearchPopup.module.css';


const SearchPopup = ({ onClose }) => {

    const [selectedOption, setSelectedOption] = useState('all');

    const handleOptionChange = (option) => {
        setSelectedOption(option);
      };


  return (
    <div className={style.popupContainer}>
      <div className={style.popup}>
        <h2>[Search]</h2>
        <p>You can search for a specific book by kewords</p>


        <div className={style.searchOptions}>
          <label
            className={selectedOption === 'all' ? style.active : ''}
            onClick={() => handleOptionChange('all')}
          >
            All
          </label>

          <label
            className={selectedOption === 'books' ? style.active : ''}
            onClick={() => handleOptionChange('books')}
          >
            Books
          </label>

          <label
            className={selectedOption === 'reports' ? style.active : ''}
            onClick={() => handleOptionChange('reports')}
          >
            Reports
          </label>
        </div>


        <div className={style.searchInput}>
            <input type="text" placeholder="Enter keywords..." />
        </div>

        <button className={style.close} onClick={onClose}>x</button>
      </div>
    </div>
  );
};

export default SearchPopup;
