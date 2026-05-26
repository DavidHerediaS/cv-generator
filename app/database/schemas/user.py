from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional

# --REGISTRO--
class UserRegister(BaseModel):
    email:EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v.encode("utf-8")) > 72:
            raise ValueError("La contraseña no puede superar los 72 caracteres")
        if len(v) < 8:
            raise ValueError("La contraseña debe tener al menos 8 caracteres")
        if not any(c.isupper() for c in v):
            raise ValueError("La contraseña debe tener al menos una mayúscula")
        if not any(c.isdigit() for c in v):
            raise ValueError("La contraseña debe tener al menos un número")
        return v 

# --LOGIN--
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# --RESPUESTA AL CLIENTE--
class UserResponse(BaseModel):
    id: int 
    email: str

    model_config = {"from_attributes": True}


# --TOKEN JWT--
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
