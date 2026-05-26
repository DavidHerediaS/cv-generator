from sqlalchemy.orm import Session 

from app.database.models.user import User
from app.database.schemas.user import UserRegister
from app.core.security import hash_password, verify_password, create_access_token

def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()

def register_user(db: Session, data: UserRegister) -> User:
    existing = get_user_by_email(db, data.email)
    if existing:
        raise ValueError("El email ya está registrado")

    new_user = User(
        email=data.email,
        hashed_password=hash_password(data.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

def login_user(db: Session, email: str, password: str) -> str:
    user = authenticate_user(db, email, password)
    if not user:
        raise ValueError("Email o contraseña incorrectos")
    return create_access_token(subject=str(user.id))