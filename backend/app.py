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
    query = "SELECT id, name, email, cal_goal, protein_goal, fat_goal, carb_goal, icon_id FROM User"

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
        id, name, email, cal_goal, protein_goal, fat_goal, carb_goal, icon_id = user_info
        response['id'] = id
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


    name = request.json.get("search")

    if not name:
        return {'message': 'Forbidden search'}, 400
    
    name.replace('%', '\\%').replace('_', '\\_')

    cursor = conn.cursor()
    cursor.execute("SELECT name, category, url, img_url FROM Recipe WHERE name like '%{}%' LIMIT 100".format(name))
    res = cursor.fetchall()
    if not res:
        return {'recipes': [], 'message': 'Error querying the database'}, 404
    
    recipes = []
    for recipe in res:
        recipes.append({
            'name': recipe[0],
            'category': recipe[1],
            'url': recipe[2],
            'img_url': recipe[3]
        })

    return {'recipes': recipes, 'message': f'{len(recipes)} recipes returned'}

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
    return {'message': 'Not implemented'}, 400

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
            
@app.route('/api/save/meal-plan', methods=['POST'])
def save_meal_plan():
    if not request.json:
        return {'message': 'application/json format required'}, 400

    conn = mysql.connection
    if not conn:
        return {'message': 'the database is not available'}, 400

    data = request.json

    user_id = data.get("user_id")
    start_date = data.get("start_date")
    plan = data.get("plan")

    if not user_id:
        return {'message': 'user_id required'}, 400
    if not start_date:
        return {'message': 'start_date required'}, 400
    if not plan:
        return {'message': 'plan required'}, 400
    
    # Validate start_date is of DATE type
    query = "SELECT WEEKOFYEAR(%s) IS NOT NULL"
    args = (start_date,)

    cursor = conn.cursor()
    cursor.execute(query, args)

    result = cursor.fetchone()[0]
    if not result:
        return {'message': 'invalid start_date'}, 400
    
    # Validate that user_id exists
    query = "SELECT COUNT(*) FROM User WHERE id = %s"
    args = (user_id,)

    cursor = conn.cursor()
    cursor.execute(query, args)

    result = cursor.fetchone()[0]
    if not result:
        return {'message': 'user_id does not exist'}, 400
    
    # See if a meal plan exists
    query = "SELECT COUNT(*) FROM SavedPlan WHERE user_id = %s and start_date = %s"
    args = (user_id, start_date)

    cursor = conn.cursor()
    cursor.execute(query, args)

    exists = cursor.fetchone()[0]

    # Format input information for query
    mon = plan.get("monday")
    tue = plan.get("tuesday")
    wed = plan.get("wednesday")
    thu = plan.get("thursday")
    fri = plan.get("friday")
    sat = plan.get("saturday")
    sun = plan.get("sunday")

    meals = []
    for day in (mon, tue, wed, thu, fri, sat, sun):
        if not day:
            meals.extend((None, None, None, None))
        else:
            meals.extend((
                day.get('breakfast'),
                day.get('lunch'),
                day.get('dinner'),
                day.get('extra')
            ))
    
    # Update or insert meal plan
    if exists:
        query = """
        UPDATE SavedPlan
        SET mon_breakfast = %s, mon_lunch = %s, mon_dinner = %s, mon_extra = %s, 
            tue_breakfast = %s, tue_lunch = %s, tue_dinner = %s, tue_extra = %s,
            wed_breakfast = %s, wed_lunch = %s, wed_dinner = %s, wed_extra = %s,
            thu_breakfast = %s, thu_lunch = %s, thu_dinner = %s, thu_extra = %s,
            fri_breakfast = %s, fri_lunch = %s, fri_dinner = %s, fri_extra = %s,
            sat_breakfast = %s, sat_lunch = %s, sat_dinner = %s, sat_extra = %s,
            sun_breakfast = %s, sun_lunch = %s, sun_dinner = %s, sun_extra = %s
        WHERE user_id = %s
          AND start_date = %s
        """
        args = tuple(meals + [user_id, start_date])

    else:
        query = """
        INSERT INTO SavedPlan (user_id, start_date, 
            mon_breakfast, mon_lunch, mon_dinner, mon_extra, 
            tue_breakfast, tue_lunch, tue_dinner, tue_extra,
            wed_breakfast, wed_lunch, wed_dinner, wed_extra,
            thu_breakfast, thu_lunch, thu_dinner, thu_extra,
            fri_breakfast, fri_lunch, fri_dinner, fri_extra,
            sat_breakfast, sat_lunch, sat_dinner, sat_extra,
            sun_breakfast, sun_lunch, sun_dinner, sun_extra
        )
        VALUES (
            %s, %s,
            %s, %s, %s, %s,
            %s, %s, %s, %s,
            %s, %s, %s, %s,
            %s, %s, %s, %s,
            %s, %s, %s, %s,
            %s, %s, %s, %s,
            %s, %s, %s, %s
        )
        """
        args = tuple([user_id, start_date] + meals)
    
    cursor.execute(query, args)

    conn.commit()
    cursor.close()

    return {'message': 'Meal plan saved'}, 200

@app.route('/api/get/meal-plan', methods=['POST'])
def get_meal_plan():
    if not request.json:
        return {'message': 'application/json format required'}, 400

    conn = mysql.connection
    if not conn:
        return {'message': 'the database is not available'}, 400

    data = request.json

    user_id = data.get("user_id")
    start_date = data.get("start_date")

    if not user_id:
        return {'message': 'user_id required'}, 400
    if not start_date:
        return {'message': 'start_date required'}, 400
    
    # Validate start_date is of DATE type
    query = "SELECT WEEKOFYEAR(%s) IS NOT NULL"
    args = (start_date,)

    cursor = conn.cursor()
    cursor.execute(query, args)

    result = cursor.fetchone()[0]
    if not result:
        return {'message': 'invalid start_date'}, 400
    
    # Validate that user_id exists
    query = "SELECT COUNT(*) FROM User WHERE id = %s"
    args = (user_id,)

    cursor.execute(query, args)

    result = cursor.fetchone()[0]
    if not result:
        return {'message': 'user_id does not exist'}, 400

    # Get meal plan
    query = """
    SELECT mon_breakfast, mon_lunch, mon_dinner, mon_extra, 
        tue_breakfast, tue_lunch, tue_dinner, tue_extra,
        wed_breakfast, wed_lunch, wed_dinner, wed_extra,
        thu_breakfast, thu_lunch, thu_dinner, thu_extra,
        fri_breakfast, fri_lunch, fri_dinner, fri_extra,
        sat_breakfast, sat_lunch, sat_dinner, sat_extra,
        sun_breakfast, sun_lunch, sun_dinner, sun_extra
    FROM SavedPlan
    WHERE user_id = %s
      AND start_date = %s
    """

    args = (user_id, start_date)
    
    cursor = conn.cursor()
    cursor.execute(query, args)

    meals = cursor.fetchone()
    cursor.close()
    
    result = {
        'user_id': user_id,
        'start_date': start_date,
    }

    if not meals:
        result['plan'] = None
        return result

    result['plan'] = {}
    days = ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')
    slots = ('breakfast', 'lunch', 'dinner', 'extra')

    for i, day in enumerate(days):
        result['plan'][day] = {
            'breakfast': {'id': (meals[4*i+0] if 4*i+0 < len(meals) else None)},
            'lunch':     {'id': (meals[4*i+1] if 4*i+1 < len(meals) else None)},
            'dinner':    {'id': (meals[4*i+2] if 4*i+2 < len(meals) else None)},
            'extra':     {'id': (meals[4*i+3] if 4*i+3 < len(meals) else None)}
        }

    # Get meta-data for each recipe
    for day in days:
        for slot in slots:
            # Avoid slots without a recipe
            rid = result['plan'][day][slot]['id']
            if rid is None:
                continue

            # Query DB for meta-data
            recipe = get_recipe(rid)
            
            result['plan'][day][slot] = recipe

    return result
    
def get_recipe(rid):
    conn = mysql.connection
    if not conn:
        return None

    query = """
    SELECT id, name, category, yield, 
        calories, protein, fat, carbs,
        prep_time, cook_time, total_time,
        img_url, url
    FROM Recipe
    WHERE id = %s
    """
    
    cursor = conn.cursor()
    cursor.execute(query, (rid,))

    recipe = cursor.fetchone()

    return {
        'id':           recipe[0],
        'name':         recipe[1],
        'category':     recipe[2],
        'yield':        recipe[3],
        'calories':     recipe[4],
        'protein':      recipe[5],
        'fat':          recipe[6],
        'carbs':        recipe[7],
        'prep_time':    recipe[8],
        'cook_time':    recipe[9],
        'total_time':   recipe[10],
        'img_url':      recipe[11],
        'url':          recipe[12]
    } if recipe and len(recipe) == 13 else None

@app.route("/api/get/ingredients", methods=['POST'])
def get_ingredients():
    '''Return ingredient information for a given recipe.'''

    if not request.json:
        return {'message': 'application/json format required'}, 400

    conn = mysql.connection
    if not conn:
        return {'message': 'The database is not available'}, 400


    recipe_id = request.json.get("recipe_id")

    if not recipe_id:
        return {'message': 'recipe_id not included'}, 400

    query = "SELECT i.name, quantity, quantity_type, style, optional FROM Ingredient i, MadeWith mw, Recipe r WHERE r.id = mw.recipe_id AND i.id = mw.ingredient_id AND mw.recipe_id = %s"
    args = (recipe_id,)

    cursor = conn.cursor()
    cursor.execute(query, args)

    results = cursor.fetchall()
    cursor.close()

    data = {'ingredients': []}
    for result in results:
        data['ingredients'].append(
            {
                'name': result[0],
                'quantity': result[1],
                'quantity_type': result[2],
                'style': result[3],
                'optional': result[4] 
            }
        )

    return data

if __name__ == '__main__':
    app.run(debug=True, port=5036, host='db8.cse.nd.edu')
