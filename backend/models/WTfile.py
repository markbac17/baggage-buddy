from flask import Flask, jsonify
import mysql.connector

app = Flask(__name__)

mydb = mysql.connector.connect(host="localhost", user="markbac17", passwd="A9ZUflJCgmYHoQFG", database="baggagebuddy")

# app.config['MYSQL_USER'] = "markbac17"
# app.config['MYSQL_PASSWORD'] = "A9ZUflJCgmYHoQFG"
# app.config['MYSQL_HOST'] = "localhost"
# app.config['MYSQL_DB'] = "baggagebuddy"
# app.config['MYSQL_CURSORCLASS'] = DictCursor

@app.route('/home')
def index():
    mycursor = mydb.cursor()
    sql = 'SELECT * from customer_data;'
    mycursor.execute(sql)
    result = mycursor.fetchall()
    return jsonify(result)


    # return render_template('home.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
