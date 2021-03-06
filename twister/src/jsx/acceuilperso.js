import React, { Component } from 'react';
import MessageSet from "./messageSet.js";
import logo from '../images/logo.png';
import Amis from "./amis.js";
import axios from 'axios';

function autoExpand(){
    document.addEventListener('input', function (event){
        if(event.target.tagName.toLowerCase() === 'textarea')
          autoExpand(event.target);
      },false);
      
      var autoExpand = function(field){
        
        field.style.height = '0px';
        var computed = window.getComputedStyle(field);
        
        var height = parseInt(computed.getPropertyValue('border-top-width'), 10)
                       + parseInt(computed.getPropertyValue('padding-top'), 10)
                       + field.scrollHeight
                       + parseInt(computed.getPropertyValue('padding-bottom'), 10)
                       + parseInt(computed.getPropertyValue('border-bottom-width'), 10);
        
        field.style.height = height + 'px';



        
      }  
}



class AcceuilPerso extends Component {
    constructor(props){
        super(props)
        this.state = {
            date:new Date(),
            listMessages:[],
            query:'',
           
        }
        this.handleOnClick = this.handleOnClick.bind(this);
        
        this.send = this.send.bind(this);
        
     
    }

    onKeyPressHandler(e){
        autoExpand();
        if(e.which === 13 && e.shiftKey) {  
            this.addMessage(e.target.value);
            e.target.value='';
            e.preventDefault();
        }

    }

    addMessage(mess){
        var formData = new URLSearchParams();
        formData.append("user_key",this.props.userKey);
        formData.append("message",mess);
        axios.get("http://localhost:8080/Twister/Profil/ajoutmessage?"+formData).then(r=>{this.traiteAddMess(r)}).catch(errorRep => {alert("Erreur : connexion avec le serveur : "+errorRep)});           
    }

    traiteAddMess(r){
        console.log(r.data);
        if(r.data.status === "OK"){
            this.props.setKey(r.data.new_key);
            this.send();
            
        }else{
            alert("Vous avez été deconnecté")
            this.props.setLogout();
            this.props.changepage("connexion");      
        }
    }

    send(){
    
        var formData = new URLSearchParams();
        
        if(this.props.userKey!==undefined)
            formData.append("userKey",this.props.userKey);
        if(this.props.userId!==undefined)
            formData.append("userId",0);
        if(this.state.query!=='')
            formData.append("query",this.state.query);
		
        console.log("http://localhost:8080/Twister/Profil/cherchermessage?"+formData)
		axios.get("http://localhost:8080/Twister/Profil/cherchermessage?"+formData).then(r=>{this.traiteReponse(r)}).catch(errorRep => {alert("Erreur : connexion avec le serveur : "+errorRep)});
		
	}

	traiteReponse(r){
        console.log(r.data);
		if(r.data.status==="OK"){
            //Mettre a jour la clé
            if(r.data.Resultat!==undefined){
                alert("Pas de Resultat pour la recherche");
            }

            this.props.setKey(r.data.new_key);
            

            //Construction d'un tableau de tableau pour tout les messages 
            /*forme =>
            [
                [idMessage, auteur, date, content]
                [idMessage, auteur, date, content]
                [idMessage, auteur, date, content]
            ]
            */
            var messagesList    = [];
            var messageTmp      = [];
            
            Object.keys(r.data.messages).forEach(function(key){
                
                messageTmp.push(r.data.messages[key].messID);
                messageTmp.push(r.data.messages[key].auteur);
                messageTmp.push(r.data.messages[key].date);
                messageTmp.push(r.data.messages[key].content);
                messagesList.push(messageTmp);
                messageTmp = [];
            });
           

            this.setState({
                listMessages:messagesList,
            });



            
            
            
        }/*else{
            this.props.setLogout();
            this.props.changepage("connexion");
        }	*/	

       
    }

    shouldI(n){
        if(new Date().getMinutes()-this.state.date.getMinutes > n){
            this.setState({
                date:new Date(),
            });
            this.send();
        }
    }

    setPattern(event){
        this.setState({
            query:event.target.value+String.fromCharCode(event.which),
        });
        
        if(event.which === 13) {  
            this.send();
            event.target.value='';
            this.setState({
                query:'',
            })
            event.preventDefault();
        }
    }


    handleOnClick(login_ami){
        this.props.setAmi(login_ami);
        this.props.changepage("pageperso");
    }


    render(){/**/
        
        //Tester les etats pour voir si il fait afficher les message d'acceuil ou bien ceux du profil (Idem pour la side navbar)
        
        return (
            <div className="AcceuilPerso">
            <header className="sticky">
                <img id="logo" src={logo} alt="logo" />
                <div id="hLinks">
                    <button type="button" className="buttontop" onClick={()=> this.props.changepage("pageperso")}>{this.props.login}</button>
                    <button type="button" className="buttontop" onClick={()=> this.props.changepage("acceuilperso")}>Acceuil</button>
                </div>
                
                <div id="mess">
                    <input id = "pattern" type="text" name="pattern" placeholder="Recherchez les Twists de vos amis !" onKeyPress={(event) => this.setPattern(event)}/>
                </div>
                <div id="hLinks">
					<button type="button" className="buttontop" onClick={()=> this.props.deconnexion()}>Déconnexion</button>
                </div>
            </header>
    
            
            

        
            <div id="corpus">
    
                <nav>
                    <p>{this.state.listMessages.length} posts</p>

                    <div>{<Amis userKey={this.props.userKey} 
                                changepage={this.props.changepage} 
                                setAmi={this.props.setAmi} 
                                setKey={this.props.setKey} 
                                deconnexion={this.props.deconnexion} 
                                list_friend={this.props.list_friend} 
                                setListFriend={this.props.setListFriend}
                                send={this.send}/>}</div>

                    <input type="text" placeholder="Cherches tes amis !" name="username" onInput={(evt) => {this.props.setAmi(evt.target.value)}} required/>
                    <button className="" type="submit" onClick={() => this.props.chercheAmi()}>Go</button>

                </nav>
            
                <article id="messages">
                    
                    <div id="formMess"> 
                        <textarea onKeyPress={(event) => this.onKeyPressHandler(event)} className="autoExpand"  name="message" placeholder="Exprimez-vous !"></textarea> 
                    </div>
                    {<MessageSet userkey={this.props.userKey} setKey={this.props.setKey} listMessages={this.state.listMessages}/>}
                    
                </article>
            </div>
    
    
            </div>
        );
    }
}


export default AcceuilPerso;