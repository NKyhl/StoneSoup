#!/usr/bin/env python3

from flask import Flask, render_template, request
from flask_mysqldb import MySQL
from flask_bcrypt import Bcrypt

app = Flask(__name__)
app.config['MYSQL_HOST'] = '127.0.0.1',
app.config['MYSQL_USER'] = 'nkyhl',
app.config['MYSQL_PASSWORD'] = 'goirish'
app.config['MYSQL_DB'] = 'nkyhl'
mysql = MySQL(app)
bcrypt = Bcrypt(app)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/api/test-connection")
def test_connection():
    return {'status': 'down' if not mysql.connection else 'up'}
    
@app.route("/api/validate/username", methods=['POST'])
def validate_username(username=''):
    if not request.json.get('username') and not username:
        return {'message': 'Data not included'}, 400

    if not (conn := mysql.connection):
        return {'message': 'The database is not available'}, 400
    
    cursor = conn.cursor()
    query = ('SELECT name FROM User WHERE name = %s')
    cursor.execute((query), (request.json.get('username', username)))
    cursor.commit()

    validated = cursor.fetchall()
    cursor.close()
    return {'exists': bool(validated)} if not username else bool(validated)

@app.route("/api/signup", methods=['POST'])
def signup():
    if not request.json:
        return {'message': 'Data not included'}, 400
    
    username = request.json.get('username')
    password = request.json.get('password')

    if not username:
        return {'message': 'Username not included'}, 400
    if not password:
        return {'message': 'Password not included'}, 400
    
    if not (conn := mysql.connection):
        return {'message': 'The database is not available'}, 400
    
    if validate_username(username):
        return {'message': 'Username already taken'}, 400
    
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    query = ('INSERT INTO Users (name, password) VALUES (%s, %s)')
    
    cursor = conn.cursor()
    cursor.execute((query), (username, hashed_password))
    cursor.commit()

    # TODO: check for errors in insertion

    return {'message': 'Your account has been created'}, 200

@app.route("/api/login")
def login():
    pass

@app.route("/api/logout")
def logout():
    pass

@app.route("/api/search/name")
def search_name():
    '''Search for Recipes by Name.'''
     if not (conn := mysql.connection):
        return {'message': 'The database is not available'}, 400

    name = request.json.get("search_name_string")

    words = name.split()


    querylist = []
    wherelist = []
    x=0
    args = ()
    if len(words) > 1:
        for word in words:
            leta = chr(ord('a') + x)
            querylist.append(f"(SELECT name FROM Recipe WHERE name REGEXP (\"(^| )%s( |$)\")){leta}")
            x=x+1
            args = args + (word,)
        for i in range(1,x):
            leta = chr(ord('a') + i-1)
            letb = chr(ord('a') + i)
            wherelist.append(f" {leta}.name = {letb}.name ")

        query = "SELECT a.name FROM "+", ".join(querylist)+" WHERE"
        where = " AND ".join(wherelist)
        query = query + where
    else:
        args = (words[0])
        query = "SELECT name FROM Recipe WHERE name REGEXP (\"(^| )%s( |$)\")"

    cursor = conn.cursor()
    cursor.execute((query), (args))
    recipes = cursor.fetchall()

        

@app.route("/api/search/ingredient")
def search_ingredient():
    '''Search for Recipes by Ingredient'''
    name = request.json("search_ingredient_string")

    words = name.split()

    querylist = []
    wherelist = []
    x = 0
    args = ()

    if len(words) > 1:
        for word in words:
            leta = chr(ord('a') + x)
            query = ("SELECT id FROM Ingredient WHERE name REGEXP (\"(^| )%s( |$)\")")
            query = "("+query+") ing"
            query = ("(SELECT recipe_id FROM "+query+f", MadeWith m WHERE m.ingredient_id = ing.id) {leta}")
            querylist.append(query)
            x=x+1
            args = args + (word,)
        for i in range(1,x):
            leta = chr(ord('a') + i-1)
            letb = chr(ord('a') + i)
            wherelist.append(f" {leta}.recipe_id = {letb}.recipe_id ")
        where = " AND ".join(wherelist)
        query = ",".join(querylist)
        query = "(SELECT a.recipe_id FROM " + query + " WHERE " +where +") id"

    else:
        query = (f"SELECT id FROM Ingredient WHERE name REGEXP (\"(^| )%( |$)\")")
        query = "("+query+") ing"
        query = "(SELECT recipe_id FROM "+query+", MadeWith m WHERE m.ingredient_id = ing.id) "
    query = "SELECT name FROM Recipe, "+query+" WHERE Recipe.id = id.recipe_id"

    cursor = conn.cursor()
    cursor.execute((query), (args))
    recipes = cursor.fetchall()


if __name__ == '__main__':
    app.run(host='db8.cse.nd.edu', port=5000)
