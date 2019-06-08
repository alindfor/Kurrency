import React, { Component } from 'react';
import './App.css';

import {
  FaExchangeAlt,
  FaBars,
  FaPlus,
  FaUndoAlt,
} from 'react-icons/fa'

import api from './api'
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
      toValue: "",
      fromValue: "",
      baseCurrency: this.props.baseCurrency
    }
  }

  handleValueChange = (event) => {
    const { toCurrency, fromCurrency } = this.props
    const { name, value } = event.target
    const { data } = event.nativeEvent
    if (data !== " " && (data >= 0 || data <= 9 || data === "," || data === ".")) {
      let replaceComma = value.replace(",", ".")
      switch (name) {
        case "from-value":
          this.setState({
            fromValue: replaceComma,
            toValue: this.truncateValue(fromCurrency.exchange(replaceComma, toCurrency), 3)
          })
          break;
        case "to-value":
          this.setState({
            toValue: replaceComma,
            fromValue: this.truncateValue(toCurrency.exchange(replaceComma, fromCurrency), 3)
          })
          break;
        default:
          console.log("Default, unused case. There was no matching field name.")
      }
    }
  }

  swapCurrencies = () => {
    const { fromValue, toValue } = this.state
    this.setState({
      toValue: fromValue,
      fromValue: toValue
    })
    this.props.swapCurrencies()
  }

  changeCurrency = (event) => {
    this.props.changeCurrency(event)
  }

  truncateValue = (value, significantDigits) => {
    return parseFloat(value).toFixed(significantDigits).toString()
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
              onChange={this.handleValueChange}
              value={this.state.fromValue}
            />
            <button className="currency-button" name="from-currency" onClick={this.changeCurrency}>
              <span className="currency-button-text">
                {fromCurrency ? fromCurrency.name : "USD"}
              </span>
              <span className="currency-button-icon-container" >
                <FaBars className="currency-button-icon" />
              </span>
            </button>
          </div>

          <div className="change-currency-container">
            <span className="change-icon-container" onClick={this.swapCurrencies}>
              <FaExchangeAlt className="change-icon" />
            </span>
          </div>

          <div className="input-container">
            <input
              className="currency-input"
              spellCheck="false"
              placeholder="0"
              name="to-value"
              onChange={this.handleValueChange}
              value={this.state.toValue}
            />
            <button className="currency-button" name="to-currency" onClick={this.changeCurrency}>
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
              1 {fromCurrency ? fromCurrency.name : "USD"} is {fromCurrency ? this.truncateValue(fromCurrency.exchange(1, toCurrency), 3) : "0"} {toCurrency ? toCurrency.name : "SEK"}
            </p>
          </div>
          <div className="reset-container">
            <button className="reset-button">
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
      fromCurrency: undefined,
      baseCurrency: new Currency("EUR", 1)
    }
  }

  componentDidMount() {
    api.getRates()
      .then((response) => {
        this.buildExchangeRates(response)
        this.setLoading(false)
      }).catch((response) => {
        console.log("response: ", response)
        this.setLoading(false)
      })
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
    const { toCurrency, fromCurrency } = this.state
    this.setState({
      toCurrency: fromCurrency,
      fromCurrency: toCurrency
    })
  }

  closeModal = (data) => {
    const { waitingForNewCurrency } = this.state
    //Check that we get a declared var that is not undefined
    if (waitingForNewCurrency === -1) {
      console.log("Unknown receiver of selected currency")
      return
    }

    if (typeof data !== 'undefined') {
      //console.log("selected currency: ", data)
      switch (waitingForNewCurrency) {
        case 0:
          this.setState({
            fromCurrency: data
          })
          break;
        case 1:
          this.setState({
            toCurrency: data
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

  render() {
    const {
      isLoading,
      modalIsOpen,
      currencies,
      toCurrency,
      fromCurrency } = this.state
    return (
      <div className="container">

        <Header isLoading={isLoading}></Header>
        <Content
          isLoading={isLoading}
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
          baseCurrency={this.state.baseCurrency}
          changeCurrency={this.openModal}
          swapCurrencies={this.swapCurrencies}>
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

}

export default Kurrency;
