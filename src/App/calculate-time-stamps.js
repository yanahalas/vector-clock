import { isEqual } from 'lodash/fp';

export const getGroupedByProcess = (process, events = eventsMock) => {
  let grouped = {};
  const senderTimeStamps = new Array(process.length).fill(0);
  const receiverTimeStamps = new Array(process.length).fill(0);

  process.forEach(p => {
    grouped[p] = events
      .filter(cur => parseInt(cur.fromProcess) === p || parseInt(cur.toProcess) === p)
      .map(cur => {
        let time;
        if (parseInt(cur.fromProcess) === p) {
          time = cur.fromTime;
        } else if (parseInt(cur.toProcess) === p) {
          time = cur.toTime;
        }

        return {
          ...cur,
          fromProcess: parseInt(cur.fromProcess),
          toProcess: parseInt(cur.toProcess),
          fromTime: parseInt(cur.fromTime),
          toTime: parseInt(cur.toTime),
          senderTimeStamps,
          receiverTimeStamps,
          time: parseInt(time),
        }
      }).sort((a, b) => a.time - b.time);
  });

  return { ...grouped }
};

export const calculateTimeStamps = (process, events) => {
  const startValue = new Array(process.length).fill(0);

  // create pointers for Process - start from 0;
  let pointers = {};
  let lastPointers = {};
  process.forEach(p => {
    pointers[p] = 0;
    lastPointers[p] = events[p].length;
  });

  let inComplete = true;
  let counter = 0;

  while (inComplete) {
    counter += 1;

    process.forEach(p => {
      pointers[p] = 0;
    });

    console.log('While #', counter);

    process.forEach(p => {
      console.log("Process #", p);

      for(let i = 0; i < events[p].length; i ++) {
        const event = events[p][i];
        // Check if receiver
        if (event.toProcess === p) {
          const senderEvent = events[event.fromProcess].find(cur => {
            return cur.fromTime === event.fromTime &&
              cur.fromProcess === event.fromProcess &&
              cur.toTime === event.toTime &&
              cur.toProcess === event.toProcess
          });

          if (!isEqual(senderEvent.senderTimeStamps, startValue)) {
            // console.info('Calculate Receiver Time stamp');
            // event.receiverTimeStamps = new Array(process.length).fill(8);

            if (i === 0) {
              const localTimeStamp = new Array(process.length).fill(0);

              // Get maximum from LocalTimeStamp and senderEvent.senderTimeStamps
              event.receiverTimeStamps = localTimeStamp.map((item, index) => {
                return Math.max(item, senderEvent.senderTimeStamps[index]);
              });
              event.receiverTimeStamps[p - 1] = 1;

            } else {
              const previousEvent = events[p][i - 1];
              // check if previous event is Receiver or Sender
              const localTimeStamp = isEqual(previousEvent.receiverTimeStamps, startValue)
                ? previousEvent.senderTimeStamps
                : previousEvent.receiverTimeStamps;

              // Get maximum from LocalTimeStamp and senderEvent.senderTimeStamps
              event.receiverTimeStamps = localTimeStamp.map((item, index) => {
                return Math.max(item, senderEvent.senderTimeStamps[index]);
              });

              event.receiverTimeStamps[p - 1] = localTimeStamp[p - 1] + 1;
            }

            pointers[p] += 1;
          } else {
            console.log('break');
            break;
          }
        } else {
          if (i === 0) {
            event.senderTimeStamps = new Array(process.length).fill(0);
            event.senderTimeStamps[p - 1] = 1;
          } else {
            // Get previous event
            const previousEvent = events[p][i - 1];
            // check if previous event is Receiver or Sender
            const localTimeStamp = isEqual(previousEvent.receiverTimeStamps, startValue)
              ? previousEvent.senderTimeStamps
              : previousEvent.receiverTimeStamps;

            event.senderTimeStamps = [...localTimeStamp];
            event.senderTimeStamps[p - 1] = event.senderTimeStamps[p - 1] + 1;
          }

          pointers[p] += 1;

          // console.log('Pointers', pointers);
        }
      }
    });


    if (isEqual(pointers, lastPointers)) {
      inComplete = false;
    }
  }

  console.log('Complete', events);

  const timeStamps = {};
  Object.keys(events).forEach(pr => {
    timeStamps[pr] = events[pr].map((cur) => {
      return isEqual(cur.receiverTimeStamps, startValue)
        ? cur.senderTimeStamps
        : cur.receiverTimeStamps;
    })
  });

  return timeStamps;
};

// export const eventsMock = [
//   {
//     fromProcess: 1,
//     fromTime: 0,
//     toProcess: undefined,
//     toTime: undefined,
//   },
//   {
//     fromProcess: 1,
//     fromTime: 10,
//     toProcess: 2,
//     toTime: 20
//   },
//   {
//     fromProcess: 1,
//     fromTime: 30,
//     toProcess: undefined,
//     toTime: undefined,
//   },
//   {
//     fromProcess: 2,
//     fromTime: 30,
//     toProcess: 1,
//     toTime: 40
//   },
//   {
//     fromProcess: 1,
//     fromTime: 50,
//     toProcess: 3,
//     toTime: 60,
//   },
//   {
//     fromProcess: 3,
//     fromTime: 20,
//     toProcess: 2,
//     toTime: 10,
//   },
//   {
//     fromProcess: 3,
//     fromTime: 50,
//     toProcess: undefined,
//     toTime: undefined,
//   }
// ];

export const eventsMock = [
  {
    fromProcess: 1,
    fromTime: 0,
    toProcess: 4,
    toTime: 10,
  },
  {
    fromProcess: 2,
    fromTime: 10,
    toProcess: 1,
    toTime: 10,
  },
  {
    fromProcess: 3,
    fromTime: 15,
    toProcess: 2,
    toTime: 15,
  },
  {
    fromProcess: 2,
    fromTime: 20,
    toProcess: 3,
    toTime: 25,
  },
  {
    fromProcess: 4,
    fromTime: 30,
    toProcess: 2,
    toTime: 35,
  },
  {
    fromProcess: 1,
    fromTime: 30,
    toProcess: 3,
    toTime: 55,
  },
  {
    fromProcess: 1,
    fromTime: 40,
    toProcess: 4,
    toTime: 45,
  },
  {
    fromProcess: 4,
    fromTime: 50,
    toProcess: 3,
    toTime: 50,
  },
  {
    fromProcess: 2,
    fromTime: 52,
    toProcess: 1,
    toTime: 52,
  },
  {
    fromProcess: 3,
    fromTime: 60,
    toProcess: 1,
    toTime: 65,
  },
  {
    fromProcess: 4,
    fromTime: 60,
    toProcess: 2,
    toTime: 70,
  },
  {
    fromProcess: 1,
    fromTime: 75,
    toProcess: 3,
    toTime: 80,
  },
];
