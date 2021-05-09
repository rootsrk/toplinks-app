import { Button } from 'react-bootstrap';
import { useState } from 'react';

function Filter(props) {
  const [activeFilters, setActiveFilters] = useState([]);

  const onOptionClick = (value) => {
    const index = activeFilters.indexOf(value);
    const modifiedActiveFilters = [...activeFilters];

    if (index > -1) {
      modifiedActiveFilters.splice(index, 1);
    } else {
      modifiedActiveFilters.push(value);
    }
    setActiveFilters(modifiedActiveFilters);
  };

  return (
    <div className='filter-container row'>
      <h3>Filters</h3>
      {props.data.map((filterItem) => (
        <div className='filter-content' key={filterItem.name}>
          <div className='filter-content-container'>
            <div className='filter-content-title'>{filterItem.name}</div>
            <div>{filterItem.customComponent()}</div>
          </div>
          <div className='filter-content-options-container'>
            {Object.keys(filterItem.data).map((option) => (
              <span
                className={`filter-content-options ${
                  activeFilters.includes(filterItem.data[option].value)
                    ? 'selected'
                    : ''
                }`}
                onClick={() => onOptionClick(filterItem.data[option].value)}
                key={filterItem.data[option].value}
              >
                {filterItem.data[option].value}
              </span>
            ))}
          </div>
        </div>
      ))}
      <div className='filter-actions'>
        <Button
          variant='outline-secondary'
          onClick={() => {
            setActiveFilters([]);
            props.clearAllFilters();
          }}
        >
          Clear all
        </Button>
        <Button onClick={() => props.applyFilters(activeFilters)}>Apply</Button>
      </div>
    </div>
  );
}

export default Filter;
