print("Meme Sozlugune Hos Geldin!")
print("Anlamini ogrenmek istedigin kelimeleri BUYUK HARFLE yaz.")
print("Toplam 5 kelime sorabilirsin.\n")

meme_dict = {
    "CRINGE": "Garip ya da utandirici bir sey",
    "LOL": "Komik bir seye verilen cevap",
    "ROFL": "Bir sakaya karsilik verilen tepki",
    "SHEESH": "Onaylamamak / sasirmak",
    "CREEPY": "Korkunc",
    "AGGRO": "Agresiflesmek / sinirlenmek"
}

for i in range(5):
    word = input(str(i + 1) + ". kelimeyi yaz: ").upper()

    if word in meme_dict:
        print(word + ": " + meme_dict[word])
    else:
        print("Bu kelime sozlukte yok.")

print("Sozluk uygulamasi bitti, yine bekleriz!")
