import React, { Component } from 'react';
import styled from 'styled-components';
import Highlighter from 'react-highlight-words';

const KEY = 'definitions';

const GENDERS = { f: 'die', m: 'der', n: 'das', pl: 'die' };

const Table = styled.table`
  table-layout: fixed;
  width: 100%;
  text-align: left;
  margin-top: 12px;
`;

const Row = styled.tr`
  &:hover {
    background-color: aliceblue;
  }
`;

const Cell = styled.td``;

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

function clean(word) {
  return word
    .replace(/{.*}|<.*>|\[.*\]|\(.*\)|\S+\.|-\s|-$/g, '')
    .split('|')[0]
    .split(':')[0]
    .trim();
}

function pair(rawEn, rawDe) {
  const cleanEn = clean(rawEn);
  const cleanDe = clean(rawDe);

  const match = /{(.*)}/.exec(rawDe);
  const gender = match && match[1] && GENDERS[match[1]];

  const de = gender ? `${gender} ${cleanDe}` : cleanDe;
  const article = Object.values(GENDERS).includes(de.split(' ')[0]);
  const en = article && !cleanEn.startsWith('the') ? `the ${cleanEn}` : cleanEn;

  return { en, de };
}

const WordSelector = ({ word, options, onClickOption }) => (
  <Table>
    <tbody>
      {options.map(({ from: de, to: en }, i) => (
        <Row key={i} onClick={() => onClickOption({ value: word, en, de })}>
          <td>{de}</td>
          <td>{en}</td>
        </Row>
      ))}
    </tbody>
  </Table>
);

const Word = ({ word, lang }) => (
  <Highlighter
    searchWords={[clean(word)]}
    highlightStyle={{
      backgroundColor: 'yellow',
      borderBottom: '1px solid #A67B5B'
    }}
    autoEscape={true}
    textToHighlight={word}
  />
);

class App extends Component {
  constructor() {
    super();
    this.state = {
      value: '',
      definitions: loadDefinitions() || [],
      responses: {}
    };
  }

  handleChange = ev => {
    this.setState({ value: ev.target.value });
  };

  handleSubmit = async ev => {
    ev.preventDefault();
    const { value } = this.state;
    const { data } = await window
      .fetch(`/api/lookup/en-de/${value}`)
      .then(res => res.json());

    this.setState({
      showWordSelector: value,
      responses: {
        ...this.state.responses,
        [value]: data
      }
    });
  };

  handleSelectWord = ({ value, de, en }) => {
    const definitions = [{ value, en, de }, ...this.state.definitions];

    this.setState({
      showWordSelector: null,
      value: null,
      definitions
    });

    saveDefinitions(definitions);
  };

  handleClickRemove = i => {
    const { definitions } = this.state;
    const newDefs = [...definitions.slice(0, i), ...definitions.slice(i + 1)];
    this.setState({ definitions: newDefs });

    saveDefinitions(newDefs);
  };

  handleClickSwap = i => {
    const { definitions } = this.state;
    const d = definitions[i];
    const newDefs = [
      ...definitions.slice(0, i),
      { ...d, en: d.de, de: d.en },
      ...definitions.slice(i + 1)
    ];
    this.setState({ definitions: newDefs });

    saveDefinitions(newDefs);
  };

  render() {
    const { definitions, value, responses, showWordSelector } = this.state;
    return (
      <div>
        <Header>
          <h1>leoweb</h1>
        </Header>
        <Container>
          <form onSubmit={this.handleSubmit}>
            <input type="text" onChange={this.handleChange} />{' '}
            <button disabled={!this.state.value}>Lookup</button>
          </form>
          {showWordSelector &&
            responses[value] && (
              <WordSelector
                word={value}
                options={responses[value]}
                onClickOption={this.handleSelectWord}
              />
            )}
          <Table>
            <thead>
              <tr>
                <th>Lookup</th>
                <th>DE</th>
                <th>EN</th>
                <th>DE clean</th>
                <th>EN clean</th>
                <th>ctl</th>
              </tr>
            </thead>
            <tbody>
              {definitions.map(({ value, en, de }, i) => (
                <Row key={i}>
                  <td>{value}</td>
                  <td>
                    <Word word={de} />
                  </td>
                  <td>
                    <Word word={en} />
                  </td>
                  <td>{pair(en, de).de}</td>
                  <td>{pair(en, de).en}</td>
                  <td>
                    <button onClick={() => this.handleClickSwap(i)}>
                      swap
                    </button>{' '}
                    <button onClick={() => this.handleClickRemove(i)}>
                      rm
                    </button>
                  </td>
                </Row>
              ))}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default App;
