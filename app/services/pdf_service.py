import tempfile
import os
from pathlib import Path

from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML

from app.database.models.cv import CV 

TEMPLATES_DIR = Path(__file__).parent.parent / "templates"

def render_cv_html(cv: CV) -> str:
    env = Environment(
        loader=FileSystemLoader(str(TEMPLATES_DIR / "modern")),
        autoescape=True
    )
    template = env.get_template("template.html")
    return template.render(cv=cv)


def generate_pdf(cv: CV) -> bytes:
    html_content = render_cv_html(cv)

    with tempfile.NamedTemporaryFile(
        suffix=".pdf",
        delete=True
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