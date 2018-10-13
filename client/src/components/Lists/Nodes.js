/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import matchSorter from 'match-sorter'
import { FormattedMessage } from 'react-intl'
import config from '../config.json'

const Nodes = ({ nodeList }) => {
  const columnHeaders = []
  for (let i = 0; i < config.networkview.length; i++) {
    switch (config.networkview[i]) {
      case 'nodename' : columnHeaders.push(
        {
          Header: <FormattedMessage
            id='page.localeProvider.nodename'
            defaultMessage='Node Name'
            description='Node Name'
          />,
          accessor: 'server_hostname',
          filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ['server_hostname'] }, { threshold: matchSorter.rankings.SIMPLEMATCH }),
          filterAll: true
        }
      ); break
      case 'endpoint_url' : columnHeaders.push(
        {
          Header: <FormattedMessage
            id='page.localeProvider.endpoint'
            defaultMessage='ENDPOINT'
            description='ENDPOINT'
          />,
          accessor: 'requests',
          filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ['requests'] }, { threshold: matchSorter.rankings.SIMPLEMATCH }),
          filterAll: true
        }
      ); break
      default : break
    }
  }
  return (
    <div>
      <ReactTable
        data={nodeList}
        columns={columnHeaders}
        defaultPageSize={5}
        minRows={0}
        showPagination={!(nodeList.length < 5)}

      />
    </div>
  )
}

export default Nodes
