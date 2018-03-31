import React, { Component } from "react";
import styled from "styled-components";

const KEY = "definitions";

const Table = styled.table`
  table-layout: fixed;
  width: 100%;
  text-align: left;
  margin-top: 12px;
`;

const Cell = styled.td`
`;

const Container = styled.div`
  padding: 12px;
`;

const Header = styled.header`
  padding: 12px;
  background-color: aliceblue;
`;

function loadDefinitions() {
  try {
    return JSON.parse(window.localStorage.getItem(KEY));
  } catch (e) {
    console.log(e);
    return [];
  }
}

function saveDefinitions(definitions) {
  window.localStorage.setItem(KEY, JSON.stringify(definitions));
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      value: "",
      definitions: loadDefinitions() || []
    };
  }

  handleChange = ev => {
    this.setState({ value: ev.target.value });
  };

  handleSubmit = async ev => {
    ev.preventDefault();
    const { value } = this.state;
    const { en, de } = await window
      .fetch(`/lookup/${value}`)
      .then(res => res.json());
    this.setState({
      definitions: [{ value, en, de }, ...this.state.definitions]
    });
    saveDefinitions(this.state.definitions);
  };

  render() {
    const { definitions } = this.state;
    return (
      <div>
        <Header>
          <h1>leoweb</h1>
        </Header>
        <Container>
          <form onSubmit={this.handleSubmit}>
            <input type="text" onChange={this.handleChange} />{" "}
            <button disabled={!this.state.value}>
              Lookup
            </button>
          </form>
          <Table>
            <thead>
              <tr><th>Lookup</th><th>DE</th><th>EN</th></tr>
            </thead>
            <tbody>
              {definitions.map(({ value, en, de }, i) =>
                <tr key={i}><td>{value}</td><td>{de}</td><td>{en}</td></tr>
              )}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default App;
