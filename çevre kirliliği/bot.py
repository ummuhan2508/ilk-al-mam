import discord
from discord.ext import commands
import os
# Bot token'ınızı buraya ekleyin
TOKEN = "token buraya"
# Bot intents ayarları
intents = discord.Intents.default()
intents.message_content = True
# Bot oluşturma
bot = commands.Bot(command_prefix='!', intents=intents)
@bot.event
async def on_ready():
    print(f'{bot.user} olarak giriş yapıldı!')
    print(f'Bot ID: {bot.user.id}')
    print('------')
@bot.command(name='kirlilik')
async def kirlilik_bilgi(ctx):
    """Kirlilik hakkında kapsamlı bilgiler verir"""
    
    # Görsel dosyasını yükle
    image_path = "images/dünyason.jpg"
    file = discord.File(image_path, filename="dünyason.jpg")
    
    embed = discord.Embed(
        title="🌍 Kirlilik ve Çevre Sorunları",
        description="Kirlilik hakkında önemli bilgiler, etkileri ve önlemler",
        color=discord.Color.red()
    )
    
    # Kirlilik Türleri
    embed.add_field(
        name="📊 Kirlilik Türleri",
        value="""
**1. Hava Kirliliği**
• Endüstriyel emisyonlar, araç egzozları, fosil yakıtlar
• Asit yağmurları, ozon tabakasının delinmesi
• Küresel ısınma ve iklim değişikliği
**2. Su Kirliliği**
• Endüstriyel atıklar, tarım ilaçları, plastik atıklar
• Okyanuslardaki plastik adaları
• İçme suyu kaynaklarının kirlenmesi
**3. Toprak Kirliliği**
• Kimyasal atıklar, ağır metaller
• Tarım ilaçları ve gübreler
• Atık depolama alanları
**4. Gürültü Kirliliği**
• Trafik, endüstri, inşaat
• İnsan sağlığına olumsuz etkileri
**5. Işık Kirliliği**
• Aşırı yapay ışıklandırma
• Doğal yaşam döngüsünü bozması
        """,
        inline=False
    )
    
    # Dünyanın Durumu ve Sonu
    embed.add_field(
        name="⚠️ Dünyanın Durumu ve Olası Sonuçlar",
        value="""
**Kısa Vadede (10-30 yıl):**
• İklim değişikliği nedeniyle aşırı hava olayları artacak
• Deniz seviyeleri yükselecek, kıyı şehirleri risk altında
• Su kaynakları azalacak, kuraklık artacak
• Biyoçeşitlilik hızla azalacak
**Orta Vadede (30-50 yıl):**
• Tarım alanları verimsizleşecek, gıda krizi riski
• İklim mültecileri artacak
• Ekosistemler çökmeye başlayacak
• Okyanuslar asitlenecek, deniz yaşamı yok olacak
**Uzun Vadede (50-100+ yıl):**
• Geri dönüşü olmayan iklim değişiklikleri
• Büyük ölçekli kitlesel yok oluşlar
• İnsanlığın yaşam alanları ciddi şekilde daralacak
• Dünya, insan yaşamı için çok daha zor bir yer haline gelecek
**⚠️ UYARI:** Bu senaryolar, şu anki hızda devam ederse gerçekleşebilir!
        """,
        inline=False
    )
    
    # Önlemler
    embed.add_field(
        name="✅ Alınabilecek Önlemler",
        value="""
**Bireysel Önlemler:**
• 🔄 Geri dönüşüm yapın (plastik, cam, kağıt, metal)
• 🚲 Toplu taşıma veya bisiklet kullanın
• 💡 Enerji tasarruflu ampuller kullanın
• 🚰 Su tasarrufu yapın
• 🌱 Daha az et tüketin (vegan/vejetaryen seçenekler)
• 🛍️ Tek kullanımlık ürünlerden kaçının
• 🌳 Ağaç dikin ve doğayı koruyun
• 📱 Elektronik cihazları geri dönüştürün
**Toplumsal Önlemler:**
• 🏭 Temiz enerji kaynaklarına geçiş (güneş, rüzgar)
• 🚗 Elektrikli araçlara geçiş
• 🏛️ Çevre dostu politikalar
• 📚 Çevre eğitimi ve bilinçlendirme
• ♻️ Sıfır atık hedefleri
• 🌊 Okyanus temizleme projeleri
• 🏭 Endüstriyel atık kontrolü
**Küresel Önlemler:**
• 🌍 Paris İklim Anlaşması gibi uluslararası anlaşmalar
• 💰 Yeşil teknoloji yatırımları
• 🔬 Temiz teknoloji araştırmaları
• 🌱 Karbon nötr hedefleri
        """,
        inline=False
    )
    
    # İstatistikler
    embed.add_field(
        name="📈 Çarpıcı İstatistikler",
        value="""
• Her yıl 8 milyon ton plastik okyanusa karışıyor
• 2050'de okyanuslarda balıktan çok plastik olabilir
• Hava kirliliği yılda 7 milyon erken ölüme neden oluyor
• Son 50 yılda dünya nüfusunun %60'ı yok oldu
• Her dakika bir futbol sahası büyüklüğünde orman yok oluyor
        """,
        inline=False
    )
    
    embed.set_footer(text="🌍 Dünyamızı korumak hepimizin sorumluluğu! | Her küçük adım önemlidir.")
    embed.set_image(url="attachment://dünyason.jpg")
    
    await ctx.send(embed=embed, file=file)
@bot.event
async def on_command_error(ctx, error):
    if isinstance(error, commands.CommandNotFound):
        return
    await ctx.send(f"Bir hata oluştu: {error}")
# Botu çalıştır
if __name__ == "__main__":
    bot.run(TOKEN)