from flask import Flask, jsonify, request
import mysql.connector

app = Flask(__name__)

mydb = mysql.connector.connect(host="localhost", user="markbac17", passwd="A9ZUflJCgmYHoQFG", database="baggagebuddy")

# SELECT
@app.route('/select_all_customers', methods=["GET"])
def select_all_customers():
    mycursor = mydb.cursor()
    sql = 'SELECT * from customer_data;'
    mycursor.execute(sql)
    result = mycursor.fetchall()
    return jsonify(result)

@app.route('/select_all_deliveries', methods=["GET"])
def select_all_deliveries():
    mycursor = mydb.cursor()
    sql = 'SELECT * from delivery_data;'
    mycursor.execute(sql)
    result = mycursor.fetchall()
    return jsonify(result)

@app.route('/select_all_delivery_items', methods=["GET"])
def select_all_delivery_items():
    mycursor = mydb.cursor()
    sql = 'SELECT * from delivery_items;'
    mycursor.execute(sql)
    result = mycursor.fetchall()
    return jsonify(result)

@app.route('/select_all_secret_data', methods=["GET"])
def select_all_secret_dta():
    mycursor = mydb.cursor()
    sql = 'SELECT * from secret_data_to_be_deleted;'
    mycursor.execute(sql)
    result = mycursor.fetchall()
    return jsonify(result)

#INSERT
@app.route('/insert_customers', methods=["POST"])
def insert_customers():
    mycursor = mydb.cursor()
    data = request.get_json()
    print(data)
    sql = """INSERT INTO customer_data (
            f_name, 
            l_name, 
            delivery_conf_status) 
        VALUES (%s, %s, %s);"""
    values = (data['f_name'],data['l_name'],data['delivery_conf_status'])
    print(values)
    mycursor.execute(sql, values)
    mydb.commit
    return jsonify(['OK'])

@app.route('/insert_deliveries', methods=["POST"])
def insert_deliveries():
    mycursor = mydb.cursor()
    data = request.get_json()
    sql = """INSERT INTO delivery_data (
            bag_tag_number, 
            bag_tag_group, 
            delivery_location_lat, 
            delivery_location_long)
            VALUES (?, ?, ?, ?);"""
    values = ("a","b" ,"1" ,"2" )
    mycursor.execute(sql, values)
    return jsonify(result)

@app.route('/insert_delivery_items', methods=["POST"])
def insert_delivery_items():
    mycursor = mydb.cursor()
    data = request.get_json()
    sql = """INSERT INTO delivery_items (
            bag_tag_number,
            customer_id,
            delivery_status)
            VALUES (?, ?, ?, ?)"""
    values = ("a", "b" ,"1" ,"2" )
    mycursor.execute(sql, values)
    return jsonify(result)

@app.route('/insert_secrets', methods=["POST"])
def insert_secrets():
    mycursor = mydb.cursor()
    data = request.get_json()
    sql = """INSERT INTO secret_data_to_be_deleted (
            delivery_address,
            delivery_city, 
            delivery_phone_num,
            delivery_email) 
            VALUES (?, ?, ?, ?)"""
    values = ("a", "b" ,"1" ,"2" )
    mycursor.execute(sql, values)
    return jsonify(result)

#UPDATE
@app.route('/update_customers', methods=["POST"])
def update_customers():
    mycursor = mydb.cursor()
    data = request.get_json()
    sql = """UPDATE customer_data SET 
            customer_id = ?,
            f_name = ?,
            l_name = ?, 
            delivery_conf_status = ?
            WHERE customer_id = ?;"""
    values = ('?','?','?','?','?')
    mycursor.execute(sql, values)
    return jsonify(result)

@app.route('/update_deliveries', methods=["POST"])
def update_deliveries():
    mycursor = mydb.cursor()
    data = request.get_json()
    sql = """UPDATE delivery_items SET 
            bt_ref = ?,
            bag_tag_number = ?,
            customer_id = ?,
            delivery_status = ? 
            WHERE bt_ref = ?;"""
    values = ('?','?','?','?','?')
    mycursor.execute(sql, values)
    return jsonify(result)

@app.route('/update_delivery_items', methods=["POST"])
def update_delivery_items():
    mycursor = mydb.cursor()
    data = request.get_json()
    sql = """UPDATE delivery_items SET 
            bag_tag_number = ?, 
            customer_id = ?, 
            delivery_status = ? WHERE 
            bt_ref = ?;"""
    values = ('?','?','?','?')
    mycursor.execute(sql, values)
    return jsonify(result)

@app.route('/update_secrets', methods=["POST"])
def update_secrets():
    mycursor = mydb.cursor()
    data = request.get_json()
    sql = """UPDATE secret_data_to_be_deleted SET 
            secret_id = ?, 
            delivery_address = ?, 
            delivery_city = ?, 
            delivery_phone_num = ?, 
            delivery_email = ? WHERE 
            secret_id = ?;"""
    values = ("a", "b" ,"1" ,"2" )
    mycursor.execute(sql, values)
    return jsonify(result)

#DELETE
@app.route('/delete_customers', methods=["POST"])
def delete_customers():
    mycursor = mydb.cursor()
    data = request.get_json()
    sql = """DELETE FROM customer_data 
            WHERE customer_id = ?;"""
    values = ('?')
    mycursor.execute(sql, values)
    return jsonify(result)

@app.route('/delete_deliveries', methods=["POST"])
def delete_deliveries():
    mycursor = mydb.cursor()
    data = request.get_json()
    sql = """DELETE FROM delivery_items  
            WHERE bt_ref = ?;"""
    values = ('?')
    mycursor.execute(sql, values)
    return jsonify(result)

@app.route('/delete_delivery_items', methods=["POST"])
def delete_delivery_items():
    mycursor = mydb.cursor()
    data = request.get_json()
    sql = """DELETE FROM delivery_items  
            WHERE bt_ref = ?;"""
    values = ('?')
    mycursor.execute(sql, values)
    return jsonify(result)

@app.route('/delete_secrets', methods=["POST"])
def delete_secrets():
    mycursor = mydb.cursor()
    data = request.get_json()
    sql = """UPDATE secret_data_to_be_deleted 
            WHERE secret_id = ?;"""
    values = ("a", "b" ,"1" ,"2" )
    mycursor.execute(sql, values)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')