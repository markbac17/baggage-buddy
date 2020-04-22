from flask import Flask, jsonify, request, send_file
import mysql.connector
from flask_cors import CORS

print("ok")

app = Flask(__name__)
cors = CORS(app)

@app.route('/select_all_customers', methods=["GET"])
def select_all_customers():
    mydb = mysql.connector.connect(host="localhost",
                               user="markbac17",
                               passwd="A9ZUflJCgmYHoQFG",
                               database="baggagebuddy")
    
    mycursor = mydb.cursor(dictionary=True)
    sql = 'SELECT * from customer_data;'
    mycursor.execute(sql)
    json_data = mycursor.fetchall()
    return jsonify(json_data)


@app.route('/select_delivery', methods=["GET"])
def select_delivery():
    mydb = mysql.connector.connect(host="localhost",
                               user="markbac17",
                               passwd="A9ZUflJCgmYHoQFG",
                               database="baggagebuddy")
    mycursor = mydb.cursor(dictionary=True)
    data = request.args.get("data", "")
    sql = "SELECT * FROM delivery_items WHERE bt_ref ='%s';"
    mycursor.execute(sql, data)
    json_data = mycursor.fetchall()
    return jsonify(json_data)


@app.route('/select_delivery_data', methods=["GET"])
def select_delivery_data():
    try:
        mydb = mysql.connector.connect(host="localhost",
                               user="markbac17",
                               passwd="A9ZUflJCgmYHoQFG",
                               database="baggagebuddy")
        mycursor = mydb.cursor(dictionary=True)
        data = request.args.get("data")
        sql = "SELECT * FROM `delivery_items` WHERE `bag_tag_number` =%s"
        mycursor.execute(sql, (data,))
        print("Data:", data)
        print("SQL:", sql)
        json_data = mycursor.fetchone()
        print(json_data)
        if json_data:
            return json_data
        else:
            json_data = {"empty": ""}
            return json_data

    except mysql.connector.Error as error:
        print("Failed to get record from MySQL table: {}".format(error))
    finally:
        if (mydb.is_connected()):
            mycursor.close()
            # mydb.close()
            print("MySQL cursor is closed")


@app.route('/select_delivery_data_2', methods=["GET"])
def select_delivery_data_2():
    try:
        mydb = mysql.connector.connect(host="localhost",
                               user="markbac17",
                               passwd="A9ZUflJCgmYHoQFG",
                               database="baggagebuddy")
        mycursor = mydb.cursor(dictionary=True)
        data = request.args.get("data")
        get_delivery_items = "SELECT * FROM `delivery_items` WHERE `bag_tag_number` = %s"
        get_secret_data = "SELECT * FROM `secret_data_to_be_deleted` WHERE `customer_id` = %s"
        get_customer_data = "SELECT * FROM `customer_data` WHERE `customer_id` = %s"
        
     
        mycursor.execute(get_delivery_items, (data,))
        print(mycursor.statement)
        delivery_items = mycursor.fetchone()
        print(delivery_items)
        if delivery_items:
            mycursor.execute(get_secret_data, (delivery_items['customer_id'],))
            print(mycursor.statement)
            secret_data = mycursor.fetchone()
            print(secret_data)
            customer_view = {'delivery_address': secret_data['delivery_address'],
                            'delivery_phone_num': secret_data['delivery_phone_num'],
                            'delivery_email': secret_data['delivery_email']}
            print(customer_view)
            delivery_items.update(customer_view)
            print(delivery_items)
            if secret_data:
                mycursor.execute(get_customer_data, (delivery_items['customer_id'],))
                print(mycursor.statement)
                customer_data = mycursor.fetchone()
                print(customer_data)
                customer_view_2 = {'fname': customer_data['f_name'],
                            'lname': customer_data['l_name'],
                            'delivery_conf_status': customer_data['delivery_conf_status']}
                delivery_items.update(customer_view_2)
            return jsonify(delivery_items)
        else:
            return {"empty": ""}

    except mysql.connector.Error as error:
        print("Failed to get record from MySQL table: {}".format(error))
    finally:
        if (mydb.is_connected()):
            mycursor.close()
            # mydb.close()
            print("MySQL cursor is closed")


@app.route('/select_all_deliveries', methods=["GET"])
def select_all_deliveries():
    mydb = mysql.connector.connect(host="localhost",
                               user="markbac17",
                               passwd="A9ZUflJCgmYHoQFG",
                               database="baggagebuddy")
    mycursor = mydb.cursor(dictionary=True)
    sql = 'SELECT * from delivery_data;'
    mycursor.execute(sql)
    json_data = mycursor.fetchall()
    print(json_data)
    return json_data


@app.route('/select_all_delivery_items', methods=["GET"])
def select_all_delivery_items():
    mydb = mysql.connector.connect(host="localhost",
                               user="markbac17",
                               passwd="A9ZUflJCgmYHoQFG",
                               database="baggagebuddy")
    mycursor = mydb.cursor(dictionary=True)
    sql = 'SELECT * from delivery_items;'
    mycursor.execute(sql)
    json_data = mycursor.fetchall()
    return jsonify(json_data)


@app.route('/select_all_secret_data', methods=["GET"])
def select_all_secret_data():
    mycursor = mydb.cursor(dictionary=True)
    sql = 'SELECT * from secret_data_to_be_deleted;'
    json_data = mycursor.fetchall()
    return jsonify(json_data)


@app.route('/insert_customers_2', methods=["POST"])
def insert_customers_2():
    mydb = mysql.connector.connect(host="localhost",
                            user="markbac17",
                            passwd="A9ZUflJCgmYHoQFG",
                            database="baggagebuddy")
    mycursor = mydb.cursor(dictionary=True)
    data = request.get_json()
    print(data)
        
    add_customer = ("INSERT INTO `customer_data` "
            "(`f_name`, `l_name`, `delivery_conf_status`) "
            "VALUES (%s, %s, %s)")
    
    add_customer_secret = ("INSERT INTO `secret_data_to_be_deleted` "
            "(`customer_id`, `delivery_address`, `delivery_city`, "
            "`delivery_phone_num`, `delivery_email`) "
            "VALUES (%s, %s, %s, %s, %s)")

    update_file = ("UPDATE `delivery_items` SET "
            "`customer_id` = %s, `delivery_status` = %s, `color` = %s, "
            "`type` = %s, `LD` = %s WHERE `bt_ref` = %s")

    if data['customer_id'] == 0:
        customer_data = (data['f_name'], data['l_name'], data['delivery_date'])
        mycursor.execute(add_customer, customer_data)
        print(mycursor.statement)
        customer_id = mycursor.lastrowid
    else:
        customer_id = data['customer_id']

    file_data = (customer_id,
            data['delivery_status'],
            data['color'],
            data['type'],
            data['LD'],
            data['bt_ref']
            ) 
    mycursor.execute(update_file, file_data)
    
    print(file_data)
    print(mycursor.statement)

    if data['delivery_address'] == '':
        data['delivery_address'] = 'TBN'
    if data['delivery_phone_num'] == '':
        data['delivery_phone_num'] = 'TBN'   
    if data['delivery_email'] == '':
        data['delivery_email'] = 'TBN'

    secret_data = (customer_id,
            data['delivery_address'],
            'TBN',
            data['delivery_phone_num'],
            data['delivery_email']
            )
    mycursor.execute(add_customer_secret, secret_data)
    
    mydb.commit()
    mycursor.close()
    mydb.close()
    print('OK')
    return jsonify(['OK'])

@app.route('/update_customers_2', methods=["POST"])
def update_customers_2():
    mydb = mysql.connector.connect(host="localhost",
                            user="markbac17",
                            passwd="A9ZUflJCgmYHoQFG",
                            database="baggagebuddy")
    mycursor = mydb.cursor(dictionary=True)
    data = request.get_json()
    print(data)
        
    update_customer = ("UPDATE `customer_data` SET "
                    "`f_name`=%s,`l_name`=%s,`delivery_conf_status`=%s "
                    "WHERE `customer_id` = %s")
    
    update_file = ("UPDATE `delivery_items` SET "
                    "`LD`=%s, `delivery_status`=%s "
                    "WHERE `customer_id`=%s")
    
    update_customer_secret = ("UPDATE `secret_data_to_be_deleted` SET "
                    "`delivery_address`=%s, `delivery_city`=%s, "
                    "`delivery_phone_num`=%s, `delivery_email`=%s "
                    "WHERE `customer_id`=%s")
    
    if data['customer_id'] != 0:
        customer_data = (data['f_name'], 
                data['l_name'],
                data['delivery_date'],
                data['customer_id']
                )
        mycursor.execute(update_customer, customer_data)
        print(customer_data)
        print(mycursor.statement)

        file_data = (
                data['LD'],
                data['delivery_status'],
                data['customer_id']
                ) 
        mycursor.execute(update_file, file_data)
        print(file_data)
        print(mycursor.statement)

        if data['delivery_address'] == '':
            data['delivery_address'] = 'TBN'
        if data['delivery_phone_num'] == '':
            data['delivery_phone_num'] = 'TBN'   
        if data['delivery_email'] == '':
            data['delivery_email'] = 'TBN'

        secret_data = (data['delivery_address'],
            'TBN',
            data['delivery_phone_num'],
            data['delivery_email'],
            data['customer_id']
            )
        mycursor.execute(update_customer_secret, secret_data)
        print(secret_data)
        print(mycursor.statement)

    mydb.commit()
    mycursor.close()
    mydb.close()
    print('OK')
    return jsonify(['OK'])

@app.route('/insert_deliveries', methods=["POST"])
def insert_deliveries():
    mycursor = mydb.cursor(dictionary=True)
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
    mycursor = mydb.cursor(dictionary=True)
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
    values = (data['bt_ref'],
              data['color'],
              data['type'],
              data['LD'],
              data['bag_tag_number'],
              data['customer_id'],
              data['delivery_status']
              )
    mycursor.execute(sql, values)
    mydb.commit()
    return jsonify(['OK'])


@app.route('/insert_secrets', methods=["POST"])
def insert_secrets():
    mycursor = mydb.cursor(dictionary=True)
    data = request.get_json()
    sql = """INSERT INTO secret_data_to_be_deleted (
            delivery_address,
            delivery_city,
            delivery_phone_num,
            delivery_email)
            VALUES (%s,%s,%s,%s)"""
    values = ("a", "b", "1", "2")
    mycursor.execute(sql, values)
    return jsonify(result)


@app.route('/update_customers', methods=["POST"])
def update_customers():
    mycursor = mydb.cursor(dictionary=True)
    data = request.get_json()
    sql = """UPDATE customer_data SET
            customer_id = %s,
            f_name = %s,
            l_name = %s,
            delivery_conf_status = %s
            WHERE customer_id = %s;"""
    values = ('?', '?', '?', '?', '?')
    mycursor.execute(sql, values)
    return jsonify(result)


@app.route('/update_deliveries', methods=["POST"])
def update_deliveries():
    mydb = mysql.connector.connect(host="localhost",
                        user="markbac17",
                        passwd="A9ZUflJCgmYHoQFG",
                        database="baggagebuddy")
    mycursor = mydb.cursor(dictionary=True)
    data = request.get_json()
    print(data)
    sql = """UPDATE `delivery_items`
        SET `delivery_status`= 'OUT FOR DELIVERY'
        WHERE file_id = '%s'"""
    values = (data['delivery_id'])
    result = mycursor.execute(sql, values)
    mydb.commit()
    print(values)
    print(sql)
    return {'result': 'OK'}


@app.route('/update_delivery_items', methods=["POST"])
def update_delivery_items():
    mydb = mysql.connector.connect(host="localhost",
                    user="markbac17",
                    passwd="A9ZUflJCgmYHoQFG",
                    database="baggagebuddy")
    mycursor = mydb.cursor(dictionary=True)
    data = request.get_json()
    sql = """UPDATE delivery_items SET
            customer_id = %s,
            delivery_status = %s,
            color = %s,
            type = %s;
            LD = %s
            WHERE
            bt_ref = %s;"""
    values = (data['customer_id'],
              data['delivery_conf_status'],
              data['color'],
              data['type'],
              data['LD'],
              data['bt_ref']
             )
    print(data)
    print(values)
    result = mycursor.execute(sql, values, multi=True)
    print(mycursor.statement)
    mydb.commit()
    mycursor.close()
    mydb.close()
    return {'result': 'OK'}


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')