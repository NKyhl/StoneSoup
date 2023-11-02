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

@app.route("/home")
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
    args = (username,)

    cursor = conn.cursor()
    cursor.execute(query, args)

    validated = cursor.fetchall()
    cursor.close()
    return {'exists': bool(validated)}

@app.route("/api/validate/email", methods=['POST'])
def validate_email(email=''):
    """
    Validate that email exists in the database.

    Called via HTTP endpoint, or by passing username parameter to
    function from other endpoints.
    """
    if not request.json:
        return {'message': 'application/json format required'}, 400

    email = request.json.get('email') if not email else email

    if not email:
        return {'message': 'Email not included'}, 400

    conn = mysql.connection
    if not conn:
        return {'message': 'The database is not available'}, 400

    query = "SELECT email FROM User WHERE email = %s"
    args = (email,)

    cursor = conn.cursor()
    cursor.execute(query, args)

    validated = cursor.fetchall()
    cursor.close()
    return {'exists': bool(validated)}

@app.route("/api/validate/user", methods=['POST'])
def validate_user(username='', email='', password=''):
    """
    Validate that a username/email and password combination are valid.

    Called via HTTP endpoint, or by passing parameters to
    function from other endpoints.
    """
    if not request.json:
        return {'message': 'application/json format required'}, 400
    
    username = request.json.get('username', username)
    email = request.json.get('email', email)
    password = request.json.get('password', password)

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

    response = {'valid': bcrypt.check_password_hash(hashed_password, password)}

    if not response['valid']:
        return response, 400

    # If valid, return user info as well
    query = "SELECT name, email, cal_goal, protein_goal, fat_goal, carb_goal, icon_id FROM User"

    if username:
        args = (username,)
        query += " WHERE name = %s"
    else:
        args = (email,)
        query += " WHERE email = %s"

    cursor = conn.cursor()
    cursor.execute(query, args)

    user_info = cursor.fetchone()
    if user_info:
        name, email, cal_goal, protein_goal, fat_goal, carb_goal, icon_id = user_info
        response['name'] = name
        response['email'] = email
        response['password'] = password
        response['cal_goal'] = cal_goal
        response['fat_goal'] = fat_goal
        response['protein_goal'] = protein_goal
        response['carb_goal'] = carb_goal
        response['icon_id'] = icon_id

    return response

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
        return {'message': 'Email not included'}, 400
    if not password:
        return {'message': 'Password not included'}, 400
    
    conn = mysql.connection
    if not conn:
        return {'message': 'The database is not available'}, 400
    
    if validate_username(username)['exists']:
        return {'message': 'Username already taken'}, 400
    if validate_email(email)['exists']:
        return {'message': 'Email already taken'}, 400
    
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

@app.route("/api/update/user", methods=['POST'])
def update_user_goals():
    if not request.json:
        return {'message': 'application/json format required'}, 400
    
    username = request.json.get('username')
    email = request.json.get('email')
    password = request.json.get('password')

    cal_goal = request.json.get('cal_goal')
    protein_goal = request.json.get('protein_goal')
    fat_goal = request.json.get('fat_goal')
    carb_goal = request.json.get('carb_goal')

    new_username = request.json.get('new_username')
    new_email = request.json.get('new_email')

    icon_id = request.json.get('icon_id')

    if not username and not email:
        return {'message': 'Username or email required'}, 400
    if not password:
        return {'message': 'Password not included'}, 400
    if not cal_goal and not fat_goal and not carb_goal and not new_username and not new_email and not icon_id:
        return {'message': 'No update included'}, 400
    
    conn = mysql.connection
    if not conn:
        return {'message': 'The database is not available'}, 400
    
    # Validate User
    if not validate_user(username, email, password)['valid']:
        return {'message': 'This is not a valid user'}, 400
    
    # Make sure User can't set username or email to existing account
    if new_username and validate_username(new_username)['exists']:
        return {'message': 'This username is taken'}, 400
    if new_email and validate_email(new_email)['exists']:
        return {'message': 'This email is taken'}, 400

    # Update User Info
    query = "UPDATE User SET"
    args = []
    if cal_goal: 
        query += " cal_goal = %s,"
        args.append(cal_goal)
    if protein_goal: 
        query += " protein_goal = %s,"
        args.append(protein_goal)
    if fat_goal: 
        query += " fat_goal = %s,"
        args.append(fat_goal)
    if carb_goal: 
        query += " carb_goal = %s,"
        args.append(carb_goal)
    if new_username: 
        query += " name = %s,"
        args.append(new_username)
    if new_email:
        query += " email = %s,"
        args.append(new_email)
    if icon_id:
        query += " icon_id = %s,"
        args.append(icon_id)

    query = query[:-1] # Remove last comma

    query += " WHERE name = %s"
    args.append(username)

    cursor = conn.cursor()
    cursor.execute(query, tuple(args))
    conn.commit()

    return {'message': 'User information updated'}, 200

@app.route("/api/search/name", methods=['GET', 'POST'])
def search_name():
    '''Search for Recipes by Name.'''

    if not request.json or 'search' not in request.json:
        return {'message': 'application/json format required'}, 400

    conn = mysql.connection
    if not conn:
        return {'message': 'The database is not available'}, 400


    name = request.json.get("search")

    #cursor = conn.cursor()
    #cursor.execute("SELECT * FROM Recipe WHERE name like '%%s%' LIMIT 10")
    #res = cursor.fetchall()
    #print(res)
    #return "done"

    words = name.split()
    mincal = request.json.get("minCal")
    mincal = str(mincal)
    maxcal = request.json.get("maxCal")
    maxcal = str(maxcal)
    mincarb = request.json.get("minCarb")
    mincarb = str(mincarb)
    maxcarb = request.json.get("maxCarb")
    maxcarb = str(maxcarb)
    minfat = request.json.get("minFat")
    minfat = str(minfat)
    maxfat = request.json.get("maxFat")
    maxfat = str(maxfat)
    minpro = request.json.get("minProtein")
    minpro = str(minpro)
    maxpro = request.json.get("maxProtein")
    maxpro = str(maxpro)


    querylist = []
    wherelist = []
    x=0
    args = []
    if len(words) > 1:
        for word in words:
            word = "%"+words+"%"
            leta = chr(ord('a') + x)
            querylist.append(f"(SELECT name FROM Recipe WHERE name LIKE '%s'){leta}")
            x=x+1
            args.append(word)
        for i in range(1,x):
            leta = chr(ord('a') + i-1)
            letb = chr(ord('a') + i)
            wherelist.append(f" {leta}.name = {letb}.name ")

        query = "SELECT a.name FROM "+", ".join(querylist)+" WHERE"
        where = " AND ".join(wherelist)
        query = query + where
    else:
        args.append(words[0])
        query = "SELECT * FROM Recipe WHERE name LIKE '%s' "
    if mincal or maxcal or mincarb or maxcarb or minfat or maxfat or minpro or maxpro:
        where = []
        query = "SELECT * FROM (" +query+ ")rec WHERE "
        if mincal:
            where.append("calories > %s")
            args.append(mincal)
        if maxcal:
            where.append("calories < %s")
            args.append(maxcal)
        if mincarb:
            where.append("carbs > %s")
            args.append(mincarb)
        if maxcarb:
            where.append("carbs < %s")
            args.append(maxcarb)
        if maxfat:
            where.append("fat < %s")
            args.append(maxfat)
        if minfat:
            where.append("fat > %s")
            args.append(minfat)
        if minpro:
            where.append("protein > %s")
            args.append(minpro)
        if maxpro:
            where.append("protein < %s")
            args.append(maxpro)
        W = " AND ".join(where)
        query = query + W +";"       
    
    print(query%tuple(args))
    curs = conn.cursor()
    curs.execute(query, tuple(args))
    recs = curs.fetchall()
    curs.close()
    print(recs)
    results = []
    for recipe in recs:
        recipecols = {}
        recipecols = {'id':recipe[0], 'name':recipe[1], 'category':recipe[2], 'yield':recipe[3], 'calories':recipe[4], 'protein':recipe[5], 'fat':recipe[6], 'carbs':recipe[7], 'prep_time':recipe[8], 'cook_time':recipe[9], 'total_time':recipe[10], 'img_url':recipe[11], 'url':recipe[12]}
        results.append(recipecols)
    r = {'results':results}
    print(r)
    return r
        

@app.route("/api/search/ingredient", methods=['POST'])
def search_ingredient():
    '''Search for Recipes by Ingredient'''
    conn = mysql.connection
    if not conn:
        return {'message': 'The database is not available'}, 400

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
    query = "SELECT * FROM Recipe, "+query+" WHERE Recipe.id = id.recipe_id;"
    
    cursor = conn.cursor()
    cursor.execute((query), (args))
    recipes = cursor.fetchall()
    return "hgfsdj"
            


if __name__ == '__main__':
    app.run(debug=True, port=5036, host='db8.cse.nd.edu')
