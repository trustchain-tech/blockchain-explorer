/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, {Component} from "react"
import Dialog from "material-ui/Dialog"
import TransactionView from "../View/TransactionView"
import BlockView from "../View/BlockView"
import ReactTable from "react-table"
import "react-table/react-table.css"
import matchSorter from "match-sorter"
import FontAwesome from "react-fontawesome"
import find from "lodash/find"
import {FormattedMessage} from 'react-intl'
import Transaction from "./Transaction"
import { IntlProvider } from 'react-intl'
import config from '../config.json'

class Blocks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
      loading: false,
      dialogOpenBlockHash: false,
      blockHash: {},
      transactions :{}
    };
  }

  handleDialogOpen = async tid => {
    await this.props.getTransaction(this.props.currentChannel, tid);
    this.setState({dialogOpen: true});
  };

  handleDialogOpenTransactions = transaction =>{
    const data = [];
    transaction.forEach(element => {
      data.push({
        txhash: element
      })
    })
    
    
    this.setState({dialogOpen: true , transactions: data});
  }

  handleDialogClose = () => {
    this.setState({dialogOpen: false});
  };

  handleDialogOpenBlockHash = blockHash => {
    const data = find(this.props.blockList, item => {
      return item.blockhash === blockHash;
    });

    this.setState({
      dialogOpenBlockHash: true,
      blockHash: data
    });
  };


  handleDialogCloseBlockHash = () => {
    this.setState({dialogOpenBlockHash: false});
  };

  handleEye = (row, val) => {
    const data = Object.assign({}, this.state.selection, {[row.index]: !val});
    this.setState({selection: data});
  };

  componentDidMount() {
    const selection = {};
    this.props.blockList.forEach(element => {
      selection[element.blocknum] = false;
    });
    
    this.setState({selection: selection});
  }

  reactTableSetup = () => {
    const blocksview = []
    for (let i = 0; i < config.blocksview.length; i++) {
      switch(config.blocksview[i]) {
        case "blocknumber" : blocksview.push(
          {
            Header: <FormattedMessage
                        id="page.localeProvider.blocknum"
                        defaultMessage="Block Number"
                        description="Block Number"
                        />,
            accessor: "blocknum",
            filterMethod: (filter, rows) =>
              matchSorter(
                rows,
                filter.value,
                {keys: ["blocknum"]},
                {threshold: matchSorter.rankings.SIMPLEMATCH}
              ),
            filterAll: true,
            width: 150
          }
        ); break;
        case "chainname" : blocksview.push(
          {
            Header: <FormattedMessage
                        id="page.localeProvider.chainname"
                        defaultMessage="Chain Name"
                        description="Chain Name"
                        />,
            accessor: "channelname",
            filterMethod: (filter, rows) =>
              matchSorter(
                rows,
                filter.value,
                {keys: ["channelname"]},
                {threshold: matchSorter.rankings.SIMPLEMATCH}
              ),
            filterAll: true
          }
        ); break;
        case "number_of_tx" : blocksview.push(
          {
            Header: <FormattedMessage
                        id="page.localeProvider.num"
                        defaultMessage="Number of Tx"
                        description="Number of Tx"
                        />,
            accessor: "txcount",
            filterMethod: (filter, rows) =>
              matchSorter(
                rows,
                filter.value,
                {keys: ["txcount"]},
                {threshold: matchSorter.rankings.SIMPLEMATCH}
              ),
            filterAll: true,
            width: 150
          }
        ); break;
        case "datahash" : blocksview.push(
          {
            Header: <FormattedMessage
                        id="page.localeProvider.datah"
                        defaultMessage="Data Hash"
                        description="Data Hash"
                        />,
            accessor: "datahash",
            filterMethod: (filter, rows) =>
              matchSorter(
                rows,
                filter.value,
                {keys: ["datahash"]},
                {threshold: matchSorter.rankings.SIMPLEMATCH}
              ),
            filterAll: true
          }
        ); break;
        case "blockhash" : blocksview.push(
          {
            Header: <FormattedMessage
                        id="page.localeProvider.blockhash"
                        defaultMessage="Block Hash"
                        description="Block Hash"
                        />,
            accessor: "blockhash",
            Cell: row => (
              <span>
                <a
                  className="partialHash"
                  onClick={() => this.handleDialogOpenBlockHash(row.value)}
                  href="#/blocks"
                >
                  <div className="fullHash" id="showTransactionId">
                    {row.value}
                  </div>{" "}
                  {row.value.slice(0, 6)} {!row.value ? "" : "... "}
                </a>{" "}
              </span>
            ),
            filterMethod: (filter, rows) =>
              matchSorter(
                rows,
                filter.value,
                {keys: ["blockhash"]},
                {threshold: matchSorter.rankings.SIMPLEMATCH}
              ),
            filterAll: true
          }
        ); break;
        case "prehash" : blocksview.push(
          {
            Header: <FormattedMessage
                        id="page.localeProvider.prehash"
                        defaultMessage="Previous Hash"
                        description="Previous Hash"
                        />,
            accessor: "prehash",
            filterMethod: (filter, rows) =>
              matchSorter(
                rows,
                filter.value,
                {keys: ["prehash"]},
                {threshold: matchSorter.rankings.SIMPLEMATCH}
              ),
            filterAll: true,
            width: 150
          }
        ); break;
        case "transactions" : blocksview.push(
          {
            Header: <FormattedMessage
                        id="page.localeProvider.transactionsl"
                        defaultMessage="Transactions"
                        description="Transactions"
                        />,
            accessor: "txhash",
            Cell: row => (
              <span>
                <button
                  className="partialHash"
                  onClick={() => this.handleDialogOpenTransactions(row.value)}
                  disabled= {row.value ? "" : "disabled"}
                  href="#/blocks"
                >
                  <div className="fullHash" id="showTransactionId">
                    <FormattedMessage
                    id="page.localeProvider.details"
                    defaultMessage="Details"
                    description="Details"
                    />
                  </div>{" "}
                  <FormattedMessage
                    id="page.localeProvider.details"
                    defaultMessage="Details"
                    description="Details"
                    />
                </button>{" "}
              </span>
            ),
            filterMethod: (filter, rows) =>
              matchSorter(
                rows,
                filter.value,
                {keys: ["txhash"]},
                {threshold: matchSorter.rankings.SIMPLEMATCH}
              ),
            filterAll: true
          }
        ); break;
        default : break;
      }
    }
    return blocksview
  };

  render() {
    return (
      <div>
        <ReactTable
          data={this.props.blockList}
          columns={this.reactTableSetup()}
          defaultPageSize={20}
          minRows={0}
          showPagination={this.props.blockList.length < 5 ? false : true}
        />

        <Dialog
          open={this.state.dialogOpen}
          onClose={this.handleDialogClose}
          fullWidth={true}
          maxWidth={"md"}
        >
          <Transaction
            transaction={this.state.transactions}
            onClose={this.handleDialogClose}
            transactions = {this.props.transaction}
            gettransaction = {this.props.getTransaction}
          />
        </Dialog>

        <Dialog
          open={this.state.dialogOpenBlockHash}
          onClose={this.handleDialogCloseBlockHash}
          fullWidth={true}
          maxWidth={"md"}
        >
          <BlockView
            blockHash={this.state.blockHash}
            onClose={this.handleDialogCloseBlockHash}
          />
        </Dialog>
      </div>
    );
  }
}

export default Blocks;
