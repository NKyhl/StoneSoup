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

@app.route("/")
def landing():
    return app.send_static_file('index.html')

@app.route("/home")
def home():
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
                ingquery = ("SELECT id FROM Ingredient WHERE name LIKE '%{}%'")
                ingquery = "("+ingquery+") ing"
                ingquery = ("(SELECT recipe_id FROM "+ingquery+", MadeWith m WHERE m.ingredient_id = ing.id) {}")
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
            ingquery = ("SELECT id FROM Ingredient WHERE name LIKE '%{}%'")
            ingquery = "("+ingquery+") ing"
            ingquery = "(SELECT recipe_id FROM "+ingquery+", MadeWith m WHERE m.ingredient_id = ing.id) id"
            ingargs.append(ingwords[0])
        ingquery = "SELECT * FROM Recipe, "+ingquery+" WHERE Recipe.id = id.recipe_id"
    

        ingquery = "SELECT name, category, url, img_url FROM (" + ingquery + ")ing"
   
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
            querylist.append("(SELECT * FROM Recipe WHERE name LIKE '%{}%' ){}")
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
        query = "SELECT * FROM Recipe WHERE name like '%{}%' "
    else: 
        query = ""
 
    if mincal or maxcal or mincarb or maxcarb or minfat or maxfat or minpro or maxpro:
        where = []
        if query:
            query = "SELECT * FROM (" +query+ ")rec WHERE "
        else:
            query = "SELECT * FROM Recipe WHERE "
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
        fquery = "SELECT id, name, category, yield, calories, protein, fat, carbs, prep_time, cook_time, total_time, img_url, url FROM (" + query + ") name"
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
        })

    return {'recipes': recipes, 'message': f'{len(recipes)} recipes returned'}

        

@app.route("/api/recommend", methods=['POST'])
def usr_recommend():
    '''Recommendation System'''

    if not request.json or 'search' not in request.json:
        return {'message': 'application/json format required'}, 400

    conn = mysql.connection
    if not conn:
        return {'message': 'The database is not available'}, 400

    recipes  = request.json.get("search")  # list of recipe ids
    recipes = recipes.split()

    calgoal = request.json.get("cal_goal")
    progoal = request.json.get("protein_goal")

    if not recipes:
        return {'message': "'search' required"}

    inglist = []
    
    # Get ingredients from given recipes
    query = "SELECT DISTINCT ingredient_id FROM MadeWith WHERE recipe_id = "
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
 
    # Only consider ingredients that show up in more than 1 recipe
    query = "Select ingredient_id, count(*) matches from MadeWith where ingredient_id = "
    wherelist = []
    ing_idlist = []
    for ing in ing_id:
        wherelist.append("%s")
        ing_idlist.append(ing[0])
    where = " OR ingredient_id = ".join(wherelist)
    query = query + where
    query = 'SELECT * FROM (' + query + " group by ingredient_id)a Where a.matches  > 1"

    curs.execute(query, tuple(ing_idlist))
    ing_to_use = curs.fetchall()
    inglist = []
    for ing in ing_to_use:
        inglist.append(ing[0])

 
    # Find recommendations
    query = ''
    recs = ()
    run_count = 0
    while run_count < 15 and len(recs) < 20:
        run_count += 1

        # Choose 3 random ingredients
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
        
        query = "(SELECT recipe_id FROM MadeWith where ingredient_id = %s AND optional = 0)" 
        query =  query + 'a, ' + query + 'b, ' + query + 'c ' #+ query + 'd '
        query = "(Select Distinct a.recipe_id FROM " + query + "where a.recipe_id = b.recipe_id AND b.recipe_id = c.recipe_id) b " #AND c.recipe_id = d.recipe_id ) b "
        query = "SELECT r.id, r.name, r.category, r.yield,  r.calories, r.protein, r.fat, r.carbs, r.prep_time, r.cook_time, r.total_time, r.img_url, r.url  FROM Recipe r," + query + "where b.recipe_id = r.id"


        curs.execute(query, ingargs)
        rec = curs.fetchall()

        recs += tuple(r for r in rec if r not in recs)
    
    curs.close()

    # Filter results by calorie goals
    if calgoal:
        calgoal = float(progoal)
        Bcal_low = 0.25 * calgoal
        Bcal_high = 0.30 * calgoal
        Lcal_low = 0.35 * calgoal
        Lcal_high = 0.40 *calgoal
        Scal_low = 0.05 * calgoal
        Scal_high = 0.10 * calgoal
        Dcal_low = 0.25 * calgoal
        Dcal_high = 0.30 *calgoal
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

    # Filter results by Protein goals
    if progoal:
        progoal = float(progoal)
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
            })
 
    return {'recipes': recipes, 'message': f'{len(recipes)} recipes returned'}
            
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
            'breakfast': {'id': meals[4*i+0]} if 4*i+0 < len(meals) else None,
            'lunch':     {'id': meals[4*i+1]} if 4*i+1 < len(meals) else None,
            'dinner':    {'id': meals[4*i+2]} if 4*i+2 < len(meals) else None,
            'extra':     {'id': meals[4*i+3]} if 4*i+3 < len(meals) else None
        }

    # Get meta-data for each recipe
    for day in days:
        for slot in slots:
            # Avoid slots without a recipe
            s = result['plan'][day][slot]
            if s is None:
                continue

            # Query DB for meta-data
            recipe = get_recipe(s['id'])
            
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


    recipes = request.json.get("recipe_ids")

    if not recipes:
        return {'message': 'recipe_id not included'}, 400

    recipes = recipes.split()

    inglist = []
    
    # Get ingredients from given recipes
    query = "SELECT DISTINCT ingredient_id, quantity, quantity_type, style, optional FROM MadeWith WHERE recipe_id = "
    wherelist = []
    recarglist = []
    for rid in recipes:
        wherelist.append("%s")
        recarglist.append(rid)
    
    where = " OR recipe_id = ".join(wherelist)
    query = query + where
    query = "Select i.name, m.quantity, m.quantity_type, m.style, m.optional From Ingredient i, (" + query + ") m WHERE i.id = m.ingredient_id"
    curs = conn.cursor()
    curs.execute(query, tuple(recarglist))
    ing_id  = curs.fetchall()
    data = {
        "ingredients": []
    }
    for result in ing_id:
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

