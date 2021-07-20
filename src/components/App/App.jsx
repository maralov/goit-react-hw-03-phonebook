import React, { Component } from 'react';
import { Row, Col } from 'antd';
import shortid from 'shortid';
import Section from 'components/Section';
import ContactForm from 'components/ContactForm';
import ContactList from 'components/ContactList';
import Filter from 'components/Filter';

import { Container } from './App.styled';

import LOCAL_STORAGE_CONTACTS from 'constants';

export default class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const savedContacts = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_CONTACTS),
    );

    savedContacts && this.setState({ contacts: savedContacts });
  }

  componentDidUpdate(_, prevState) {
    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem(
        LOCAL_STORAGE_CONTACTS,
        JSON.stringify(this.state.contacts),
      );
    }
    console.log(prevState.contacts);
    console.log(this.state.contacts);
  }

  handleSubmit = (name, number) => {
    const id = shortid.generate();

    const isContact = this.state.contacts.find(contact =>
      contact.name.includes(name),
    );

    isContact
      ? alert(`${name} is already in contacts`)
      : this.setState(prevState => ({
          contacts: [...prevState.contacts, { id, name, number }],
        }));
  };

  handleFilterChange = ({ currentTarget }) => {
    const value = currentTarget.value;
    const name = currentTarget.name;

    this.setState({
      [name]: value,
    });
  };

  getVisibleContacts = () => {
    const { filter, contacts } = this.state;
    const normalizedFilter = filter.toLowerCase();
    return contacts.filter(item =>
      item.name.toLowerCase().includes(normalizedFilter),
    );
  };

  deleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  render() {
    const { filter, contacts } = this.state;
    const visibleContacts = this.getVisibleContacts();
    return (
      <Container>
        <Row gutter={16}>
          <Col className="gutter-row" md={18} lg={10}>
            <Section title="Phonebook">
              <ContactForm onSubmit={this.handleSubmit} />
            </Section>
          </Col>

          <Col className="gutter-row" md={18} lg={20}>
            <Section title="Contacts">
              <Filter
                onChange={this.handleFilterChange}
                value={filter}
                style={{ marginBottom: 24 }}
                placeholder="Enter name"
              />

              {contacts.length ? (
                <ContactList
                  contacts={visibleContacts}
                  onDeleteUser={this.deleteContact}
                />
              ) : (
                'Phonebook is Empty '
              )}
            </Section>
          </Col>
        </Row>
      </Container>
    );
  }
}
