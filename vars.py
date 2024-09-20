from flask import url_for


def get_cards_data(app):
    with app.app_context():
        return [
            {
                "image": url_for("static", filename="images/memory-cards/chili.png"),
                "name": "chili",
            },
            {
                "image": url_for("static", filename="images/memory-cards/grapes.png"),
                "name": "grapes",
            },
            {
                "image": url_for("static", filename="images/memory-cards/lemon.png"),
                "name": "lemon",
            },
            {
                "image": url_for("static", filename="images/memory-cards/orange.png"),
                "name": "orange",
            },
            {
                "image": url_for(
                    "static", filename="images/memory-cards/pineapple.png"
                ),
                "name": "pineapple",
            },
            {
                "image": url_for(
                    "static", filename="images/memory-cards/strawberry.png"
                ),
                "name": "strawberry",
            },
            {
                "image": url_for("static", filename="images/memory-cards/tomato.png"),
                "name": "tomato",
            },
            {
                "image": url_for(
                    "static", filename="images/memory-cards/watermelon.png"
                ),
                "name": "watermelon",
            },
            {
                "image": url_for("static", filename="images/memory-cards/cherries.png"),
                "name": "cherries",
            },
        ]


def get_images_data(app):
    with app.app_context():  # Push the app context manually
        return [
            {
                "name": "Memes",
                "searches": 1200000,
                "image": url_for("static", filename="images/higher-lower/meme.jpg"),
            },
            {
                "name": "Cats",
                "searches": 500000,
                "image": url_for("static", filename="images/higher-lower/cats.jpg"),
            },
            {
                "name": "Dogs",
                "searches": 800000,
                "image": url_for("static", filename="images/higher-lower/dogs.jpg"),
            },
            {
                "name": "Football",
                "searches": 1200000,
                "image": url_for("static", filename="images/higher-lower/football.jpg"),
            },
            {
                "name": "Pizza",
                "searches": 600000,
                "image": url_for("static", filename="images/higher-lower/pizza.jpg"),
            },
            {
                "name": "Movies",
                "searches": 900000,
                "image": url_for("static", filename="images/higher-lower/movies.jpg"),
            },
            {
                "name": "Music",
                "searches": 1100000,
                "image": url_for("static", filename="images/higher-lower/music.jpg"),
            },
            {
                "name": "Games",
                "searches": 1000000,
                "image": url_for("static", filename="images/higher-lower/games.jpg"),
            },
            {
                "name": "Cars",
                "searches": 700000,
                "image": url_for("static", filename="images/higher-lower/cars.jpg"),
            },
            {
                "name": "Phones",
                "searches": 950000,
                "image": url_for("static", filename="images/higher-lower/phones.jpg"),
            },
            {
                "name": "Fashion",
                "searches": 850000,
                "image": url_for("static", filename="images/higher-lower/fashion.jpg"),
            },
            {
                "name": "Travel",
                "searches": 900000,
                "image": url_for("static", filename="images/higher-lower/travel.jpg"),
            },
            {
                "name": "Fitness",
                "searches": 750000,
                "image": url_for("static", filename="images/higher-lower/fitness.jpg"),
            },
            {
                "name": "Technology",
                "searches": 1000000,
                "image": url_for(
                    "static", filename="images/higher-lower/technology.jpg"
                ),
            },
            {
                "name": "Nature",
                "searches": 500000,
                "image": url_for("static", filename="images/higher-lower/nature.jpg"),
            },
            {
                "name": "Space",
                "searches": 650000,
                "image": url_for("static", filename="images/higher-lower/space.jpg"),
            },
            {
                "name": "History",
                "searches": 300000,
                "image": url_for("static", filename="images/higher-lower/history.jpg"),
            },
            {
                "name": "Art",
                "searches": 400000,
                "image": url_for("static", filename="images/higher-lower/art.jpg"),
            },
            {
                "name": "Cooking",
                "searches": 700000,
                "image": url_for("static", filename="images/higher-lower/cooking.jpg"),
            },
            {
                "name": "Sports",
                "searches": 1050000,
                "image": url_for("static", filename="images/higher-lower/sports.jpg"),
            },
            {
                "name": "Science",
                "searches": 600000,
                "image": url_for("static", filename="images/higher-lower/science.jpg"),
            },
            {
                "name": "Photography",
                "searches": 800000,
                "image": url_for(
                    "static", filename="images/higher-lower/photography.jpg"
                ),
            },
            {
                "name": "Books",
                "searches": 550000,
                "image": url_for("static", filename="images/higher-lower/books.jpg"),
            },
            {
                "name": "Anime",
                "searches": 900000,
                "image": url_for("static", filename="images/higher-lower/anime.jpg"),
            },
            {
                "name": "Hiking",
                "searches": 650000,
                "image": url_for("static", filename="images/higher-lower/hiking.jpg"),
            },
        ]


def get_picmatch_data(app):
    with app.app_context():
        return [
            {
                "name": "Image_1",
                "image": url_for(
                    "static", filename="images/match-image/img_1.jpg", _external=True
                ),
            },
            {
                "name": "Image_2",
                "image": url_for(
                    "static", filename="images/match-image/img_2.jpg", _external=True
                ),
            },
            {
                "name": "Image_3",
                "image": url_for(
                    "static", filename="images/match-image/img_3.jpg", _external=True
                ),
            },
            {
                "name": "Image_4",
                "image": url_for(
                    "static", filename="images/match-image/img_4.jpg", _external=True
                ),
            },
            {
                "name": "Image_5",
                "image": url_for(
                    "static", filename="images/match-image/img_5.jpg", _external=True
                ),
            },
            {
                "name": "Image_6",
                "image": url_for(
                    "static", filename="images/match-image/img_6.jpg", _external=True
                ),
            },
            {
                "name": "Image_7",
                "image": url_for(
                    "static", filename="images/match-image/img_7.jpg", _external=True
                ),
            },
            {
                "name": "Image_8",
                "image": url_for(
                    "static", filename="images/match-image/img_8.jpg", _external=True
                ),
            },
            {
                "name": "Image_9",
                "image": url_for(
                    "static", filename="images/match-image/img_9.jpg", _external=True
                ),
            },
            {
                "name": "Image_10",
                "image": url_for(
                    "static", filename="images/match-image/img_10.jpg", _external=True
                ),
            },
            {
                "name": "Image_11",
                "image": url_for(
                    "static", filename="images/match-image/img_11.jpg", _external=True
                ),
            },
            {
                "name": "Image_12",
                "image": url_for(
                    "static", filename="images/match-image/img_12.jpg", _external=True
                ),
            },
            {
                "name": "Image_13",
                "image": url_for(
                    "static", filename="images/match-image/img_13.jpg", _external=True
                ),
            },
            {
                "name": "Image_14",
                "image": url_for(
                    "static", filename="images/match-image/img_14.jpg", _external=True
                ),
            },
            {
                "name": "Image_15",
                "image": url_for(
                    "static", filename="images/match-image/img_15.jpg", _external=True
                ),
            },
        ]
