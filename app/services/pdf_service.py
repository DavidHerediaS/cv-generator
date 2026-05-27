import tempfile
import os
from pathlib import Path

from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML, CSS

from app.database.models.cv import CV

TEMPLATES_DIR = Path(__file__).parent.parent / "templates"


def _estimate_content_lines(cv: CV, proyectos, experiencias, educaciones, habilidades, idiomas) -> int:
    lines = 0
    lines += 8  # cabecera fija

    if cv.resumen:
        lines += 2 + len(cv.resumen) // 80

    for p in proyectos:
        lines += 2
        if p.tecnologias:
            lines += 1
        if p.descripcion:
            lines += 1 + len(p.descripcion) // 80

    for exp in experiencias:
        lines += 2
        if exp.descripcion:
            lines += 1 + len(exp.descripcion) // 80

    for edu in educaciones:
        lines += 2
        if edu.descripcion:
            lines += 1 + len(edu.descripcion) // 80

    if habilidades:
        lines += 2 + len(habilidades) // 4

    if idiomas:
        lines += 2 + len(idiomas) // 2

    return lines


def _get_density_styles(lines: int) -> dict:
    # Una página A4 con fuente 10.5pt tiene ~55 líneas útiles
    if lines <= 45:
        return {
            "seccion_margin": "14pt",
            "item_margin": "9pt",
            "line_height": "1.4",
            "resumen_size": "10pt",
            "cuerpo_padding": "12mm 16mm",
        }
    elif lines <= 55:
        return {
            "seccion_margin": "10pt",
            "item_margin": "7pt",
            "line_height": "1.35",
            "resumen_size": "9.5pt",
            "cuerpo_padding": "10mm 16mm",
        }
    elif lines <= 65:
        return {
            "seccion_margin": "7pt",
            "item_margin": "5pt",
            "line_height": "1.3",
            "resumen_size": "9pt",
            "cuerpo_padding": "8mm 16mm",
        }
    else:
        return {
            "seccion_margin": "5pt",
            "item_margin": "4pt",
            "line_height": "1.25",
            "resumen_size": "9pt",
            "cuerpo_padding": "6mm 16mm",
        }


def render_cv_html(cv: CV, foto_base64: str | None = None) -> str:
    plantilla = getattr(cv, 'plantilla', 'modern')
    if plantilla not in ('modern', 'classic', 'minimal'):
        plantilla = 'modern'

    env = Environment(
        loader=FileSystemLoader(str(TEMPLATES_DIR / plantilla)),
        autoescape=True
    )
    template = env.get_template("template.html")

    proyectos = list(cv.proyectos)
    experiencias = list(cv.experiencias)
    educaciones = list(cv.educaciones)
    habilidades = list(cv.habilidades)
    idiomas = list(cv.idiomas)

    lines = _estimate_content_lines(cv, proyectos, experiencias, educaciones, habilidades, idiomas)
    density = _get_density_styles(lines)

    return template.render(
        cv=cv,
        proyectos=proyectos,
        experiencias=experiencias,
        educaciones=educaciones,
        habilidades=habilidades,
        idiomas=idiomas,
        density=density,
        foto_base64=foto_base64
    )


def generate_pdf(cv: CV, foto_base64: str | None = None) -> bytes:
    html_content = render_cv_html(cv, foto_base64)

    with tempfile.NamedTemporaryFile(
        suffix=".pdf",
        delete=False
    ) as tmp:
        tmp_path = tmp.name

    HTML(string=html_content).write_pdf(tmp_path)

    with open(tmp_path, "rb") as f:
        pdf_bytes = f.read()

    try:
        os.remove(tmp_path)
    except FileNotFoundError:
        pass

    return pdf_bytes