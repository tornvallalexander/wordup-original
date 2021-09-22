from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, EqualTo, Length, ValidationError
from passlib.hash import pbkdf2_sha256
from models import User


# writing outside for other use than just in one class
# flaskform will automatically pass in these arg depend. on where being called
def invalid_credentials(form, field):
    """ Username and password checker """

    username_entered = form.username.data
    password_entered = field.data

    user_object = User.query.filter_by(username=username_entered).first()
    if user_object is None:
        raise ValidationError("Username or password is incorrect")
    elif not pbkdf2_sha256.verify(password_entered, user_object.password):
        raise ValidationError("Username or password is incorrect")

class RegistraitionForm(FlaskForm):

    """ Registration form """

    email = StringField("email_label", validators=[InputRequired(message="Email required.", )])
    username = StringField("username_label", validators=[InputRequired(message="Username required."), Length(min=5, max=25, message="Username must be between 5 and 25 characters.")])
    password = PasswordField("password_label", validators=[InputRequired(message="Password required."), Length(min=5, max=25, message="Password must be between 5 and 25 characters.")])
    confirm_pswd = PasswordField("confirm_pswd_label", validators=[InputRequired(message="You must confirm your password"), EqualTo("password", message="Passwords must match.")])
    submit_button = SubmitField("Create Account")

    def validate_username(self, username):
        user_object_username = User.query.filter_by(username=username.data).first()
        # user_object_email = User.query.filter_by(email=email.data).first()
        if user_object_username:
            raise ValidationError("Username already exists. Select a different username.")
        # if user_object_email:
        #     raise ValidationError("Username or email already exists. Select a different username or email!")
        # if user_object_email:
        #     raise ValidationError("Email already exists. Select a different email address.")

    def validate_email(self, email):
        user_object_email = User.query.filter_by(email=email.data).first()

        if user_object_email:
            raise ValidationError("Email already exists. Select a different email.")


class LoginForm(FlaskForm):

    username = StringField("username_label", validators=[InputRequired(message="Username required!")])
    password = PasswordField("password_label", validators=[InputRequired(message="Password Required"), invalid_credentials])

    submit_button = SubmitField("Login")


