package services.message;

import java.sql.SQLException;

import org.json.JSONException;
import org.json.JSONObject;

import services.ErrorJSON;
import tools.message.MessageBDTools;
import tools.user.UserBDTools;

public class ListMessage {
	
	public static JSONObject getMessages(String userKey) throws JSONException{
		JSONObject retour = new JSONObject();
		
		//Faut bien faire commencer l'entr�e id de la table message a 1 sous peine de generer des erreurs
		if(userKey == null) 
			return ErrorJSON.serviceRefused("Champs manquants", -1);
		if(!UserBDTools.checkKey(userKey))
			return ErrorJSON.serviceRefused("Erreur correspondance cle utilisateur", 1000);
		
		try {
			//Tool
			retour = MessageBDTools.getMessages(userKey);
			if(retour == null)
				return ErrorJSON.serviceRefused("Reccuppertation Impossible", 1000);
			
			retour.put("status", "OK");
			
		} catch (SQLException e) {
			return ErrorJSON.serviceRefused(e.getMessage(), 1000);
		}
		
		return retour;
	}

}
