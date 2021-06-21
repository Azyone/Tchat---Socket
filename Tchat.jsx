let ws = new WebSocket("wss://ws.jdedev.fr:8124")

ws.onopen = ()=>{
    console.log("connexion établi")
}
ws.onerror = ()=>{
    console.log("Echec de la connexion")
}


class Conteneur extends React.Component {

    constructor(props){

        super(props)
        this.state = { con: false, pseudo: "", msg: "", listMsg: [""], listUser: [""]}
        this.chgInpCon = this.chgInpCon.bind(this)
        this.connect = this.connect.bind(this)
        this.disconnect = this.disconnect.bind(this)
        this.chgInpMsg = this.chgInpMsg.bind(this)
        this.affMsg = this.affMsg.bind(this)
        this.sendMsg = this.sendMsg.bind(this)
        this.affListUser = this.affListUser.bind(this)
    }

    componentDidMount(){
    ws.onmessage = (data)=>{
        console.log(JSON.parse(data.data));
    let message = JSON.parse(data.data);
    if(message.typeTrame == "lstUser"){
        this.connect2()
        this.addListUser2(message.users);
    }
    if(message.typeTrame == "user"){
        this.addListUser(message.nom);
    }
    if(message.typeTrame == "message"){
        this.sendMsg2(message.from, message.content)
    }
    } 
    }

    chgInpCon(event){
        this.setState({ pseudo: event.target.value });
    }
    chgInpMsg(event){
        this.setState({ msg: event.target.value });
    }

    connect(){
        let connection = {type: "", typeTrame: "user",nom: this.state.pseudo, id: "1"}
        ws.send(JSON.stringify(connection));

    }
    connect2(){
        this.setState({ con: true });

    }
    addListUser(pseudo){
        let c = [];
        for(let i = 0; i < this.state.listUser.length; i++){

            c.push(this.state.listUser[i])
        
        }
        c.push(pseudo)
        this.setState({ listUser: [...c] });
    }
    addListUser2(liste){
        let c = [];
        for(let i = 0; i < liste.length; i++){

            c.push(liste[i].nom)
        
        }
        this.setState({ listUser: [...c] });
    }
    affListUser(){
        let c = [];
        for(let i = 0; i < this.state.listUser.length; i++){

            c.push(<p key={i}>{this.state.listUser[i]}</p>)
            
        }
        return (c);
    }
    disconnect(){
        this.setState({ con: false });
        this.setState({ pseudo: "" });
        this.setState({ listUser: [""] });
        this.setState({ listMsg: [""] });
        let turnoff = {  type: "", typeTrame: "logOut", nom: this.state.pseudo, id: 1 }
        ws.send(JSON.stringify(turnoff));
    }
    affMsg(){
        let b = [];
        for(let i = 0; i < this.state.listMsg.length; i++){

            b.push(<p key={i}>{this.state.listMsg[i]}</p>)
            
        }
        return (b);
    }
    sendMsg(){
            let sendMessage = { type: "", typeTrame: "message", from: this.state.pseudo, content: this.state.msg, date: new Date()}
            ws.send(JSON.stringify(sendMessage));
            let b = [];
            for(let i = 0; i < this.state.listMsg.length; i++){
                b.push(this.state.listMsg[i])
            }
            b.push(this.state.pseudo +" : "+ this.state.msg )
            this.setState({ listMsg: [...b] });
            this.setState({ msg: "" });
            /* {type: "", typeTrame: "message", from: "julien", content: "Salut Aymeric", date: "2021-06-21T09:26:47.803Z"}
content: "Salut Aymeric"
date: "2021-06-21T09:26:47.803Z"
from: "julien"
type: ""
typeTrame: "message" */
    }
    sendMsg2(pseudo, msg){
            let b = [];
            for(let i = 0; i < this.state.listMsg.length; i++){
                b.push(this.state.listMsg[i])
            }
            b.push(pseudo +" : "+ msg )
            this.setState({ listMsg: [...b] });
            this.setState({ msg: "" });
    }
    render(){
        return(
            <div id="conteneur">
                <Nav  con={this.state.con} pseudo={this.state.pseudo} chg={this.chgInpCon} connect={this.connect} disconnect={this.disconnect}/>
                <div id="middle">
                    <Liste affListUser={this.affListUser} listUser={this.state.listUser}/>
                    <div id="tchat">
                        <Aff listMsg={this.state.listMsg} affMsg={this.affMsg}/>
                        {(this.state.con == false)?"":
                        <Message pseudo={this.state.pseudo} msg={this.state.msg} chgInpMsg={this.chgInpMsg} sendMsg={this.sendMsg}/>
                        }
                    </div>
                </div>

            </div>
        )
    }

}

function Nav(props) {

        return(
            <div id="Nav">
                <h2>MimimiChat</h2>
                {(props.con === false)? <div id="btn"> <input type="text" value={props.pseudo} onChange={props.chg} /> <button onClick={props.connect}>Login</button> </div> : <div id="btn"><p>Bonjour, {props.pseudo}</p><button onClick={props.disconnect}>Logout</button></div>}
            </div>
            );

};
function Liste(props) {

        return(
            <div id="Liste">
                {props.affListUser()}
            </div>
            );

};
function Aff(props) {

        return(
            <div id="Aff">
                {props.affMsg()}
            </div>
            );

};
function Message(props) {

        return(
            <div id="Message">
                <input type="text"  value={props.msg} onChange={props.chgInpMsg}/>
                <button onClick={props.sendMsg}>Envoyer</button>
            </div>
            );

};

ReactDOM.render(
    <Conteneur/>,
    document.getElementById('body')
);