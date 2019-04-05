import React, { Component } from 'react';
import Acceuil from "./acceuil.js";
import Inscription from "./incription.js";
import Connexion from "./connexion.js";
import AcceuilPerso from "./acceuilperso.js"
import Pageperso from "./pageperso.js";




class MainPage extends Component{
    constructor(props){
        super(props);
        this.state = {pagecourrante:"acceuil", connected:false, key:""};
        this.changepage = this.changepage.bind(this);
        this.setConnected = this.setConnected.bind(this);
        this.setKey = this.setKey.bind(this);
    }


    render(){
        var {connected} = this.state;
        var {pagecourrante} = this.state;
        
        
        let page;

        if (connected === true){
            if(pagecourrante === "acceuilperso")
                page = <AcceuilPerso changepage = {this.changepage} setconnected = {this.setConnected} userKey={this.state.key}/> 
            else if(pagecourrante==="pageperso")
                page = <Pageperso changepage = {this.changepage} setconnected = {this.setConnected}/>
        }else{
            if (pagecourrante === "inscription"){
                page = <Inscription changepage = {this.changepage} setconnected = {this.setConnected}/>;
            }
            else if (pagecourrante === "connexion"){
                page = <Connexion changepage = {this.changepage} setconnected = {this.setConnected} setKey = {this.setKey}/>;
            }
            else{
                page = <Acceuil changepage = {this.changepage}/> 
            }

        }
        return( 
            <div>{page}</div>
        );
    }

    changepage(nomPage){
        this.setState({pagecourrante:nomPage});
    }

    setKey(newkey){
        this.setState({key:newkey});
    }

    setConnected(){
        this.setState({connected:!this.state.connected});
    }


}

export default MainPage;