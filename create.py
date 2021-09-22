from flask import Flask
from models import *
import os

app = Flask(__name__)

# os.environ.get('SQLALCHEMY_DATABASE_URL')

app.config['SQLALCHEMY_DATABASE_URI'] = "postgres://ezrnloowpqwkvk:e8446020c86d2ccba0c2bd7f52506321bbdd72562c98656596bfdc1e57168d7e@ec2-54-75-245-196.eu-west-1.compute.amazonaws.com:5432/d82lihl9tn37t1"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)


def main():
    db.create_all()


if __name__ == "__main__":
    with app.app_context():
        main()
