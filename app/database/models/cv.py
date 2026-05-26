from datetime import date
from typing import Optional

from sqlalchemy import String, Text, ForeignKey, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base

class CV(Base):
    __tablename__="cvs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    # DATOS PERSONALES
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    apellidos: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    telefono: Mapped[str] = mapped_column(String(100), nullable=False)
    ciudad: Mapped[str] = mapped_column(String(100), nullable=False)
    linkedin: Mapped[Optional[str]] = mapped_column(String(255), nullable=False)
    github: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    web: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    foto_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    # PERFIL LABORAL
    titulo_profesional: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    resumen: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # RELACIONES
    experiencias: Mapped[list["CVExperience"]] = relationship(
        back_populates="cv", cascade="all, delete-orphan"
    )
    educaciones: Mapped[list["CVEducation"]] = relationship(
        back_populates="cv", cascade="all, delete-orphan"
    )
    habilidades: Mapped[list["CVSkill"]] = relationship(
        back_populates="cv", cascade="all, delete-orphan"
    )
    idiomas: Mapped[list["CVLanguage"]] = relationship(
        back_populates="cv", cascade="all, delete-orphan"
    )


class CVExperience(Base):
    __tablename__ = "cv_experiences"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    cv_id: Mapped[int] = mapped_column(ForeignKey("cvs.id"), nullable=False)

    empresa: Mapped[str] = mapped_column(String(150), nullable=False)
    cargo: Mapped[str] = mapped_column(String(150), nullable=False)
    fecha_inicio: Mapped[date] = mapped_column(Date, nullable=False)
    fecha_fin: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    descripcion: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    cv: Mapped["CV"] = relationship(back_populates="experiencias")


class CVEducation(Base):
    __tablename__="cv_educations"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    cv_id: Mapped[int] = mapped_column(ForeignKey("cvs.id"), nullable=False)

    institucion: Mapped[str] = mapped_column(String(150), nullable=False)
    titulo: Mapped[str] = mapped_column(String(150), nullable=False)
    fecha_inicio: Mapped[date] = mapped_column(Date, nullable=False)
    fecha_fin: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    descripcion: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    cv: Mapped["CV"] = relationship(back_populates="educaciones")


class CVSkill(Base):
    __tablename__="cv_skills"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    cv_id: Mapped[int] = mapped_column(ForeignKey("cvs.id"), nullable=False)

    nombre: Mapped[str] = mapped_column(String(100), nullable=False)

    cv: Mapped["CV"] = relationship(back_populates="habilidades")


class CVLanguage(Base):
    __tablename__="cv_languages"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    cv_id: Mapped[int] = mapped_column(ForeignKey("cvs.id"), nullable=False)

    idioma: Mapped[str] = mapped_column(String(100), nullable=False)
    nivel: Mapped[str] = mapped_column(String(50), nullable=False)

    cv: Mapped["CV"] = relationship(back_populates="idiomas")