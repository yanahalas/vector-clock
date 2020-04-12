import React, { Fragment } from 'react';
import { Stage, Layer, Circle, Arrow, Text } from "react-konva";

const canvasWidth = 960;
const lineWidth = 900;
const leftMargin = 40;
const lineMargin = 60;

const calculateEventCoords = (time, process) => {
  const x = time === 0 ? leftMargin : (lineWidth * time / 100);
  const y = process * lineMargin + 10;
  return [x, y]
};

const Events = ({processorEvents, timeStamps}) => {
  return (
      Object.keys(processorEvents).flatMap(key => {
        return processorEvents[key].map((cur, circleIndex) => {
          const fromProcess = parseInt(cur.fromProcess);
          const toProcess = cur.toProcess ? parseInt(cur.toProcess) : 1;

          const [x, y] = calculateEventCoords(cur.fromTime, fromProcess);
          const [x2, y2] = calculateEventCoords(cur.toTime || 0, toProcess);

          const senderColor = '#039be5';
          const receiverColor = '#ffeb3b';

          return (
            <Fragment key={`process-${key}-circle-${circleIndex}`}>
              {
                cur.fromProcess === parseInt(key) && (
                  <Fragment>
                    <Circle
                      x={x}
                      y={y}
                      radius={10}
                      fill={senderColor}
                    />

                    { timeStamps && (
                      <Text
                        x={x - 30}
                        y={y - 25}
                        fontSize={15}
                        text={timeStamps[key][circleIndex].join(', ')}
                      />
                    )}
                  </Fragment>
                )
              }
              {
                cur.toProcess === parseInt(key) && (
                  <Fragment>
                    <Circle x={x2} y={y2} radius={10} fill={receiverColor} />
                    <Arrow
                      x={x}
                      y={y}
                      points={[0, 0, (x2 - x), (y2 - y)]}
                      strokeWidth={4}
                      stroke={senderColor}
                    />

                    { timeStamps && (
                      <Text
                        x={x2 - 30}
                        y={y2 - 25}
                        fontSize={15}
                        text={timeStamps[key][circleIndex].join(', ')}
                      />
                    )}
                  </Fragment>
                )
              }
            </Fragment>
          )
        });
      })
  )
};

const Processors = ({processors, processorEvents, timeStamps}) => {
  const canvasHeight = processors.length * 70;

  return (
    <div className='Processors'>
      <Stage width={canvasWidth} height={canvasHeight}>
        <Layer>
          { processors.map((line) => {
            const y = line * lineMargin + 10;
            const points = [leftMargin, y, lineWidth, y];
            return (
              <Fragment key={`line-${line}`}>
                <Text
                  x={0}
                  y={y - 6}
                  fontSize={16}
                  fontStyle={'bold'}
                  text={`P${line}`}
                />
                <Arrow
                  points={points}
                  strokeWidth={5}
                  stroke="#303030"
                />
              </Fragment>
            );
          })}
          <Events
            processorEvents={processorEvents}
            timeStamps={timeStamps}
          />
        </Layer>
      </Stage>

    </div>
  )
};

export default Processors;
