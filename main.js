const TelegramBot = require("node-telegram-bot-api")
const NewsAPI = require('newsapi');

const token = "7129659146:AAFHY0hHTtZXahisb4vT00y_8nScykMdkC4"
const options = {
    polling: true
}

const ziibot = new TelegramBot(token,options)

// ziibot.on("message", (callback) => {
//     const id = callback.from.id
//     ziibot.sendMessage(id, "Masuk")
// })

const prefix = "/"

const help = new RegExp(`^${prefix}help$`)
const sayHi = new RegExp(`^${prefix}halo$`)
const gempa = new RegExp(`^${prefix}gempa$`)
const cuaca = new RegExp(`^${prefix}cuaca$`)
const quote = new RegExp(`^${prefix}quote$`)
const berita = new RegExp(`^${prefix}berita$`)
// const gempa = /^gempa$/


ziibot.onText(help, (callback) => {
  
        const welcomeMessage = `Selamat datang, ${callback.from.first_name}! Terima kasih telah bergabung dengan ziibot.\n\n` +
            `Silakan gunakan perintah berikut:\n` +
            `-${prefix}halo: Untuk menyapa bot\n` +
            `-${prefix}gempa: Untuk mendapatkan informasi gempa terbaru\n` +
            `-${prefix}berita: Untuk mendapatkan berita terbaru\n` +
            `-${prefix}quote: Untuk mendapatkan quote harian\n` +
            `-${prefix}cuaca: Untuk mendapatkan informasi cuaca terkini\n\n` +
            `Silahkan Mencoba`;
        
        ziibot.sendMessage(callback.from.id, welcomeMessage)
});


ziibot.onText(sayHi, (callback) => {
   ziibot.sendMessage(callback.from.id,"Halo")
})



ziibot.onText(gempa, async(callback) => {
    const BMKG_ENDPOINT = "https://data.bmkg.go.id/DataMKG/TEWS/"

    const apiCall = await fetch(BMKG_ENDPOINT + "autogempa.json")
    const {Infogempa: { 
        gempa: {
            Jam,Magnitude,Tanggal,Wilayah,Potensi,Kedalaman,Shakemap
        } 
    
    } 
} = await apiCall.json()

    const BMKGImage = BMKG_ENDPOINT+ Shakemap
    const resultText = `
    Waktu: ${Tanggal} | ${Jam} 
    Besaran: ${Magnitude} SR 
    Wilayah: ${Wilayah} 
    Potensi: ${Potensi} 
    Kedalaman: ${Kedalaman} 
    `

    ziibot.sendPhoto(callback.from.id, BMKGImage, {
        caption: resultText
    })
})

ziibot.onText(cuaca, async(callback) => {
    const CUACA_ENDPOINT = "https://ibnux.github.io/BMKG-importer/cuaca/"

    const apiCall = await fetch(CUACA_ENDPOINT + "501233.json")
    const [{jamCuaca,kodeCuaca,cuaca,humidity,tempC,tempF}] = await apiCall.json()

    const result =
    `
    Jam Cuaca: ${jamCuaca}
    Kode Cuaca: ${kodeCuaca}
    Kondisi Cuaca: ${cuaca}
    Kelembaban: ${humidity}
    Temperatur Celcius ${tempC}
    Temperatur Fahrenheit ${tempF}
    `

    ziibot.sendMessage(callback.from.id, result)

})

ziibot.onText(quote, async(callback) => {
    const QUOTE_ENDPOINT = "https://api.api-ninjas.com/v1/quotes?category="
    const API_KEY = "nUrh3ps3yQLp1ocRarIJLg==n0PfkyvyVlKZoW5Y"

    try {
        const apiCall = await fetch(QUOTE_ENDPOINT, {
            headers: {
                'X-Api-Key': API_KEY
            }
        });
        
        const  [{ quote, author, category }] = await apiCall.json();

            const result = `Quote: ${quote}\nAuthor: ${author}\nCategory: ${category}`;
            ziibot.sendMessage(callback.from.id, result);
        
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
        ziibot.sendMessage(callback.from.id, "Maaf, terjadi kesalahan dalam memproses permintaan.");
    }
})

ziibot.onText(berita, async(callback) => {
    const API_KEY = new NewsAPI('46c69ee329a044cf82f15a914b62af0e');

    API_KEY.v2.topHeadlines({
        source:'google-news',
        country: 'id'
      }).then(response => {

        const articles = response.articles;       

    //DIBAWAH UNTUK PEMANGGILAN DATA DALAM JUMLAH BANYAK
        
    //     data.forEach(article => {
    //         const { source, author, title, description, url, urlToImage, publishedAt, content } = article;
    //         ziibot.sendMessage(callback.from.id, `
    //             Source: ${source.name}
    //             Author: ${author}
    //             Title: ${title}
    //             Description: ${description}
    //             URL: ${url}
    //             Published At: ${publishedAt}
    //             Content: ${content}
    //         `);
    //     });

    if (articles.length > 0) {
 
        const randomIndex = Math.floor(Math.random() * articles.length);
        const data = articles[randomIndex];

        const { source, author, title, url, publishedAt } = data;
        ziibot.sendMessage(callback.from.id, `
            Judul: ${title}\n
            Dibuat Pada: ${publishedAt}
            Author: ${author}
            Sumber Berita: ${source.name}
            URL Berita: ${url}
        `);
    } else {
        ziibot.sendMessage(callback.from.id, "Tidak ada artikel yang ditemukan.");
    }
   });

})