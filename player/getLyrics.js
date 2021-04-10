const fetch = require('node-fetch')
const cio = require('cheerio')

module.exports = async(name, artist = '') => {
    const song = `${name} ${artist}`.toLowerCase().replace(/ *\([^)]*\) */g, '').replace(/ *\[[^\]]*]/, '').replace(/feat.|ft./g, '').replace(/\s+/g, ' ').trim()

    const res = await fetch(`https://api.genius.com/search?q=${encodeURIComponent(song)}`, {
      headers: {
        Authorization: `Bearer ${process.env.geniusToken}`
      }
    }).then(res => res.json())
  
    if(!res.response.hits.length) return null
  
    const data = res.response.hits[0].result
    const lyricData = await fetch(data.url).then(res => res.text())
  
    const $ = cio.load(lyricData)
  
    let lyrics = $('div[class="lyrics"]').text().trim()
  
    if(!lyrics){
      lyrics = ''
      $('div[class^="Lyrics_Container"]').each((i, el) => {
        if($(el).text().length){
          let snippet = $(el).html().replace(/<br>/g, '\n').replace(/<(?!\s*br\s*\/?)[^>]+>/gi, '')
  
          lyrics += $('<textarea/>').html(snippet || '').text().trim() + '\n\n'
        }
      })
    }
    return {
      lyrics: lyrics.trim().split('\n') || '',
    }
}