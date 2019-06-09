import React, { Component } from 'react';
import './App.css';

import {
  FaExchangeAlt,
  FaBars,
  FaPlus,
  FaUndoAlt,
} from 'react-icons/fa'

import api from './api'
import utils from './utils/common'

import Currency from './Currency'

class Header extends Component {

  render() {
    const { isLoading } = this.props
    return (
      <header className={isLoading ? "header-container hidden" : "header-container"}>
        <h1 className="header-logo">
          Kurrency
        </h1>
        <nav className="nav-container">
          <ul className="nav-list">
            <li className="nav-item">
              Home
            </li>
            <li className="nav-item">
              About
            </li>
          </ul>
        </nav>
      </header>
    )
  }
}

class Content extends Component {

  constructor(props) {
    super(props)
    this.state = {
      baseCurrency: this.props.baseCurrency
    }
  }

  render() {
    const { isLoading, toCurrency, fromCurrency } = this.props
    return (
      <section className={isLoading ? "content-container hidden" : "content-container"}>
        <div className="inner-container">
          <div className="input-container">
            <input
              className="currency-input"
              spellCheck="false"
              placeholder="0"
              name="from-value"
              onChange={this.props.handleValueChange}
              value={this.props.fromValue}
            />
            <button className="currency-button" name="from-currency" onClick={this.props.changeCurrency}>
              <span className="currency-button-text">
                {fromCurrency ? fromCurrency.name : "USD"}
              </span>
              <span className="currency-button-icon-container" >
                <FaBars className="currency-button-icon" />
              </span>
            </button>
          </div>

          <div className="change-currency-container">
            <span className="change-icon-container" onClick={this.props.swapCurrencies}>
              <FaExchangeAlt className="change-icon" />
            </span>
          </div>

          <div className="input-container">
            <input
              className="currency-input"
              spellCheck="false"
              placeholder="0"
              name="to-value"
              onChange={this.props.handleValueChange}
              value={this.props.toValue}
            />
            <button className="currency-button" name="to-currency" onClick={this.props.changeCurrency}>
              <span className="currency-button-text">
                {toCurrency ? toCurrency.name : "USD"}
              </span>
              <span className="currency-button-icon-container">
                <FaBars className="currency-button-icon" />
              </span>
            </button>
          </div>
          <div className="result-info-container">
            <p className="result-info">
              1 {fromCurrency ? fromCurrency.name : "USD"} is {fromCurrency ? utils.truncateValue(fromCurrency.exchange(1, toCurrency), 8) : "0"} {toCurrency ? toCurrency.name : "SEK"}
            </p>
          </div>
          <div className="reset-container">
            <button className="reset-button" onClick={this.props.resetFields}>
              <span className="reset-text">Reset</span>
              <span className="reset-icon-container">
                <FaUndoAlt className="reset-icon" />
              </span>
            </button>
          </div>
        </div>

      </section>
    )
  }
}

class Loader extends Component {
  render() {
    const { isLoading } = this.props
    return (
      <div className={isLoading ? "loader-container" : "loader-container hidden"}>
        <span className="loader" />
        <h1 className="loader-title">loading exchange rates...</h1>
      </div>
    )
  }
}

class Footer extends Component {
  render() {
    const { isLoading } = this.props
    return (
      <footer className={isLoading ? "footer hidden" : "footer"}>
        <div className="inner-footer">
          <p>Made with ReactJS by <a href="https://github.com/alindfor/" target="_blank" rel="noreferrer noopener">Alexander Lindfors</a>, 2019</p>
          <p>The currency exchange rates are fetched using <a href="https://exchangeratesapi.io/" target="_blank" rel="noreferrer noopener">Exchange Rates API</a></p>
        </div>
      </footer>
    )
  }
}

class Modal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      filter: "",
      unfilteredCurrencies: this.props.currencies,
      filteredCurrencies: this.props.currencies
    }
  }

  _handleKeyDown = (event) => {
    var ESCAPE_KEY = 27;
    if (this.props.isShowing) {
      switch (event.keyCode) {
        case ESCAPE_KEY:
          this.closeModal()
          break;
        default:
          break;
      }
    }
  }
  componentDidMount() {
    document.addEventListener("keydown", this._handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this._handleKeyDown)
  }

  componentWillReceiveProps(newProps, oldProps) {

    //Attempt to make sure we have the currencies after initial load
    if (oldProps.currencies !== newProps.currencies) {
      this.setState({
        unfilteredCurrencies: newProps.currencies,
        filteredCurrencies: newProps.currencies
      })
    }
  }
  filterCurrencies = () => {

    const { unfilteredCurrencies, filter } = this.state

    if (filter.length === 0) {
      //Reset the filter
      this.setState({
        filteredCurrencies: unfilteredCurrencies
      })
    } else {
      //Filter the list on the search text)
      let updatedFilter = unfilteredCurrencies.filter((item) => {
        const { name } = item
        let uppercaseFilter = filter.toUpperCase()
        return name.includes(uppercaseFilter)
      })
      this.setState({
        filteredCurrencies: updatedFilter
      })
    }
  }
  updateText = (event) => {

    this.setState({
      filter: event.target.value
    }, () => {
      this.filterCurrencies()
    })
  }

  closeModal = (data) => {
    this.setState({
      filter: ""
    })
    const { filteredCurrencies } = this.state
    let returnData = undefined
    if (typeof data !== 'undefined') {
      returnData = filteredCurrencies[data]
    }
    this.props.onClose(returnData)
    this.currenciesList.scrollTo({ top: 0, left: 0 })
  }

  render() {

    const { isShowing } = this.props
    const { filter, filteredCurrencies } = this.state
    return (
      <div className={isShowing ? "modal-container" : "modal-container hidden"}>
        <div className="modal">
          <div className="close-modal-container">
            <FaPlus className="close-modal-icon" onClick={() => this.closeModal()} />
          </div>
          <input
            autoFocus={true}
            className="currency-search"
            autoCorrect="false"
            type="text"
            placeholder="Filter currencies.."
            value={filter}
            onChange={this.updateText}
          ></input>
          <div className="currencies-container" ref={(ref) => this.currenciesList = ref}>
            <ul className="currencies-list">
              {filteredCurrencies.map((item, index) => {
                return (
                  <li key={index} className="currency-item" onClick={() => this.closeModal(index)}>
                    <p>{item.name}</p>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}
class Kurrency extends Component {


  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      modalIsOpen: false,
      currencies: [],
      waitingForNewCurrency: -1,
      toCurrency: undefined,
      toValue: "0",
      fromCurrency: undefined,
      fromValue: "0",
      baseCurrency: new Currency("EUR", 1)
    }
  }

  componentDidMount() {
    api.getRates()
      .then((response) => {
        this.buildExchangeRates(response)
        this.setLoading(false)
      }).catch((response) => {
        console.log("The fetching of rates failed")
        console.log("response: ", response)
        this.setLoading(false)
      })
  }

  render() {
    const {
      isLoading,
      modalIsOpen,
      currencies,
      fromCurrency,
      fromValue,
      toCurrency,
      toValue } = this.state
    return (
      <div className="container">

        <Header isLoading={isLoading}></Header>
        <Content
          isLoading={isLoading}
          fromCurrency={fromCurrency}
          fromValue={fromValue}
          toCurrency={toCurrency}
          toValue={toValue}
          handleValueChange={this.handleValueChange}
          baseCurrency={this.state.baseCurrency}
          changeCurrency={this.openModal}
          swapCurrencies={this.swapCurrencies}
          resetFields={this.resetFields}>
        </Content>
        <Modal
          onClose={this.closeModal}
          isShowing={modalIsOpen}
          currencies={currencies}>
        </Modal>
        <Loader isLoading={isLoading}></Loader>
        <Footer isLoading={isLoading} />
      </div>
    )
  }

  resetFields = () => {
    const {currencies} = this.state
    this.setState({
      fromCurrency: currencies[0],
      toCurrency: currencies[1],
      fromValue:"",
      toValue:""
    })
  }
  handleValueChange = (event) => {
    const { toCurrency, fromCurrency } = this.state
    const { name, value } = event.target
    const { data } = event.nativeEvent
    if (data !== " " && (data >= 0 || data <= 9 || data === "," || data === ".")) {
      let replaceComma = value.replace(",", ".")
      switch (name) {
        case "from-value":
          this.setState({
            fromValue: replaceComma,
            toValue: utils.truncateValue(fromCurrency.exchange(replaceComma, toCurrency), 3)
          })
          break;
        case "to-value":
          this.setState({
            toValue: replaceComma,
            fromValue: utils.truncateValue(toCurrency.exchange(replaceComma, fromCurrency), 3)
          })
          break;
        default:
          console.log("Default, unused case. There was no matching field name.")
      }
    }
  }
  setLoading = (state) => {
    this.setState({
      isLoading: state,
    })
  }

  buildExchangeRates = (rates) => {
    let ratesArray = Object.entries(rates)
    var currencies = []
    ratesArray.forEach((rate) => {
      let tempCurrency = new Currency(rate[0], rate[1])
      currencies.push(tempCurrency)
    })

    //We need to add EUR, the base currency, manually
    currencies.push(this.state.baseCurrency)
    this.setState({
      currencies: currencies,
      fromCurrency: currencies[0],
      toCurrency: currencies[1]
    })
  }

  openModal = (data, changeCallback) => {

    let requestingField = data.target.name
    let requestingFieldIndex = -1
    switch (requestingField) {
      case "from-currency":
        requestingFieldIndex = 0
        break;
      case "to-currency":
        requestingFieldIndex = 1
        break;
      default:
        console.log("Default, unused case")
        break;
    }
    this.setState({
      modalIsOpen: true,
      waitingForNewCurrency: requestingFieldIndex
    })
  }

  swapCurrencies = () => {
    const { 
      toCurrency,
      toValue,
      fromCurrency,
      fromValue } = this.state
    this.setState({
      toCurrency: fromCurrency,
      fromCurrency: toCurrency,
      toValue: fromValue,
      fromValue: toValue
    })
  }

  closeModal = (newCurrency) => {
    const { 
      waitingForNewCurrency,
      toValue,
      fromValue,
      toCurrency,
      fromCurrency
     } = this.state

    //Check that we get a declared var that is not undefined
    if (waitingForNewCurrency === -1) {
      console.log("Unknown receiver of selected currency")
      return
    }

    if (typeof newCurrency !== 'undefined') {
      switch (waitingForNewCurrency) {
        //Updated the 'from currency'
        case 0:
          this.setState({
            fromCurrency: newCurrency,
            fromValue: utils.truncateValue(toCurrency.exchange(toValue, newCurrency))
          })
          break;
        //Updated the 'to currency'
        case 1:
          this.setState({
            toCurrency: newCurrency,
            toValue: utils.truncateValue(fromCurrency.exchange(fromValue, newCurrency),3)
          })
          break;
        default:
          console.log("Default, unused case. There is no correlating currency field.")
          break;
      }
    }
    this.setState({
      modalIsOpen: false,
      waitingForNewCurrency: -1
    })
  }
}

export default Kurrency;
