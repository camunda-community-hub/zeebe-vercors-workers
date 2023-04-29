// -----------------------------------------------------------
//
// Parameters
//
// List of all runners available
//
// -----------------------------------------------------------

import React from 'react';

class Parameters extends React.Component {


  constructor(_props) {
    super();
    this.state = {};
  }

  componentDidMount() {
    console.log("Definition.componentDidMount: BEGIN");
    console.log("Definition.componentDidMount: END");
  }

  /*           {JSON.stringify(this.state.runners, null, 2) } */
  render() {
    return(<div className={"container"}><h1>Parameters</h1></div>)
  }

  /**
   * Set the display property
   * @param propertyName name of the property
   * @param propertyValue the value
   */
  setDisplayProperty(propertyName, propertyValue) {
    let displayObject = this.state.display;
    displayObject[propertyName] = propertyValue;
    this.setState({display: displayObject});
  }
}

export default Parameters;