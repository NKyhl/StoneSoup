from flask import Flask, render_template, request, make_response
from flask_mysqldb import MySQL
from flask_bcrypt import Bcrypt
import random 

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

@app.route("/api/search/name", methods=['POST'])
def search_name():
    '''Search for Recipes by Name.'''

    if not request.json or 'search' not in request.json:
        return {'message': 'application/json format required'}, 400

    conn = mysql.connection
    if not conn:
        return {'message': 'The database is not available'}, 400


    recipes  = request.json.get("search")  ##need recipe id list
    recipes = recipes.split()
    inglist = []
    
    query = "SELECT DISTINCT ingredient_id FROM MadeWith_new WHERE recipe_id = "
    wherelist = []
    recarglist = []
    for rid in recipes:
        wherelist.append("%s")
        recarglist.append(rid)
    
    where = " OR recipe_id = ".join(wherelist)
    query = query + where


    curs = conn.cursor()
    curs.execute(query, tuple(recarglist))
    ing_id  = curs.fetchall()
    curs.close()
   

 
    query = "Select ingredient_id, count(*) matches from MadeWith_new where ingredient_id = "
    wherelist = []
    ing_idlist = []
    for ing in ing_id:
        wherelist.append("%s")
        ing_idlist.append(ing[0])
    where = " OR ingredient_id = ".join(wherelist)
    query = query + where
    query = 'SELECT * FROM (' + query + " group by ingredient_id)a Where a.matches  > 1"


    curs = conn.cursor()
    curs.execute(query, tuple(ing_idlist))
    ing_to_use = curs.fetchall()
    inglist = []
    for ing in ing_to_use:
        inglist.append(ing[0])

 
    goodrec = False
    query = ''
    while not goodrec:
        args = []
        for i in range(3):
            new = False
            while not new:
                x = random.choice(inglist)
                if x in args:
                    new = False
                else:
                    args.append(x)
                    new = True
        
        ingargs = tuple(args)
        
        query = "(SELECT recipe_id FROM MadeWith_new where ingredient_id = %s)" 
        query =  query + 'a, ' + query + 'b, ' + query + 'c ' #+ query + 'd '
        query = "(Select Distinct a.recipe_id FROM " + query + "where a.recipe_id = b.recipe_id AND b.recipe_id = c.recipe_id) b " #AND c.recipe_id = d.recipe_id ) b "
        query = "SELECT r.name, r.category, r.url, r.img_url, r.calories, r.protein, r.carbs  FROM Recipe_new r," + query + "where b.recipe_id = r.id"


        curs = conn.cursor()
        curs.execute(query, ingargs)
        recs = curs.fetchall()
        curs.close()
        if len(recs) > 20 :
            goodrec = True 
     #GET CALORIE GOAL
    calgoal = 2800
    progoal = 80


    Bcal_low = 0.25 * calgoal
    Bcal_high = 0.30 * calgoal
    Lcal_low = 0.35 * calgoal
    Lcal_high = 0.40 *calgoal
    Scal_low = 0.05 * calgoal
    Scal_high = 0.10 * calgoal
    Dcal_low = 0.25 * calgoal
    Dcal_high = 0.30 *calgoal


    Bpro_low = 0.25 * progoal
    Bpro_high = 0.30 * progoal
    Lpro_low = 0.35 * progoal
    Lpro_high = 0.40 *progoal
    Spro_low = 0.05 * progoal
    Spro_high = 0.10 * progoal
    Dpro_low = 0.25 * progoal
    Dpro_high = 0.30 *progoal


    test = []
    for rec in recs:
        if rec[4] == None:
            continue
        if rec[1] == "Breakfast":
            if rec[4] < Bcal_low or rec[4] > Bcal_high:
                continue
        elif rec[1] == "Lunch":
            if rec[4] < Lcal_low or rec[4] > Lcal_high:
                continue

        elif rec[1] == "Dinner":
            if rec[4] < Dcal_low or rec[4] > Dcal_high:
                continue

        else:
            if rec[4] < Scal_low or rec[4] > Scal_high:
                continue
        test.append(rec)
    if len(test) > 3:
        recs = test[:]

    
    test = []
    for rec in recs:
        if rec[5] == None:
            continue
        if rec[1] == "Breakfast":
            if rec[5] < Bpro_low or rec[5] > Bpro_high:
                continue
        elif rec[1] == "Lunch":
            if rec[5] < Lpro_low or rec[5] > Lpro_high:
                continue

        elif rec[1] == "Dinner":
            if rec[5] < Dpro_low or rec[5] > Dpro_high:
                continue

        else:
            if rec[5] < Spro_low or rec[5] > Spro_high:
                continue
        test.append(rec)
    if len(test) > 3:
        recs = test[:]
    
    recipes = []
    for recipe in recs:
        recipes.append({
            'name': recipe[0],
            'category': recipe[1],
            'url': recipe[2],
            'img_url': recipe[3]
            })

    return {'recipes': recipes, 'message': f'{len(recipes)} recipes returned'}

         
        


    ing = request.json.get("ingredient")
    if ing:


        ingwords = ing.split()
        inglet = []

        ingquerylist = []
        ingwherelist = []
        x = 0
        ingargs = []

        if len(ingwords) > 1:
            for word in ingwords:
                inglet.append(chr(ord('a') + x))
                ingquery = ("SELECT id FROM Ingredient_new WHERE name LIKE '%{}%'")
                ingquery = "("+ingquery+") ing"
                ingquery = ("(SELECT recipe_id FROM "+ingquery+", MadeWith_new m WHERE m.ingredient_id = ing.id) {}")
                ingquerylist.append(ingquery)
                ingargs.append(word)
                ingargs.append(inglet[x])
                x = x+1
            for i in range(1,x):
                leta = chr(ord('a') + i-1)
                letb = chr(ord('a') + i)
                ingwherelist.append(f" {leta}.recipe_id = {letb}.recipe_id ")
            ingwhere = " AND ".join(ingwherelist)
            ingquery = ",".join(ingquerylist)
            ingquery = "(SELECT DISTINCT a.recipe_id FROM " + ingquery + " WHERE " +ingwhere +") id"

        else:
            ingquery = ("SELECT id FROM Ingredient_new WHERE name LIKE '%{}%'")
            ingquery = "("+ingquery+") ing"
            ingquery = "(SELECT recipe_id FROM "+ingquery+", MadeWith_new m WHERE m.ingredient_id = ing.id) id"
            ingargs.append(ingwords[0])
        ingquery = "SELECT * FROM Recipe_new, "+ingquery+" WHERE Recipe.id = id.recipe_id"
    

        ingquery = "SELECT name, category, url, img_url FROM (" + ingquery + ")ing"
        #a = tuple(ingargs)
        #print(ingquery.format(*a)) 
        #curs = conn.cursor()
        #curs.execute(ingquery.format(*a))
        #recs = curs.fetchall()
        #ingrecipes = []
        #for recipe in recs:
         #   ingrecipes.append({
          #      'name': recipe[0],
          #      'category': recipe[1],
          #      'url': recipe[2],
          #      'img_url': recipe[3]
          #  })
   
    name = request.json.get("search")
    if name.lower() == "stone":
        name = "%"
 
    name.replace('%', '\\%').replace('_', '\\_')
    
    words = name.split()
    mincal = request.json.get("minCal")
    if mincal:
        mincal = int(mincal)
    maxcal = request.json.get("maxCal")
    if maxcal:
        maxcal = int(maxcal)
    mincarb = request.json.get("minCarb")
    if mincarb:
        mincarb = int(mincarb)
    maxcarb = request.json.get("maxCarb")
    if maxcarb:
        maxcarb = int(maxcarb)
    minfat = request.json.get("minFat")
    if minfat:
        minfat = int(minfat)
    maxfat = request.json.get("maxFat")
    if maxfat:
        maxfat = int(maxfat)
    minpro = request.json.get("minProtein")
    if minpro:
        minpro = int(minpro)
    maxpro = request.json.get("maxProtein")
    if maxpro:
        maxpro = int(maxpro)


    querylist = []
    wherelist = []
    leta = []
    letb = []
    x=0
    args = []
    if len(words) > 1:
        for word in words:
            leta.append(chr(ord('a') + x))
            querylist.append("(SELECT * FROM Recipe_new WHERE name LIKE '%{}%' ){}")
            args.append(word)
            args.append(leta[x])
            x+=1
        for i in range(1,x):
            leta = chr(ord('a') + i-1)
            letb = chr(ord('a') + i)
            wherelist.append(f" {leta}.name = {letb}.name ")

        query = "SELECT a.* FROM "+", ".join(querylist)+" WHERE"
        where = " AND ".join(wherelist)
        query = query + where
    elif len(words) == 1:
        word = name
        args.append(words[0])
        query = "SELECT * FROM Recipe_new WHERE name like '%{}%' "
    else: 
        query = ""
 
    if mincal or maxcal or mincarb or maxcarb or minfat or maxfat or minpro or maxpro:
        where = []
        if query:
            query = "SELECT * FROM (" +query+ ")rec WHERE "
        else:
            query = "SELECT * FROM Recipe_new WHERE "
        if mincal:
            where.append("calories > {}")
            args.append(mincal)
        if maxcal:
            where.append("calories < {}")
            args.append(maxcal)
        if mincarb:
            where.append("carbs > {}")
            args.append(mincarb)
        if maxcarb:
            where.append("carbs < {}")
            args.append(maxcarb)
        if maxfat:
            where.append("fat < {}")
            args.append(maxfat)
        if minfat:
            where.append("fat > {}")
            args.append(minfat)
        if minpro:
            where.append("protein > {}")
            args.append(minpro)
        if maxpro:
            where.append("protein < {}")
            args.append(maxpro)
        W = " AND ".join(where)
        query = query + W        
    if query:
        fquery = "SELECT name, category, url, img_url FROM (" + query + ") name"
    else:
        fquery = ""
    if ing:
        if fquery:
            fquery = "SELECT DISTINCT * FROM " + "("+ ingquery+") ing"+ "," + "("+fquery+") name" + " WHERE ing.name = name.name "
            args = ingargs + args
        else:
            fquery = ingquery
            args = ingargs
    a = tuple(args)
    q = " LIMIT 100"
    fquery+= q
    print(fquery.format(*a)) 
    curs = conn.cursor()
    curs.execute(fquery.format(*a))
    recs = curs.fetchall()
    curs.close()
    recipes = []
    for recipe in recs:
        recipes.append({
            'name': recipe[0],
            'category': recipe[1],
            'url': recipe[2],
            'img_url': recipe[3]
        })

    return {'recipes': recipes, 'message': f'{len(recipes)} recipes returned'}

        

@app.route("/api/search/ingredient", methods=['POST'])
def usr_recommend():
    '''Recommendation System'''

    if not request.json or 'search' not in request.json:
        return {'message': 'application/json format required'}, 400

    conn = mysql.connection
    if not conn:
        return {'message': 'The database is not available'}, 400


    recipes  = request.json.get("recipes") ##need recipe id list
    inglist = []
    
    query = "SELECT DISTINCT ingredient_id FROM MadeWidth WHERE recipe_id = %d"
    wherelist = []
    recarglist = []
    for rid in recipes:
        wherelist.append("%d")
        recarglist.append(rid)
    
    where = "OR recipe_id = ".join(wherelist)
    query = query + where
    curs = conn.cursor()
    curs.execute(query, tuple(recarglist))
    ing_id  = curs.fetchall()
    cur.close()
    
    query = "Select ingredient_id, count(*) from MadeWith where ingredient_id = %d"
    wherelist = []
    ing_idlist = []
    for ing in ing_id:
        wherelist.append("%d")
        ing_idlist.append(ing)
    where = "OR ingredient_id = ".join(wherelist)
    query = query + where
    query = 'SELECT * FROM (' + query + " Group by ingredient_id)a, Where a.count(*) > 10"
    curs = conn.cursor()
    curs.execute(query, tuple(ing_idlist))
    ings_to_use = curs.fetchall()
    print(ing_to_use)
        
    
    
     #GET CALORIE GOAL
    calgoal = 2800
    progoal = 80


    Bcal_low = 0.25 * calgoal
    Bcal_high = 0.30 * calgoal
    Lcal_low = 0.35 * calgoal
    Lcal_high = 0.40 *calgoal
    Scal_low = 0.05 * calgoal
    Scal_high = 0.10 * calgoal
    Dcal_low = 0.25 * calgoal
    Dcal_high = 0.30 *calgoal
    

    Bpro_low = 0.25 * progoal
    Bpro_high = 0.30 * progoal
    Lpro_low = 0.35 * progoal
    Lpro_high = 0.40 *progoal
    Spro_low = 0.05 * progoal
    Spro_high = 0.10 * progoal
    Dpro_low = 0.25 * progoal
    Dpro_high = 0.30 *progoal

    
    test = list(recs[:])
    print(len(recs))
    x = 0
    for rec in test: 
        if rec[4] == None:
            test.pop(x)
            x = x+1
            continue
        print("val:",rec[4])
        if rec[1] == "Breakfast":
            if rec[4] < Bcal_low or rec[4] > Bcal_high:
                test.pop(x)
        elif rec[1] == "Lunch":
            if rec[4] < Lcal_low or rec[4] > Lcal_high:
                test.pop(x)

        elif rec[1] == "Dinner":
            if rec[4] < Dcal_low or rec[4] > Dcal_high:
                ex = test.pop(x)
                print(ex)

        else:
            if rec[4] < Scal_low or rec[4] > Scal_high:
                test.pop(x)
        x = x+1
    #if len(test) > 0:
    recs = test[:]

    test = list(recs[:])
    print(len(recs))
    x = 0
    for rec in test:
        if rec[5] == None:
            test.pop(x)
            x = x+1
            continue
        print("val:", rec[5])
        if rec[1] == "Breakfast":
            if rec[5] < Bro_low or rec[5] > Bpro_high:
                test.pop(x)
        elif rec[1] == "Lunch":
            if rec[5] < Lpro_low or rec[5] > Lpro_high:
                test.pop(x)

        elif rec[1] == "Dinner":
            if rec[5] < Dpro_low or rec[5] > Dpro_high:
                ex = test.pop(x)
                print(ex)

        else:
            if rec[5] < Spro_low or rec[5] > Spro_high:
                test.pop(x)
        x = x+1
   # if len(test) > 0:
    recs = test[:]
    print(len(recs))
    print(recs)

    
     
    return {'message': 'Not implemented'}, 400
                


if __name__ == '__main__':
    app.run(debug=True, port=5053, host='db8.cse.nd.edu')
