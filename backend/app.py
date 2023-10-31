from flask import Flask, render_template, request, make_response
from flask_mysqldb import MySQL
from flask_bcrypt import Bcrypt

app = Flask(__name__, static_folder="../frontend/build", static_url_path="/")
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'nkyhl'
app.config['MYSQL_PASSWORD'] = 'goirish'
app.config['MYSQL_DB'] = 'nkyhl'
mysql = MySQL(app)
bcrypt = Bcrypt(app)

@app.route("/")
def index():
    return app.send_static_file('index.html')

@app.route("/login")
def login():
    return app.send_static_file('index.html')

@app.route("/signup")
def signup():
    return app.send_static_file('index.html')

@app.route("/user")
def user():
    return app.send_static_file('index.html')

@app.route("/api/test-connection")
def test_connection():
    return {'status': 'down' if not mysql.connection.cursor() else 'up'}
    
@app.route("/api/validate/username", methods=['POST'])
def validate_username(username=''):
    """
    Validate that username exists in the database.

    Called via HTTP endpoint, or by passing username parameter to
    function from other endpoints.
    """
    if not request.json:
        return {'message': 'application/json format required'}, 400

    username = request.json.get('username') if not username else username

    if not username:
        return {'message': 'Username not included'}, 400

    conn = mysql.connection
    if not conn:
        return {'message': 'The database is not available'}, 400

    query = "SELECT name FROM User WHERE name = %s"
    args = (request.json.get('username', username),)

    cursor = conn.cursor()
    cursor.execute(query, args)

    validated = cursor.fetchall()
    cursor.close()
    return {'exists': bool(validated)}

@app.route("/api/validate/user", methods=['POST'])
def validate_user():
    """
    Validate that a username/email and password combination are valid.
    """
    if not request.json:
        return {'message': 'application/json format required'}, 400
    
    username = request.json.get('username')
    email = request.json.get('email')
    password = request.json.get('password')

    if not username and not email:
        return {'message': 'Username or email required'}, 400
    if not password:
        return {'message': 'Password not included'}, 400
    
    conn = mysql.connection
    if not conn:
        return {'message': 'The database is not available'}, 400
    
    query = "SELECT password FROM User WHERE "
    query += "name = %s" if username else "email = %s"
    args = (username if username else email,)

    cursor = conn.cursor()
    cursor.execute(query, args)

    validated = cursor.fetchall()
    cursor.close()

    if not validated:
        return {'message': 'User does not exist'}, 400
    
    hashed_password = validated[0][0]

    return {'valid': bcrypt.check_password_hash(hashed_password, password)}

@app.route("/api/signup", methods=['POST'])
def api_signup():
    if not request.json:
        return {'message': 'application/json format required'}, 400
    
    username = request.json.get('username')
    email = request.json.get('email')
    password = request.json.get('password')

    if not username:
        return {'message': 'Username not included'}, 400
    if not email:
        return {'message': 'Password not included'}, 400
    if not password:
        return {'message': 'Password not included'}, 400
    
    conn = mysql.connection
    if not conn:
        return {'message': 'The database is not available'}, 400
    
    if validate_username(username)['exists']:
        return {'message': 'Username already taken'}, 400
    
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    query = "INSERT INTO User (name, email, password) VALUES (%s, %s, %s)"
    args = (username, email, hashed_password)
    
    cursor = conn.cursor()
    cursor.execute(query, args)

    conn.commit()
    cursor.close()

    # Validate Insertion
    if not validate_username(username)['exists']:
        return {'message': 'Error in creating user'}, 400
    return {'message': 'Your account has been created'}, 200

@app.route("/api/search/name")
def search_name():
    '''Search for Recipes by Name.'''
    pass

@app.route("/api/search/ingredient")
def search_ingredient():
    '''Search for Recipes by Ingredient'''
    pass

if __name__ == '__main__':
    app.run(debug=True, port=5036, host='db8.cse.nd.edu')
