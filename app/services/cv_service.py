from sqlalchemy.orm import Session, joinedload

from app.database.models.cv import CV, CVExperience, CVEducation, CVSkill, CVLanguage, CVProject
from app.database.schemas.cv import CVCreate, CVUpdate
from app.core.encryption import encrypt, decrypt


def _encrypt_cv_fields(data: dict) -> dict:
    for field in ("email", "telefono"):
        if data.get(field):
            data[field] = encrypt(data[field])
    return data


def _decrypt_cv(cv: CV) -> CV:
    if cv.email:
        cv.email = decrypt(cv.email)
    if cv.telefono:
        cv.telefono = decrypt(cv.telefono)
    return cv


def create_cv(db: Session, user_id: int, data: CVCreate) -> CV:
    fields = data.model_dump(exclude={"experiencias", "educaciones", "habilidades", "idiomas", "proyectos"})
    fields = _encrypt_cv_fields(fields)

    cv = CV(user_id=user_id, **fields)
    db.add(cv)
    db.flush()

    for proyecto in data.proyectos:
        db.add(CVProject(cv_id=cv.id, **proyecto.model_dump()))
    for exp in data.experiencias:
        db.add(CVExperience(cv_id=cv.id, **exp.model_dump()))

    for edu in data.educaciones:
        db.add(CVEducation(cv_id=cv.id, **edu.model_dump()))

    for skill in data.habilidades:
        db.add(CVSkill(cv_id=cv.id, **skill.model_dump()))

    for lang in data.idiomas:
        db.add(CVLanguage(cv_id=cv.id, **lang.model_dump()))

    db.commit()
    db.refresh(cv)
    return _decrypt_cv(cv)


def get_cv(db: Session, cv_id: int, user_id: int) -> CV | None:
    cv = db.query(CV).options(
        joinedload(CV.experiencias),
        joinedload(CV.educaciones),
        joinedload(CV.habilidades),
        joinedload(CV.idiomas),
        joinedload(CV.proyectos)
    ).filter(CV.id == cv_id, CV.user_id == user_id).first()
    if cv:
        return _decrypt_cv(cv)
    return None


def get_cvs_by_user(db: Session, user_id: int) -> list[CV]:
    cvs = db.query(CV).filter(CV.user_id == user_id).all()
    return [_decrypt_cv(cv) for cv in cvs]


def update_cv(db: Session, cv_id: int, user_id: int, data: CVUpdate) -> CV | None:
    cv = db.query(CV).filter(CV.id == cv_id, CV.user_id == user_id).first()
    if not cv:
        return None

    simple_fields = [
        "nombre", "apellidos", "email", "telefono", "ciudad",
        "linkedin", "github", "web", "foto_url",
        "titulo_profesional", "resumen"
    ]
    for field in simple_fields:
        value = getattr(data, field)
        if value is not None:
            if field in ("email", "telefono"):
                value = encrypt(value)
            setattr(cv, field, value)

    if data.proyectos is not None:
        for proyecto in cv.proyectos:
            db.delete(proyecto)
        for proyecto in data.proyectos:
            db.add(CVProject(cv_id=cv.id, **proyecto.model_dump()))

    if data.experiencias is not None:
        for exp in cv.experiencias:
            db.delete(exp)
        for exp in data.experiencias:
            db.add(CVExperience(cv_id=cv.id, **exp.model_dump()))

    if data.educaciones is not None:
        for edu in cv.educaciones:
            db.delete(edu)
        for edu in data.educaciones:
            db.add(CVEducation(cv_id=cv.id, **edu.model_dump()))

    if data.habilidades is not None:
        for skill in cv.habilidades:
            db.delete(skill)
        for skill in data.habilidades:
            db.add(CVSkill(cv_id=cv.id, **skill.model_dump()))

    if data.idiomas is not None:
        for lang in cv.idiomas:
            db.delete(lang)
        for lang in data.idiomas:
            db.add(CVLanguage(cv_id=cv.id, **lang.model_dump()))

    db.commit()
    db.refresh(cv)
    return _decrypt_cv(cv)


def delete_cv(db: Session, cv_id: int, user_id: int) -> bool:
    cv = db.query(CV).filter(CV.id == cv_id, CV.user_id == user_id).first()
    if not cv:
        return False
    db.delete(cv)
    db.commit()
    return True