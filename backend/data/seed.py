import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  user="markbac17",
  passwd="A9ZUflJCgmYHoQFG",
  database="baggagebuddy"
)

mycursor = mydb.cursor()

mycursor.execute("""SET FOREIGN_KEY_CHECKS=0;""")
mycursor.execute("""DROP TABLE IF EXISTS customer_data;""")
mycursor.execute("""DROP TABLE IF EXISTS delivery_data;""")
mycursor.execute("""DROP TABLE IF EXISTS secret_data_to_be_deleted;""")
mycursor.execute("""DROP TABLE IF EXISTS delivery_items;""")
mycursor.execute("""SET FOREIGN_KEY_CHECKS=1;""")


mycursor.execute("""CREATE TABLE customer_data (
	            customer_id INT PRIMARY KEY AUTO_INCREMENT,
                f_name VARCHAR(255),
	            l_name VARCHAR(255),
                delivery_conf_status VARCHAR(255)
	            );""")

mycursor.execute("""CREATE TABLE delivery_data (
	            delivery_id INT PRIMARY KEY AUTO_INCREMENT,
	            bag_tag_number INT,
                bad_tag_group INT,
                delivery_location_lat VARCHAR(255),
	            delivery_location_long VARCHAR(255),
	            delivery_location_name VARCHAR(255),
	            delivery_location_zip	INT,
	            current_location VARCHAR(255),
	            current_location_lat VARCHAR(255),
	            current_location_long VARCHAR(255),
	            current_location_timestamp VARCHAR(255),
	            delivery_window_start_time VARCHAR(255),
	            delivery_window_end_time VARCHAR(255),
	            delivery_status	VARCHAR(255),
	            data_storage_status VARCHAR(255),
	            data_storage_datetime_start	VARCHAR(255),
	            data_storage_datetime_end VARCHAR(255),
	            customer_id	INT,
                FOREIGN KEY(customer_id) REFERENCES customer_data(customer_id));""")

mycursor.execute("""CREATE TABLE secret_data_to_be_deleted (
	            secret_id INTEGER PRIMARY KEY AUTO_INCREMENT,
                delivery_address VARCHAR(255),
	            delivery_city VARCHAR(255),
	            delivery_phone_num VARCHAR(255),
	            delivery_email VARCHAR(255),
	            FOREIGN KEY(secret_id) REFERENCES customer_data(customer_id)
                );""")

mycursor.execute("""CREATE TABLE delivery_items (
                bt_ref INT PRIMARY KEY AUTO_INCREMENT,
                bag_tag_number INT,
                customer_id INT,
                delivery_status VARCHAR(255),
                FOREIGN KEY(customer_id) REFERENCES customer_data(customer_id)
                );""")
