import React from "react";
import fetch from "isomorphic-fetch";
import PropTypes from "prop-types";
import "./styles.css";

const EmptyText = ({ show, emptyText, children }) =>
  show ? <div>{emptyText}</div> : React.Children.only(children);

const LoadingText = ({ show, loadingText, children }) =>
  show ? <div>{loadingText}</div> : React.Children.only(children);

class ContryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contryNames: [],
      loading: false,
      progressStep: 0
    };
  }

  delay(ms) {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (this.state.progressStep >= this.props.maxSteps) {
          resolve();
          clearInterval(interval);
        } else {
          this.setState((prevState, props) => ({
            progressStep: prevState.progressStep + 1
          }));
        }
      }, ms);
    });
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.delay(700)
      .then(() => fetch("https://restcountries.eu/rest/v2/all"))
      .then(response => response.json())
      .then(json => json.map(country => country.name))
      .then(contryNames => this.setState({ contryNames, loading: false }));
  }

  render() {
    const { stepLength } = this.props;
    const { progressStep } = this.state;
    const progress =
      progressStep - Math.floor(progressStep / stepLength) * stepLength;
    const { contryNames, loading } = this.state;
    return (
      <LoadingText
        show={loading}
        loadingText={`Loading${Array(progress)
          .fill(".")
          .join("")}`}
      >
        <EmptyText show={!contryNames.length} emptyText="No contry names">
          <ul>
            {contryNames.map((country, i) => (
              <li key={i}>{country}</li>
            ))}
          </ul>
        </EmptyText>
      </LoadingText>
    );
  }
}

ContryList.propTypes = {
  maxSteps: PropTypes.number,
  stepLength: PropTypes.number
};

ContryList.defaultProps = {
  maxSteps: 10,
  stepLength: 4
};

export default function App() {
  return <ContryList />;
}
