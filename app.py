from flask import Flask, request, render_template, redirect, url_for, flash
from flask_login import LoginManager, login_user, current_user, login_required, logout_user
import os

from wtform_fields import *
from models import * 

app = Flask(__name__)
app.secret_key = "replace later"
# os.environ.get("SECRET")
# os.environ.get("DATABASE_URL")

app.config['SQLALCHEMY_DATABASE_URI'] = "postgres://ezrnloowpqwkvk:e8446020c86d2ccba0c2bd7f52506321bbdd72562c98656596bfdc1e57168d7e@ec2-54-75-245-196.eu-west-1.compute.amazonaws.com:5432/d82lihl9tn37t1"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


# Configure flask login
login = LoginManager(app)
login.init_app(app)


@app.errorhandler(404)
def page_not_found(e):
    return render_template(("404.html"))


@login.user_loader
def load_user(id):
    return User.query.get(int(id))


@app.route("/", methods=["GET", "POST"])
def index():
    return render_template("index.html")


@app.route("/register", methods=["POST", "GET"])
def register():
    reg_form = RegistraitionForm()
    if reg_form.validate_on_submit():
        email = reg_form.email.data
        username = reg_form.username.data
        password = reg_form.password.data

        # hash the password
        hashed_pswd = pbkdf2_sha256.hash(password)

        user = User(email=email, username=username, password=hashed_pswd)
        db.session.add(user)
        db.session.commit()

        return redirect(url_for("login")) 

    return render_template("register.html", form=reg_form)


@app.route("/login", methods=["POST", "GET"])
def login():

    if current_user.is_authenticated:
        flash("Already loggd in!", "success")
        return redirect(url_for("typing"))
    else:
        login_form = LoginForm()
        if login_form.validate_on_submit():
            user_object = User.query.filter_by(username=login_form.username.data).first()
            login_user(user_object)
            user_current = current_user.username
            flash("You have now been logged in!", "success")
            return redirect(url_for("typing"))

        return render_template("login.html", form=login_form)


@app.route("/typing", methods=["POST", "GET"])
def typing():
    if not current_user.is_authenticated:
        flash("Not logged in.", "danger")
        return redirect(url_for("login"))
    return render_template("typing.html", username=current_user.username)


@app.route("/logout")
def logout():
    if not current_user.is_authenticated:
        flash("You were never logged in!", "success")
        return redirect(url_for("login"))
    else:
        logout_user()
        flash("You have now been logged out", "success")
        return redirect(url_for("login"))


if __name__ == "__main__":
    app.run(debug=True)
