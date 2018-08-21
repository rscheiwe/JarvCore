import React, { Component } from 'react'
import { Container, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';
import SearchBar from './SearchBar'
import ResultCardsContainer from './ResultCardsContainer'

export default class SearchModal extends Component {

  state = {
    modal: false
  }

  toggle = () => {
    this.setState( prev => ({ modal: !prev.modal }))
  }

  render() {
    const { search, searchResults, accessToken, playList } = this.props
    return (
      <Container>
        <Button style={{opacity: 0}} onClick={this.toggle} className="search-modal-button"></Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}></ModalHeader>
          <ModalBody>

            <SearchBar search={search} />
            <ResultCardsContainer searchResults={searchResults} accessToken={accessToken} playList={playList} />

          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>Close</Button>
          </ModalFooter>
        </Modal>
      </Container>
    )
  }
}
