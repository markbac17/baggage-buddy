import mysql.connector
from flask_cors import CORS
# dbpath=(host="localhost", user="baggagebuddy", passwd="A9ZUflJCgmYHoQFG", database="baggagebuddy")

class ORM:
    fields = []

    def save(self):
        if self.pk is None:
            self._insert()
        else:
            self._update()

    def _insert(self):
        mydb = mysql.connector.connect(host="localhost", user="baggagebuddy", passwd="A9ZUflJCgmYHoQFG", database="baggagebuddy")
        mycursor = mydb.cursor(buffered=True)
        field_string = ', '.join(self.fields)
        q_marks = ', '.join(['%s' for _ in self.fields])
        sql = f"""INSERT INTO {self.tablename} ({field_string})
                VALUES ({q_marks});"""
        values = [getattr(self, field) for field in self.fields]
        mycursor.execute(sql, values)
        mydb.commit()

    def _update():
        mydb = mysql.connector.connect(host="localhost", user="flabaggagebuddysk", passwd="A9ZUflJCgmYHoQFG", database="baggagebuddy")
        mycursor = mydb.cursor(buffered=True)
        assignments = ", ".join([f"{field} = %s" for field in self.fields])
        sql = f"""UPDATE {self.tablename} SET {assignments} WHERE pk = %s;"""
        values = [getattr(self, field) for field in self.fields]
        values.append(self.pk)
        if len(values) <= 1:
            mycursor.execute(sql, values,)
        else:
            mycursor.execute(sql, values)
        mydb.commit()
        return jsonify(result)
    
    def delete(self):
        mydb = mysql.connector.connect(host="localhost", user="baggagebuddy", passwd="A9ZUflJCgmYHoQFG", database="baggagebuddy")
        if not self.pk:
            raise KeyError(f"{self.pk} does not exist in the database")
        mycursor = mydb.cursor(buffered=True)
        sql = f"""DELETE FROM {self.tablename} WHERE pk = %s"""
        mycursor.execute(sql, (self.pk,))
        mydb.commit()

    @classmethod
    def select_one(cls, where_clause = "", values = tuple()):
        mydb = mysql.connector.connect(host="localhost", user="baggagebuddy", passwd="A9ZUflJCgmYHoQFG", database="baggagebuddy")
        mycursor = mydb.cursor(dictionary=True)
        json_data=[]
        print(json_data)
        sql = f"""SELECT * FROM {cls.tablename} {where_clause};"""
        mycursor.execute(sql, values)
        result = mycursor.fetchone()
        return cls(**result)
    
    # @classmethod
    # def select_all(cls, where_clause = '', values = tuple()):
    #     mydb = mysql.connector.connect(host="localhost", user="flask", passwd="A9ZUflJCgmYHoQFG", database="shitty-city")
    #     mycursor = mydb.cursor()
    #     json_data=[]
    #     if len(values) == 0:
    #         sql = f'''SELECT * FROM {cls.tablename};'''
    #         mycursor.execute(sql)
    #     else:
    #         sql = f'''SELECT * FROM {cls.tablename} {where_clause};'''
    #         mycursor.execute(sql, values)
    #     rv = mycursor.fetchall()
    #     row_headers=[x[0] for x in mycursor.description]
    #     for result in rv:
    #         json_data.append(dict(zip(row_headers,result)))
    #     return jsonify(json_data)