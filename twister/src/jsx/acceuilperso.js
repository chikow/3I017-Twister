import React, { Component } from 'react';

class AcceuilPerso extends Component {


    render(){
        return (
            <div classNameName="AcceuilPerso">
            <header classNameName="sticky">
                <img id="logo" src ="../images/ancre.png" alt="logo" />
    
                <form id="mess" method="GET" action="">
                    <input id = "pattern" type="text" name="pattern"/>
                </form>
                <div id="hLinks">
                    <a className="headerLink" href="page_perso.html">Mon Profil</a>
                    <a className="headerLink" href="deconnexion.html">Deconnexion</a>
                </div>
            </header>
    
            
    
            <div id="corpus">
    
                <nav>
                    <p>Nombre de messages écrit</p>
                    <p>Nombre d'abonnés</p>
                    <p>Nombre d'abonnements</p>
                    <p>on ajoutera des amis ici</p>
                    <form id="amis" method="GET" action> 
                        <input id="searchFriend" type="text" name="pattern"/>
                        
                    </form>
                </nav>
            
                <article id="messages">
                    
                    <form id="formMess" method="GET" action =""> 
                        <textarea /*ERREUR PAR ICI*/onKeyPress="process(event, this)" className="autoExpand" rows='3' data-min-rows='3' name="message" placeholder="Exprimez-vous !"></textarea> 
                    </form>
                    <p>Liste de messages ici</p>
                    
                </article>
            </div>
    
            <script type="text/javascript" src="../js/autoExpand.js"></script>
            <script type="text/javascript" src="../js/submitArea.js"></script>
    
            </div>
        );
    }
}


export default AcceuilPerso;