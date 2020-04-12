import React, { Fragment } from 'react';
import {
  DataTable,
  DataTableContent,
  DataTableHead,
  DataTableRow,
  DataTableHeadCell,
  DataTableBody,
  DataTableCell
} from '@rmwc/data-table';

import '@rmwc/data-table/styles';

const Table = ({timeStamps}) => {
  return (
    <DataTable>
      <DataTableContent>
        <DataTableHead>
          <DataTableRow>
            <DataTableHeadCell>Process</DataTableHeadCell>
            <DataTableHeadCell>Vector Clock Timestamps</DataTableHeadCell>
          </DataTableRow>
        </DataTableHead>
        <DataTableBody>
          {
            Object.keys(timeStamps).map((process, index) => (
              <Fragment key={index}>
                <DataTableRow>
                  <DataTableCell>Process {process}</DataTableCell>
                  <DataTableCell>
                    {timeStamps[process].map((event, eventIndex) => (
                      <Fragment key={eventIndex}>
                        <span>({event.join(', ')}) </span>
                      </Fragment>
                    ))}
                  </DataTableCell>
                </DataTableRow>
              </Fragment>
            ))
          }
        </DataTableBody>
      </DataTableContent>
    </DataTable>
  );
};

export default Table;
