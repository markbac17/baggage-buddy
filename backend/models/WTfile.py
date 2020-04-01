from flask import Flask, jsonify, request, send_file
import mysql.connector
from flask_cors import CORS
from flask_qrcode import QRcode


app = Flask(__name__)

cors = CORS(app)
qrcode = QRcode(app)

mydb = mysql.connector.connect(host="localhost", user="markbac17", passwd="A9ZUflJCgmYHoQFG", database="baggagebuddy")


@app.route("/qrcode", methods=["GET"])
def get_qrcode():
    # please get /qrcode?data=<qrcode_data>
    data = request.args.get("data", "")
    return send_file(qrcode(data, mode="raw"), mimetype="image/png")

# SELECT
@app.route('/select_all_customers', methods=["GET"])
def select_all_customers():
    mycursor = mydb.cursor()
    sql = 'SELECT * from customer_data;'
    mycursor.execute(sql)
    row_headers=[x[0] for x in mycursor.description]
    rv = mycursor.fetchall()
    json_data=[]
    for result in rv:
        json_data.append(dict(zip(row_headers,result)))
    return jsonify(json_data)

@app.route('/select_delivery', methods=["GET"])
def select_delivery():
    mycursor = mydb.cursor()
    data = request.args.get("data", "")
    sql = "SELECT * FROM delivery_items WHERE bt_ref ='" + data + "';"
    values = (data)
    mycursor.execute(sql)
    row_headers=[x[0] for x in mycursor.description]
    rv = mycursor.fetchall()
    json_data=[]
    for result in rv:
        json_data.append(dict(zip(row_headers,result)))
    return jsonify(json_data)

@app.route('/select_delivery_data', methods=["GET"])
def select_delivery_data():
    mycursor = mydb.cursor()
    data = request.args.get("data", "")
    sql = "SELECT * FROM delivery_data WHERE bag_tag_group='" + data + "';"
    print(sql)
    values = (data)
    print(data)
    mycursor.execute(sql)
    row_headers=[x[0] for x in mycursor.description]
    rv = mycursor.fetchone()
    json_data=[]
    for result in rv:
        json_data.append(dict(zip(row_headers,result)))
    return jsonify(json_data)

@app.route('/select_all_deliveries', methods=["GET"])
def select_all_deliveries():
    mycursor = mydb.cursor()
    sql = 'SELECT * from delivery_data;'
    mycursor.execute(sql)
    row_headers=[x[0] for x in mycursor.description]
    rv = mycursor.fetchall()
    json_data=[]
    for result in rv:
        json_data.append(dict(zip(row_headers,result)))
    return jsonify(json_data)

@app.route('/select_all_delivery_items', methods=["GET"])
def select_all_delivery_items():
    mycursor = mydb.cursor()
    sql = 'SELECT * from delivery_items;'
    mycursor.execute(sql)
    row_headers=[x[0] for x in mycursor.description]
    rv = mycursor.fetchall()
    json_data=[]
    for result in rv:
        json_data.append(dict(zip(row_headers,result)))
    return jsonify(json_data)

@app.route('/select_all_secret_data', methods=["GET"])
def select_all_secret_data():
    mycursor = mydb.cursor()
    sql = 'SELECT * from secret_data_to_be_deleted;'
    row_headers=[x[0] for x in mycursor.description]
    rv = mycursor.fetchall()
    json_data=[]
    for result in rv:
        json_data.append(dict(zip(row_headers,result)))
    return jsonify(json_data)

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
    mydb.commit()
    return jsonify(['OK'])

@app.route('/insert_deliveries', methods=["POST"])
def insert_deliveries():
    mycursor = mydb.cursor()
    data = request.get_json()
    sql = """INSERT INTO delivery_data (
            delivery_qr_code,
            bag_tag_number,
            bag_tag_group,
            delivery_location_lat,
            delivery_location_long,
            delivery_location_name,
            delivery_location_zip,
            current_location,
            current_location_lat,
            current_location_long,
            current_location_timestamp,
            delivery_window_start_time,
            delivery_window_end_time,
            delivery_status,
            data_storage_status,
            data_storage_datetime_start,
            data_storage_datetime_end
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s,%s, %s, %s, %s, %s, %s, %s, %s, %s);"""

    values = (data['delivery_qr_code'], data['bag_tag_number'], 
            data['bag_tag_group'], data['delivery_location_lat'], 
            data['delivery_location_long'], data['delivery_location_name'],
            data['delivery_location_zip'], data['current_location'],
            data['current_location_lat'], data['current_location_long'],
            data['current_location_timestamp'], data['delivery_window_start_time'],
            data['delivery_window_end_time'], data['delivery_status'],
            data['data_storage_status'], data['data_storage_datetime_start'],
            data['data_storage_datetime_end']
            )

    mycursor.execute(sql, values)
    mydb.commit()
    return jsonify(['OK'])

@app.route('/insert_delivery_items', methods=["POST"])
def insert_delivery_items():
    mycursor = mydb.cursor()
    data = request.get_json()
    sql = """INSERT INTO delivery_items (
            bt_ref,
            color,
            type,
            LD,
            bag_tag_number,
            customer_id,
            delivery_status
            ) 
            VALUES (%s, %s, %s, %s, %s, %s, %s);"""
    
    values = (data['bt_ref'],data['color'],
                data['type'], data['LD'],
                data['bag_tag_number'],
                data['customer_id'],
                data['delivery_status']
            )
    
    mycursor.execute(sql, values)
    mydb.commit()
    return jsonify(['OK'])

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
