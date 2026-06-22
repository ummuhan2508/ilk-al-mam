import os

from flask import Flask, render_template,request
from ultralytics import YOLO
from PIL import Image 

app=Flask(__name__,template_folder=".",static_folder=".",static_url_path="")

model_yolu="yolov8m.pt" if os.path.exists("yolov8m.pt") else"../models/weight/yolov8m.pt"
model= YOLO(model_yolu)


TURKCE={"person":"insan","car":"araba","dog":"köpek","cat":"kedi",
        "bird":"kuş","bus":"otobüs","biycle":"bisiklet","chair":"sandalye",
        "laptop":"laptop","cell phone":"telefon","book":"kitap","cup":"bardak",
}


def turkce_yorum(sonuc):
    if sonuc.boxes is None or len(sonuc.boxes) == 0:
        return "Görselde nesne bulunamadı."

    sayac = {}
    for kutu in sonuc.boxes:
        isim = sonuc.names[int(kutu.cls[0])]
        tr = TURKCE.get(isim, isim)
        sayac[tr] = sayac.get(tr, 0) + 1

    parcalar = []
    for isim, adet in sayac.items():
        if adet == 1:
            parcalar.append(f"bir {isim}")
        else:
            parcalar.append(f"{adet} {isim}")

    metin = ", ".join(parcalar)
    return f"Bu görselde {metin} görülüyor."


@app.route("/", methods=["GET", "POST"])
def ana_sayfa():
    yorum = None
    gorsel = None

    if request.method == "POST":
        dosya = request.files.get("gorsel")
        if dosya and dosya.filename:
            yol = "temp.jpg"
            dosya.save(yol)
            sonuc = model.predict(yol, conf=0.4, verbose=False)[0]
            yorum = turkce_yorum(sonuc)
            isaretli = sonuc.plot()
            Image.fromarray(isaretli[:, :, ::-1]).save("sonuc.jpg")
            gorsel = "sonuc.jpg"

    return render_template("index.html", yorum=yorum, gorsel=gorsel)


if __name__ == "__main__":
    app.run(debug=True, port=5000)