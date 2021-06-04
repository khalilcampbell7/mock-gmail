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
    this.search = this.search.bind(this);
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
      this.setState({emailMessage: 
      <form className="createEmail">
          <label>Sender:<input type="email" name="sender" className="sender" defaultValue="test@gmail.com"></input></label>
          <label>recipient:<input type="email" name="recipient" className="recipient" defaultValue="test2@gmail.com"></input></label>
          <label>Subject:<input type="text" name="subject" className="subject" defaultValue="subject here"></input></label>
          <label><textarea cols="30" rows="10" name="message" className="message" defaultValue="message here"></textarea></label>
          <button type="button" onClick={this.sendEmail}>Send Email</button>

        </form>})
  }

  async sendEmail() {

    const url = 'http://localhost:3001/emails'
    const response = await fetch(url)
    const data = await response.json()

    let newId = data[data.length - 1].id;
    newId++;

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);

    let dataToSend = 
    {
        sender: document.querySelector('.sender').value,
        recipient: document.querySelector('.recipient').value,
        subject: document.querySelector('.subject').value,
        message: document.querySelector('.message').value,
        date: today.toISOString(),
        id: newId
    } 

    const send = await fetch('http://localhost:3001/send', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)  
    })

    const sentData = await send.json()

    console.log(JSON.stringify(dataToSend))
    console.log(sentData)
  }

  async search() {
      let searchBar = document.querySelector('.searchBar')
      const response = await fetch(`http://localhost:3001/search?query=${searchBar.value}`)
      const data = await response.json()
      this.setState({emailList: data.map((email) => {

    return (<div className="emailItem" id={email.id} onClick={this.displayMessage}>
                <span className ="emailSubject">SUBJECT: {email.subject}</span>
                <span>SENDER: {email.sender}</span>
                </div>)})})
  }

  render() {
    return (
    <div>
        <div className="header">
            <span>Yes, this is the actual Gmail</span>
            <button type="button" onClick={this.writeEmail}>Create Email</button>
            <span><form><input type="text" name="query" className="searchBar"></input>
            <button type="button" onClick={this.search}>Search</button></form></span>
        </div>
        <div className="emailList App-header">{this.state.emailList}</div>
        <div className="emailArea App">{this.state.emailMessage}</div>
    </div>)
  }
}

export default EmailList;