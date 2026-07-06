from flask import Flask, render_template, request, jsonify, session
import random

app = Flask(__name__, template_folder=".")
app.secret_key = "sesoyunu"

KELIMELER = {
    "kolay": ["kedi", "köpek", "elma", "süt", "güneş", "ev", "su", "anne", "top"],
    "orta": ["muz", "okul", "arkadaş", "pencere", "sarı", "kitap", "bahçe", "deniz"],
    "zor": ["teknoloji", "üniversite", "bilgi", "telaffuz", "hayal gücü", "demokrasi", "matematik"],
}

def yeni_kelime():
    return random.choice(KELIMELER[session["seviye"]])

@app.route("/")
def ana():
    return render_template("index.html")

@app.route("/basla", methods=["POST"])
def basla():
    seviye = request.json.get("seviye", "kolay")
    if seviye not in KELIMELER:
        seviye = "kolay"
    session.update(skor=0, hata=0, seviye=seviye, bitti=False)
    session["kelime"] = yeni_kelime()
    return jsonify(kelime=session["kelime"], skor=0, hata=0)

@app.route("/kontrol", methods=["POST"])
def kontrol():
    if session.get("bitti"):
        return jsonify(bitti=True, skor=session["skor"], hata=session["hata"])
    tahmin = request.json.get("metin", "").lower().strip()
    dogru_kelime = session["kelime"].lower()
    if tahmin == dogru_kelime:
        session["skor"] += 1
        mesaj = "✅ Harika! Doğru söyledin!"
        dogru = True
    else:
        session["hata"] += 1
        mesaj = f"❌ Yanlış! Sen: '{tahmin}' | Doğrusu: '{session['kelime']}'"
        dogru = False
    if session["hata"] >= 3:
        session["bitti"] = True
        return jsonify(bitti=True, mesaj="💀 3 hata! Oyun bitti!", skor=session["skor"], hata=session["hata"], dogru=dogru)
    session["kelime"] = yeni_kelime()
    return jsonify(bitti=False, mesaj=mesaj, kelime=session["kelime"], skor=session["skor"], hata=session["hata"], dogru=dogru)

if __name__ == "__main__":
    app.run(debug=True, port=5050)