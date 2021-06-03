import React from 'react';

class EmailList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        emailList: [],
        emailMessage: ''
    }

    this.displayMessage = this.displayMessage.bind(this);
    this.writeEmail = this.writeEmail.bind(this);
  }


  async componentDidMount() {

    const url = 'http://localhost:3001/emails'
    const response = await fetch(url)
    const data = await response.json()

    this.setState({emailList: data.map((email) => {

    return (<div className="emailItem" id={email.id} onClick={this.displayMessage}>
                <span className ="emailSubject">SUBJECT: {email.subject}</span>
                <span>SENDER: {email.sender}</span>
                </div>)})})
  }

  async displayMessage(event) {

    const url = 'http://localhost:3001/emails'
    const response = await fetch(url)
    const data = await response.json()
    let targetEmail = data.filter((email) => email.id === parseInt(event.target.parentElement.id))
    
    this.setState({emailMessage: targetEmail[0].message})
  }

  writeEmail() {
        console.log('test')
      this.setState({emailMessage: 
      <form>
          <label>Sender:<input type="text"></input></label>
          <label>Recepient:<input type="text"></input></label>
          <label>Subject:<input type="text"></input></label>
          <label>Message:<textarea cols="30" rows="10"></textarea></label>
          <label>Date:<input type="date"></input></label>
          <button type="submit">Send Email</button>
        </form>})
  }

  render() {
    return (
    <div>
        <div className="header">
            <span>Yes, this is the actual Gmail</span>
            <button type="button" onClick={this.writeEmail}>Create Email</button>
            <span><input type="text"></input>
            <button>Search</button></span>
        </div>
        <div className="emailList App-header">{this.state.emailList}</div>
        <div className="emailArea App">{this.state.emailMessage}</div>
    </div>)
  }
}

export default EmailList;