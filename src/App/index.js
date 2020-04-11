import React, { useState } from 'react';

import { SimpleTopAppBar, TopAppBarFixedAdjust } from '@rmwc/top-app-bar';

import '@rmwc/top-app-bar/styles';

import './styles.scss';
import Processors from '../Processors';
import SettingForm from '../SettingForm';
import Table from '../Table';

import { getGroupedByProcess, calculateTimeStamps } from './calculate-time-stamps';
import { Button } from '@rmwc/button';

function App() {
  const [processorsValue, setProcessorsValue] = useState();

  // for testing
  // const events = getGroupedByProcess(processorsValue, eventsMock);

  const [processorEvents, setProcessorEvents] = useState();
  const [timeStamps, setTimeStamps] = useState();

  const createVisualization = (values) => {
    const { processors, events } = values;

    const groupedEvents = getGroupedByProcess(processors, events);

    setProcessorsValue(processors);
    setProcessorEvents(groupedEvents);
    setTimeStamps();
  };

  const run = () => {
    const localTimeStamps = calculateTimeStamps(processorsValue, processorEvents);
    console.log("TimeStamps", localTimeStamps);
    setTimeStamps(localTimeStamps);
  };

  return (
    <div className="App">
      <SimpleTopAppBar
        title="LTAT.06.007 Distributed Systems: Vector Clock Timestamps"
        endContent={"Yana Halas, Tetiana Shtym, Sergei Zaiaev"}
      />
      <TopAppBarFixedAdjust />
        <div className='content'>
          <SettingForm createVisualization={createVisualization} />

          {(processorsValue && processorEvents) && (
            <>
              <Button label="RUN" raised onClick={() => run()} />
              <Processors
                processors={processorsValue}
                processorEvents={processorEvents}
                timeStamps={timeStamps}
              />
            </>
          )}

          {timeStamps && (
            <div style={{'marginTop': 10}}>
              <Table timeStamps={timeStamps}/>
            </div>
          )}
        </div>
    </div>
  );
}

export default App;
