"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Profile, Task
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/info/<int:user_id>', methods=['GET'])
def info_usuario(user_id):

    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "Usuario no existe"}), 404

    return jsonify(user.serialize()), 200


@api.route('/signup', methods=['POST'])
def login():
    email = request.json.get("email")
    password = request.json.get("password")

    if not email:
        return jsonify({"error": "Email is required"}), 400
    if not password:
        return jsonify({"error": "Password is required"}), 400

    user = User.query.filter_by(email=email). first()
    password = user.password

    if not user:
        return jsonify({"error": "Incorrect email/password"}), 401

    if not password:
        return jsonify({"error": "Incorrect email/password"}), 401

    data = {
        "user": user.serialize()
    }

    return jsonify({"status": "success", "data": data}), 200


@api.route('/register', methods=['POST'])
def register():

    email = request.json.get("email")
    password = request.json.get("password")

    if not email:
        return jsonify({"error": "El email es requerido"}), 400
    if not password:
        return jsonify({"error": "El password es requerido"}), 400

    # SELECT * FROM users WHERE email="" => <User 1>
    found = User.query.filter_by(email=email).first()

    if found:
        return jsonify({"error": "El email ya esta siendo utilizado"}), 400

    # Configuramos los datos del usuario
    user = User()
    user.email = email
    user.password = password  # Encripta la constraseña

    # Configuramos los datos del perfil
    profile = Profile()

    # Asociamos el perfil al usuario a traves del relationship
    user.profile = profile

    # Guardamos el usuario
    db.session.add(user)
    db.session.commit()

    return jsonify({"success": "Registro exitoso"}), 200


@api.route('/profile', methods=['GET'])
def profile():
    id = User.id  # Obtenemos el id del usuario que esta haciendo la petision
    user = User.query.get(id)  # Buscamos al usuario
    return jsonify(user.serialize_complete_info()), 200
