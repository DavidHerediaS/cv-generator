from pydantic import BaseModel
from datetime import date


# --- Experiencia ---
class ExperienceBase(BaseModel):
    empresa: str
    cargo: str
    fecha_inicio: date
    fecha_fin: date | None = None
    descripcion: str | None = None

class ExperienceCreate(ExperienceBase):
    pass

class ExperienceResponse(ExperienceBase):
    id: int
    model_config = {"from_attributes": True}


# --- Educación ---
class EducationBase(BaseModel):
    institucion: str
    titulo: str
    fecha_inicio: date
    fecha_fin: date | None = None
    descripcion: str | None = None

class EducationCreate(EducationBase):
    pass

class EducationResponse(EducationBase):
    id: int
    model_config = {"from_attributes": True}


# --- Habilidad ---
class SkillBase(BaseModel):
    nombre: str

class SkillCreate(SkillBase):
    pass

class SkillResponse(SkillBase):
    id: int
    model_config = {"from_attributes": True}


# --- Idioma ---
class LanguageBase(BaseModel):
    idioma: str
    nivel: str

class LanguageCreate(LanguageBase):
    pass

class LanguageResponse(LanguageBase):
    id: int
    model_config = {"from_attributes": True}


# --- PROYECTO ---
class ProjectBase(BaseModel):
    nombre: str | None = None
    descripcion: str | None = None
    tecnologias: str | None = None
    url: str | None = None

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int
    model_config = {"from_attributes": True}


# --- CV ---
class CVCreate(BaseModel):
    nombre: str
    apellidos: str
    email: str
    telefono: str
    ciudad: str
    linkedin: str | None = None
    github: str | None = None
    web: str | None = None
    foto_url: str | None = None
    titulo_profesional: str | None = None
    resumen: str | None = None
    proyectos: list[ProjectCreate] = []
    experiencias: list[ExperienceCreate] = []
    educaciones: list[EducationCreate] = []
    habilidades: list[SkillCreate] = []
    idiomas: list[LanguageCreate] = []


class CVUpdate(BaseModel):
    nombre: str | None = None
    apellidos: str | None = None
    email: str | None = None
    telefono: str | None = None
    ciudad: str | None = None
    linkedin: str | None = None
    github: str | None = None
    web: str | None = None
    foto_url: str | None = None
    titulo_profesional: str | None = None
    resumen: str | None = None
    proyectos: list[ProjectCreate] | None = None
    experiencias: list[ExperienceCreate] | None = None
    educaciones: list[EducationCreate] | None = None
    habilidades: list[SkillCreate] | None = None
    idiomas: list[LanguageCreate] | None = None


class CVResponse(BaseModel):
    id: int
    user_id: int
    nombre: str
    apellidos: str
    email: str
    telefono: str
    ciudad: str
    linkedin: str | None = None
    github: str | None = None
    web: str | None = None
    foto_url: str | None = None
    titulo_profesional: str | None = None
    resumen: str | None = None
    proyectos: list[ProjectResponse] = []
    experiencias: list[ExperienceResponse] = []
    educaciones: list[EducationResponse] = []
    habilidades: list[SkillResponse] = []
    idiomas: list[LanguageResponse] = []

    model_config = {"from_attributes": True}