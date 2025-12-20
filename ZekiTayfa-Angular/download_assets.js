
const fs = require('fs');
const https = require('https');
const path = require('path');

const IMAGES_TO_DOWNLOAD = [
    // Memory & Themes
    { name: 'cat.png', url: 'https://img.icons8.com/fluency/200/cat.png' },
    { name: 'dog.png', url: 'https://img.icons8.com/fluency/200/dog.png' },
    { name: 'mouse.png', url: 'https://img.icons8.com/fluency/200/mouse.png' },
    { name: 'hamster.png', url: 'https://img.icons8.com/fluency/200/hamster.png' },
    { name: 'rabbit.png', url: 'https://img.icons8.com/fluency/200/rabbit.png' },
    { name: 'fox.png', url: 'https://img.icons8.com/fluency/200/fox.png' },
    { name: 'bear.png', url: 'https://img.icons8.com/fluency/200/bear.png' },
    { name: 'panda.png', url: 'https://img.icons8.com/fluency/200/panda.png' },
    { name: 'koala.png', url: 'https://img.icons8.com/fluency/200/koala.png' },
    { name: 'tiger.png', url: 'https://img.icons8.com/fluency/200/tiger.png' },
    
    // Counting
    { name: 'star.png', url: 'https://img.icons8.com/fluency/96/star.png' },

    // Association
    { name: 'chicken.png', url: 'https://img.icons8.com/fluency/200/chicken.png' },
    { name: 'chick.png', url: 'https://img.icons8.com/emoji/96/hatching-chick.png' },
    { name: 'cow.png', url: 'https://img.icons8.com/fluency/200/cow.png' },
    { name: 'milk.png', url: 'https://img.icons8.com/fluency/200/milk-bottle.png' },
    { name: 'bee.png', url: 'https://img.icons8.com/fluency/200/bee.png' },
    { name: 'honey.png', url: 'https://img.icons8.com/fluency/200/honey.png' },
    { name: 'bone.png', url: 'https://img.icons8.com/emoji/200/bone-emoji.png' },
    { name: 'gorilla.png', url: 'https://img.icons8.com/color/200/gorilla.png' },
    { name: 'banana.png', url: 'https://img.icons8.com/fluency/200/banana.png' },
    { name: 'carrot.png', url: 'https://img.icons8.com/fluency/200/carrot.png' },
    { name: 'sun.png', url: 'https://img.icons8.com/fluency/200/sun.png' },
    { name: 'sunglasses.png', url: 'https://img.icons8.com/fluency/200/sunglasses.png' },
    { name: 'doctor.png', url: 'https://img.icons8.com/fluency/200/doctor-male.png' },
    { name: 'stethoscope.png', url: 'https://img.icons8.com/fluency/200/stethoscope.png' },
    
    // Other Themes
     { name: 'elephant.png', url: 'https://img.icons8.com/fluency/200/elephant.png' },
     { name: 'lion.png', url: 'https://img.icons8.com/fluency/200/lion.png' },
     { name: 'giraffe.png', url: 'https://img.icons8.com/fluency/200/giraffe.png' },
     
     { name: 'apple.png', url: 'https://img.icons8.com/fluency/200/apple.png' },
     { name: 'strawberry.png', url: 'https://img.icons8.com/fluency/200/strawberry.png' },
     { name: 'orange.png', url: 'https://img.icons8.com/fluency/200/orange.png' },
     { name: 'watermelon.png', url: 'https://img.icons8.com/fluency/200/watermelon.png' },
     { name: 'grapes.png', url: 'https://img.icons8.com/fluency/200/grapes.png' },
     { name: 'pineapple.png', url: 'https://img.icons8.com/fluency/200/pineapple.png' },
     { name: 'cherry.png', url: 'https://img.icons8.com/fluency/200/cherry.png' },
];

const dest = path.join(__dirname, 'src/assets/images');

IMAGES_TO_DOWNLOAD.forEach(img => {
    const file = fs.createWriteStream(path.join(dest, img.name));
    https.get(img.url, response => {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log(`Downloaded ${img.name}`);
        });
    }).on('error', err => {
        fs.unlink(img.name);
        console.error(`Error downloading ${img.name}: ${err.message}`);
    });
});
