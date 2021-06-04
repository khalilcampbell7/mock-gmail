import React from 'react';
import { isCompositeComponent } from 'react-dom/test-utils';

class EmailList extends React.Component {
  constructor(props) {
    super(props)

    // This is our state. 
    this.state = {
        emailList: [],
        emailMessage: ''
    }

    // I want 'this' in each of these functions to refer to this EmailList class. 
    // I need to see what this refers to by default. 
    this.displayMessage = this.displayMessage.bind(this);
    this.writeEmail = this.writeEmail.bind(this);
    this.search = this.search.bind(this);
  }

  // A function that gets called on before everything initially renders
  // We're using this to get the initial list of emails to populate to the screen. 
  // Must be async because we're using awaits.
  async componentDidMount() {

    // Using awaits to do a fetch (GET) to email server. 
    // Sorta wish I had used promise syntax here because they looks cleaner.
    // TO-DO: Implement error-handling. 
    const url = 'http://localhost:3001/emails'
    const response = await fetch(url)
    const data = await response.json()

    // Here, we are calling setState (which also calls render) and having it return our div.
    // The return here is for the .map function. 
    this.setState({emailList: data.map((email) => {

      return (<div className="emailItem" id={email.id} onClick={this.displayMessage}>
                <span className ="emailSubject">SUBJECT: {email.subject}</span>
                <span>SENDER: {email.sender}</span>
              </div>)})})
  }


  // Another async function, this one used to "open" and read a message that's clicked on. 
  // TO-DO: Implement error-handling. 
  async displayMessage(event) {

    const url = 'http://localhost:3001/emails'
    const response = await fetch(url)
    const data = await response.json()
    let targetEmail = data.filter((email) => email.id === parseInt(event.target.parentElement.id))
    
    this.setState({emailMessage: targetEmail[0].message})
  }

  // This function is just used to create the form in which we'll write our email. 
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

  // Another asnc function. This one sends a fetch (POST) request to send an email. 
  async sendEmail() {

    // The following code is just used to get the next ID we'll need to send an email. 
    const url = 'http://localhost:3001/emails'
    const response = await fetch(url)
    const data = await response.json()

    let newId = data[data.length - 1].id;
    newId++;

    // This just gets the current date. 
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);

    // This is the data we'll be sending. 
    let dataToSend = 
    {
        sender: document.querySelector('.sender').value,
        recipient: document.querySelector('.recipient').value,
        subject: document.querySelector('.subject').value,
        message: document.querySelector('.message').value,
        date: today.toISOString(),
        id: newId
    } 

    // Here, we actually fetch (POST) our data to the server. 
    // The method, headers, and body are NOT OPTIONAL HERE. 
    const send = await fetch('http://localhost:3001/send', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)  
    })

    // This is our response from the server. 
    const sentData = await send.json()
    console.log(sentData)
  }

  // Another async function. This one allows use to use a fetch (GET) serach query to the server and replace our initial email list with that. 
  // I would test this functionality with the word "meeting"
  async search() {
      let searchBar = document.querySelector('.searchBar')
      const response = await fetch(`http://localhost:3001/search?query=${searchBar.value}`)
      const data = await response.json()
      
      // setState emailList to data.map (return ...), same as in the componentDidMount()
      this.setState({emailList: data.map((email) => {   
        return (<div className="emailItem" id={email.id} onClick={this.displayMessage}>
                  <span className ="emailSubject">SUBJECT: {email.subject}</span>
                  <span>SENDER: {email.sender}</span>
                </div>)})})
  }

  // Finally, let's render all this
  // This function is called again every time setState is called. 
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