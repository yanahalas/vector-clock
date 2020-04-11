import React, { useState, useEffect } from 'react';
import { Select } from '@rmwc/select';
import { Button } from '@rmwc/button';
import { ThemeProvider } from '@rmwc/theme';
import '@rmwc/select/styles';
import '@rmwc/button/styles';

const getTimeOptions = () => {
  let times = [];

  for (let i = 0; i <= 100; i ++) {
    if (i % 10 === 0) {
      times.push(i);
    }
  }

  return times;
};

const SettingForm = ({createVisualization}) => {
  const [processorsCount, setProcessorsCount] = useState('3');
  const [processors, setProcessors] = useState([1,2,3]);
  const [events, setEvents] = useState([
    {
      fromProcess: '1',
      fromTime: '0',
      toTime: undefined,
      toProcess: undefined,
    }
  ]);

  const timeOptions = getTimeOptions();

  const addEvent = () => {
    setEvents([...events, {
      fromProcess: undefined,
      fromTime: undefined,
      toTime: undefined,
      toProcess: undefined,
    }]);
  };

  const updateEventByIndex = (eventIndex, field, newValue) => {
    const newEvent = {
      ...events.find((e, index) => index === eventIndex),
      [field]: newValue
    };

    const newEvents = events.slice();
    newEvents[eventIndex] = newEvent;

    setEvents([...newEvents]);
  };

  const changeNumberOfProcessors = (value) => {
    setProcessorsCount(value);

    let processors = [];
    for (let i = 1; i <= value; i ++) {
      processors.push(i);
    }

    setProcessors(processors);
    setEvents([]);
  };

  const submitForm = () => {
    createVisualization({processors, events});
  };

  return (
    <div className='SettingForm'>
      <div className='form-group'>
        <Select
          label="Number of Processes"
          value={processorsCount}
          options={['2', '3', '4', '5', '6', '7', '8', '9', '10']}
          enhanced
          onChange={(e) => changeNumberOfProcessors(e.currentTarget.value)}
        />
      </div>
      <label>Events</label>
      <div className='events-list'>
        {
          events.map((event, index) => (
            <div className='event' key={index}>
              <label>Event # {index + 1}</label>
              <div className='form-group'>
                <label>From</label>
                <div className="field-columns">
                  <div className="field">
                    <Select label="Process"
                            enhanced
                            value={event.fromProcess}
                            onChange={(e) => updateEventByIndex(index, 'fromProcess', e.currentTarget.value)}
                            options={processors.filter(cur => cur !== parseInt(event.toProcess))}/>
                  </div>

                  <div className="field">
                    <Select label="Position"
                            enhanced
                            value={event.fromTime}
                            onChange={(e) => updateEventByIndex(index, 'fromTime', e.currentTarget.value)}
                            options={timeOptions}/>
                  </div>
                </div>
              </div>

              <div className='form-group'>
                <label>To (optional)</label>
                <div className="field-columns">
                  <div className="field">
                    <Select label="Process"
                            enhanced
                            disabled={!event.fromProcess}
                            value={event.toProcess}
                            onChange={(e) => updateEventByIndex(index, 'toProcess', e.currentTarget.value)}
                            options={processors.filter(cur => cur !== parseInt(event.fromProcess))}/>
                  </div>

                  <div className="field">
                    <Select label="Position"
                            enhanced
                            disabled={!event.fromProcess}
                            value={event.toTime}
                            onChange={(e) => updateEventByIndex(index, 'toTime', e.currentTarget.value)}
                            options={timeOptions}/>
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </div>

      <div className='form-group'>
        <ThemeProvider
          options={{
            primary: '#64b5f6',
          }}
        >
          <Button label="+ Add Event"
                  raised
                  onClick={() => addEvent()}
          />
        </ThemeProvider>
      </div>

      <div className='form-group'>
        <Button label="Create"
                raised
                onClick={() => submitForm()}
        />
      </div>
    </div>
  )
};

export default SettingForm;
