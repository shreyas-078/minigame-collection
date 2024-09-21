from flask import (
    Flask,
    request,
    jsonify,
    render_template,
)
from bson import ObjectId
import os
from flask_pymongo import PyMongo
from dotenv import load_dotenv
from vars import get_images_data, get_cards_data, get_picmatch_data
import certifi
from flask_login import (
    LoginManager,
    UserMixin,
    login_user,
    login_required,
    current_user,
)
import uuid

# In-memory storage for demonstration; use a database in production
card_token_map = {}


def generate_token():
    return str(uuid.uuid4())


stages = {
    1: "wordle.html",
    2: "crossword.html",
    3: "quiz.html",
    4: "hangman.html",
    5: "higher-lower.html",
    6: "memory-card.html",
    7: "music-quiz.html",
    8: "hanoi.html",
    9: "pic-match.html",
    10: "impossible-tac-toe.html",
}

# Load the environment variables from the .env file
load_dotenv()

app = Flask(__name__, static_url_path="/static", static_folder="static")


# Get the SECRET_KEY from the environment file
app.secret_key = os.getenv("SECRET_KEY")
# Get the Mongo URI from the environment file
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
flask_env = os.getenv("FLASK_ENV", "production")
mongo = PyMongo(app, tlsCAFile=certifi.where())
db = mongo.db


login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "/"


class User(UserMixin):
    def __init__(self, user_id):
        self.user_id = user_id

    def get_id(self):
        return self.user_id


@login_manager.user_loader
def load_user(user_id):
    try:
        user = db.players.find_one({"_id": ObjectId(user_id)})
    except:
        return None

    if user:
        return User(str(user["_id"]))
    return None


@app.route("/fetch-cards", methods=["GET"])
def fetch_cards():
    card_templates = get_cards_data(app)
    cards = []
    global card_token_map  # Ensure card_token_map is accessible here
    card_token_map.clear()  # Clear any previous tokens

    for card in card_templates:
        token1 = generate_token()
        token2 = generate_token()
        while token1 == token2:  # Ensure tokens are unique
            token2 = generate_token()

        # Add both cards with unique tokens
        cards.append({"name": card["name"], "image": card["image"], "token": token1})
        cards.append({"name": card["name"], "image": card["image"], "token": token2})

        # Map tokens to card names
        card_token_map[token1] = card["name"]
        card_token_map[token2] = card["name"]

    return jsonify(cards)  # Return card data as JSON


@app.route("/check-match", methods=["POST"])
def check_match():
    selected_tokens = request.json["selected_tokens"]
    if len(selected_tokens) != 2:
        return jsonify(match=False)

    card_names = [card_token_map.get(token) for token in selected_tokens]
    match = card_names[0] == card_names[1]
    return jsonify(match=match)


@app.route("/fetch-images", methods=["GET"])
def fetch_images():
    topics = get_images_data(app)
    return jsonify(topics)


@app.route("/fetch-picmatch-images", methods=["GET"])
def fetch_picmatch_data():
    images = get_picmatch_data(app)
    return jsonify(images)


def check_stage_and_render(stage_num, template):
    current_stage = get_stage()
    if current_stage != "Player Not Found" and current_stage == stage_num:
        return render_template(template)
    else:
        return render_template("access-denied.html")


@app.route("/update-stage", methods=["POST"])
def update_stage():
    data = request.get_json()
    current_stage = data["curStage"]
    next_stage = int(current_stage) + 1
    db.players.update_one(
        {"_id": ObjectId(current_user.user_id)}, {"$set": {"stage": str(next_stage)}}
    )


# Get the player's current stage based on Name
@app.route("/stage", methods=["GET"])
def get_stage():
    player = db.players.find_one({"_id": ObjectId(current_user.user_id)})

    if player:
        return player["stage"]
    else:
        return "Player Not Found"


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data["username"]
    password = data["password"]
    user = db.players.find_one({"name": username})
    if user and user["password"] == password:
        login_user(User(str(user["_id"])))
        return jsonify({"stage": get_stage()})
    return jsonify({"error": "Invalid Credentials"})


@app.route("/stage1", methods=["GET"])
@login_required
def wordle():
    return check_stage_and_render("1", "wordle.html")


@app.route("/stage2", methods=["GET"])
@login_required
def crossword():
    return check_stage_and_render("2", "crossword.html")


@app.route("/no-access", methods=["GET"])
def denial():
    return render_template("access-denied.html")


@app.route("/stage3", methods=["GET"])
@login_required
def quiz():
    return check_stage_and_render("3", "quiz.html")


@app.route("/stage4", methods=["GET"])
@login_required
def hangman():
    return check_stage_and_render("4", "hangman.html")


@app.route("/stage5", methods=["GET"])
@login_required
def higher_lower():
    return check_stage_and_render("5", "higher-lower.html")


@app.route("/stage6", methods=["GET"])
def match_cards():
    return check_stage_and_render("6", "memory-card.html")


@app.route("/stage7", methods=["GET"])
@login_required
def music_quiz():
    return check_stage_and_render("7", "music-quiz.html")


@app.route("/stage8", methods=["GET"])
@login_required
def hanoi():
    return check_stage_and_render("8", "hanoi.html")


@app.route("/stage9", methods=["GET"])
@login_required
def pic_match():
    return check_stage_and_render("9", "pic-match.html")


@app.route("/stage10", methods=["GET"])
# @login_required
def impossible_tac_toe():
    return render_template("impossible-tac-toe.html")
    return check_stage_and_render("10", "impossible-tac-toe.html")


@app.route("/", methods=["GET"])
def intro():
    if current_user.is_authenticated:
        return render_template(stages[int(get_stage())])
    else:
        return render_template("intro.html")


@app.route("/create-profile", methods=["POST"])
def db_add_new_user():
    data = request.get_json()
    print(data)
    existing_user = db.players.find_one({"name": data["name"]})

    if existing_user:
        return jsonify({"error": "Name Already Exists"}), 409

    db.players.insert_one(
        {"name": data["name"], "password": data["password"], "stage": "1"}
    )
    return jsonify({"message": "Profile Created Successfully"})


@app.route("/new-user", methods=["GET"])
def new_user_creation():
    return render_template("create-profile.html")


@app.errorhandler(404)
def page_not_found(error):
    return render_template("404.html"), 404


@login_manager.unauthorized_handler
def unauthorized():
    # Redirect unauthorized users to DENIED
    return render_template("access-denied.html")


if __name__ == "__main__":
    if flask_env == "development":
        app.run("0.0.0.0", debug=True, port=7800)
    else:
        print("Production Mode.")
