import matplotlib.pyplot
import io, base64, js


def __plt__show__override(*args, **kwargs):
    buf = io.BytesIO()
    matplotlib.pyplot.savefig(buf, format="png", bbox_inches="tight")
    buf.seek(0)
    b64 = base64.b64encode(buf.read()).decode()

    img = js.document.createElement("img")
    img.src = f"data:image/png;base64,{b64}"
    js.document.pyodideMplTarget.appendChild(img)

    buf.close()


matplotlib.pyplot.show = __plt__show__override
