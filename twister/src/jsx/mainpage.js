import React, { Component } from 'react';
import Acceuil from "./acceuil.js";
import Inscription from "./incription.js";
import Connexion from "./connexion.js";
import AcceuilPerso from "./acceuilperso.js"


class MainPage extends Component{
    constructor(props){
        super(props);
        this.state = {pagecourrante:"Acceuil", connected : false};
        this.changepage = this.changepage.bind(this);
        this.setState = this.setConnected.bind(this);
    }


    render(){
        var {connected} = this.state;
        var {pagecourrante} = this.state;

        let page;

        if (connected === true){
            page = <AcceuilPerso changepage = {this.changepage}/> 
        }else{
            if (pagecourrante === "inscription"){
                page = <Inscription changepage = {this.changepage} connected = {this.setConnected} />;
            }
            else if (pagecourrante === "connexion"){
                page = <Connexion changepage = {this.changepage} connected = {this.setConnected}/>;
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
        console.log(nomPage);
        this.setState({pagecourrante:nomPage});
    }

    setConnected(){
        this.setState({connected:!this.connected});
    }


}

export default MainPage;