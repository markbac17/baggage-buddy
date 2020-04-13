import os
from random import random
from .ORM import ORM
from ._utils import generate_token
import os
import mysql.connector
from flask_cors import CORS
import bcrypt

class User(ORM):
    fields = ["pk", "username", "encrypted_password", "salt", "fname", "lname", "email", "token"]
    tablename = "user"

    def __init__(self, **kwargs):
        self.pk = kwargs.get("pk")
        self.username = kwargs.get("username")
        self.encrypted_password = kwargs.get("encrypted_password")
        self.salt = kwargs.get("salt")
        self.fname = kwargs.get("fname")
        self.lname = kwargs.get("lname")
        self.email = kwargs.get("email")
        self.token = kwargs.get("token")

    def del_token(self):
        db = mysql.connector.connect(host="localhost",user="flask",passwd="A9ZUflJCgmYHoQFG",database="baggagebuddy")
        cursor = db.cursor(dictionary=True)
        sql = f"""UPDATE {self.tablename} SET token = '' WHERE pk = {self.pk}"""
        cursor.execute(sql)

    def get_token(self):
        db = mysql.connector.connect(host="localhost",user="flask",passwd="A9ZUflJCgmYHoQFG",database="baggagebuddy")
        cursor = db.cursor(dictionary=True)
        self.token = generate_token()
        print(self.tablename,self.token)
        sql = f"""SELECT pk FROM {self.tablename} WHERE token = %s"""
        repeat = True
        while repeat is True:
            cursor.execute(sql, (self.token,))
            instance = cursor.fetchone()
            print(instance)
            if instance is None:
               repeat = False
            else:
                self.token = generate_token()
                print(self.token,self.pk,self.tablename)
                sql = f"""UPDATE {self.tablename} SET token = '{self.token}' WHERE pk = '{self.pk}'"""
                # sql = f"""UPDATE user SET token = '1234' WHERE pk = '59'"""
                print(sql)
                cursor.execute(sql)
                db.commit()

    @classmethod
    def no_repeat_username(cls, username):
        db = mysql.connector.connect(host="localhost",user="flask",passwd="A9ZUflJCgmYHoQFG",database="baggagebuddy")
        cursor = db.cursor(buffered=True)
        sql = f"""SELECT pk FROM {cls.tablename} WHERE username = %s"""
        cursor.execute(sql, (username,))
        if cursor.rowcount == 0:
            return False
        return True

    @classmethod
    def no_repeat_email(cls, email):
        db = mysql.connector.connect(host="localhost",user="flask",passwd="A9ZUflJCgmYHoQFG",database="baggagebuddy")
        cursor = db.cursor(buffered=True)
        sql = f"""SELECT pk FROM {cls.tablename} WHERE email = %s"""
        cursor.execute(sql, (email,))
        if cursor.rowcount == 0:
            return False
        return True
    
    @classmethod
    def login(cls, username, password):
        db = mysql.connector.connect(host="localhost",user="flask",passwd="A9ZUflJCgmYHoQFG",database="baggagebuddy")
        cursor = db.cursor(dictionary=True)
        sql= f"""SELECT * FROM {cls.tablename} WHERE username = %s"""
        cursor.execute(sql, (username,)) 
        user_account = cursor.fetchone()
        if user_account is None:
            return False
        if not bcrypt.checkpw(password.encode('utf-8'),user_account["encrypted_password"].encode('utf-8')):
            return False
        else:
            return cls(**user_account)