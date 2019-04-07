package tools.message;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;

import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.json.JSONException;
import org.json.JSONObject;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.Filters;

import tools.relation.RelationBDTools;
import tools.user.UserBDTools;

public class MessageBDTools {

	public static String insertMessage(String message, String userKey, Connection conn, Document query, MongoCollection<Document> message_collection) throws SQLException{

		int id = UserBDTools.getUserIdfromKey(userKey, conn);
		boolean res = false;


		query.append("user_id",id);
		query.append("date", new Date());
		query.append("content", message);
		query.append("user_name", UserBDTools.getLogin(id, conn));

		message_collection.insertOne(query);



		FindIterable<Document> fi = message_collection.find(query);
		MongoCursor<Document> cur = fi.iterator();

		while(cur.hasNext()) {
			cur.next();
			res = true;
		}
		ObjectId retour = query.getObjectId("_id");	
		if (!res)
			return null;
		return retour.toString();
	}


	public static boolean removeMessage(String idMessage, Connection conn,Document query, MongoCollection<Document> message_collection) throws SQLException {
		//ICI 

		query.append("_id",new ObjectId(idMessage));

		message_collection.deleteOne(query);

		FindIterable<Document> fi = message_collection.find(query);
		MongoCursor<Document> cur = fi.iterator();

		boolean res = true;
		while(cur.hasNext()) {
			System.out.println(cur.next());
			res = false;
		}
		return res;

	}

	public static JSONObject getMessages(int userID,Connection conn) throws SQLException, JSONException {
		JSONObject retour = new JSONObject();

		String query = "SELECT * FROM messages WHERE user_id='"+userID+"'";
		Statement st = conn.createStatement();
		ResultSet rs = st.executeQuery(query);

		while(rs.next()) {
			retour.put(rs.getString("message_id"), rs.getString("message_content"));
		}
		rs.close();
		st.close();
		return retour;
	}



	public static boolean checkAuteur(String userKey, String iDMessage, Connection conn, Document query, MongoCollection<Document> message_collection) throws SQLException {

		int userID = UserBDTools.getUserIdfromKey(userKey, conn);

		query.append("user_id", userID);
		query.append("_id", new ObjectId(iDMessage));

		message_collection.find(query);

		FindIterable<Document> fi = message_collection.find(query);
		MongoCursor<Document> cur = fi.iterator();

		boolean res = false;
		while(cur.hasNext()) {

			res = true;
		}



		return res;

	}


	public static JSONObject getMessages(Document query, MongoCollection<Document> message_collection) throws JSONException {
		JSONObject retour = new JSONObject();

		FindIterable<Document> fi = message_collection.find().sort(new Document("date", -1));
		MongoCursor<Document> cur = fi.iterator();

		while(cur.hasNext()) {

			Document obj = cur.next();

			retour.put(obj.getObjectId("_id").toString(), obj.getString("content"));
		}

		return retour;
	}


	public static JSONObject getMessages(String userKey,Connection conn, Document query, MongoCollection<Document> message_collection) throws SQLException, JSONException {
		JSONObject retour = new JSONObject();
		int userID = UserBDTools.getUserIdfromKey(userKey, conn);
		JSONObject listFriend = RelationBDTools.getFriends(userID, conn);
		
		
		Iterator<String> friendId = listFriend.keys();
		ArrayList<String> concerned = new ArrayList<String>();
		concerned.add(Integer.toString(userID));
		
		while (friendId.hasNext()) {
			concerned.add(friendId.next());
		}
		
		

		
		for (String string : concerned) {
			query.put("user_id", string);
			System.out.println(query);
		}
		
		System.out.println(query);
		FindIterable<Document> fi = message_collection.find(query).sort(new Document("date", -1));
		MongoCursor<Document> cur = fi.iterator();
		
		while(cur.hasNext()) {

			Document obj = cur.next();
			System.out.println(obj);
			retour.append(obj.getObjectId("_id").toString(), obj.getString("content"));
		}
		
		return retour;
	}


	public static JSONObject getMessages(String userKey, String pattern, int userId, Document query,
			MongoCollection<Document> message_collection) throws JSONException {

		JSONObject retour = new JSONObject();

		query.append("user_id",userId);
		if(pattern != null)
			query.append("content", "/.*"+pattern+"*./");


		FindIterable<Document> fi = message_collection.find(query).sort(new Document("date", -1));
		MongoCursor<Document> cur = fi.iterator();

		while(cur.hasNext()) {

			Document obj = cur.next();
			retour.put(obj.getObjectId("_id").toString(), obj.getString("content"));
		}

		return retour;
	}



}
