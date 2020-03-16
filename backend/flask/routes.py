from flask import Flask, render_template, request, redirect, session, jsonify, url_for
from models import WT_file
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/bag_file/add', methods=["POST"])
def save_bag_file():
    data = request.get_json()
    new_file = WTfile(**data)
    new_file.insert()
    return jsonify({"wt_file":new_file.ref})

@app.route('/bag_files/select', methods=["GET"])
def get_wt_files():
    saved_wt_files = WT_file.select_all()
    return jsonify({"wt_file":saved_wt_file})